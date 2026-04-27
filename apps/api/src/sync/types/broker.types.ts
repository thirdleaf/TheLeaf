/**
 * broker.types.ts
 * Shared types for the broker sync engine.
 */

export type BrokerName = 'ZERODHA' | 'ANGELONE' | 'UPSTOX' | 'DHAN' | 'FYERS' | 'IIFL';

export type InstrumentType = 'EQ' | 'FUT' | 'CE' | 'PE' | 'COMMODITY' | 'CURRENCY';
export type Exchange = 'NSE' | 'BSE' | 'MCX' | 'NFO' | 'BFO' | 'CDS';
export type TradeDirection = 'LONG' | 'SHORT';

/**
 * Raw trade leg as returned by a specific broker.
 */
export interface RawBrokerTrade {
  orderId: string;
  symbol: string;
  exchange: string;
  transactionType: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  tradeTime: string;
  productType?: string;
}

export interface NormalizedTrade {
  brokerOrderId: string;
  brokerTradeId?: string;
  symbol: string;
  exchange: Exchange;
  instrumentType: InstrumentType;
  direction: TradeDirection;
  // All prices in base units (paise for INR, cents for USD)
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  entryTime: Date;
  exitTime?: Date;
  grossPnl?: number;
  isIntraday: boolean;
  productType: string;
  tags?: string[];
  lotSize?: number; // e.g. 75 for NIFTY
  unitsPerLot?: number; // Normalized multiplier
}

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  userId?: string; // Broker-side user ID if available
}

export interface BrokerProfile {
  brokerUserId: string;
  name?: string;
  email?: string;
}

export interface BrokerageBreakdown {
  brokerage: number;
  stt: number;
  exchangeCharges: number;
  sebiFee: number;
  gst: number;
  stampDuty: number;
  totalFees: number;
  netPnl: number;
}

export interface SyncResult {
  connectionId: string;
  broker: BrokerName;
  newTrades: number;
  duplicates: number;
  errors: string[];
  durationMs: number;
}

/**
 * Simplified Parser Interface
 */
export interface IBrokerParser {
  parse(response: any, options?: { from?: string; to?: string }): Promise<NormalizedTrade[]>;
}

export interface BrokerCredentials {
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  clientId?: string;
}
