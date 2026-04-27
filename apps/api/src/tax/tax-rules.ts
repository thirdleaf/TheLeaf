import { addDays, addMonths, isBefore, isAfter, startOfDay, endOfDay, parseISO } from 'date-fns';

/**
 * getFY returns the Financial Year for a given date.
 * Financial Year in India runs from April 1 to March 31.
 */
export function getFY(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed, 3 is April

  if (month < 3) {
    // Jan-Mar belongs to previous year's FY
    return `${year - 1}-${year.toString().slice(-2)}`;
  }
  return `${year}-${(year + 1).toString().slice(-2)}`;
}

/**
 * getFYDateRange returns the start and end dates for a financial year string like '2023-24'
 */
export function getFYDateRange(fy: string): { start: Date; end: Date } {
  const parts = fy.split('-');
  const startYearStr = parts[0];
  if (!startYearStr) throw new Error('Invalid FY format');
  
  const startYear = parseInt(startYearStr);
  return {
    start: startOfDay(new Date(startYear, 3, 1)), // April 1
    end: endOfDay(new Date(startYear + 1, 2, 31)), // March 31
  };
}

export type TaxCategory = 'INTRADAY_EQUITY' | 'STCG_EQUITY' | 'LTCG_EQUITY' | 'FO_BUSINESS' | 'SPECULATIVE';

export interface TradeForTax {
  id: string;
  symbol: string;
  instrumentType: string;
  entryTime: Date;
  exitTime: Date;
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  grossPnl: number;
  isIntraday: boolean;
}

export function categorizeTrade(trade: TradeForTax): TaxCategory {
  const { instrumentType, isIntraday, entryTime, exitTime } = trade;

  // 1. F&O (Futures & Options) -> Non-Speculative Business Income
  if (instrumentType === 'FUT' || instrumentType === 'CE' || instrumentType === 'PE') {
    return 'FO_BUSINESS';
  }

  // 2. Equity
  if (instrumentType === 'EQ') {
    if (isIntraday) {
      return 'INTRADAY_EQUITY'; // Speculative Business Income (Section 43(5))
    }

    // Capital Gains logic: check holding period
    const holdingDays = Math.floor((exitTime.getTime() - entryTime.getTime()) / (1000 * 60 * 60 * 24));
    
    // LTCG for equity is > 1 year (365 days)
    if (holdingDays > 365) {
      return 'LTCG_EQUITY';
    }
    return 'STCG_EQUITY';
  }

  return 'SPECULATIVE';
}
