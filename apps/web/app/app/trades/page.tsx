"use client";

import React, { useState } from "react";
import { FiltersBar } from "../../../components/trades/FiltersBar";
import { TradeTable } from "../../../components/trades/TradeTable";
import { TradeDrawer } from "../../../components/trades/TradeDrawer";
import { AddTradeModal } from "../../../components/trades/AddTradeModal";

export default function TradesPage() {
  const [selectedTrade, setSelectedTrade] = useState<any | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mock data payload resolving frontend UI visual checks
  const mockTrades = [
    {
      id: "1",
      symbol: "BANKNIFTY",
      direction: "LONG",
      entryTime: new Date(Date.now() - 3600000).toISOString(),
      exitTime: new Date().toISOString(),
      entryPrice: 48500 * 100,
      exitPrice: 48650 * 100,
      quantity: 30,
      netPnl: 4500 * 100,
      grossPnl: 4800 * 100,
      taxes: 120 * 100,
      brokerage: 180 * 100,
      holdDurationSeconds: 1200,
      rMultipleActual: 2.5,
      deviationsFromPlan: true,
    },
    {
      id: "2",
      symbol: "RELIANCE",
      direction: "SHORT",
      entryTime: new Date(Date.now() - 8600000).toISOString(),
      exitTime: new Date(Date.now() - 7600000).toISOString(),
      entryPrice: 2900 * 100,
      exitPrice: 2950 * 100,
      quantity: 50,
      netPnl: -2500 * 100,
      grossPnl: -2400 * 100,
      taxes: 60 * 100,
      brokerage: 40 * 100,
      holdDurationSeconds: 850,
      rMultipleActual: -1.0,
      deviationsFromPlan: false,
    }
  ];

  // Pressing 'N' keyboard shortcut opens the add trade modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "n" && !isAddModalOpen && !selectedTrade) {
        // Prevent if typing in an input
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        e.preventDefault();
        setIsAddModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAddModalOpen, selectedTrade]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-heading text-white">Trade Log</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-brand-primary text-black font-semibold px-4 py-2 rounded-lg hover:bg-brand-primary/90 transition-all flex items-center gap-2"
        >
          <span>Log Trade</span>
          <kbd className="hidden md:inline-block text-[10px] bg-black/20 px-1.5 py-0.5 rounded opacity-80 border border-black/10">N</kbd>
        </button>
      </div>

      <FiltersBar />

      <TradeTable data={mockTrades} onRowClick={setSelectedTrade} />

      <TradeDrawer trade={selectedTrade} onClose={() => setSelectedTrade(null)} />
      
      {isAddModalOpen && <AddTradeModal onClose={() => setIsAddModalOpen(false)} />}
    </div>
  );
}
