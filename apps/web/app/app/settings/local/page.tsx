"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { 
  Globe, 
  Coins, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  Info,
  MapPin,
  Languages,
  Scale
} from "lucide-react";

const CURRENCIES = [
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" }
];

const TIMEZONES = [
  "Asia/Kolkata",
  "America/New_York",
  "Europe/London",
  "Asia/Dubai",
  "Asia/Singapore",
  "Australia/Sydney",
  "UTC"
];

export default function RegionalSettingsPage() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [settings, setSettings] = useState({
    defaultCurrency: "INR",
    timezone: "Asia/Kolkata",
    customBrokeragePaise: 0,
    brokerageCapPaise: 0,
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
          defaultCurrency: json.data.defaultCurrency || "INR",
          timezone: json.data.timezone || "Asia/Kolkata",
          customBrokeragePaise: json.data.customBrokeragePaise || 0,
          brokerageCapPaise: json.data.brokerageCapPaise || 0,
        });
      }
    } catch (e) {
      console.error("Failed to fetch regional settings", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updates: any) => {
    setSaving(true);
    setSuccess(false);
    
    // Optimistic update
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);

    try {
      const token = await getToken();
      const res = await fetch("/api/users/me/settings", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
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
        <h1 className="text-2xl font-black text-white">Regional Settings</h1>
        <p className="text-zinc-500 text-sm mt-1">Configure your currency, timezone, and brokerage overrides.</p>
      </div>

      <div className="space-y-6">
        {/* Currency Selection */}
        <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400">
              <Coins size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold">Base Currency</h3>
              <p className="text-zinc-500 text-xs">Used for your dashboard and journaling</p>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CURRENCIES.map(curr => (
              <button
                key={curr.code}
                onClick={() => handleSave({ defaultCurrency: curr.code })}
                className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-3 ${
                  settings.defaultCurrency === curr.code 
                    ? "bg-amber-500/10 border-amber-500/50 text-white shadow-lg shadow-amber-500/5" 
                    : "bg-zinc-800/50 border-white/5 text-zinc-400 hover:border-white/10"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-sm">
                  {curr.symbol}
                </div>
                <div>
                  <div className="font-bold text-sm">{curr.code}</div>
                  <div className="text-[10px] opacity-60">{curr.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Timezone Selection */}
        <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold">Timezone</h3>
              <p className="text-zinc-500 text-xs">Ensures trade sync matches your market hours</p>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <select 
                value={settings.timezone}
                onChange={e => handleSave({ timezone: e.target.value })}
                className="w-full bg-zinc-800 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white appearance-none focus:outline-none focus:border-indigo-500/50 transition-all cursor-pointer"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Brokerage Overrides */}
        <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
              <Scale size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold">Brokerage Overrides</h3>
              <p className="text-zinc-500 text-xs text-indigo-400 font-bold uppercase tracking-wider">Experimental</p>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase ml-2">Flat Fee Per Order (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 font-bold">₹</span>
                <input 
                  type="number"
                  value={settings.customBrokeragePaise / 100}
                  onChange={e => handleSave({ customBrokeragePaise: Math.round(parseFloat(e.target.value) * 100) || 0 })}
                  className="w-full bg-zinc-800 border border-white/5 rounded-2xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  placeholder="20.00"
                />
              </div>
              <p className="text-[10px] text-zinc-600 ml-2">Applied as a per-side fee if set. Defaults to broker standard if 0.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase ml-2">Max Brokerage Cap (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 font-bold">₹</span>
                <input 
                  type="number"
                  value={settings.brokerageCapPaise / 100}
                  onChange={e => handleSave({ brokerageCapPaise: Math.round(parseFloat(e.target.value) * 100) || 0 })}
                  className="w-full bg-zinc-800 border border-white/5 rounded-2xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  placeholder="20.00"
                />
              </div>
              <p className="text-[10px] text-zinc-600 ml-2">The maximum brokerage per order leg.</p>
            </div>
          </div>
        </div>

        {/* Language (Disabled) */}
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 opacity-40 grayscale pointer-events-none">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-500">
              <Languages size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold">Language</h3>
              <p className="text-zinc-500 text-xs font-mono lowercase">EN (Default) • Coming Soon</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center h-12">
        {saving ? (
          <div className="flex items-center gap-2 text-zinc-500 font-bold text-xs uppercase tracking-widest animate-pulse">
            <Loader2 size={14} className="animate-spin" />
            Persisting to database...
          </div>
        ) : success ? (
          <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-widest animate-in fade-in zoom-in">
            <CheckCircle2 size={14} />
            Preferences Saved
          </div>
        ) : null}
      </div>

      <div className="bg-indigo-500/5 border border-indigo-500/10 p-8 rounded-[32px] text-center space-y-4 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full" />
        <Globe size={40} className="text-indigo-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white tracking-tight">Global Connectivity</h3>
        <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
          ThirdLeaf supports global market standards. Your timezone choice affects how your equity curves and profit calendars are rendered.
        </p>
      </div>
    </div>
  );
}
