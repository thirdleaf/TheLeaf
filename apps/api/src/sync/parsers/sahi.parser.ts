import { Injectable } from '@nestjs/common';
import { NormalizedTrade, Exchange, InstrumentType, TradeDirection } from '../types/broker.types';

@Injectable()
export class SahiParser {
  /**
   * Safe JSON parse with type casting
   */
  private async safeParse(response: Response): Promise<any> {
    const text = await (response as any).text();
    try {
      return JSON.parse(text);
    } catch (e) {
      return { status: 'error', data: [] };
    }
  }

  async parse(response: Response, options: { from?: string; to?: string } = {}): Promise<NormalizedTrade[]> {
    const json: any = await this.safeParse(response);
    const { from, to } = options;

    const data: any[] = json.data ?? [];

    // Filter by date range if provided
    const filtered = data.filter((trade: any) => {
      const tradeDate = trade.date?.split(' ')[0];
      if (!tradeDate) return false;
      
      if (from && tradeDate < from) return false;
      if (to && tradeDate > to) return false;
      
      return true;
    });

    return filtered.map((trade: any) => ({
      brokerOrderId: trade.id,
      symbol: trade.symbol,
      exchange: (trade.exchange || 'NSE') as Exchange,
      instrumentType: (trade.instrument_type || 'EQ') as InstrumentType,
      direction: (trade.side === 'BUY' ? 'LONG' : 'SHORT') as TradeDirection,
      entryPrice: Math.round(parseFloat(trade.average_price) * 100),
      exitPrice: Math.round(parseFloat(trade.average_price) * 100),
      quantity: parseInt(trade.quantity),
      entryTime: new Date(trade.date),
      exitTime: new Date(trade.date),
      grossPnl: 0,
      isIntraday: trade.product === 'INTRADAY',
      productType: trade.product || 'CNC',
    }));
  }
}
