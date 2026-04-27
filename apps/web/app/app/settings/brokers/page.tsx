"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Clock, Activity, AlertTriangle, X, Loader2 } from "lucide-react";
import { BrokerCard } from "../../../../components/brokers/BrokerCard";
import { AddBrokerModal } from "../../../../components/brokers/AddBrokerModal";

export default function BrokersSettingsPage() {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const fetchConnections = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sync/connections");
      const json = await res.json();
      if (json.success) setConnections(json.data);
    } catch (e) {
      console.error("Failed to fetch connections", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const handleSync = async (connectionId: string) => {
    setSyncingIds(s => new Set(s).add(connectionId));
    try {
      const res = await fetch(`/api/sync/trigger/${connectionId}`, { method: "POST" });
      const json = await res.json();
      if (!json.success) setError(json.message ?? "Sync failed");
      else {
        // Poll for status/refresh after delay
        setTimeout(fetchConnections, 3000);
      }
    } catch (e) {
      setError("Network error triggering sync");
    } finally {
      setSyncingIds(s => {
        const n = new Set(s);
        n.delete(connectionId);
        return n;
      });
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    if (!confirm("Disconnect this broker? Your existing trades won't be deleted.")) return;
    try {
      const res = await fetch(`/api/sync/connect/${connectionId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) fetchConnections();
    } catch (e) {
      setError("Failed to disconnect broker");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Broker Connections</h1>
          <p className="text-zinc-500 text-sm mt-1">Auto-import trades from your broker accounts</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={16} /> Add Broker
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/8 border border-red-500/15 rounded-xl text-sm text-red-300">
          <AlertTriangle size={14} /> {error}
          <button onClick={() => setError(null)} className="ml-auto"><X size={14} /></button>
        </div>
      )}

      {/* Auto-sync info banner */}
      <div className="flex items-center gap-4 p-4 bg-indigo-500/8 border border-indigo-500/15 rounded-xl text-sm">
        <Clock size={16} className="text-indigo-400 shrink-0" />
        <div>
          <p className="text-indigo-300 font-semibold">Automatic sync at 4:00 PM IST on trading days</p>
          <p className="text-zinc-500 text-xs mt-0.5">Elite plan users get sync every 15 minutes during market hours (9:15 AM – 3:30 PM IST)</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-56 bg-zinc-900/50 border border-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : connections.length === 0 ? (
        <div className="text-center py-20 border border-white/5 rounded-2xl bg-zinc-900/30">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <Activity size={24} className="text-zinc-600" />
          </div>
          <h3 className="font-bold text-zinc-400 text-lg">No brokers connected</h3>
          <p className="text-zinc-600 text-sm mt-1 mb-6">Connect your first broker to start auto-importing trades</p>
          <button
            onClick={() => setShowAdd(true)}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all"
          >
            Connect Your First Broker
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {connections.map(conn => (
            <BrokerCard
              key={conn.id}
              conn={conn}
              onSync={() => handleSync(conn.id)}
              onDisconnect={() => handleDisconnect(conn.id)}
              syncing={syncingIds.has(conn.id)}
            />
          ))}
        </div>
      )}

      {showAdd && (
        <AddBrokerModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            setShowAdd(false);
            fetchConnections();
          }}
        />
      )}
    </div>
  );
}
