import { Injectable, BadRequestException } from '@nestjs/common';
import { IBrokerConnector } from './connector.interface';
import { 
  BrokerName, NormalizedTrade, TokenResponse, 
  BrokerProfile, BrokerCredentials, Exchange, InstrumentType, TradeDirection 
} from '../types/broker.types';

@Injectable()
export class DhanConnector implements IBrokerConnector {
  private readonly baseUrl = 'https://api.dhan.co';

  getName(): BrokerName {
    return 'DHAN';
  }

  getAuthUrl(apiKey: string, _redirectUri: string, state?: string): string {
    // Dhan OAuth entry point often involves a redirect to their login portal
    // For SaaS, we usually use the client_id (apiKey)
    return `https://login.dhan.co/connect?client_id=${apiKey}${state ? `&state=${state}` : ''}`;
  }

  async exchangeCode(credentials: BrokerCredentials, code: string): Promise<TokenResponse> {
    const { apiKey, apiSecret } = credentials;

    // Check if the "code" is actually already a full JWT access token (Manual Token Flow)
    // Dhan tokens are usually long JWTs
    if (code.length > 100 && code.split('.').length === 3) {
      return {
        accessToken: code,
        expiresAt: new Date(Date.now() + 24 * 3600 * 1000), // Manual tokens valid for 24h
      };
    }

    if (!apiKey || !apiSecret) throw new BadRequestException('Client ID and Secret required for Dhan');

    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        client_id: apiKey,
        client_secret: apiSecret,
      }),
    });

    const json: any = await response.json();
    if (json.status === 'failure') throw new BadRequestException(json.remarks || 'Dhan token exchange failed');

    return {
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
      expiresAt: json.expires_in ? new Date(Date.now() + json.expires_in * 1000) : new Date(Date.now() + 24 * 3600 * 1000),
    };
  }

  async refreshToken(credentials: BrokerCredentials): Promise<TokenResponse> {
    const { accessToken } = credentials;
    if (!accessToken) throw new BadRequestException('Access Token required for Dhan refresh');

    const response = await fetch(`${this.baseUrl}/renew-token`, {
      method: 'POST',
      headers: { 
        'access-token': accessToken,
        'Content-Type': 'application/json'
      },
    });

    const json: any = await response.json();
    if (json.status === 'failure') throw new BadRequestException(json.remarks || 'Dhan token renewal failed');

    return {
      accessToken: json.access_token,
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
    };
  }

  async syncTrades(credentials: BrokerCredentials, from: Date, to: Date): Promise<NormalizedTrade[]> {
    const { accessToken } = credentials;
    if (!accessToken) throw new BadRequestException('Access Token required for Dhan');

    const response = await fetch(`${this.baseUrl}/trades`, {
      headers: {
        'access-token': accessToken,
        'Content-Type': 'application/json',
      },
    });

    const data: any[] = await response.json() as any[];
    if (!Array.isArray(data)) throw new BadRequestException('Unexpected response from Dhan trades API');

    const fromStr = from.toISOString().split('T')[0];
    const toStr = to.toISOString().split('T')[0];

    return data
      .filter((trade: any) => {
        const tradeDate = trade.createTime?.split(' ')[0];
        return tradeDate && tradeDate >= fromStr! && tradeDate <= toStr!;
      })
      .map((trade: any) => {
        const symbol = trade.tradingSymbol || '';
        let lotSize = 1;
        if (symbol.includes('NIFTY')) lotSize = 75;
        if (symbol.includes('BANKNIFTY')) lotSize = 15;
        if (symbol.includes('FINNIFTY')) lotSize = 40;

        return {
          brokerOrderId: trade.orderId,
          brokerTradeId: trade.tradeId,
          symbol,
          exchange: (trade.exchange || 'NSE') as Exchange,
          instrumentType: (trade.instrumentType || 'EQ') as InstrumentType,
          direction: (trade.transactionType === 'BUY' ? 'LONG' : 'SHORT') as TradeDirection,
          entryPrice: Math.round(parseFloat(trade.avgPrice) * 100),
          exitPrice: Math.round(parseFloat(trade.avgPrice) * 100),
          quantity: parseInt(trade.quantity),
          entryTime: new Date(trade.createTime),
          exitTime: new Date(trade.createTime),
          isIntraday: trade.productType === 'INTRADAY',
          productType: trade.productType || 'CNC',
          lotSize,
          unitsPerLot: lotSize,
        };
      });
  }

  async syncProfile(credentials: BrokerCredentials): Promise<BrokerProfile> {
    const { accessToken } = credentials;
    const response = await fetch(`${this.baseUrl}/user/profile`, {
      headers: { 'access-token': accessToken! },
    });

    const json: any = await response.json();
    return {
      brokerUserId: json.dhanClientId || json.userId,
      name: json.clientName,
      email: json.emailId,
    };
  }
}
