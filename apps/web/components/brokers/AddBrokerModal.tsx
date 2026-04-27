"use client";

import React, { useState } from "react";
import {
  X, AlertTriangle, Loader2, ChevronRight, ExternalLink, Info, CheckCircle2, Wifi, Eye, EyeOff
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { BROKERS, FIELD_LABELS, FIELD_MASKED } from "./broker-utils";

interface AddBrokerModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AddBrokerModal = ({ onClose, onSuccess }: AddBrokerModalProps) => {
  const { getToken } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedBroker, setSelectedBroker] = useState<typeof BROKERS[0] | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [showMasked, setShowMasked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const set = (key: string, val: string) => setFields(f => ({ ...f, [key]: val }));
  const toggleMask = (key: string) => setShowMasked(m => ({ ...m, [key]: !m[key] }));

  const handleInitConnect = async () => {
    if (!selectedBroker) return;
    setLoading(true);
    setError(null);
    try {
      const broker = selectedBroker;
      const token = await getToken();
      if (broker.authType === "oauth") {
        const res = await fetch("/api/sync/connect/init", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ broker: broker.id, apiKey: fields.apiKey, apiSecret: fields.apiSecret }),
        });
        const json = await res.json();
        if (json.success) {
          setRedirectUrl(json.data.redirectUrl);
          setStep(3); // Show redirect step
        } else {
          setError(json.message ?? "Failed to initiate connection");
        }
      } else {
        setStep(3); // Direct connect confirmation
      }
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDirectConnect = async () => {
    if (!selectedBroker) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await fetch("/api/sync/connect/complete", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ broker: selectedBroker.id, ...fields }),
      });
      const json = await res.json();
      if (json.success) {
        setStep(5); // Success
        setTimeout(() => { onSuccess(); onClose(); }, 2000);
      } else {
        setError(json.message ?? "Connection failed");
      }
    } catch(e) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <h3 className="font-bold text-white text-lg">Add Broker Connection</h3>
            <div className="flex items-center gap-2 mt-1">
              {[1,2,3,4,5].map(s => (
                <div key={s} className={`h-1 rounded-full transition-all ${s <= step ? "bg-indigo-500 w-8" : "bg-zinc-800 w-4"}`} />
              ))}
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          {/* Step 1: Select Broker */}
          {step === 1 && (
            <div>
              <p className="text-sm text-zinc-400 mb-4">Select the broker you want to connect</p>
              <div className="grid grid-cols-2 gap-3">
                {BROKERS.map(b => (
                  <button
                    key={b.id}
                    onClick={() => { setSelectedBroker(b); setStep(2); }}
                    className="flex items-center gap-3 p-4 rounded-xl border border-white/8 bg-zinc-800/50 hover:border-white/20 hover:bg-zinc-800 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
                         style={{ background: b.color }}>
                      {b.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{b.name}</div>
                      <div className="text-[10px] text-zinc-500">{b.authType === "oauth" ? "OAuth" : b.authType === "totp" ? "TOTP" : "API Key"}</div>
                    </div>
                    <ChevronRight size={14} className="ml-auto text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Enter credentials */}
          {step === 2 && selectedBroker && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${selectedBroker.color}18` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm"
                     style={{ background: selectedBroker.color }}>
                  {selectedBroker.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{selectedBroker.name}</p>
                  <p className="text-xs text-zinc-500">Enter your API credentials</p>
                </div>
              </div>

              {selectedBroker.fields.map(field => (
                <div key={field} className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">{FIELD_LABELS[field] ?? field}</label>
                  <div className="relative">
                    <input
                      type={FIELD_MASKED[field] && !showMasked[field] ? "password" : "text"}
                      value={fields[field] ?? ""}
                      onChange={e => set(field, e.target.value)}
                      placeholder={`Enter ${FIELD_LABELS[field] ?? field}`}
                      className="w-full bg-zinc-800 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 pr-10"
                    />
                    {FIELD_MASKED[field] && (
                      <button onClick={() => toggleMask(field)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                        {showMasked[field] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-zinc-400 hover:text-white transition-colors">
                  Back
                </button>
                <button
                  onClick={selectedBroker.authType === "oauth" ? handleInitConnect : (() => setStep(3))}
                  disabled={loading || selectedBroker.fields.some(f => !fields[f])}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold disabled:opacity-50 transition-all"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : null}
                  {selectedBroker.authType === "oauth" ? "Connect with OAuth →" : "Next →"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: OAuth redirect or direct connect */}
          {step === 3 && selectedBroker && (
            <div className="space-y-4 text-center">
              {redirectUrl ? (
                <>
                  <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center" style={{ background: selectedBroker.color }}>
                    <ExternalLink size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Authorize on {selectedBroker.name}</h4>
                    <p className="text-sm text-zinc-500 mt-1">Click the button below to open {selectedBroker.name}'s login page.</p>
                  </div>
                  <a href={redirectUrl} target="_blank" rel="noopener noreferrer"
                     className="flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm"
                     style={{ background: selectedBroker.color }}>
                    Open {selectedBroker.name} Login
                    <ExternalLink size={14} />
                  </a>
                  <p className="text-xs text-zinc-600">After authorizing, return here and click "I've Authorized"</p>
                  <button onClick={() => setStep(4)} className="w-full py-2.5 rounded-xl border border-white/10 text-sm text-zinc-400 hover:text-white transition-colors">
                    I've Authorized →
                  </button>
                </>
              ) : (
                <div className="space-y-4 text-left">
                  <p className="text-sm text-zinc-400">Review and connect</p>
                  <button
                    onClick={handleDirectConnect}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Wifi size={14} />}
                    {loading ? "Connecting..." : "Connect Broker"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: OAuth callback token entry */}
          {step === 4 && selectedBroker && (
            <div className="space-y-4">
              <p className="text-sm text-zinc-400">Enter the response token from {selectedBroker.name}</p>
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={fields.requestToken ?? fields.code ?? ""}
                  onChange={e => set(selectedBroker.id === "ZERODHA" ? "requestToken" : "code", e.target.value)}
                  placeholder="Paste token/code here"
                  className="w-full bg-zinc-800 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 font-mono"
                />
              </div>
              <button
                onClick={handleDirectConnect}
                disabled={loading || (!fields.requestToken && !fields.code)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                {loading ? "Connecting..." : "Complete Connection"}
              </button>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} className="text-emerald-400" />
              </div>
              <h4 className="font-bold text-white text-lg">Connected!</h4>
              <p className="text-sm text-zinc-400">Your broker account is now linked. We're running your initial sync.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
