import { Module } from '@nestjs/common';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';
import { BullModule } from '@nestjs/bullmq';
import { EncryptionModule } from '../common/security/encryption.module';
import { ModerationModule } from '../common/security/moderation.module';
import { TradingRulesModule } from '../trading-rules/trading-rules.module';
import { PsychologyModule } from '../psychology/psychology.module';

@Module({
  imports: [
    EncryptionModule,
    ModerationModule,
    TradingRulesModule,
    PsychologyModule,
    BullModule.registerQueue({ name: 'analytics' }),
  ],
  controllers: [JournalController],
  providers: [JournalService],
  exports: [JournalService],
})
export class JournalModule {}
