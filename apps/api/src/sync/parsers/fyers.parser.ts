import { Injectable } from '@nestjs/common';
import { NormalizedTrade, Exchange, InstrumentType, TradeDirection } from '../types/broker.types';

@Injectable()
export class FyersParser {
  /**
   * Safe JSON parse with type casting
   */
  private async safeParse(response: Response): Promise<any> {
    const text = await (response as any).text();
    try {
      return JSON.parse(text);
    } catch (e) {
      return { s: 'error', message: 'Invalid JSON response' };
    }
  }

  async parse(response: Response, _options: any = {}): Promise<NormalizedTrade[]> {
    const json: any = await this.safeParse(response);
    
    if (json.s !== 'ok') {
      throw new Error(json.message ?? 'Fyers API error');
    }

    const data: any[] = json.data ?? [];

    return data.map((trade: any) => ({
      brokerOrderId: trade.id,
      symbol: trade.symbol,
      exchange: (trade.exch || 'NSE') as Exchange,
      instrumentType: (trade.instrument || 'EQ') as InstrumentType,
      direction: (trade.side === 1 ? 'LONG' : 'SHORT') as TradeDirection,
      entryPrice: Math.round(parseFloat(trade.avgPrice) * 100),
      exitPrice: Math.round(parseFloat(trade.avgPrice) * 100),
      quantity: parseInt(trade.qty),
      entryTime: new Date(trade.orderDateTime),
      exitTime: new Date(trade.orderDateTime),
      grossPnl: 0,
      isIntraday: trade.productType === 'INTRADAY',
      productType: trade.productType || 'CNC',
    }));
  }
}
