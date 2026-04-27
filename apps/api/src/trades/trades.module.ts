import { Module } from '@nestjs/common';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';
import { TradesRepository } from './trades.repository';
import { BrokerParserFactory } from './parsers/broker-parser.factory';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'analytics' }),
    NotificationsModule,
  ],
  controllers: [TradesController],
  providers: [TradesService, TradesRepository, BrokerParserFactory],
  exports: [TradesService],
})
export class TradesModule {}
