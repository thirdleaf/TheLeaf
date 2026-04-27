"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Zap, ArrowRight, Shield, Brain, TrendingUp, Activity, Users, FileText } from "lucide-react";
import {
  PLANS, FEATURE_LABELS, FEATURE_REQUIRED_PLAN, PlanKey
} from "../../lib/billing-plans";

const FEATURE_ICONS: Record<string, React.ComponentType<any>> = {
  broker_sync: Activity,
  ai_reflection: Brain,
  trades_import: TrendingUp,
  client_management: Users,
  advanced_analytics: TrendingUp,
  live_broker_sync: Zap,
  white_label_reports: FileText,
  api_access: Shield,
};

const FEATURE_BENEFITS: Record<string, string[]> = {
  broker_sync: ["Auto-import trades from Zerodha, Dhan, Upstox", "Real-time P&L tracking", "Never log trades manually again"],
  ai_reflection: ["GPT-4o journal coaching", "Identify blind spots in your trading", "Personalized reflection questions"],
  trades_import: ["Unlimited trade logging", "CSV import from any broker", "Bulk entry & editing"],
  client_management: ["Manage unlimited clients", "Track client P&L separately", "Send white-labeled reports"],
  advanced_analytics: ["MAE/MFE scatter matrix", "Strategy breakdown by any dimension", "Rolling win rate charts"],
  live_broker_sync: ["Real-time position updates", "Instant P&L sync", "Live trade auto-capture"],
  white_label_reports: ["PDF reports with your branding", "Client-ready performance summaries", "Custom logo & colors"],
  api_access: ["Programmatic access to all data", "10,000 API calls/day", "Build custom integrations"],
};

interface UpgradePromptProps {
  feature: string;
  currentPlan?: PlanKey;
  onClose?: () => void;
  /** If true, renders as a modal. If false, renders inline */
  modal?: boolean;
}

export const UpgradePrompt = ({ feature, currentPlan = "free", onClose, modal = true }: UpgradePromptProps) => {
  const router = useRouter();
  const requiredPlan = FEATURE_REQUIRED_PLAN[feature] ?? "pro";
  const featureLabel = FEATURE_LABELS[feature] ?? feature;
  const planDef = PLANS[requiredPlan];
  const Icon = FEATURE_ICONS[feature] ?? Zap;
  const benefits = FEATURE_BENEFITS[feature] ?? ["Access this premium feature"];

  const formatINR = (paise: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(paise / 100);

  const content = (
    <div className={`bg-zinc-900 border border-indigo-500/20 rounded-2xl overflow-hidden w-full max-w-md ${modal ? "" : "mx-auto"}`}>
      {/* Header gradient */}
      <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/10 p-6 border-b border-white/5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <Icon size={20} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">
                {requiredPlan.toUpperCase()} Feature
              </p>
              <h3 className="text-lg font-black text-white">{featureLabel}</h3>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-zinc-600 hover:text-zinc-400 transition-colors mt-0.5">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Current vs required plan */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/8 text-xs font-bold text-zinc-400">
            Your plan: {currentPlan.toUpperCase()}
          </div>
          <ArrowRight size={14} className="text-zinc-600" />
          <div className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-300">
            Required: {requiredPlan.toUpperCase()}
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">What you get</p>
          {benefits.map((b, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-zinc-300">
              <div className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              {b}
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="p-4 bg-zinc-800/50 rounded-xl border border-white/5">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {formatINR(planDef.priceMonthly)}
            </span>
            <span className="text-sm text-zinc-500">/month</span>
            <span className="ml-auto text-xs text-zinc-500">or</span>
            <span className="text-sm font-bold text-emerald-400">
              {formatINR(Math.round(planDef.priceYearly / 12))}/mo yearly
            </span>
          </div>
          <p className="text-xs text-zinc-600 mt-1">Save 25% with annual billing</p>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Maybe later
            </button>
          )}
          <button
            onClick={() => router.push(`/app/billing?plan=${requiredPlan}`)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            <Zap size={14} />
            Upgrade to {planDef.name}
          </button>
        </div>
      </div>
    </div>
  );

  if (!modal) return content;

  return (
    <>
      {/* Desktop: centered modal */}
      <div className="hidden md:flex fixed inset-0 bg-black/70 backdrop-blur-sm items-center justify-center z-50 p-4">
        {content}
      </div>
      {/* Mobile: bottom sheet */}
      <div className="md:hidden fixed inset-x-0 bottom-0 bg-black/70 backdrop-blur-sm z-50">
        <div className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
          {content}
        </div>
      </div>
    </>
  );
};

/**
 * Hook to check if a feature is gated and show the upgrade prompt.
 * Usage: const { check, UpgradeModal } = useFeatureGate('broker_sync');
 *        await check() → returns true if allowed, false if gated (shows modal)
 */
export function useFeatureGate(feature: string, currentPlan: PlanKey = "free") {
  const [showPrompt, setShowPrompt] = useState(false);

  const check = async (): Promise<boolean> => {
    try {
      const res = await fetch(`/api/billing/feature-check/${feature}`);
      const json = await res.json();
      if (json.success && json.data.allowed) return true;
      setShowPrompt(true);
      return false;
    } catch {
      return true; // fail open — don't block on network error
    }
  };

  const UpgradeModal = showPrompt ? (
    <UpgradePrompt
      feature={feature}
      currentPlan={currentPlan}
      modal={true}
      onClose={() => setShowPrompt(false)}
    />
  ) : null;

  return { check, UpgradeModal, showPrompt, closePrompt: () => setShowPrompt(false) };
}
