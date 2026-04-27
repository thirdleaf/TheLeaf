"use client";

import React, { useState, useEffect } from "react";
import {
  Check, X, Zap, Shield, Sparkles, TrendingUp, Loader2,
  AlertCircle, CreditCard, Calendar, Download, ChevronDown
} from "lucide-react";
import { PLANS } from "../../../lib/billing-plans";

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatINR = (paise: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(paise / 100);

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  paused: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/20",
  expired: "bg-zinc-700 text-zinc-400 border-zinc-600",
  halted: "bg-red-500/15 text-red-400 border-red-500/20",
  pending: "bg-blue-500/15 text-blue-400 border-blue-500/20",
};

// ── Usage Meter ───────────────────────────────────────────────────────────────

const UsageMeter = ({ label, used, limit, unit = "" }: {
  label: string; used: number; limit: number | null; unit?: string;
}) => {
  const isUnlimited = limit === null;
  const pct = isUnlimited ? 0 : Math.min((used / limit!) * 100, 100);
  const isWarning = !isUnlimited && pct >= 80;
  const isFull = !isUnlimited && pct >= 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-400 font-medium">{label}</span>
        <span className={isFull ? "text-red-400 font-bold" : "text-zinc-300"}>
          {used.toLocaleString("en-IN")}{unit}
          {isUnlimited ? " / ∞" : ` / ${limit!.toLocaleString("en-IN")}${unit}`}
        </span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        {!isUnlimited && (
          <div
            className={`h-full rounded-full transition-all duration-500 ${isFull ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-indigo-500"}`}
            style={{ width: `${pct}%` }}
          />
        )}
        {isUnlimited && <div className="h-full w-full bg-gradient-to-r from-indigo-600 to-emerald-500 opacity-40 rounded-full" />}
      </div>
    </div>
  );
};

// ── Pricing Card ──────────────────────────────────────────────────────────────

const PricingCard = ({ plan, cycle, onSubscribe, isCurrent, loading }: {
  plan: typeof PLANS[keyof typeof PLANS];
  cycle: "monthly" | "yearly";
  onSubscribe: (plan: string, cycle: string) => void;
  isCurrent: boolean;
  loading: boolean;
}) => {
  const price = cycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
  const monthlyEquiv = cycle === "yearly" ? Math.round(plan.priceYearly / 12) : plan.priceMonthly;
  const savings = Math.round(100 - (plan.priceYearly / (plan.priceMonthly * 12)) * 100);
  const isFree = plan.key === "free";

  const FEATURE_ROWS = [
    { label: "Trades/month", value: plan.limits.tradesPerMonth === null ? "Unlimited" : `${plan.limits.tradesPerMonth}` },
    { label: "Trading accounts", value: plan.limits.tradingAccounts === Infinity ? "Unlimited" : plan.limits.tradingAccounts },
    { label: "Broker connections", value: plan.limits.brokerConnections === null ? "Unlimited" : plan.limits.brokerConnections },
    { label: "AI Journal Coach", value: plan.limits.aiReflectionsPerDay > 0 ? `${plan.limits.aiReflectionsPerDay}/day` : false },
    { label: "Advanced analytics", value: plan.limits.hasAdvancedAnalytics },
    { label: "Live broker sync", value: plan.limits.hasLiveBrokerSync },
    { label: "Client management", value: plan.limits.hasClientManagement },
    { label: "White-label reports", value: plan.limits.hasWhiteLabelReports },
    { label: "API access", value: plan.limits.hasApiAccess
        ? (plan.limits.apiCallsPerDay ? `${plan.limits.apiCallsPerDay.toLocaleString("en-IN")}/day` : true) : false },
  ];

  return (
    <div className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
      plan.popular
        ? "border-indigo-500/40 bg-gradient-to-b from-indigo-900/20 to-zinc-900/80 shadow-xl shadow-indigo-500/10"
        : "border-white/8 bg-zinc-900/50 hover:border-white/15"
    }`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 text-[10px] font-black tracking-[0.15em] uppercase bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-500/30">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-black text-white">{plan.name}</h3>
        <p className="text-xs text-zinc-500 mt-0.5">{plan.tagline}</p>
      </div>

      <div className="mb-6">
        {isFree ? (
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-white">₹0</span>
            <span className="text-zinc-500 text-sm">forever</span>
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">{formatINR(monthlyEquiv)}</span>
              <span className="text-zinc-500 text-sm">/mo</span>
            </div>
            {cycle === "yearly" && (
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-zinc-500 line-through">{formatINR(plan.priceMonthly)}/mo</span>
                <span className="text-xs font-bold text-emerald-400">Save {savings}%</span>
              </div>
            )}
            {cycle === "yearly" && (
              <p className="text-xs text-zinc-600 mt-0.5">Billed as {formatINR(plan.priceYearly)}/year</p>
            )}
          </>
        )}
      </div>

      <div className="space-y-2.5 mb-6 flex-1">
        {FEATURE_ROWS.map(({ label, value }) => (
          <div key={label} className="flex items-center gap-2.5 text-xs">
            {value === false ? (
              <X size={13} className="text-zinc-700 shrink-0" />
            ) : (
              <Check size={13} className="text-emerald-400 shrink-0" />
            )}
            <span className={value === false ? "text-zinc-600" : "text-zinc-300"}>
              {label}
              {typeof value === "string" && value !== "true" && value !== "false"
                ? `: ${value}` : ""}
            </span>
          </div>
        ))}
      </div>

      {isCurrent ? (
        <div className="py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center text-sm font-semibold text-emerald-400">
          ✓ Current Plan
        </div>
      ) : isFree ? (
        <div className="py-2.5 rounded-xl border border-white/10 text-center text-sm text-zinc-400">
          Free Forever
        </div>
      ) : (
        <button
          onClick={() => onSubscribe(plan.key, cycle)}
          disabled={loading}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
            plan.popular
              ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
              : "bg-zinc-800 hover:bg-zinc-700 text-white"
          }`}
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
          {loading ? "Processing..." : `Subscribe to ${plan.name}`}
        </button>
      )}
    </div>
  );
};

// ── Cancel Modal ──────────────────────────────────────────────────────────────

const CancelModal = ({ onConfirm, onClose }: { onConfirm: (atEnd: boolean) => void; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
          <AlertCircle className="text-red-400" size={18} />
        </div>
        <h3 className="font-bold text-lg text-white">Cancel Subscription</h3>
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed">
        You can choose when to cancel. We recommend cancelling at period end to keep access until your paid period expires.
      </p>
      <div className="space-y-3 pt-2">
        <button
          onClick={() => onConfirm(true)}
          className="w-full py-3 rounded-xl border border-amber-500/25 bg-amber-500/5 text-amber-300 text-sm font-semibold hover:bg-amber-500/10 transition-colors text-left px-4"
        >
          <div className="font-bold">Cancel at period end</div>
          <div className="text-xs text-zinc-500 mt-0.5">Keep access until current billing period ends. No refund.</div>
        </button>
        <button
          onClick={() => onConfirm(false)}
          className="w-full py-3 rounded-xl border border-red-500/25 bg-red-500/5 text-red-400 text-sm font-semibold hover:bg-red-500/10 transition-colors text-left px-4"
        >
          <div className="font-bold">Cancel immediately</div>
          <div className="text-xs text-zinc-500 mt-0.5">Access ends now. No refund issued.</div>
        </button>
      </div>
      <button onClick={onClose} className="w-full py-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
        Keep my subscription
      </button>
    </div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const [billingData, setBillingData] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statusRes, invRes] = await Promise.all([
        fetch("/api/billing/status"),
        fetch("/api/billing/invoices"),
      ]);
      const status = await statusRes.json();
      const inv = await invRes.json();
      if (status.success) setBillingData(status.data);
      if (inv.success) setInvoices(inv.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubscribe = async (plan: string, selectedCycle: string) => {
    setSubscribing(true);
    try {
      const res = await fetch("/api/billing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, cycle: selectedCycle }),
      });
      const json = await res.json();
      if (json.success && json.data.shortUrl) {
        // Redirect to Razorpay hosted payment page
        window.location.href = json.data.shortUrl;
      } else {
        setActionMsg({ type: "error", text: json.message || "Could not initiate subscription. Try again." });
      }
    } finally {
      setSubscribing(false);
    }
  };

  const handleCancel = async (atPeriodEnd: boolean) => {
    setShowCancel(false);
    const res = await fetch("/api/billing/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ atPeriodEnd }),
    });
    const json = await res.json();
    if (json.success) {
      setActionMsg({ type: "success", text: json.data.message });
      setTimeout(fetchData, 500);
    } else {
      setActionMsg({ type: "error", text: "Cancellation failed. Please try again." });
    }
  };

  const currentPlan = billingData?.plan ?? "free";
  const hasActiveSub = billingData?.status === "active" && currentPlan !== "free";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="text-indigo-500 animate-spin" size={28} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16">
      <div>
        <h1 className="text-3xl font-black text-white">Plans & Billing</h1>
        <p className="text-zinc-500 mt-1">Upgrade your TradeForge experience. Cancel anytime.</p>
      </div>

      {/* ── Action Message ─── */}
      {actionMsg && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm ${
          actionMsg.type === "success"
            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
            : "bg-red-500/5 border-red-500/20 text-red-300"
        }`}>
          {actionMsg.type === "success" ? <Check size={15} /> : <AlertCircle size={15} />}
          {actionMsg.text}
          <button onClick={() => setActionMsg(null)} className="ml-auto text-zinc-500 hover:text-white"><X size={14} /></button>
        </div>
      )}

      {/* ── Active Subscription Dashboard ─── */}
      {hasActiveSub && (
        <div className="bg-gradient-to-br from-indigo-900/20 to-zinc-900/50 border border-indigo-500/20 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-black text-white">{billingData.planName} Plan</h2>
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border ${STATUS_COLORS[billingData.status] ?? STATUS_COLORS.active}`}>
                  {billingData.status}
                </span>
              </div>
              {billingData.currentPeriodEnd && (
                <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                  <Calendar size={11} />
                  {billingData.cancelAtPeriodEnd ? "Cancels" : "Renews"} on{" "}
                  {new Date(billingData.currentPeriodEnd).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  {" · "}{formatINR(billingData.billingCycle === "yearly" ? billingData.pricing.yearly : billingData.pricing.monthly)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowCancel(true)}
                className="px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 text-xs hover:bg-red-500/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Usage Meters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
            <UsageMeter
              label="Trades this month"
              used={billingData.usage?.tradesThisMonth ?? 0}
              limit={billingData.limits?.tradesPerMonth}
            />
            <UsageMeter
              label="AI reflections today"
              used={billingData.usage?.aiReflectionsToday ?? 0}
              limit={billingData.limits?.aiReflectionsPerDay}
            />
            <UsageMeter
              label="Broker connections"
              used={billingData.usage?.brokerConnectionsCount ?? 0}
              limit={billingData.limits?.brokerConnections}
            />
          </div>
        </div>
      )}

      {/* ── Pricing Table ─── */}
      <div>
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-black text-white">Choose Your Plan</h2>
            <p className="text-zinc-500 text-sm mt-0.5">Used by 500+ traders across India</p>
          </div>

          {/* Billing cycle toggle */}
          <div className="flex items-center bg-zinc-900 border border-white/8 rounded-xl p-1">
            {(["monthly", "yearly"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  cycle === c ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {c.charAt(0).toUpperCase() + c.slice(1)}
                {c === "yearly" && <span className="ml-1.5 text-[10px] font-bold text-emerald-400">–25%</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(PLANS).map((plan) => (
            <PricingCard
              key={plan.key}
              plan={plan}
              cycle={cycle}
              onSubscribe={handleSubscribe}
              isCurrent={currentPlan === plan.key}
              loading={subscribing}
            />
          ))}
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          Billed in INR · All payments processed securely via Razorpay · Cancel anytime · No hidden fees
        </p>
      </div>

      {/* ── Invoice History ─── */}
      {invoices.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-zinc-500" /> Payment History
          </h2>
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/80 border-b border-white/5">
                <tr>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3">Method</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4 text-zinc-300">
                      {inv.paidAt
                        ? new Date(inv.paidAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-zinc-400">{inv.description ?? "Subscription payment"}</td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-white">
                      {formatINR(inv.amount)}
                    </td>
                    <td className="px-5 py-4 text-zinc-500 capitalize">{inv.method ?? "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        inv.status === "captured" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        inv.status === "failed" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        "bg-zinc-700 text-zinc-400 border-zinc-600"
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {inv.invoiceUrl && (
                        <a href={inv.invoiceUrl} target="_blank" rel="noopener noreferrer"
                           className="text-indigo-400 hover:text-indigo-300 transition-colors">
                          <Download size={14} />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Cancel Modal ─── */}
      {showCancel && (
        <CancelModal onConfirm={handleCancel} onClose={() => setShowCancel(false)} />
      )}
    </div>
  );
}
