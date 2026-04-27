"use client";

import React from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <Navbar />

      <main className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        <div className="mb-20 text-center space-y-4">
           <Shield className="mx-auto text-emerald-500" size={48} />
           <h1 className="text-4xl lg:text-7xl font-black tracking-tight leading-[0.9]">
             Privacy <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">is your edge.</span>
           </h1>
           <p className="text-zinc-500 text-lg">
             Effective Date: April 18, 2026
           </p>
        </div>

        <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 space-y-12">
           <section className="space-y-6">
              <h2 className="text-2xl font-black text-white">1. Introduction & Scope</h2>
              <p>
                ThirdLeaf Technologies Pvt. Ltd. (&quot;ThirdLeaf&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the ThirdLeaf platform. This Privacy Policy is designed to comply with the <strong className="text-white">Digital Personal Data Protection (DPDP) Act, 2023</strong> of India and other global data protection standards. We are committed to transparency in how we handle the sensitive trading data of our users.
              </p>
           </section>

           <section className="space-y-6">
              <h2 className="text-2xl font-black text-white">2. Data We Collect and Why</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">2.1 Personal Identifiable Information (PII)</h3>
                <p>We collect your name, phone number, and email address primarily for authentication and security notifications. This data is managed through our identity provider (Clerk) and is encrypted at rest.</p>
                
                <h3 className="text-lg font-bold text-white">2.2 Financial & Brokerage Data</h3>
                <p>When you link your broker accounts via OAuth or API Secrets, we collect historical order logs, trade executions, and position data. <strong className="text-white">We do NOT have access to your funds, nor can we initiate withdrawals or transfers on your behalf.</strong> This data is used strictly to populate your journaling dashboards.</p>
                
                <h3 className="text-lg font-bold text-white">2.3 Behavioral & Mindset Data</h3>
                <p>We store the mood scores, strategy notes, and setup tags you input manually. This data is used to generate the "Psychology" analytics that helps you improve your trading discipline.</p>
              </div>
           </section>

           <section className="space-y-6 p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[40px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-16 -mt-16" />
              <h2 className="text-xl font-black text-white flex items-center gap-3">
                 <Lock size={20} className="text-indigo-400" />
                 Zero-Leak Security Pillar
              </h2>
              <p className="text-sm leading-relaxed">
                ThirdLeaf follows a localized data storage policy. All trading data is hosted on secure servers within Indian geography to comply with RBI/SEBI data localization mandates. We employ **AES-256 encryption** for all database fields containing trade-specific information. We maintain a strict "No-Front-Run" policy: your data is never aggregated for high-frequency trading (HFT) firms or proprietary desks.
              </p>
           </section>

           <section className="space-y-6">
              <h2 className="text-2xl font-black text-white">3. Cookies and Tracking</h2>
              <p>
                We use strictly necessary cookies to maintain your session. We do not use third-party advertising trackers or pixel-based "retargeting" on our internal authenticated dashboard. We may use anonymized analytics (e.g., PostHog or Google Analytics) on the marketing site to improve user experience.
              </p>
           </section>

           <section className="space-y-6">
              <h2 className="text-2xl font-black text-white">4. Data Retention and Deletion</h2>
              <p>
                We retain your data as long as your account is active. Upon request for account deletion, all PII and brokerage data are purged from our primary databases within <strong className="text-white">72 hours</strong>. Backup archives may retain data for up to 30 days before full rotation/deletion.
              </p>
           </section>

           <section className="space-y-6">
              <h2 className="text-2xl font-black text-white">5. Third-Party Services</h2>
              <p>
                We share data only with necessary service providers:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li><strong className="text-white">Clerk:</strong> For identity and session management.</li>
                <li><strong className="text-white">Neon/AWS:</strong> For secure, encrypted database storage.</li>
                <li><strong className="text-white">Official Broker APIs:</strong> (Zerodha, Dhan, etc.) For trade synchronization.</li>
              </ul>
           </section>

           <section className="space-y-6">
              <h2 className="text-2xl font-black text-white">6. Contact Data Protection Officer</h2>
              <p>
                If you have concerns about your data privacy or wish to exercise your rights under the DPDP Act, please contact our Grievance Officer at <strong className="text-indigo-400">privacy@thirdleaf.com</strong>.
              </p>
           </section>
        </div>

        <div className="mt-20 pt-12 border-t border-white/5 text-center">
           <p className="text-zinc-600 text-sm">Last Updated: April 18, 2026</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
