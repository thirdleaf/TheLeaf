"use client";

import React from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { FileText, AlertCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Navbar />

      <main className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        <div className="mb-20 text-center space-y-4">
           <FileText className="mx-auto text-amber-500" size={48} />
           <h1 className="text-4xl lg:text-7xl font-black tracking-tight leading-[0.9]">
             Terms of <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-indigo-400">Service.</span>
           </h1>
           <p className="text-text-muted text-lg">
             Agreement Version 1.0 — April 18, 2026
           </p>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none text-text-secondary space-y-12">
           <section className="space-y-6">
              <h2 className="text-2xl font-black text-text-primary">1. Acceptance of Terms</h2>
              <p>
                By accessing, registering for, or using ThirdLeaf Technologies Pvt. Ltd. (&quot;ThirdLeaf&quot;), you agree to be legally bound by these Terms of Service. If you are using the service on behalf of a proprietary trading firm or corporate entity, you represent that you have the authority to bind such entity to these terms.
              </p>
           </section>

           <section className="space-y-6">
              <h2 className="text-2xl font-black text-text-primary">2. Nature of the Service (Non-Advisory)</h2>
              <p>
                ThirdLeaf is a SaaS platform providing post-trade analytics, journaling, and performance visualization. 
                <strong className="text-text-primary">ThirdLeaf is NOT a SEBI-registered Investment Advisor (RIA) or Research Analyst.</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm italic">
                <li>We do not provide specific buy/sell signals or &quot;tips.&quot;</li>
                <li>We do not manage user funds or provide portfolio management services.</li>
                <li>All analytics shown (Profit Factor, Win Rate, etc.) are based on your historical data and are not indicative of future market outcomes.</li>
              </ul>
           </section>

           <section className="space-y-6 p-8 bg-amber-500/5 border border-amber-500/10 rounded-[40px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl -mr-16 -mt-16" />
              <h2 className="text-xl font-black text-text-primary flex items-center gap-3">
                 <AlertCircle size={20} className="text-amber-400" />
                 Market Risk Disclosure
              </h2>
              <p className="text-sm leading-relaxed text-text-secondary">
                Trading in Equities, Derivatives (F&O), and Commodities involves substantial risk of loss and is not suitable for every investor. The high leverage provided in Indian Futures and Options can work against you as well as for you. You are solely responsible for all trades executed in your broker account. ThirdLeaf shall not be held liable for any financial losses, whether direct or indirect, resulting from your use of the platform.
              </p>
           </section>

           <section className="space-y-6">
              <h2 className="text-2xl font-black text-text-primary">3. Subscription, Payments & Refunds</h2>
              <div className="space-y-4">
                <p>Access to professional features in ThirdLeaf may require a paid subscription. All fees are quoted in INR (Indian Rupees) inclusive of GST where applicable.</p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li><strong className="text-text-primary">Auto-Renewal:</strong> Subscriptions provided as monthly or annual plans will auto-renew unless canceled 24 hours prior to the next billing cycle.</li>
                  <li><strong className="text-text-primary">No-Refund Policy:</strong> Due to the digital nature of our performance analytics and the instant availability of historical sync features, we do not offer refunds once a trade sync has been performed.</li>
                  <li><strong className="text-text-primary">Cancellation:</strong> You may cancel your subscription at any time via the Settings dashboard. Access will remain until the end of the current billing period.</li>
                </ul>
              </div>
           </section>

           <section className="space-y-6">
              <h2 className="text-2xl font-black text-text-primary">4. Platform Usage & Integrity</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-text-secondary">
                <li>Reverse engineer or attempt to extract the source code of our sync engine.</li>
                <li>Use automated scripts to scrape data from the ThirdLeaf dashboard.</li>
                <li>Share your login credentials with other individuals; accounts are for individual use only.</li>
              </ul>
           </section>

           <section className="space-y-6">
              <h2 className="text-2xl font-black text-text-primary">5. Limitation of Liability</h2>
              <p>
                In no event shall ThirdLeaf be liable for any interruption of service, broker API failures, or data inaccuracies provided by third-party exchanges (NSE/BSE/MCX). Our total liability for any claim arising out of these terms shall not exceed the amount paid by you for the service in the 3 months preceding the claim.
              </p>
           </section>

           <section className="space-y-6">
              <h2 className="text-2xl font-black text-text-primary">6. Jurisdiction</h2>
              <p>
                These Terms are governed by the laws of India. Any legal action or proceeding relating to your access to, or use of, the platform shall be instituted in a state or federal court in <strong className="text-text-primary">Jaipur, Rajasthan</strong>.
              </p>
           </section>
        </div>

        <div className="mt-20 pt-12 border-t border-border text-center">
           <p className="text-text-disabled text-sm">Last Updated: April 18, 2026</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
