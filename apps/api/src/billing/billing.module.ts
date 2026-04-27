import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { BillingWebhookService } from './billing.webhook';

@Module({
  controllers: [BillingController],
  providers: [BillingService, BillingWebhookService],
  exports: [BillingService],
})
export class BillingModule {}
