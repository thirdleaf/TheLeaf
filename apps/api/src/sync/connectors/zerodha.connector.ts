import { Injectable, BadRequestException } from '@nestjs/common';
import { IBrokerConnector } from './connector.interface';
import { 
  BrokerName, NormalizedTrade, TokenResponse, 
  BrokerProfile, BrokerCredentials, Exchange, InstrumentType, TradeDirection 
} from '../types/broker.types';
import * as crypto from 'crypto';

@Injectable()
export class ZerodhaConnector implements IBrokerConnector {
  private readonly baseUrl = 'https://api.kite.trade';

  getName(): BrokerName {
    return 'ZERODHA';
  }

  getAuthUrl(apiKey: string, _redirectUri: string, _state?: string): string {
    return `https://kite.zerodha.com/connect/login?api_key=${apiKey}&v=3`;
  }

  async exchangeCode(credentials: BrokerCredentials, code: string): Promise<TokenResponse> {
    const { apiKey, apiSecret } = credentials;
    if (!apiKey || !apiSecret) throw new BadRequestException('API Key and Secret required for Zerodha');

    const checksum = crypto
      .createHash('sha256')
      .update(apiKey + code + apiSecret)
      .digest('hex');

    const response = await fetch(`${this.baseUrl}/session/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        api_key: apiKey,
        request_token: code,
        checksum: checksum,
      }),
    });

    const json: any = await response.json();
    if (json.status === 'error') throw new BadRequestException(json.message);

    return {
      accessToken: json.data.access_token,
      userId: json.data.user_id,
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000), // Kite tokens are valid for 1 day
    };
  }

  async syncTrades(credentials: BrokerCredentials, from: Date, to: Date): Promise<NormalizedTrade[]> {
    const { apiKey, accessToken } = credentials;
    if (!apiKey || !accessToken) throw new BadRequestException('API Key and Access Token required');

    const response = await fetch(`${this.baseUrl}/trades`, {
      headers: {
        'X-Kite-Version': '3',
        'Authorization': `token ${apiKey}:${accessToken}`,
      },
    });

    const json: any = await response.json();
    if (json.status === 'error') throw new BadRequestException(json.message);

    const data: any[] = json.data ?? [];
    const fromStr = from.toISOString().split('T')[0];
    const toStr = to.toISOString().split('T')[0];

    return data
      .filter((trade: any) => {
        const tradeDate = (trade.fill_timestamp || trade.order_timestamp)?.split(' ')[0];
        return tradeDate && tradeDate >= fromStr! && tradeDate <= toStr!;
      })
      .map((trade: any) => {
        const symbol = trade.tradingsymbol || '';
        let lotSize = 1;
        if (symbol.includes('NIFTY')) lotSize = 75;
        if (symbol.includes('BANKNIFTY')) lotSize = 15;
        if (symbol.includes('FINNIFTY')) lotSize = 40;

        return {
          brokerOrderId: trade.order_id,
          brokerTradeId: trade.trade_id,
          symbol,
          exchange: (trade.exchange || 'NSE') as Exchange,
          instrumentType: (trade.instrument_type || 'EQ') as InstrumentType,
          direction: (trade.transaction_type === 'BUY' ? 'LONG' : 'SHORT') as TradeDirection,
          entryPrice: Math.round(parseFloat(trade.average_price) * 100),
          exitPrice: Math.round(parseFloat(trade.average_price) * 100),
          quantity: parseInt(trade.quantity),
          entryTime: new Date(trade.fill_timestamp || trade.order_timestamp),
          exitTime: new Date(trade.fill_timestamp || trade.order_timestamp),
          isIntraday: trade.product === 'MIS',
          productType: trade.product || 'CNC',
          lotSize,
          unitsPerLot: lotSize,
        };
      });
  }

  async syncProfile(credentials: BrokerCredentials): Promise<BrokerProfile> {
    const { apiKey, accessToken } = credentials;
    const response = await fetch(`${this.baseUrl}/user/profile`, {
      headers: {
        'X-Kite-Version': '3',
        'Authorization': `token ${apiKey}:${accessToken}`,
      },
    });

    const json: any = await response.json();
    if (json.status === 'error') throw new BadRequestException(json.message);

    return {
      brokerUserId: json.data.user_id,
      name: json.data.user_name,
      email: json.data.email,
    };
  }
}
