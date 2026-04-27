import { Injectable, NotFoundException } from '@nestjs/common';
import { IBrokerConnector } from './connector.interface';
import { BrokerName } from '../types/broker.types';
import { ZerodhaConnector } from './zerodha.connector';
import { DhanConnector } from './dhan.connector';
import { UpstoxConnector, FyersConnector, AngelOneConnector } from './placeholders.connector';

@Injectable()
export class ConnectorRegistry {
  private connectors: Map<BrokerName, IBrokerConnector> = new Map();

  constructor(
    private zerodha: ZerodhaConnector,
    private dhan: DhanConnector,
    private upstox: UpstoxConnector,
    private fyers: FyersConnector,
    private angel: AngelOneConnector,
  ) {
    this.register(this.zerodha);
    this.register(this.dhan);
    this.register(this.upstox);
    this.register(this.fyers);
    this.register(this.angel);
  }

  private register(connector: IBrokerConnector) {
    this.connectors.set(connector.getName(), connector);
  }

  getConnector(broker: BrokerName): IBrokerConnector {
    const connector = this.connectors.get(broker);
    if (!connector) {
      throw new NotFoundException(`Broker connector for ${broker} not implemented`);
    }
    return connector;
  }
}
