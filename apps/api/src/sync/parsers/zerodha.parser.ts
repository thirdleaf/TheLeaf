import { Injectable } from '@nestjs/common';
import { NormalizedTrade, Exchange, InstrumentType, TradeDirection } from '../types/broker.types';

@Injectable()
export class ZerodhaParser {
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
      const tradeTime = trade.fill_timestamp || trade.order_timestamp;
      const tradeDate = tradeTime?.split(' ')[0];
      if (!tradeDate) return false;
      
      if (from && tradeDate < from) return false;
      if (to && tradeDate > to) return false;
      
      return true;
    });

    return filtered.map((trade: any) => ({
      brokerOrderId: trade.order_id,
      symbol: trade.tradingsymbol,
      exchange: (trade.exchange || 'NSE') as Exchange,
      instrumentType: (trade.instrument_type || 'EQ') as InstrumentType,
      direction: (trade.transaction_type === 'BUY' ? 'LONG' : 'SHORT') as TradeDirection,
      entryPrice: Math.round(parseFloat(trade.average_price) * 100),
      exitPrice: Math.round(parseFloat(trade.average_price) * 100),
      quantity: parseInt(trade.quantity),
      entryTime: new Date(trade.fill_timestamp || trade.order_timestamp),
      exitTime: new Date(trade.fill_timestamp || trade.order_timestamp),
      grossPnl: 0,
      isIntraday: trade.product === 'MIS',
      productType: trade.product || 'CNC',
    }));
  }
}
