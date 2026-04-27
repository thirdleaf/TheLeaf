import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { EncryptionService } from '../common/security/encryption.service';
import { ConnectorRegistry } from './connectors/connector.registry';
import { BrokerName } from './types/broker.types';

@Injectable()
export class OAuthService {
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly registry: ConnectorRegistry,
  ) {}

  getLoginUrl(broker: BrokerName, apiKey: string, redirectUri: string, state?: string): string {
    const connector = this.registry.getConnector(broker);
    return connector.getAuthUrl(apiKey, redirectUri, state);
  }

  async exchangeCode(broker: BrokerName, code: string, apiKey: string, apiSecret: string, redirectUri?: string): Promise<any> {
    const connector = this.registry.getConnector(broker);
    const tokens = await connector.exchangeCode({ apiKey, apiSecret }, code, redirectUri);
    
    return {
      accessToken: this.encryptionService.encrypt(tokens.accessToken),
      refreshToken: tokens.refreshToken ? this.encryptionService.encrypt(tokens.refreshToken) : undefined,
      expiresAt: tokens.expiresAt,
      userId: tokens.userId,
    };
  }

  // Legacy/Internal helpers for specific flows if still needed during migration
  getZerodhaLoginUrl(apiKey: string): string {
    return this.getLoginUrl('ZERODHA', apiKey, '');
  }

  getDhanLoginUrl(apiKey: string, state?: string): string {
    return this.getLoginUrl('DHAN', apiKey, '', state);
  }

  async exchangeZerodhaToken(apiKey: string, apiSecret: string, requestToken: string): Promise<any> {
    return this.exchangeCode('ZERODHA', requestToken, apiKey, apiSecret);
  }
}
