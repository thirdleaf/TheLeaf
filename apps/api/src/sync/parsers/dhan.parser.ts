import { Injectable } from '@nestjs/common';
import { NormalizedTrade, Exchange, InstrumentType, TradeDirection } from '../types/broker.types';

@Injectable()
export class DhanParser {
  /**
   * Safe JSON parse with type casting
   */
  private async safeParse(response: Response): Promise<any> {
    const text = await (response as any).text();
    try {
      return JSON.parse(text);
    } catch (e) {
      return [];
    }
  }

  async parse(response: Response, _options: any = {}): Promise<NormalizedTrade[]> {
    const json: any = await this.safeParse(response);
    const data: any[] = Array.isArray(json) ? json : [];

    return data.map((trade: any) => ({
      brokerOrderId: trade.orderId,
      symbol: trade.tradingSymbol,
      exchange: (trade.exchange || 'NSE') as Exchange,
      instrumentType: (trade.instrumentType || 'EQ') as InstrumentType,
      direction: (trade.transactionType === 'BUY' ? 'LONG' : 'SHORT') as TradeDirection,
      entryPrice: Math.round(parseFloat(trade.avgPrice) * 100),
      exitPrice: Math.round(parseFloat(trade.avgPrice) * 100),
      quantity: parseInt(trade.quantity),
      entryTime: new Date(trade.createTime),
      exitTime: new Date(trade.createTime),
      grossPnl: 0,
      isIntraday: trade.productType === 'INTRADAY',
      productType: trade.productType || 'CNC',
    }));
  }
}
