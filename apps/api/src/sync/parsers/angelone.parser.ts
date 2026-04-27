import { Injectable } from '@nestjs/common';
import { RawBrokerTrade, NormalizedTrade, Exchange, InstrumentType, TradeDirection } from '../types/broker.types';

@Injectable()
export class AngelOneParser {
  /**
   * Safe JSON parse with type casting
   */
  private async safeParse(response: Response): Promise<any> {
    const text = await (response as any).text();
    try {
      return JSON.parse(text);
    } catch (e) {
      return { status: false, message: 'Invalid JSON response' };
    }
  }

  async parse(response: Response, options: { from?: string; to?: string } = {}): Promise<NormalizedTrade[]> {
    const json: any = await this.safeParse(response);
    const { from, to } = options;

    if (!json.status) {
      throw new Error(json.message ?? 'AngelOne API error');
    }

    const data: any[] = json.data ?? [];

    const filtered = data.filter((trade: any) => {
      const tradeDate = trade.exchtime?.split(' ')[0];
      if (!tradeDate) return false;
      if (from && tradeDate < from) return false;
      if (to && tradeDate > to) return false;
      return true;
    });

    return filtered.map((trade: any) => ({
      brokerOrderId: trade.orderid,
      symbol: trade.tradingsymbol,
      exchange: trade.exchange as Exchange,
      instrumentType: (trade.instrumenttype || 'EQ') as InstrumentType,
      direction: (trade.transactiontype === 'BUY' ? 'LONG' : 'SHORT') as TradeDirection,
      entryPrice: Math.round(parseFloat(trade.fillprice) * 100),
      exitPrice: Math.round(parseFloat(trade.fillprice) * 100),
      quantity: parseInt(trade.fillsize),
      entryTime: new Date(trade.exchtime),
      exitTime: new Date(trade.exchtime),
      grossPnl: 0,
      isIntraday: trade.producttype === 'INTRADAY',
      productType: trade.producttype || 'CNC',
    }));
  }
}
