"use client";

import React, { useState, useEffect } from "react";
import { 
  Calculator, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  Download, 
  History, 
  ArrowRight,
  ShieldAlert,
  HelpCircle
} from "lucide-react";
import { format } from "date-fns";

export default function TaxReportingPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [fy, setFy] = useState("2024-25");
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, [fy]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tax/summary?fy=${fy}`);
      const data = await res.json();
      setSummary(data);
    } catch (e) {
      console.error("Failed to fetch tax summary", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Calculator className="text-indigo-500" size={32} />
            Tax Reporting Center
          </h1>
          <p className="text-zinc-500 mt-1">Precise tax estimations and compliance reports for Indian traders.</p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900/50 p-1.5 rounded-xl border border-white/5">
          <select 
            value={fy} 
            onChange={(e) => setFy(e.target.value)}
            className="bg-transparent text-white text-sm font-bold px-4 py-2 outline-none cursor-pointer"
          >
            <option value="2024-25">FY 2024-25</option>
            <option value="2023-24">FY 2023-24</option>
          </select>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-lg shadow-indigo-500/20">
            Export JSON
          </button>
        </div>
      </div>

      {/* Audit Warning */}
      {summary?.audit?.requiresAudit && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-4">
          <div className="bg-amber-500/20 p-2 rounded-xl">
            <ShieldAlert className="text-amber-500" size={24} />
          </div>
          <div>
            <h4 className="text-amber-500 font-bold">Tax Audit Warning</h4>
            <p className="text-amber-200/70 text-sm mt-1">{summary.audit.message}</p>
          </div>
          <button className="ml-auto text-amber-500 text-xs font-bold underline">Learn More</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-white/5 gap-8">
        {["overview", "breakdown", "reports", "carry_forward"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === tab ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.split("_").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard title="Total Realized P&L" value={summary?.totals?.netPnl} />
            <SummaryCard title="Estimated Taxes" value={summary?.totals?.estimatedTax} color="text-amber-400" />
            <SummaryCard title="Total Turnover" value={summary?.totals?.turnover} color="text-emerald-400" />
            <SummaryCard title="Total Fees & Taxes" value={summary?.fees?.total} />
            
            <div className="col-span-full grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
              <SegmentCard title="Equity Intraday" data={summary?.equity?.intraday} category="Speculative Business" />
              <SegmentCard title="F&O Segments" data={summary?.fo?.futures} category="Non-Speculative Business" />
              <SegmentCard title="Capital Gains" data={summary?.equity?.shortTerm} category="Short & Long Term" />
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReportActionCard 
              title="Trade-Wise Tax Report" 
              desc="Comprehensive audit-ready list of every trade with turnover calculation." 
              type="FY2025-26"
            />
            <ReportActionCard 
              title="Capital Gains Statement" 
              desc="Ready-to-use breakdown for ITR Schedule CG (Section 111A/112A)." 
              type="Section 111A/112A"
            />
            <ReportActionCard 
              title="Business Income Statement" 
              desc="Consolidated P&L for F&O and Intraday equity segments." 
              type="P&L"
            />
            <ReportActionCard 
              title="Tax Audit Package" 
              desc="Turnover summaries and expense statements for your CA." 
              type="Audit Ready"
            />
          </div>
        )}
      </div>

      {/* Global Disclaimer */}
      <div className="p-6 bg-zinc-900/30 rounded-2xl border border-white/5 text-zinc-600 text-[11px] leading-relaxed">
        <div className="flex items-center gap-2 mb-2 text-zinc-500 font-bold uppercase tracking-wider">
          <HelpCircle size={12} />
          Disclaimer
        </div>
        TradeForge provides tax estimates for reference only. These calculations are performed as per our interpretation of the Indian Income Tax Act and guidelines. Actual tax liability may differ based on other sources of income, deductions under Chapter VI-A, and specific audit requirements. TradeForge is NOT a tax filing service. Please consult a qualified Chartered Accountant (CA) before filing your ITR.
      </div>
    </div>
  );
}

function SummaryCard({ title, value, color = "text-white" }: any) {
  return (
    <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl hover:bg-zinc-800/80 transition-all border-b-2 border-b-indigo-500/50">
      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{title}</p>
      <h3 className={`text-2xl font-black mt-2 ${color}`}>
        ₹{(value / 100 || 0).toLocaleString()}
      </h3>
    </div>
  );
}

function SegmentCard({ title, data, category }: any) {
  return (
    <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-white font-bold">{title}</h4>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full uppercase font-bold tracking-tight">
            {category}
          </span>
        </div>
        <div className={data?.netPnl >= 0 ? "text-emerald-500" : "text-rose-500"}>
          <TrendingUp size={20} />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Net Profit/Loss</span>
          <span className="text-white font-bold">₹{(data?.netPnl / 100 || 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Turnover</span>
          <span className="text-zinc-300 font-medium">₹{(data?.turnover / 100 || 0).toLocaleString()}</span>
        </div>
        <div className="h-px bg-white/5" />
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Est. Tax Liability</span>
          <span className="text-amber-500 font-bold">₹{(data?.estimatedTax / 100 || 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function ReportActionCard({ title, desc, type }: any) {
  return (
    <div className="group bg-zinc-900 hover:bg-zinc-800 border border-white/5 p-6 rounded-2xl transition-all cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-indigo-600/20 p-3 rounded-xl text-indigo-500">
          <FileText size={24} />
        </div>
        <span className="text-[10px] text-zinc-500 font-bold flex items-center gap-1">
          <History size={12} /> {type}
        </span>
      </div>
      <h4 className="text-white font-bold text-lg group-hover:text-indigo-400 transition-colors">{title}</h4>
      <p className="text-zinc-500 text-sm mt-2 leading-relaxed">{desc}</p>
      <button className="flex items-center gap-2 mt-6 text-indigo-500 font-bold text-sm">
        Generate PDF <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
