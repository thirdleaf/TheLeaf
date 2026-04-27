"use client";

import React from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { 
  Target, 
  Users, 
  Rocket, 
  Shield, 
  Zap, 
  TrendingUp, 
  Globe, 
  Brain
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 relative overflow-hidden text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -mt-40" />
          
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Our Mission
            </div>
            <h1 className="text-5xl lg:text-8xl font-black tracking-tight leading-[0.85] mb-8">
              Democratizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">professional grade</span> trading analytics.
            </h1>
            <p className="text-zinc-400 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
              We started with a simple belief: Indian retail traders deserve the same powerful insights and execution tools as global hedge funds.
            </p>
          </div>
        </section>

        {/* Vision Grid */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-[40px] hover:border-indigo-500/30 transition-all group">
              <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Mindset Over Math</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Most platforms focus only on numbers. We believe the psychology of the trader is the real differentiator in long-term profitability.
              </p>
            </div>

            <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-[40px] hover:border-emerald-500/30 transition-all group">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">India First</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Built specifically for NSE, BSE, and MCX traders. Native handling of Indian tax standards, lot sizes, and broker APIs out of the box.
              </p>
            </div>

            <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-[40px] hover:border-amber-500/30 transition-all group">
              <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Zero Trust Privacy</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Your trade data is encrypted and private. We never sell data to prop desks or use it to front-run retail flows.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 px-6 bg-[#08080c] relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 rounded-[64px] border border-white/5 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent z-10" />
                 <TrendingUp className="text-indigo-500/30" size={300} strokeWidth={1} />
                 <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="text-center p-8 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl max-w-xs shadow-2xl">
                       <span className="text-4xl font-black text-white">$100M+</span>
                       <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2 font-bold">Trading Volume Journaled</p>
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-6xl font-black leading-tight text-white">
                The story of <span className="text-indigo-400">ThirdLeaf</span>
              </h2>
              <div className="space-y-6 text-zinc-400 leading-relaxed text-lg">
                <p>
                  ThirdLeaf was born in a small trading room in Bengaluru. We were tired of using clunky Excel sheets and disjointed dashboards that didn&apos;t understand the nuances of the Indian market.
                </p>
                <p>
                  We saw a gap: professional traders had expensive terminals, but retail traders were flying blind. We spent two years engineering the most robust multi-broker synchronization engine in India.
                </p>
                <p>
                  Today, ThirdLeaf is the tool we wish we had when we started. A single command center for journaling, behavioral analysis, and performance auditing.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                <div>
                   <h4 className="text-3xl font-black text-white">40+</h4>
                   <p className="text-xs text-zinc-600 font-bold uppercase tracking-wider">Broker Connectors</p>
                </div>
                <div>
                   <h4 className="text-3xl font-black text-white">10k+</h4>
                   <p className="text-xs text-zinc-600 font-bold uppercase tracking-wider">Active Traders</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team/CTA */}
        <section className="py-32 px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-10">
            <Users className="mx-auto text-zinc-800" size={60} />
            <h2 className="text-3xl lg:text-5xl font-black text-white">Join the leading edge of Indian quant trading.</h2>
            <p className="text-zinc-500">We&apos;re an engineering-first team on a mission to bring institutional intelligence to every retail desktop.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <button className="btn btn-primary px-10 py-4 text-lg">Start Free Trial</button>
               <button className="btn btn-ghost px-10 py-4 text-lg">Our Careers</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
