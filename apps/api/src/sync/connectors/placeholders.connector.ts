import { Injectable, BadRequestException } from '@nestjs/common';
import { IBrokerConnector } from './connector.interface';
import { 
  BrokerName, NormalizedTrade, TokenResponse, 
  BrokerProfile, BrokerCredentials 
} from '../types/broker.types';

@Injectable()
export class PlaceholderConnector implements IBrokerConnector {
  constructor(private readonly broker: BrokerName) {}

  getName(): BrokerName {
    return this.broker;
  }

  getAuthUrl(apiKey: string, redirectUri: string, state?: string): string {
    // Basic OAuth URL template for most Indian brokers
    const urls: Record<string, string> = {
      'UPSTOX': `https://api.upstox.com/v2/login/authorization/dialog?client_id=${apiKey}&redirect_uri=${redirectUri}&response_type=code`,
      'FYERS': `https://api.fyers.in/api/v2/generate-authcode?client_id=${apiKey}&redirect_uri=${redirectUri}&response_type=code&state=${state || 'tradeforge'}`,
      'ANGELONE': `https://smartapi.angelbroking.com/login?api_key=${apiKey}`,
    };
    return urls[this.broker] || '#';
  }

  async exchangeCode(_credentials: BrokerCredentials, _code: string): Promise<TokenResponse> {
    throw new BadRequestException(`${this.broker} integration is coming soon.`);
  }

  async syncTrades(_credentials: BrokerCredentials, _from: Date, _to: Date): Promise<NormalizedTrade[]> {
    return [];
  }
}

@Injectable() export class UpstoxConnector extends PlaceholderConnector { constructor() { super('UPSTOX'); } }
@Injectable() export class FyersConnector extends PlaceholderConnector { constructor() { super('FYERS'); } }
@Injectable() export class AngelOneConnector extends PlaceholderConnector { constructor() { super('ANGELONE'); } }
