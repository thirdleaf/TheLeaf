import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BillingService } from './billing.service';
import { FEATURE_KEYS } from './billing.constants';

// Mock the db dependency
vi.mock('@thirdleaf/db', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => [{ 
          id: 'sub-1', 
          userId: 'user-1', 
          plan: 'free', 
          status: 'active' 
        }]),
      })),
    })),
  },
  users: { id: 'users.id' },
  subscriptions: { userId: 'subscriptions.userId' },
  billingPayments: { userId: 'billingPayments.userId' },
  featureUsage: { 
    userId: 'featureUsage.userId', 
    feature: 'featureUsage.feature', 
    month: 'featureUsage.month',
    count: 'featureUsage.count'
  },
}));

import { db, featureUsage } from '@thirdleaf/db';

describe('apps/api/src/billing/billing.service', () => {
  let service: BillingService;

  beforeEach(() => {
    service = new BillingService();
    vi.clearAllMocks();
  });

  describe('checkFeatureLimit', () => {
    it('should allow free user with 10 trades (limit 50)', async () => {
      // Mock sub as "free"
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({
          where: vi.fn(() => [{ id: 'u-1' }]) // User found
        }))
      } as any).mockReturnValueOnce({
        from: vi.fn(() => ({
          where: vi.fn(() => [{ plan: 'free' }]) // Sub found
        }))
      } as any);

      // Mock usage as 10
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({
          where: vi.fn(() => [{ count: 10 }])
        }))
      } as any);

      const result = await service.checkFeatureLimit('user-1', FEATURE_KEYS.TRADES_IMPORT);
      expect(result.allowed).toBe(true);
      expect(result.used).toBe(10);
      expect(result.limit).toBe(50);
    });

    it('should block free user with 50 trades', async () => {
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({ where: vi.fn(() => [{ id: 'u-1' }]) }))
      } as any).mockReturnValueOnce({
        from: vi.fn(() => ({ where: vi.fn(() => [{ plan: 'free' }]) }))
      } as any);

      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({ where: vi.fn(() => [{ count: 50 }]) }))
      } as any);

      const result = await service.checkFeatureLimit('user-1', FEATURE_KEYS.TRADES_IMPORT);
      expect(result.allowed).toBe(false);
    });

    it('should allow pro user with unlimited trades', async () => {
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({ where: vi.fn(() => [{ id: 'u-1' }]) }))
      } as any).mockReturnValueOnce({
        from: vi.fn(() => ({ where: vi.fn(() => [{ plan: 'pro' }]) }))
      } as any);

      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({ where: vi.fn(() => [{ count: 1000 }]) }))
      } as any);

      const result = await service.checkFeatureLimit('user-1', FEATURE_KEYS.TRADES_IMPORT);
      expect(result.allowed).toBe(true);
      expect(result.limit).toBeNull();
    });

    it('should block pro user on AI reflections (limit 5)', async () => {
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({ where: vi.fn(() => [{ id: 'u-1' }]) }))
      } as any).mockReturnValueOnce({
        from: vi.fn(() => ({ where: vi.fn(() => [{ plan: 'pro' }]) }))
      } as any);

      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({ where: vi.fn(() => [{ count: 5 }]) }))
      } as any);

      const result = await service.checkFeatureLimit('user-1', FEATURE_KEYS.AI_REFLECTION);
      expect(result.allowed).toBe(false);
      expect(result.limit).toBe(5);
    });

    it('should allow elite user on AI reflections (limit 20)', async () => {
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({ where: vi.fn(() => [{ id: 'u-1' }]) }))
      } as any).mockReturnValueOnce({
        from: vi.fn(() => ({ where: vi.fn(() => [{ plan: 'elite' }]) }))
      } as any);

      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({ where: vi.fn(() => [{ count: 15 }]) }))
      } as any);

      const result = await service.checkFeatureLimit('user-1', FEATURE_KEYS.AI_REFLECTION);
      expect(result.allowed).toBe(true);
      expect(result.used).toBe(15);
      expect(result.limit).toBe(20);
    });
  });
});
