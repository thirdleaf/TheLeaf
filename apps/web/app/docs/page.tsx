"use client";

import React from "react";
import { 
  Book, 
  Zap,
  Code2,
  ChevronRight,
  Cpu,
  Layers
} from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
      {/* Header */}
      <div className="space-y-4 pt-10 lg:pt-0">
        <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center">
          <Book size={24} />
        </div>
        <h1 className="text-4xl lg:text-7xl font-black tracking-tight leading-[0.9]">
          Platform <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Overview.</span>
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
          ThirdLeaf is a high-bandwidth trading journal engineered for the Indian market. We bridge the gap between retail execution and institutional analytics by providing automated, multi-broker synchronization.
        </p>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
        <Link href="#zerodha" className="group p-8 bg-zinc-900/40 border border-white/5 rounded-[40px] hover:bg-zinc-900 transition-all hover:border-amber-500/20">
           <Cpu className="text-amber-400 mb-6 group-hover:scale-110 transition-transform" size={24} />
           <h3 className="text-xl font-bold mb-3">Zerodha Kite</h3>
           <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              Connect your Kite Connect API to automate your journaling and trade analytics.
           </p>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-400">
              <span>SETUP GUIDE</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
           </div>
        </Link>

        <Link href="/docs/api" className="group p-8 bg-zinc-900/40 border border-white/5 rounded-[40px] hover:bg-zinc-900 transition-all hover:border-indigo-500/20">
           <Code2 className="text-emerald-400 mb-6 group-hover:scale-110 transition-transform" size={24} />
           <h3 className="text-xl font-bold mb-3">API Reference</h3>
           <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              REST endpoints and webhook structures for quants building custom dashboards.
           </p>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
              <span>REFERENCE</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
           </div>
        </Link>
      </div>

      {/* Broker Details Section */}
      <div className="space-y-32 pt-20">
         {/* Zerodha Section */}
         <section id="zerodha" className="scroll-mt-32 space-y-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-amber-500">
                  <Cpu size={24} />
               </div>
               <h2 className="text-4xl font-black">Zerodha Kite Connect</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="space-y-6 text-zinc-400 leading-relaxed">
                  <p>To connect Zerodha, you must have an active Kite Connect API subscription. ThirdLeaf uses this to fetch your trades and positions securely.</p>
                  <ul className="space-y-4 text-sm">
                     <li className="flex gap-3">
                        <span className="text-amber-500 font-bold">1.</span>
                        Create an app in the Kite Connect dashboard.
                     </li>
                     <li className="flex gap-3">
                        <span className="text-amber-500 font-bold">2.</span>
                        Set Redirect URL to <code className="text-white">https://thirdleaf.in/auth/callback</code>.
                     </li>
                     <li className="flex gap-3">
                        <span className="text-amber-500 font-bold">3.</span>
                        Copy your API Key and Secret into ThirdLeaf Settings.
                     </li>
                  </ul>
               </div>
               <div className="p-8 bg-zinc-900/40 border border-white/5 rounded-3xl">
                  <h4 className="font-bold mb-4">API Costs</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed mb-6">Zerodha charges ₹2000/month for Kite Connect. ThirdLeaf does not charge extra for the sync service.</p>
                  <a href="https://kite.trade" target="_blank" className="btn btn-secondary w-full">Open Kite Dashboard</a>
               </div>
            </div>
         </section>

         {/* Dhan Section */}
         <section id="dhan" className="scroll-mt-32 space-y-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-indigo-500">
                  <Zap size={24} />
               </div>
               <h2 className="text-4xl font-black">DhanHQ</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="space-y-6 text-zinc-400 leading-relaxed">
                  <p>Dhan provides a free API for all its users. This is the fastest way to get started with ThirdLeaf.</p>
                  <ul className="space-y-4 text-sm">
                     <li className="flex gap-3">
                        <span className="text-indigo-500 font-bold">1.</span>
                        Login to <code className="text-white">api.dhan.co</code>.
                     </li>
                     <li className="flex gap-3">
                        <span className="text-indigo-500 font-bold">2.</span>
                        Generate a Personal Access Token (PAT).
                     </li>
                     <li className="flex gap-3">
                        <span className="text-indigo-500 font-bold">3.</span>
                        Ensure &quot;Orders&quot; and &quot;Trades&quot; scopes are checked.
                     </li>
                  </ul>
               </div>
               <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl">
                  <h4 className="font-bold mb-4 text-indigo-400">Best For Quants</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">Dhan offers the lowest latency for trade-to-journal sync in our ecosystem.</p>
               </div>
            </div>
         </section>

         {/* Fyers Section */}
         <section id="fyers" className="scroll-mt-32 space-y-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-emerald-500">
                  <Code2 size={24} />
               </div>
               <h2 className="text-4xl font-black">Fyers V3</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="space-y-6 text-zinc-400 leading-relaxed">
                  <p>Fyers V3 API is supported for both individual traders and business partners.</p>
                  <ul className="space-y-4 text-sm">
                     <li className="flex gap-3">
                        <span className="text-emerald-500 font-bold">1.</span>
                        Register your app at <code className="text-white">api-dashboard.fyers.in</code>.
                     </li>
                     <li className="flex gap-3">
                        <span className="text-emerald-500 font-bold">2.</span>
                        Add <code className="text-white">https://thirdleaf.in/api/v1/fyers-auth</code> as your App Redirect ID.
                     </li>
                  </ul>
               </div>
               <div className="p-8 bg-zinc-900/40 border border-white/5 rounded-3xl">
                  <p className="text-xs text-zinc-600 italic">Note: Fyers requires a daily authentication token refresh which ThirdLeaf automates for you.</p>
               </div>
            </div>
         </section>

         {/* Shoonya Section */}
         <section id="shoonya" className="scroll-mt-32 space-y-10 pb-20 border-b border-white/5">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-zinc-200">
                  <Zap size={24} />
               </div>
               <h2 className="text-4xl font-black">Shoonya (Finvasia)</h2>
            </div>
            <p className="text-zinc-500 max-w-2xl leading-relaxed">
               Shoonya connectivity is handled via their standard TOTP and AppKey protocol. Ensure you have enabled TOTP in your Finvasia portal before connecting to ThirdLeaf.
            </p>
         </section>

         {/* Analytics Core Section */}
         <section id="pnl" className="scroll-mt-32 space-y-12">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                  Math Engine
               </div>
               <h2 className="text-4xl lg:text-5xl font-black">PnL Calculation Logic</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
               <div className="space-y-6 text-zinc-400 leading-relaxed">
                  <p>ThirdLeaf uses the **First-In-First-Out (FIFO)** method for calculating PnL, which is the gold standard for Indian tax compliance. This means your oldest buy positions are cleared first against your sell orders.</p>
                  
                  <div className="p-8 bg-zinc-900/40 border border-white/5 rounded-3xl space-y-4">
                     <h4 className="font-bold text-white">FIFO Example</h4>
                     <p className="text-xs italic">Buy 100 Qty @ 150 (Order A)</p>
                     <p className="text-xs italic">Buy 100 Qty @ 160 (Order B)</p>
                     <p className="text-xs italic">Sell 100 Qty @ 180</p>
                     <p className="text-sm text-indigo-400 font-bold">ThirdLeaf will match the sell against Order A, realizing a profit of ₹3,000.</p>
                  </div>
               </div>
               <div className="space-y-6">
                  <h4 className="text-xl font-bold">Brokerage & Charges</h4>
                  <p className="text-zinc-500 text-sm">Most Indian brokers do not provide the exact stamp duty and STT in their real-time execution payloads. ThirdLeaf estimates these using standard SEBI charge sheets:</p>
                  <ul className="text-xs text-zinc-600 space-y-2 font-mono">
                     <li>- STT: 0.1% on Turnover</li>
                     <li>- GST: 18% on Brokerage</li>
                     <li>- Stamp Duty: 0.015% (Buy side)</li>
                  </ul>
               </div>
            </div>
         </section>

         {/* Risk Metrics Section */}
         <section id="risk" className="scroll-mt-32 space-y-12">
            <h2 className="text-4xl font-black">Risk Ratios & Metrics</h2>
            <p className="text-zinc-500 max-w-2xl leading-relaxed">
               Winning isn&apos;t enough—you need to know if you&apos;re taking too much risk for every rupee earned. ThirdLeaf automates these institutional-grade calculations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-8 bg-zinc-900 border border-white/5 rounded-[40px] space-y-4">
                  <h4 className="text-lg font-bold">Sharpe Ratio</h4>
                  <p className="text-zinc-500 text-xs leading-relaxed">Measures risk-adjusted return. A ratio above 2.0 is considered excellent for retail traders using high-leverage F&O.</p>
               </div>
               <div className="p-8 bg-zinc-900 border border-white/5 rounded-[40px] space-y-4">
                  <h4 className="text-lg font-bold">Sortino Ratio</h4>
                  <p className="text-zinc-500 text-xs leading-relaxed">Similar to Sharpe, but only penalizes downside volatility. This gives you a clearer picture of your risk in volatile markets.</p>
               </div>
               <div className="p-8 bg-zinc-900 border border-white/5 rounded-[40px] space-y-4">
                  <h4 className="text-lg font-bold">Max Drawdown</h4>
                  <p className="text-zinc-500 text-xs leading-relaxed">The largest peak-to-trough decline in your portfolio. Critical for understanding the "emotional pain" of your strategy.</p>
               </div>
            </div>
         </section>

         {/* MAE/MFE Section */}
         <section id="mae" className="scroll-mt-32 space-y-12 pb-32">
            <div className="p-12 bg-indigo-500/5 border border-indigo-500/20 rounded-[48px] space-y-8">
               <h2 className="text-3xl lg:text-4xl font-black">Excursion Analysis (MAE/MFE)</h2>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-4">
                     <h4 className="font-bold text-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        MAE (Max Adverse Excursion)
                     </h4>
                     <p className="text-zinc-500 text-sm leading-relaxed">
                        The maximum &quot;pain&quot; your trade was in before it closed. If your MAE is consistently close to your Stop Loss, you may need a wider entry or better timing.
                     </p>
                  </div>
                  <div className="space-y-4">
                     <h4 className="font-bold text-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        MFE (Max Favorable Excursion)
                     </h4>
                     <p className="text-zinc-500 text-sm leading-relaxed">
                        The maximum &quot;unrealized&quot; profit your trade reached. High MFE with low realized PnL indicates that you are leaving too much money on the table (failing to take profits).
                     </p>
                  </div>
               </div>
            </div>
         </section>
      </div>
    </div>
  );
}
