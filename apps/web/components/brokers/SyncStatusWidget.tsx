"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, CheckCircle2, AlertTriangle, Wifi, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";

function timeAgo(date: string | null): string {
  if (!date) return "Never synced";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface SyncWidgetProps {
  compact?: boolean;
}

export const SyncStatusWidget = ({ compact = false }: SyncWidgetProps) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const [logsRes, connRes] = await Promise.all([
        fetch("/api/sync/logs?limit=5"),
        fetch("/api/sync/connections"),
      ]);
      const logsJson = await logsRes.json();
      const connJson = await connRes.json();
      if (logsJson.success) setLogs(logsJson.data);
      if (connJson.success) setConnections(connJson.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60_000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const handleSyncAll = async () => {
    setSyncing(true);
    try {
      await fetch("/api/sync/trigger-all", { method: "POST" });
      setTimeout(fetchStatus, 3000);
    } finally {
      setSyncing(false);
    }
  };

  const activeConns = connections.filter(c => c.isActive && !c.needsReauth);
  const needsReauthConns = connections.filter(c => c.needsReauth);
  const lastSync = logs[0]?.startedAt ?? null;
  const lastNewTrades = logs.reduce((s, l) => s + (l.newTradesCount ?? 0), 0);
  const hasErrors = logs.some(l => l.status === "failed");

  if (loading) {
    return <div className="h-16 bg-zinc-800/50 rounded-xl animate-pulse" />;
  }

  if (connections.length === 0) {
    return (
      <Link href="/app/settings/brokers"
        className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-white/5 rounded-xl hover:border-white/10 transition-colors group">
        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
          <Wifi size={14} className="text-zinc-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-zinc-500">No brokers connected</p>
          <p className="text-xs text-zinc-700">Connect a broker to auto-import trades</p>
        </div>
        <ChevronRight size={14} className="text-zinc-700 group-hover:text-zinc-500 transition-colors" />
      </Link>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-white/5 rounded-xl">
        <div className={`w-2 h-2 rounded-full ${hasErrors ? "bg-red-500" : "bg-emerald-500"} shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-zinc-400 truncate">
            {hasErrors ? "Sync error on last run" : `Last synced ${timeAgo(lastSync)}`}
            {lastNewTrades > 0 && ` · ${lastNewTrades} new trades`}
          </p>
        </div>
        <button
          onClick={handleSyncAll}
          disabled={syncing || activeConns.length === 0}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white disabled:opacity-50 transition-colors shrink-0"
        >
          {syncing ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
          Sync
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/50 border border-white/8 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          {hasErrors
            ? <AlertTriangle size={14} className="text-amber-400" />
            : <CheckCircle2 size={14} className="text-emerald-400" />}
          <h3 className="text-sm font-bold text-white">Broker Sync</h3>
          <span className="text-[10px] text-zinc-500 font-medium">
            {activeConns.length} active · auto-sync 4 PM
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncAll}
            disabled={syncing || activeConns.length === 0}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white disabled:opacity-50 transition-colors"
          >
            {syncing ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
            Sync All
          </button>
          <Link href="/app/settings/brokers" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            Manage →
          </Link>
        </div>
      </div>

      {needsReauthConns.length > 0 && (
        <div className="px-4 py-2 bg-amber-500/8 border-b border-amber-500/15">
          <p className="text-xs text-amber-300 flex items-center gap-1.5">
            <AlertTriangle size={11} />
            {needsReauthConns.length} broker{needsReauthConns.length > 1 ? "s" : ""} need re-authentication
            <Link href="/app/settings/brokers" className="underline ml-1">Fix now</Link>
          </p>
        </div>
      )}

      <div className="p-4 space-y-2">
        {logs.slice(0, 3).map(log => (
          <div key={log.id} className="flex items-center gap-3 text-xs">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              log.status === "success" ? "bg-emerald-500" :
              log.status === "failed" ? "bg-red-500" : "bg-amber-500"
            }`} />
            <span className="font-medium text-zinc-400 w-20 shrink-0">{log.broker}</span>
            <span className="text-zinc-600">{timeAgo(log.startedAt)}</span>
            {log.newTradesCount > 0 && (
              <span className="ml-auto text-emerald-400 font-semibold">+{log.newTradesCount} trades</span>
            )}
            {log.status === "failed" && (
              <span className="ml-auto text-red-400 text-[10px] truncate max-w-24">{log.errorMessage?.substring(0, 30)}</span>
            )}
          </div>
        ))}
        {logs.length === 0 && (
          <p className="text-xs text-zinc-600 text-center py-2">No sync history yet</p>
        )}
      </div>
    </div>
  );
};
