import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import { db } from '@thirdleaf/db';
import { users, subscriptions, billingPayments, featureUsage } from '@thirdleaf/db';
import { eq, and, desc, sql } from 'drizzle-orm';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import {
  PLANS, PLAN_HIERARCHY, PlanKey, BillingCycle, FEATURE_KEYS, FeatureKey, planMeetsRequirement
} from './billing.constants';

// ── AES-256-GCM Encryption (same pattern as broker credentials) ─────────────

function encryptField(plaintext: string): string {
  const key = Buffer.from(process.env.ENCRYPTION_KEY ?? '', 'hex');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return JSON.stringify({
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    data: encrypted.toString('base64'),
  });
}

function decryptField(ciphertext: string): string {
  const key = Buffer.from(process.env.ENCRYPTION_KEY ?? '', 'hex');
  const { iv, authTag, data } = JSON.parse(ciphertext);
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(iv, 'base64')
  );
  decipher.setAuthTag(Buffer.from(authTag, 'base64'));
  return Buffer.concat([
    decipher.update(Buffer.from(data, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}

// ── Razorpay Client ─────────────────────────────────────────────────────────

function getRazorpayClient(): Razorpay {
  const isProduction = process.env.NODE_ENV === 'production';
  return new Razorpay({
    key_id: isProduction
      ? process.env.RAZORPAY_KEY_ID_LIVE!
      : process.env.RAZORPAY_KEY_ID_TEST!,
    key_secret: isProduction
      ? process.env.RAZORPAY_KEY_SECRET_LIVE!
      : process.env.RAZORPAY_KEY_SECRET_TEST!,
  });
}

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  // ── Internal helpers ──────────────────────────────────────────────────────

  private async getUserWithSubscription(clerkOrDbId: string) {
    // 1. Try to find user by internal ID (UUID)
    let [user] = await db.select().from(users).where(eq(users.id, clerkOrDbId));
    
    // 2. If not found by UUID, try Clerk ID (string)
    if (!user) {
      [user] = await db.select().from(users).where(eq(users.clerkId, clerkOrDbId));
    }

    if (!user) throw new NotFoundException('User not found. Please sync your account.');

    // Always use the resolved internal UUID for the subscription check
    const [sub] = await db.select().from(subscriptions)
      .where(eq(subscriptions.userId, user.id));

    return { user, sub: sub ?? null };
  }

  private async upsertFreeSubscription(userId: string) {
    await db.insert(subscriptions)
      .values({ userId, plan: 'free', billingCycle: 'monthly', status: 'active' })
      .onConflictDoNothing();
  }

  // ── Razorpay Customer ─────────────────────────────────────────────────────

  async createOrGetRazorpayCustomer(userId: string, email: string, name: string, phone?: string) {
    const { sub } = await this.getUserWithSubscription(userId);
    const rzp = getRazorpayClient();

    // If already has customer ID, return decrypted version
    if (sub?.encryptedRazorpayCustomerId) {
      return decryptField(sub.encryptedRazorpayCustomerId);
    }

    // Create new Razorpay customer
    const customer = await rzp.customers.create({
      name,
      email,
      contact: phone ?? '',
      fail_existing: '0', // don't fail if customer with same email exists
    } as any);

    const customerId = customer.id;

    // Save encrypted customer ID
    if (sub) {
      await db.update(subscriptions)
        .set({ encryptedRazorpayCustomerId: encryptField(customerId) })
        .where(eq(subscriptions.userId, userId));
    } else {
      await db.insert(subscriptions).values({
        userId,
        plan: 'free',
        billingCycle: 'monthly',
        status: 'active',
        encryptedRazorpayCustomerId: encryptField(customerId),
      });
    }

    return customerId;
  }

  // ── Create Subscription ───────────────────────────────────────────────────

  async createSubscription(userId: string, plan: PlanKey, cycle: BillingCycle) {
    if (plan === 'free') throw new BadRequestException('Cannot subscribe to the free plan');

    const { user, sub } = await this.getUserWithSubscription(userId);
    const rzp = getRazorpayClient();

    // Prevent duplicate active subscriptions
    if (sub?.status === 'active' && sub.plan === plan && sub.billingCycle === cycle) {
      throw new BadRequestException('You already have this subscription active');
    }

    const planDef = PLANS[plan];
    const razorpayPlanId = cycle === 'yearly'
      ? planDef.razorpayPlanIdYearly
      : planDef.razorpayPlanIdMonthly;

    if (!razorpayPlanId) {
      throw new BadRequestException(`Razorpay plan ID not configured for ${plan}/${cycle}. Set env vars.`);
    }

    // Get or create customer
    const customerId = await this.createOrGetRazorpayCustomer(userId, user.email, user.name);

    // Create Razorpay subscription
    const rzpSub = await rzp.subscriptions.create({
      plan_id: razorpayPlanId,
      customer_notify: 1,
      quantity: 1,
      total_count: cycle === 'yearly' ? 1 : 120, // 120 = 10 years rolling
      addons: [],
      notes: {
        userId,
        plan,
        cycle,
      },
    } as any);

    // Save encrypted subscription ID
    const encryptedSubId = encryptField(rzpSub.id);

    if (sub) {
      await db.update(subscriptions).set({
        encryptedRazorpaySubId: encryptedSubId,
        plan,
        billingCycle: cycle,
        status: 'pending',
      }).where(eq(subscriptions.userId, userId));
    } else {
      await db.insert(subscriptions).values({
        userId,
        encryptedRazorpaySubId: encryptedSubId,
        encryptedRazorpayCustomerId: encryptField(customerId),
        plan,
        billingCycle: cycle,
        status: 'pending',
      });
    }

    return {
      subscriptionId: rzpSub.id,
      shortUrl: (rzpSub as any).short_url,
      status: rzpSub.status,
      razorpayKeyId: process.env.NODE_ENV === 'production'
        ? process.env.RAZORPAY_KEY_ID_LIVE
        : process.env.RAZORPAY_KEY_ID_TEST,
    };
  }

  // ── Cancel Subscription ───────────────────────────────────────────────────

  async cancelSubscription(userId: string, atPeriodEnd: boolean) {
    const { sub } = await this.getUserWithSubscription(userId);
    if (!sub?.encryptedRazorpaySubId) {
      throw new NotFoundException('No active subscription found');
    }
    if (sub.plan === 'free') throw new BadRequestException('Free plan cannot be cancelled');

    const rzp = getRazorpayClient();
    const rzpSubId = decryptField(sub.encryptedRazorpaySubId);

    await rzp.subscriptions.cancel(rzpSubId, atPeriodEnd) as any;

    await db.update(subscriptions).set({
      cancelAtPeriodEnd: atPeriodEnd,
      cancelledAt: atPeriodEnd ? null : new Date(),
      status: atPeriodEnd ? 'active' : 'cancelled',
    }).where(eq(subscriptions.userId, userId));

    return {
      cancelled: true,
      atPeriodEnd,
      message: atPeriodEnd
        ? 'Your subscription will cancel at the end of the current billing period. You retain full access until then.'
        : 'Your subscription has been cancelled immediately. You have been moved to the Free plan.',
    };
  }

  // ── Pause / Resume ────────────────────────────────────────────────────────

  async pauseSubscription(userId: string) {
    const { sub } = await this.getUserWithSubscription(userId);
    if (!sub?.encryptedRazorpaySubId) throw new NotFoundException('No subscription found');
    if (sub.status !== 'active') throw new BadRequestException('Only active subscriptions can be paused');

    const rzp = getRazorpayClient();
    const rzpSubId = decryptField(sub.encryptedRazorpaySubId);
    await rzp.subscriptions.pause(rzpSubId, {} as any);

    await db.update(subscriptions)
      .set({ status: 'paused' })
      .where(eq(subscriptions.userId, userId));

    return { paused: true };
  }

  async resumeSubscription(userId: string) {
    const { sub } = await this.getUserWithSubscription(userId);
    if (!sub?.encryptedRazorpaySubId) throw new NotFoundException('No subscription found');
    if (sub.status !== 'paused') throw new BadRequestException('Only paused subscriptions can be resumed');

    const rzp = getRazorpayClient();
    const rzpSubId = decryptField(sub.encryptedRazorpaySubId);
    await rzp.subscriptions.resume(rzpSubId, {} as any);

    await db.update(subscriptions)
      .set({ status: 'active' })
      .where(eq(subscriptions.userId, userId));

    return { resumed: true };
  }

  // ── Billing Status ────────────────────────────────────────────────────────

  async getBillingStatus(userId: string) {
    await this.upsertFreeSubscription(userId);
    const { user, sub } = await this.getUserWithSubscription(userId);
    const plan = (sub?.plan ?? 'free') as PlanKey;
    const planDef = PLANS[plan];

    // Gather today/month usage
    const today = new Date().toISOString().split('T')[0];
    const todayStr = today || new Date().toISOString().split('T')[0]!;
    const currentMonth = todayStr.substring(0, 7);

    const usageRows = await db.select().from(featureUsage)
      .where(and(eq(featureUsage.userId, userId), eq(featureUsage.month, currentMonth)));

    const usageMap: Record<string, number> = {};
    for (const row of usageRows) {
      usageMap[row.feature] = row.count;
    }

    return {
      plan,
      planName: planDef.name,
      billingCycle: sub?.billingCycle ?? 'monthly',
      status: sub?.status ?? 'active',
      currentPeriodEnd: sub?.currentPeriodEnd,
      cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
      pricing: {
        monthly: planDef.priceMonthly,
        yearly: planDef.priceYearly,
      },
      limits: planDef.limits,
      usage: {
        tradesThisMonth: usageMap[FEATURE_KEYS.TRADES_IMPORT] ?? 0,
        aiReflectionsToday: usageMap[`${FEATURE_KEYS.AI_REFLECTION}_${today}`] ?? 0,
        brokerConnectionsCount: usageMap[FEATURE_KEYS.BROKER_SYNC] ?? 0,
      },
    };
  }

  // ── Invoice History ───────────────────────────────────────────────────────

  async getInvoiceHistory(userId: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const payments = await db.select().from(billingPayments)
      .where(eq(billingPayments.userId, userId))
      .orderBy(desc(billingPayments.createdAt))
      .limit(limit)
      .offset(offset);

    return payments.map(p => ({
      id: p.id,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      method: p.method,
      description: p.description,
      invoiceUrl: p.invoiceUrl,
      paidAt: p.paidAt,
      failureReason: p.failureReason,
      createdAt: p.createdAt,
    }));
  }

  // ── Feature Usage Checks ──────────────────────────────────────────────────

  async checkFeatureLimit(userId: string, feature: FeatureKey): Promise<{
    allowed: boolean;
    used: number;
    limit: number | null;
    plan: PlanKey;
  }> {
    const { sub } = await this.getUserWithSubscription(userId);
    const plan = (sub?.plan ?? 'free') as PlanKey;
    const planDef = PLANS[plan];

    const isDaily = feature === FEATURE_KEYS.AI_REFLECTION;
    const period = isDaily
      ? new Date().toISOString().split('T')[0]  // 'YYYY-MM-DD'
      : new Date().toISOString().substring(0, 7); // 'YYYY-MM'

    if (!period) throw new BadRequestException('Period is required');
    const monthKey = isDaily ? period.substring(0, 7) : period;

    const [usage] = await db.select().from(featureUsage)
      .where(and(
        eq(featureUsage.userId, userId),
        eq(featureUsage.feature, feature),
        eq(featureUsage.month, monthKey)
      ));

    const used = usage?.count ?? 0;
    let limit: number | null = null;

    switch (feature) {
      case FEATURE_KEYS.TRADES_IMPORT:
        limit = planDef.limits.tradesPerMonth;
        break;
      case FEATURE_KEYS.AI_REFLECTION:
        limit = planDef.limits.aiReflectionsPerDay;
        break;
    }

    return {
      allowed: limit === null || used < limit,
      used,
      limit,
      plan,
    };
  }

  async incrementFeatureUsage(userId: string, feature: FeatureKey) {
    const isDaily = feature === FEATURE_KEYS.AI_REFLECTION;
    const today = new Date().toISOString().split('T')[0];
    const todayValue = new Date().toISOString().split('T')[0]!;
    const currentMonth = todayValue.substring(0, 7);

    const featureKey = isDaily ? `${feature}_${today}` : feature;
    const monthKey = isDaily ? currentMonth : currentMonth;

    // Upsert with conflict on (userId, feature, month)
    await db.insert(featureUsage)
      .values({ userId, feature: featureKey, month: monthKey, count: 1 })
      .onConflictDoUpdate({
        target: [featureUsage.userId, featureUsage.feature, featureUsage.month],
        set: { count: sql`${featureUsage.count} + 1`, updatedAt: new Date() },
      });
  }

  // ── Webhook Helpers ───────────────────────────────────────────────────────

  /** Called by webhook handler on subscription.activated / subscription.charged */
  async handleSubscriptionActivated(payload: any) {
    const rzpSubId = payload.subscription?.id;
    const planStart = payload.subscription?.current_start;
    const planEnd = payload.subscription?.current_end;
    if (!rzpSubId) return;

    // Find subscription by decrypting all records and matching — or use notes
    const notes = payload.subscription?.notes;
    const userId = notes?.userId;
    if (!userId) {
      this.logger.warn(`Webhook subscription.activated: no userId in notes for ${rzpSubId}`);
      return;
    }

    await db.update(subscriptions).set({
      status: 'active',
      currentPeriodStart: planStart ? new Date(planStart * 1000) : undefined,
      currentPeriodEnd: planEnd ? new Date(planEnd * 1000) : undefined,
    }).where(eq(subscriptions.userId, userId));

    // Update user plan
    const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
    if (sub) {
      await db.update(users).set({ plan: sub.plan === 'elite' ? 'prop_mentor' : 'quant_builder' })
        .where(eq(users.id, userId));
    }
  }

  async handleSubscriptionHalted(payload: any) {
    const notes = payload.subscription?.notes;
    const userId = notes?.userId;
    if (!userId) return;

    // Downgrade to free
    await db.update(subscriptions).set({
      status: 'halted',
      plan: 'free',
    }).where(eq(subscriptions.userId, userId));
    this.logger.warn(`Subscription halted for userId=${userId}. Downgraded to free.`);
  }

  async handlePaymentCaptured(payload: any) {
    const payment = payload.payment?.entity;
    if (!payment?.id) return;

    // Idempotency: check if already processed
    const [existing] = await db.select().from(billingPayments)
      .where(eq(billingPayments.razorpayPaymentId, payment.id));
    if (existing) return;

    // Find userId from subscription notes or subscription record
    const notes = payload.subscription?.notes ?? payment.notes ?? {};
    const userId = notes?.userId;
    if (!userId) return;

    await db.insert(billingPayments).values({
      userId,
      razorpayPaymentId: payment.id,
      razorpayOrderId: payment.order_id,
      amount: payment.amount,
      currency: payment.currency ?? 'INR',
      status: 'captured',
      method: payment.method,
      paidAt: new Date(payment.created_at * 1000),
    });
  }

  async handlePaymentFailed(payload: any) {
    const payment = payload.payment?.entity;
    if (!payment?.id) return;

    const [existing] = await db.select().from(billingPayments)
      .where(eq(billingPayments.razorpayPaymentId, payment.id));
    if (existing?.status === 'failed') return;

    if (existing) {
      await db.update(billingPayments).set({
        status: 'failed',
        failureReason: payment.error_description ?? 'Payment failed',
      }).where(eq(billingPayments.razorpayPaymentId, payment.id));
    } else {
      // notes lookup fallback
      const userId = payment.notes?.userId;
      if (!userId) return;
      await db.insert(billingPayments).values({
        userId,
        razorpayPaymentId: payment.id,
        amount: payment.amount ?? 0,
        status: 'failed',
        failureReason: payment.error_description ?? 'Payment failed',
      });
    }
  }
}
