"use client";

import React from "react";
import {
  Activity, RefreshCw, Trash2, Wifi, WifiOff, AlertTriangle, Loader2
} from "lucide-react";
import { BROKERS, timeAgo } from "./broker-utils";

interface BrokerCardProps {
  conn: any;
  onSync: () => void;
  onDisconnect: () => void;
  syncing: boolean;
}

export const BrokerCard = ({ conn, onSync, onDisconnect, syncing }: BrokerCardProps) => {
  const broker = BROKERS.find(b => b.id === conn.broker) ?? { name: conn.broker, color: "#666" };
  const isHealthy = conn.isActive && !conn.needsReauth;

  return (
    <div className="bg-zinc-900/60 border border-white/8 rounded-2xl p-5 space-y-4 hover:border-white/15 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0"
               style={{ background: broker.color }}>
            {broker.name[0]}
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">{broker.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              {conn.needsReauth ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  <AlertTriangle size={9} /> Needs Re-auth
                </span>
              ) : conn.isActive ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <Wifi size={9} /> Connected
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                  <WifiOff size={9} /> Disconnected
                </span>
              )}
            </div>
          </div>
        </div>
        <button onClick={onDisconnect} className="text-zinc-700 hover:text-red-400 transition-colors">
          <Trash2 size={15} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-zinc-800/50 rounded-xl p-2.5">
          <div className="text-sm font-black text-white">{conn.totalTradesSynced.toLocaleString("en-IN")}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Trades Synced</div>
        </div>
        <div className="bg-zinc-800/50 rounded-xl p-2.5">
          <div className="text-sm font-black text-white">{timeAgo(conn.lastSyncAt)}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Last Sync</div>
        </div>
        <div className="bg-zinc-800/50 rounded-xl p-2.5">
          <div className="text-[11px] font-bold text-zinc-300">4:00 PM</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Next Sync</div>
        </div>
      </div>

      {conn.syncError && (
        <div className="flex items-start gap-2 p-2.5 bg-red-500/8 border border-red-500/15 rounded-xl text-xs text-red-300">
          <AlertTriangle size={12} className="shrink-0 mt-0.5" />
          <span className="truncate">{conn.syncError}</span>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onSync}
          disabled={syncing || !isHealthy}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold disabled:opacity-50 transition-colors"
        >
          {syncing
            ? <><Loader2 size={12} className="animate-spin" /> Syncing...</>
            : <><RefreshCw size={12} /> Sync Now</>
          }
        </button>
        {conn.needsReauth && (
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-semibold transition-colors">
            <Activity size={12} /> Re-authenticate
          </button>
        )}
      </div>
    </div>
  );
};
