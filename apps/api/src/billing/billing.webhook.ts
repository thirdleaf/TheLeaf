import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { BillingService } from './billing.service';
import { createHmac } from 'crypto';

/**
 * BillingWebhookService
 * Handles all Razorpay webhook events.
 * Signature verification ensures only authentic Razorpay events are processed.
 * All handlers are idempotent — safe to replay.
 */
@Injectable()
export class BillingWebhookService {
  private readonly logger = new Logger(BillingWebhookService.name);

  constructor(private readonly billingService: BillingService) {}

  verifySignature(rawBody: string, signature: string): boolean {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      this.logger.error('RAZORPAY_WEBHOOK_SECRET is not set — rejecting webhook');
      return false;
    }
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
    return expected === signature;
  }

  async handleEvent(event: string, payload: any): Promise<void> {
    this.logger.log(`Razorpay webhook received: ${event}`);

    try {
      switch (event) {
        case 'subscription.activated':
          await this.billingService.handleSubscriptionActivated(payload);
          break;

        case 'subscription.charged':
          // A charge was made — record payment + ensure status=active
          await this.billingService.handleSubscriptionActivated(payload);
          await this.billingService.handlePaymentCaptured(payload);
          break;

        case 'subscription.pending':
          // Payment pending — don't downgrade yet, just update status
          await this.updateSubscriptionStatus(payload, 'pending');
          break;

        case 'subscription.halted':
          // Multiple payment failures — downgrade to free
          await this.billingService.handleSubscriptionHalted(payload);
          break;

        case 'subscription.cancelled':
          await this.updateSubscriptionStatus(payload, 'cancelled');
          break;

        case 'subscription.paused':
          await this.updateSubscriptionStatus(payload, 'paused');
          break;

        case 'subscription.resumed':
          await this.updateSubscriptionStatus(payload, 'active');
          break;

        case 'payment.captured':
          await this.billingService.handlePaymentCaptured(payload);
          break;

        case 'payment.failed':
          await this.billingService.handlePaymentFailed(payload);
          break;

        default:
          this.logger.debug(`Unhandled Razorpay event: ${event}`);
      }
    } catch (err) {
      this.logger.error(`Error processing webhook ${event}: ${(err as Error).message}`, (err as Error).stack);
      // Don't throw — return 200 to Razorpay to prevent retries on our internal errors
    }
  }

  private async updateSubscriptionStatus(payload: any, status: string) {
    const notes = payload.subscription?.notes;
    const userId = notes?.userId;
    if (!userId) {
      this.logger.warn(`Cannot update subscription status — no userId in webhook notes`);
      return;
    }

    const { db } = await import('@thirdleaf/db');
    const { subscriptions } = await import('@thirdleaf/db');
    const { eq } = await import('drizzle-orm');

    await db.update(subscriptions)
      .set({ status: status as any })
      .where(eq(subscriptions.userId, userId));
  }
}
