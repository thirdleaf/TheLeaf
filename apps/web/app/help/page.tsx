"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { 
  Search, 
  Book, 
  Cpu, 
  Shield, 
  Zap, 
  HelpCircle,
  ArrowRight,
  MessageCircle,
  FileText,
  Inbox
} from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  /* ... previously defined ... */
  {
    icon: Zap,
    title: "Getting Started",
    description: "Learn the basics of ThirdLeaf and set up your first journal in minutes.",
    count: 12,
    color: "text-amber-400"
  },
  {
    icon: Cpu,
    title: "Broker Connectivity",
    description: "Guides on connecting Zerodha, Dhan, Fyers, and other Indian brokers.",
    count: 8,
    color: "text-indigo-400"
  },
  {
    icon: Book,
    title: "Journaling 101",
    description: "How to tag setups, emotions, and common trading mistakes.",
    count: 15,
    color: "text-emerald-400"
  },
  {
    icon: Shield,
    title: "Security & Privacy",
    description: "Everything about how we protect your data and SEBI compliance.",
    count: 5,
    color: "text-rose-400"
  }
];

const FAQS = [
  {
    q: "How safe is my broker data?",
    a: "We use official broker APIs and OAuth scopes that only allow 'Read-Only' access to your trade logs. We never store your broker passwords."
  },
  {
    q: "Does ThirdLeaf support MCX and Commodities?",
    a: "Yes, we support NSE, BSE, and MCX instruments including Equities, F&O, and Commodities."
  },
  {
    q: "Can I export my data for tax filing?",
    a: "Absolutely. You can export your journal as a CSV/Excel file compatible with major Indian tax filing platforms."
  }
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = FAQS.filter(f => 
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = CATEGORIES.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasResults = filteredFaqs.length > 0 || filteredCategories.length > 0;

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Navbar />

      <main>
        {/* Help Hero */}
        <section className="pt-32 pb-20 px-6 relative overflow-hidden text-center">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -mt-40" />
           
           <div className="max-w-3xl mx-auto relative z-10 space-y-8">
              <h1 className="text-4xl lg:text-7xl font-black tracking-tight leading-[1]">
                How can we <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">help you?</span>
              </h1>
              
              <div className="max-w-xl mx-auto relative">
                 <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for articles, brokers, or features..."
                  className="w-full bg-surface-2 border border-border rounded-2xl px-14 py-5 focus:outline-none focus:border-accent transition-all font-medium text-lg text-text-primary placeholder:text-text-disabled"
                 />
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" size={24} />
                 {searchQuery && (
                   <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-text-disabled hover:text-text-primary"
                   >
                     CLEAR
                   </button>
                 )}
              </div>
           </div>
        </section>

        {!hasResults ? (
          <section className="py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="w-20 h-20 bg-surface-2 border border-border rounded-full flex items-center justify-center mx-auto mb-6 text-text-disabled">
                <Inbox size={40} />
             </div>
             <h3 className="text-xl font-bold mb-2">No results for &quot;{searchQuery}&quot;</h3>
             <p className="text-text-muted max-w-xs mx-auto">Try searching for broader terms like &quot;Broker&quot;, &quot;Security&quot;, or &quot;Tax.&quot;</p>
          </section>
        ) : (
          <>
            {/* Categories Grid */}
            {filteredCategories.length > 0 && (
              <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredCategories.map((cat) => (
                      <div key={cat.title} className="group p-8 bg-surface border border-border rounded-[40px] hover:bg-surface-2 transition-all hover:border-accent/30 cursor-pointer h-full">
                        <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${cat.color}`}>
                            <cat.icon size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{cat.title}</h3>
                        <p className="text-text-muted text-sm leading-relaxed mb-6">
                            {cat.description}
                        </p>
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-text-disabled">
                            <span>{cat.count} Articles</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* Popular Questions */}
            {filteredFaqs.length > 0 && (
              <section className="py-24 px-6 bg-surface-2/20 border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-black mb-12 text-center">
                      {searchQuery ? "Matching Questions" : "Common Questions"}
                    </h2>
                    <div className="space-y-4">
                      {filteredFaqs.map((faq) => (
                        <div key={faq.q} className="p-8 bg-surface-2 border border-border rounded-3xl space-y-3">
                            <h4 className="font-bold text-text-primary flex items-center gap-3">
                              <HelpCircle size={18} className="text-accent" />
                              {faq.q}
                            </h4>
                            <p className="text-text-muted text-sm leading-relaxed ml-7">
                              {faq.a}
                            </p>
                        </div>
                      ))}
                    </div>
                </div>
              </section>
            )}
          </>
        )}

        {/* Support CTA */}
        <section className="py-32 px-6 text-center">
           <div className="max-w-2xl mx-auto space-y-10">
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                 <MessageCircle size={32} />
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-text-primary">Still need manual help?</h2>
              <p className="text-text-muted leading-relaxed">Our support pod is available Mon-Fri, 9AM - 6PM IST to help you tune your journal.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <Link href="/contact" className="btn btn-primary px-10">Chat with Support</Link>
                 <Link href="/docs" className="btn btn-ghost px-10">Full Documentation</Link>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
