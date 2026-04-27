import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { SyncProcessor } from './sync.processor';
import { OAuthService } from './oauth.service';
import { TokenRefreshService } from './token-refresh.service';
import { BullModule } from '@nestjs/bullmq';
import { EncryptionModule } from '../common/security/encryption.module';
import { ZerodhaParser } from './parsers/zerodha.parser';
import { AngelOneParser } from './parsers/angelone.parser';
import { UpstoxParser } from './parsers/upstox.parser';
import { DhanParser } from './parsers/dhan.parser';
import { FyersParser } from './parsers/fyers.parser';
import { IIFLParser } from './parsers/iifl.parser';
import { SahiParser } from './parsers/sahi.parser';

import { ZerodhaConnector } from './connectors/zerodha.connector';
import { DhanConnector } from './connectors/dhan.connector';
import { ConnectorRegistry } from './connectors/connector.registry';
import { UpstoxConnector, FyersConnector, AngelOneConnector } from './connectors/placeholders.connector';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'broker-sync' }),
    EncryptionModule,
  ],
  controllers: [SyncController],
  providers: [
    SyncService,
    SyncProcessor,
    OAuthService,
    TokenRefreshService,
    ConnectorRegistry,
    ZerodhaConnector,
    DhanConnector,
    UpstoxConnector,
    FyersConnector,
    AngelOneConnector,
  ],
  exports: [SyncService],
})
export class SyncModule {}
