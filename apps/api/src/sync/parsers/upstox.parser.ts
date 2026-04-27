import { Injectable } from '@nestjs/common';
import { NormalizedTrade, Exchange, InstrumentType, TradeDirection } from '../types/broker.types';

@Injectable()
export class UpstoxParser {
  /**
   * Safe JSON parse with type casting
   */
  private async safeParse(response: Response): Promise<any> {
    const text = await (response as any).text();
    try {
      return JSON.parse(text);
    } catch (e) {
      return { status: 'error', data: { trades: [] } };
    }
  }

  async parse(response: Response, _options: any = {}): Promise<NormalizedTrade[]> {
    const json: any = await this.safeParse(response);
    const data: any[] = json.data?.trades ?? [];

    return data.map((trade: any) => ({
      brokerOrderId: trade.order_id,
      symbol: trade.trading_symbol,
      exchange: (trade.exchange || 'NSE') as Exchange,
      instrumentType: (trade.instrument_type || 'EQ') as InstrumentType,
      direction: (trade.transaction_type === 'BUY' ? 'LONG' : 'SHORT') as TradeDirection,
      entryPrice: Math.round(parseFloat(trade.average_price) * 100),
      exitPrice: Math.round(parseFloat(trade.average_price) * 100),
      quantity: parseInt(trade.quantity),
      entryTime: new Date(trade.order_timestamp),
      exitTime: new Date(trade.order_timestamp),
      grossPnl: 0,
      isIntraday: trade.product === 'I',
      productType: trade.product || 'CNC',
    }));
  }
}
