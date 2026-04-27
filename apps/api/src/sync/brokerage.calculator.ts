/**
 * brokerage.calculator.ts
 *
 * Exact Indian brokerage and tax calculations.
 * https://zerodha.com/brokerage-calculator
 * https://groww.in/p/brokerage-charges
 *
 * ALL inputs in paise (integer). ALL outputs in paise (integer).
 * We round all fractions DOWN to stay conservative (underestimate fees slightly).
 */

import { NormalizedTrade, BrokerageBreakdown, BrokerName } from './types/broker.types';

// ── Exchange Transaction Charge Rates (decimal, applied to turnover) ─────────
// Source: NSE circular, BSE circular (as of 2024)
const EXCHANGE_CHARGES = {
  NSE: {
    EQ_DELIVERY: 0.0000297,   // ₹2.97/lakh for delivery
    EQ_INTRADAY: 0.0000297,
    FUT: 0.00000188,           // ₹1.88/lakh for futures
    OPT: 0.00005003,           // ₹50.03/lakh for options (on premium)
  },
  BSE: {
    EQ_DELIVERY: 0.000003,
    EQ_INTRADAY: 0.000003,
    FUT: 0.000,
    OPT: 0.0000500,
  },
  NSE_CDS: 0.00000009,         // Currency derivatives
  MCX: 0.0000026,              // Commodity futures
};

// ── STT Rates ────────────────────────────────────────────────────────────────
const STT = {
  EQ_DELIVERY: 0.001,          // 0.1% on both buy and sell
  EQ_INTRADAY_SELL: 0.00025,   // 0.025% on sell only
  FUT_SELL: 0.0002,            // 0.02% on sell (futures turnover)
  OPT_SELL_PREMIUM: 0.000625,  // 0.0625% on sell (options premium)
  OPT_EXERCISE: 0.001,         // 0.1% on ITM options exercise
};

// ── SEBI Turnover Fee ─────────────────────────────────────────────────────────
const SEBI_FEE = 0.000001;     // ₹10/crore = 0.0001% on turnover

// ── GST Rate ─────────────────────────────────────────────────────────────────
const GST_RATE = 0.18;         // 18% on (brokerage + exchange charges)

// ── Stamp Duty (Delhi/India standard) ────────────────────────────────────────
const STAMP_DUTY = {
  EQ_DELIVERY: 0.00015,        // 0.015% on buy
  EQ_INTRADAY: 0.00003,        // 0.003% on buy
  FUT: 0.00002,                // 0.002% on buy (futures)
  OPT: 0.00003,                // 0.003% on buy (options premium)
};

// ── Broker flat fee / caps ───────────────────────────────────────────────────
const BROKER_FLAT_FEES: Record<BrokerName, { flatPer: number; cap: number }> = {
  ZERODHA:  { flatPer: 2000, cap: 2000 },   // ₹20/trade flat, max ₹20
  ANGELONE: { flatPer: 2000, cap: 2000 },
  UPSTOX:   { flatPer: 2000, cap: 2000 },
  DHAN:     { flatPer: 0,    cap: 0    },   // Dhan is 0 brokerage on delivery
  FYERS:    { flatPer: 2000, cap: 2000 },
  IIFL:     { flatPer: 2000, cap: 2000 },
};

function roundPaise(v: number): number {
  return Math.floor(v);  // Always round down (conservative)
}

/**
 * Calculate exact Indian brokerage and taxes for a normalized trade.
 * @param trade - NormalizedTrade with prices and quantities in paise
 * @param broker - Broker name for flat-fee lookup
 * @param overrides - Optional user-defined fee settings
 */
export function calculateBrokerage(
  trade: NormalizedTrade, 
  broker: BrokerName,
  overrides?: { customBrokeragePaise?: number; brokerageCapPaise?: number }
): BrokerageBreakdown {
  const { entryPrice, exitPrice, quantity, instrumentType, exchange, isIntraday } = trade;

  // Convert prices from paise (integer) to rupees (decimal) for calculation
  const entryRs = entryPrice / 100;
  // Robustness fix: Use entryPrice as exitPrice if exitPrice is missing (for open positions or fill logs)
  const effectiveExitPrice = exitPrice ?? entryPrice;
  const exitRs = effectiveExitPrice / 100;

  const buyValue = entryRs * quantity;   // Rupees
  const sellValue = exitRs * quantity;   // Rupees
  const turnover = buyValue + sellValue; // Total turnover in rupees

  // ── Brokerage ─────────────────────────────────────────────────────────────
  let brokerage = 0;
  const isDelivery = !isIntraday && (instrumentType === 'EQ');

  if (overrides?.customBrokeragePaise !== undefined && overrides?.customBrokeragePaise !== null) {
    // 1. User specified custom fee override
    brokerage = Math.min(
      overrides.customBrokeragePaise * 2, // Default to 2 orders (buy + sell)
      (overrides.brokerageCapPaise ?? Infinity) * 2
    );
  } else {
    // 2. Fallback to broker-specific defaults
    const brokerDefaults = BROKER_FLAT_FEES[broker];
    if (broker === 'DHAN' && isDelivery) {
      brokerage = 0;
    } else if (isDelivery) {
      brokerage = 0; // zerodha/upstox/fyers 0 for delivery
    } else {
      brokerage = Math.min(brokerDefaults!.flatPer * 2, brokerDefaults!.cap * 2);
    }
  }

  // ── STT ──────────────────────────────────────────────────────────────────
  let stt = 0;
  if (instrumentType === 'EQ') {
    if (isIntraday) {
      stt = roundPaise(sellValue * STT.EQ_INTRADAY_SELL * 100);
    } else {
      stt = roundPaise((buyValue + sellValue) * STT.EQ_DELIVERY * 100);
    }
  } else if (instrumentType === 'FUT') {
    stt = roundPaise(sellValue * STT.FUT_SELL * 100);
  } else if (instrumentType === 'CE' || instrumentType === 'PE') {
    stt = roundPaise(sellValue * STT.OPT_SELL_PREMIUM * 100);
  }

  // ── Exchange Transaction Charges ──────────────────────────────────────────
  let exchangeRate: number = EXCHANGE_CHARGES.NSE.EQ_DELIVERY;
  if (exchange === 'NSE' || exchange === 'NFO') {
    if (instrumentType === 'EQ') exchangeRate = EXCHANGE_CHARGES.NSE.EQ_DELIVERY;
    else if (instrumentType === 'FUT') exchangeRate = EXCHANGE_CHARGES.NSE.FUT;
    else if (instrumentType === 'CE' || instrumentType === 'PE') exchangeRate = EXCHANGE_CHARGES.NSE.OPT;
  } else if (exchange === 'BSE' || exchange === 'BFO') {
    if (instrumentType === 'EQ') exchangeRate = EXCHANGE_CHARGES.BSE.EQ_DELIVERY;
    else if (instrumentType === 'CE' || instrumentType === 'PE') exchangeRate = EXCHANGE_CHARGES.BSE.OPT;
  } else if (exchange === 'MCX') {
    exchangeRate = EXCHANGE_CHARGES.MCX;
  } else if (exchange === 'CDS') {
    exchangeRate = EXCHANGE_CHARGES.NSE_CDS;
  }
  const exchangeCharges = roundPaise(turnover * exchangeRate * 100);

  // ── SEBI Fee ──────────────────────────────────────────────────────────────
  const sebiFee = roundPaise(turnover * SEBI_FEE * 100);

  // ── GST (on brokerage + exchange charges) ─────────────────────────────────
  const gst = roundPaise((brokerage + exchangeCharges) * GST_RATE);

  // ── Stamp Duty (on buy value only) ────────────────────────────────────────
  let stampRate: number = isIntraday ? STAMP_DUTY.EQ_INTRADAY : STAMP_DUTY.EQ_DELIVERY;
  if (instrumentType === 'FUT') stampRate = STAMP_DUTY.FUT;
  else if (instrumentType === 'CE' || instrumentType === 'PE') stampRate = STAMP_DUTY.OPT;
  const stampDuty = roundPaise(buyValue * stampRate * 100);

  const totalFees = brokerage + stt + exchangeCharges + sebiFee + gst + stampDuty;
  const grossPnl = trade.grossPnl || 0;
  const netPnl = grossPnl - totalFees;

  return { brokerage, stt, exchangeCharges, sebiFee, gst, stampDuty, totalFees, netPnl };
}
