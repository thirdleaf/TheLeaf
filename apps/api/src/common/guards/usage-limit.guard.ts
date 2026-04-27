import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { db } from '@thirdleaf/db';
import { featureUsage, subscriptions } from '@thirdleaf/db';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class UsageLimitGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.clerkUserId;
    if (!userId) return true;

    const today = new Date().toISOString().split('T')[0];
    if (!today) return true; // Safety fallback
    
    const currentMonth = today.substring(0, 7);

    // Check plan limits (placeholder logic)
    // In production, we would fetch sub and check usage table

    return true;
  }
}
