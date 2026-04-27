"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { 
  ShieldAlert, 
  Target, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  TrendingDown,
  Scale
} from "lucide-react";

export default function TradingRulesPage() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [settings, setSettings] = useState({
    riskPerTrade: 1.0,
    dailyLossLimit: 5000,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = await getToken();
      const res = await fetch("/api/users/me/settings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSettings({
          riskPerTrade: json.data.riskPerTrade / 100, // Conversion from basis points
          dailyLossLimit: json.data.dailyLossLimit,
        });
      }
    } catch (e) {
      console.error("Failed to fetch rules", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const token = await getToken();
      const res = await fetch("/api/users/me/settings", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          riskPerTrade: Math.round(settings.riskPerTrade * 100), // Convert to basis points
          dailyLossLimit: settings.dailyLossLimit,
        })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      console.error("Save failed", e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-black text-white">Trading Rules</h1>
        <p className="text-zinc-500 text-sm mt-1">Define your risk parameters and engine guardrails.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Per Trade */}
        <div className="bg-zinc-900 border border-white/5 p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
              <Target size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold">Risk Per Trade</h3>
              <p className="text-zinc-500 text-xs">Recommended: 0.5% – 2%</p>
            </div>
          </div>
          
          <div className="space-y-4 pt-4">
            <div className="flex justify-between items-end">
              <span className="text-4xl font-black text-white">{settings.riskPerTrade}%</span>
              <span className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Cap at 10%</span>
            </div>
            <input 
              type="range" min="0.1" max="5" step="0.1"
              value={settings.riskPerTrade}
              onChange={e => setSettings(s => ({ ...s, riskPerTrade: parseFloat(e.target.value) }))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>

        {/* Daily Loss Limit */}
        <div className="bg-zinc-900 border border-white/5 p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-400">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold">Daily Loss Limit</h3>
              <p className="text-zinc-500 text-xs">Hard stop for the day</p>
            </div>
          </div>
          
          <div className="space-y-4 pt-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">₹</span>
              <input 
                type="number"
                value={settings.dailyLossLimit}
                onChange={e => setSettings(s => ({ ...s, dailyLossLimit: parseInt(e.target.value) || 0 }))}
                className="w-full bg-zinc-800 border border-white/5 rounded-2xl pl-8 pr-4 py-4 text-2xl font-black text-white focus:outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logic Banners */}
      <div className="bg-indigo-500/5 border border-indigo-500/10 p-6 rounded-3xl flex items-start gap-4">
        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 shrink-0">
          <Zap size={18} />
        </div>
        <div>
          <h4 className="text-indigo-300 font-bold text-sm">Automated Guardrails</h4>
          <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
            These rules are enforced by the ThirdLeaf engine. If your equity drops below the daily loss limit, 
            you will receive an instant push notification, and subsequent journals will be flagged for "Discipline Audit".
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          {success && (
            <div className="flex items-center gap-2 text-emerald-400 animate-in fade-in slide-in-from-left-4">
              <CheckCircle2 size={16} />
              <span className="text-xs font-bold">Rules Updated</span>
            </div>
          )}
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-white text-black font-black text-sm rounded-2xl hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : null}
          Save Changes
        </button>
      </div>

      <div className="pt-12 border-t border-white/5">
        <h3 className="text-lg font-bold text-white mb-6">Advanced Controls Coming Soon</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ComingSoonCard title="Max Open Positions" icon={<Scale size={18} />} />
          <ComingSoonCard title="Max Drawdown (Trailing)" icon={<TrendingDown size={18} />} />
        </div>
      </div>
    </div>
  );
}

function ComingSoonCard({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="p-4 bg-zinc-900/30 border border-white/5 rounded-2xl flex items-center gap-3 opacity-50 grayscale">
      <div className="text-zinc-500">{icon}</div>
      <span className="text-sm font-medium text-zinc-500">{title}</span>
    </div>
  );
}
