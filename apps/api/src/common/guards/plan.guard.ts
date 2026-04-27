import {
  Injectable, CanActivate, ExecutionContext, ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { db, users, subscriptions } from '@thirdleaf/db';
import { eq } from 'drizzle-orm';
import { PlanKey, planMeetsRequirement } from '../../billing/billing.constants';

export const REQUIRES_PLAN_KEY = 'requiresPlan';

/**
 * @RequiresPlan('pro') — Requires the user to have at least a Pro subscription.
 * @RequiresPlan('elite') — Requires the user to have an Elite subscription.
 * Applied as a route decorator; the PlanGuard enforces it.
 */
export const RequiresPlan = (plan: PlanKey) => SetMetadata(REQUIRES_PLAN_KEY, plan);

/** Simple in-memory cache for plan lookups (TTL: 5 minutes) */
const PLAN_CACHE = new Map<string, { plan: PlanKey; expiresAt: number }>();
const PLAN_CACHE_TTL_MS = 5 * 60 * 1000;

@Injectable()
export class PlanGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPlan = this.reflector.getAllAndOverride<PlanKey>(
      REQUIRES_PLAN_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No @RequiresPlan decorator — allow through
    if (!requiredPlan) return true;

    const request = context.switchToHttp().getRequest();
    const clerkUserId: string | undefined = request.clerkUserId;
    if (!clerkUserId) throw new ForbiddenException('Unauthenticated');

    const userPlan = await this.getUserPlan(clerkUserId);

    if (!planMeetsRequirement(userPlan, requiredPlan)) {
      throw new ForbiddenException({
        error: 'PLAN_LIMIT_REACHED',
        currentPlan: userPlan,
        requiredPlan,
        upgradeUrl: '/app/billing',
        message: `This feature requires a ${requiredPlan.toUpperCase()} subscription or higher.`,
      });
    }

    return true;
  }

  private async getUserPlan(clerkId: string): Promise<PlanKey> {
    // Check cache first
    const cached = PLAN_CACHE.get(clerkId);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.plan;
    }

    // 1. Resolve internal UUID from clerkId
    const [user] = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (!user) {
      return 'free';
    }

    // 2. Query DB for active subscription using UUID
    const [sub] = await db.select({ plan: subscriptions.plan, status: subscriptions.status })
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id));

    // Only count as upgraded if subscription is actually active
    let plan: PlanKey = 'free';
    if (sub && sub.status === 'active') {
      plan = (sub.plan as string).toLowerCase() as PlanKey;
    }

    PLAN_CACHE.set(clerkId, { plan, expiresAt: Date.now() + PLAN_CACHE_TTL_MS });
    return plan;
  }

  /** Call this after a subscription state change to invalidate the cache */
  static invalidateCache(clerkId: string) {
    PLAN_CACHE.delete(clerkId);
  }
}
