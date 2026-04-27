import { Injectable } from '@nestjs/common';
import { NormalizedTrade, Exchange, InstrumentType, TradeDirection } from '../types/broker.types';

@Injectable()
export class IIFLParser {
  /**
   * Safe JSON parse with type casting
   */
  private async safeParse(response: Response): Promise<any> {
    const text = await (response as any).text();
    try {
      return JSON.parse(text);
    } catch (e) {
      return { body: { Status: -1, Message: 'Invalid JSON response' } };
    }
  }

  async parse(response: Response, options: { from?: string; to?: string } = {}): Promise<NormalizedTrade[]> {
    const json: any = await this.safeParse(response);
    const { from, to } = options;
    
    const statusCode = json?.body?.Status ?? -1;
    if (statusCode !== 0) {
      throw new Error(json?.body?.Message ?? 'IIFL API error');
    }

    const data: any[] = json?.body?.Data ?? [];

    // Filter by date range if provided
    const filtered = data.filter((trade: any) => {
      const tradeDate = trade.TradeDate?.split(' ')[0];
      if (!tradeDate) return false;
      if (from && tradeDate < from) return false;
      if (to && tradeDate > to) return false;
      return true;
    });

    return filtered.map((trade: any) => {
      const isOption = /\d{4}(CE|PE)$/.test(trade.Symbol);
      const isFuture = trade.Symbol.endsWith('FUT');

      return {
        brokerOrderId: trade.OrderNumber,
        symbol: trade.Symbol,
        exchange: (trade.Exchange || 'NSE') as Exchange,
        instrumentType: (isOption ? 'CE' : isFuture ? 'FUT' : 'EQ') as InstrumentType,
        direction: (trade.OrderType === 'Buy' ? 'LONG' : 'SHORT') as TradeDirection,
        entryPrice: Math.round(parseFloat(trade.Price) * 100),
        exitPrice: Math.round(parseFloat(trade.Price) * 100),
        quantity: parseInt(trade.Qty),
        entryTime: new Date(trade.TradeDate),
        exitTime: new Date(trade.TradeDate),
        grossPnl: 0,
        isIntraday: trade.MarketType === 'Intraday',
        productType: trade.MarketType || 'CNC',
      };
    });
  }
}
