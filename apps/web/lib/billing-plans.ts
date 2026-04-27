/**
 * Frontend billing plan constants.
 * Mirrors apps/api/src/billing/billing.constants.ts — keep in sync.
 * Used by billing page and UpgradePrompt component.
 */

export type PlanKey = "free" | "pro" | "elite";
export type BillingCycle = "monthly" | "yearly";

export interface PlanLimits {
  tradesPerMonth: number | null;
  tradingAccounts: number | typeof Infinity;
  brokerConnections: number | null;
  aiReflectionsPerDay: number;
  hasAdvancedAnalytics: boolean;
  hasLiveBrokerSync: boolean;
  hasClientManagement: boolean;
  hasWhiteLabelReports: boolean;
  hasApiAccess: boolean;
  apiCallsPerDay: number | null;
}

export interface PlanDefinition {
  key: PlanKey;
  name: string;
  tagline: string;
  priceMonthly: number;  // paise
  priceYearly: number;   // paise
  limits: PlanLimits;
  popular?: boolean;
}

export const PLANS: Record<PlanKey, PlanDefinition> = {
  free: {
    key: "free",
    name: "Free",
    tagline: "For traders just getting started",
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
    },
  },
  pro: {
    key: "pro",
    name: "Pro",
    tagline: "For serious retail traders",
    priceMonthly: 49900,
    priceYearly: 449900,
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
    },
  },
  elite: {
    key: "elite",
    name: "Elite",
    tagline: "For professional & prop traders",
    priceMonthly: 99900,
    priceYearly: 899900,
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
    },
  },
};

export const PLAN_HIERARCHY: PlanKey[] = ["free", "pro", "elite"];

export function planMeetsRequirement(userPlan: PlanKey, requiredPlan: PlanKey): boolean {
  return PLAN_HIERARCHY.indexOf(userPlan) >= PLAN_HIERARCHY.indexOf(requiredPlan);
}

export const FEATURE_LABELS: Record<string, string> = {
  broker_sync: "Broker Sync",
  ai_reflection: "AI Journal Coach",
  trades_import: "Trade Import",
  client_management: "Client Management",
  advanced_analytics: "Advanced Analytics",
  live_broker_sync: "Live Broker Sync",
  white_label_reports: "White-Label Reports",
  api_access: "API Access",
};

/** Required plan per feature — used by UpgradePrompt */
export const FEATURE_REQUIRED_PLAN: Record<string, PlanKey> = {
  broker_sync: "pro",
  ai_reflection: "pro",
  trades_import: "pro",
  client_management: "elite",
  advanced_analytics: "pro",
  live_broker_sync: "elite",
  white_label_reports: "elite",
  api_access: "elite",
};
