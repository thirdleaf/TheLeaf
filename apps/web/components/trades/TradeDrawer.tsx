"use client";

import React, { useEffect } from "react";
import { X, ArrowRightLeft, Target, Percent, Clock, AlertTriangle, Image as ImageIcon } from "lucide-react";
import { formatPnL, formatDateTime, formatIndianCurrency } from "@thirdleaf/utils";

export const TradeDrawer = ({ trade, onClose }: { trade: any | null; onClose: () => void }) => {
  
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!trade) return null;

  const { pnlStr, color } = trade.netPnl ? {
    pnlStr: formatPnL(trade.netPnl).formatted,
    color: trade.netPnl > 0 ? "text-emerald-400" : "text-red-400",
  } : { pnlStr: "₹0", color: "text-zinc-400" };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-[640px] max-w-[100vw] bg-[#09090b] border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${trade.direction === "LONG" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
              {trade.direction === "LONG" ? "L" : "S"}
            </div>
            <div>
              <h2 className="text-2xl font-bold font-heading text-white tracking-tight">{trade.symbol}</h2>
              <p className="text-sm text-zinc-500 font-medium">{formatDateTime(trade.entryTime)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`text-right font-mono text-2xl font-bold ${color}`}>
              {pnlStr}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-zinc-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard icon={<Target size={16}/>} label="Entry" value={formatIndianCurrency(trade.entryPrice / 100)} />
            <StatCard icon={<ArrowRightLeft size={16}/>} label="Exit" value={trade.exitPrice ? formatIndianCurrency(trade.exitPrice / 100) : "Open"} />
            <StatCard icon={<Percent size={16}/>} label="Quantity" value={trade.quantity} />
            <StatCard icon={<Clock size={16}/>} label="R-Mult" value={trade.rMultipleActual ? `${trade.rMultipleActual}R` : "-"} />
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 border border-white/5 bg-zinc-900/30 rounded-xl">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Gross P&L</p>
              <p className="font-mono text-white">{trade.grossPnl ? formatIndianCurrency(Math.abs(trade.grossPnl / 100)) : "-"}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Taxes/Fees</p>
              <p className="font-mono text-red-400">-{formatIndianCurrency((trade.brokerage + trade.taxes) / 100 || 0)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Hold Time</p>
              <p className="font-mono text-white">{trade.holdDurationSeconds ? `${Math.floor(trade.holdDurationSeconds/60)} mins` : "-"}</p>
            </div>
          </div>

          {/* Strategy Deviations */}
          {trade.deviationsFromPlan && (
            <div className="p-4 border border-orange-500/20 bg-orange-500/10 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-orange-400">Strategy Deviations</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-md">Moved Stoploss</span>
                  <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-md">Re-entry</span>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <h3 className="text-sm font-medium text-white mb-3">Analysis Tags</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">Breakout Pullback</span>
              <span className="text-xs px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">H4 Bias Sync</span>
              <span className="text-xs px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300">FOMO Entry</span>
            </div>
          </div>

          {/* Raw Tips */}
          <div>
            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-zinc-500" /> Screenshots
            </h3>
            <div className="h-32 rounded-xl bg-zinc-900 border border-white/5 border-dashed flex items-center justify-center text-zinc-500 text-sm hover:bg-zinc-800 transition-colors cursor-pointer">
              + Drop images here
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/5 bg-black">
          <button className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors">
            Edit Trade Specs
          </button>
        </div>

      </div>
    </>
  );
};

const StatCard = ({ icon, label, value }: any) => (
  <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
    <div className="flex items-center gap-2 text-zinc-500 mb-2">
      {icon}
      <span className="text-xs uppercase tracking-wider font-semibold">{label}</span>
    </div>
    <div className="font-mono text-white text-lg">{value}</div>
  </div>
);
