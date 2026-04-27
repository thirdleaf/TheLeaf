import { 
  BrokerName, NormalizedTrade, TokenResponse, 
  BrokerProfile, BrokerCredentials 
} from '../types/broker.types';

export interface IBrokerConnector {
  getName(): BrokerName;

  /**
   * Generate the login URL for the broker's OAuth flow.
   */
  getAuthUrl(apiKey: string, redirectUri: string, state?: string): string;

  /**
   * Exchange the authorization code or request token for access tokens.
   */
  exchangeCode(credentials: BrokerCredentials, code: string, redirectUri?: string): Promise<TokenResponse>;

  /**
   * Sync historical and recent trades from the broker.
   * Prices should be returned in paise (base units).
   */
  syncTrades(credentials: BrokerCredentials, from: Date, to: Date): Promise<NormalizedTrade[]>;

  /**
   * Retrieve the user's profile from the broker.
   */
  syncProfile?(credentials: BrokerCredentials): Promise<BrokerProfile>;

  /**
   * Sync open positions (optional).
   */
  syncPositions?(credentials: BrokerCredentials): Promise<any[]>;

  /**
   * Refresh the access token using the refresh token if available.
   */
  refreshToken?(credentials: BrokerCredentials): Promise<TokenResponse>;
}
