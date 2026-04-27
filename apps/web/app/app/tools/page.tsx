"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { 
  Code2, 
  Search, 
  Plus, 
  ChevronRight, 
  Copy, 
  ExternalLink,
  Zap,
  Cpu,
  Terminal,
  FileCode,
  Tag
} from "lucide-react";

// Mock Data
const MOCK_TEMPLATES = [
  {
    id: "t1",
    name: "NSE F&O ORB Bot",
    description: "Intraday Opening Range Breakout strategy optimized for Zerodha Kite Connect API.",
    language: "PYTHON",
    type: "ALGO_STRATEGY",
    tags: ["Intraday", "Zerodha", "NSE"],
    code: `# TradeForge Template: NSE F&O ORB Bot
import kiteconnect

def check_orb_breakout(candles):
    # Calculate 15-min ORB high/low
    orb_high = max([c['high'] for c in candles[:3]])
    orb_low = min([c['low'] for c in candles[:3]])
    
    current_price = candles[-1]['close']
    
    if current_price > orb_high:
        return "BUY"
    elif current_price < orb_low:
        return "SELL"
    return "WAIT"`
  },
  {
    id: "t2",
    name: "Options Selling Delta-Neutral",
    description: "Multi-leg delta-neutral selling bot for Nifty/BankNifty weekly options.",
    language: "PYTHON",
    type: "ALGO_STRATEGY",
    tags: ["Options", "Delta Neutral"],
    code: `# TradeForge Template: Delta Neutral Seller
def calculate_delta(strike, spot, iv, dte):
    # Black-Scholes delta calc logic here
    pass

def execute_rebalance(positions, target_delta=0):
    # Check current net portfolio delta
    # Fire orders to hedge if threshold breached
    pass`
  },
  {
    id: "t3",
    name: "PineScript RSI Divergence",
    description: "TradingView strategy script identifying bullish/bearish divergence across timeframes.",
    language: "PINESCRIPT",
    type: "INDICATOR",
    tags: ["Indicator", "RSI", "TradingView"],
    code: `// TradeForge Template: RSI Divergence
//@version=5
strategy("RSI Divergence Master", overlay=true)

rsi_len = input(14, "RSI Length")
src = input(close, "Source")

rsi_val = ta.rsi(src, rsi_len)
plot(rsi_val, "RSI", color=color.purple)`
  }
];

export default function ToolsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(MOCK_TEMPLATES[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTemplates = MOCK_TEMPLATES.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-120px)] flex gap-8">
      
      {/* Sidebar - Template List */}
      <div className="w-96 flex flex-col space-y-6">
         <div>
            <h1 className="text-3xl font-bold font-heading text-white">Script Library</h1>
            <p className="text-zinc-500 mt-1">Foundational templates for rapid algo delivery.</p>
         </div>

         <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search templates..." 
              className="w-full bg-zinc-900 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>

         <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
            {filteredTemplates.map(template => (
               <button 
                 key={template.id}
                 onClick={() => setSelectedTemplate(template)}
                 className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                   selectedTemplate.id === template.id 
                    ? "bg-brand-primary/10 border-brand-primary/30 shadow-[0_0_20px_rgba(192,132,252,0.1)]" 
                    : "bg-zinc-900/50 border-white/5 hover:bg-zinc-900 hover:border-white/10"
                 }`}
               >
                 <div className="flex items-center justify-between mb-2">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                      template.language === "PYTHON" ? "bg-blue-500/10 text-blue-400" : "bg-orange-500/10 text-orange-400"
                    }`}>
                      {template.language}
                    </span>
                    {selectedTemplate.id === template.id && <Zap size={14} className="text-brand-primary animate-pulse" />}
                 </div>
                 <h4 className="text-sm font-bold text-white mb-1">{template.name}</h4>
                 <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">{template.description}</p>
                 <div className="flex flex-wrap gap-1 mt-3">
                    {template.tags.slice(0, 2).map(tag => (
                       <span key={tag} className="text-[9px] text-zinc-600 font-bold">#{tag}</span>
                    ))}
                 </div>
               </button>
            ))}
         </div>
         
         <button className="flex items-center justify-center gap-2 w-full py-4 bg-zinc-900 border border-white/5 rounded-2xl text-zinc-400 font-bold hover:text-white hover:border-white/10 transition-all">
            <Plus size={18} /> New Template
         </button>
      </div>

      {/* Main Content - Code Editor */}
      <div className="flex-1 flex flex-col bg-[#09090b] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
         <div className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-zinc-950">
            <div className="flex items-center gap-4">
               <div className="p-2 bg-brand-primary/10 rounded-lg">
                  <Terminal size={18} className="text-brand-primary" />
               </div>
               <div>
                  <h3 className="text-sm font-bold text-white">{selectedTemplate.name}</h3>
                  <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">{selectedTemplate.type}</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <button className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors">
                  <Copy size={16} /> Copy
               </button>
               <button className="h-9 px-4 bg-brand-primary text-black font-bold rounded-lg text-xs flex items-center gap-2 hover:bg-brand-primary/90 transition-all">
                  <ExternalLink size={14} /> Use for Project
               </button>
            </div>
         </div>
         <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage={selectedTemplate.language.toLowerCase() === 'pinescript' ? 'javascript' : selectedTemplate.language.toLowerCase()}
              theme="vs-dark"
              value={selectedTemplate.code}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                padding: { top: 20 },
                fontFamily: "var(--font-mono)",
                readOnly: false,
              }}
            />
         </div>
      </div>

    </div>
  );
}
