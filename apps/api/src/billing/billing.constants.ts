/**
 * billing.constants.ts
 * Single source of truth for plan definitions, limits, and Razorpay plan IDs.
 * Razorpay plan IDs must be created in Razorpay Dashboard and set in env.
 */

export type PlanKey = 'free' | 'pro' | 'elite';
export type BillingCycle = 'monthly' | 'yearly';

export interface PlanLimits {
  tradesPerMonth: number | null;    // null = unlimited
  tradingAccounts: number;
  brokerConnections: number | null; // null = unlimited
  aiReflectionsPerDay: number;
  hasAdvancedAnalytics: boolean;
  hasLiveBrokerSync: boolean;
  hasClientManagement: boolean;
  hasWhiteLabelReports: boolean;
  hasApiAccess: boolean;
  apiCallsPerDay: number | null;
  priority: 'gpt-4o-mini' | 'gpt-4o';
}

export interface PlanDefinition {
  key: PlanKey;
  name: string;
  tagline: string;
  priceMonthly: number;   // paise
  priceYearly: number;    // paise
  limits: PlanLimits;
  // Razorpay plan IDs (from env — created in Razorpay dashboard)
  razorpayPlanIdMonthly?: string;
  razorpayPlanIdYearly?: string;
  popular?: boolean;
}

export const PLANS: Record<PlanKey, PlanDefinition> = {
  free: {
    key: 'free',
    name: 'Free',
    tagline: 'For traders just getting started',
    priceMonthly: 0,
    priceYearly: 0,
    limits: {
      tradesPerMonth: 50,
      tradingAccounts: 1,
      brokerConnections: 0,
      aiReflectionsPerDay: 0,
      hasAdvancedAnalytics: false,
      hasLiveBrokerSync: false,
      hasClientManagement: false,
      hasWhiteLabelReports: false,
      hasApiAccess: false,
      apiCallsPerDay: null,
      priority: 'gpt-4o-mini',
    },
  },

  pro: {
    key: 'pro',
    name: 'Pro',
    tagline: 'For serious retail traders',
    priceMonthly: 49900,    // ₹499 in paise
    priceYearly: 449900,    // ₹4,499 in paise
    popular: true,
    limits: {
      tradesPerMonth: null,
      tradingAccounts: 5,
      brokerConnections: 2,
      aiReflectionsPerDay: 5,
      hasAdvancedAnalytics: true,
      hasLiveBrokerSync: false,
      hasClientManagement: false,
      hasWhiteLabelReports: false,
      hasApiAccess: false,
      apiCallsPerDay: null,
      priority: 'gpt-4o-mini',
    },
    get razorpayPlanIdMonthly() {
      return process.env.RAZORPAY_PLAN_PRO_MONTHLY || '';
    },
    get razorpayPlanIdYearly() {
      return process.env.RAZORPAY_PLAN_PRO_YEARLY || '';
    },
  },

  elite: {
    key: 'elite',
    name: 'Elite',
    tagline: 'For professional & prop traders',
    priceMonthly: 99900,    // ₹999 in paise
    priceYearly: 899900,    // ₹8,999 in paise
    limits: {
      tradesPerMonth: null,
      tradingAccounts: Infinity,
      brokerConnections: null,
      aiReflectionsPerDay: 20,
      hasAdvancedAnalytics: true,
      hasLiveBrokerSync: true,
      hasClientManagement: true,
      hasWhiteLabelReports: true,
      hasApiAccess: true,
      apiCallsPerDay: 10000,
      priority: 'gpt-4o',
    },
    get razorpayPlanIdMonthly() {
      return process.env.RAZORPAY_PLAN_ELITE_MONTHLY || '';
    },
    get razorpayPlanIdYearly() {
      return process.env.RAZORPAY_PLAN_ELITE_YEARLY || '';
    },
  },
};

/** Feature keys used in feature_usage table */
export const FEATURE_KEYS = {
  TRADES_IMPORT: 'trades_import',
  AI_REFLECTION: 'ai_reflection',
  BROKER_SYNC: 'broker_sync',
  REPORT_EXPORT: 'report_export',
} as const;

export type FeatureKey = typeof FEATURE_KEYS[keyof typeof FEATURE_KEYS];

/** Human-readable feature labels for error messages */
export const FEATURE_LABELS: Record<FeatureKey, string> = {
  trades_import: 'Trade Import',
  ai_reflection: 'AI Journal Coach',
  broker_sync: 'Broker Sync',
  report_export: 'Report Export',
};

/** Plans ordered by tier (for comparison: free < pro < elite) */
export const PLAN_HIERARCHY: PlanKey[] = ['free', 'pro', 'elite'];

export function planMeetsRequirement(userPlan: PlanKey, requiredPlan: PlanKey): boolean {
  return PLAN_HIERARCHY.indexOf(userPlan) >= PLAN_HIERARCHY.indexOf(requiredPlan);
}

/** Format paise to Indian Rupee display string */
export function formatINR(paise: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(paise / 100);
}
