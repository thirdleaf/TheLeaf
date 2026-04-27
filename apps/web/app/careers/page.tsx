"use client";

import React from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { 
  Briefcase, 
  ShieldAlert, 
  Terminal, 
  Layers, 
  Mail, 
  ArrowRight 
} from "lucide-react";
import Link from "next/link";

const JOBS = [
  {
    title: "Cybersecurity Intern",
    type: "Internship",
    description: "Help us secure our trading data pipelines. Focus on penetration testing, OAuth hardening, and PII encryption audits.",
    icon: ShieldAlert,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
  },
  {
    title: "Backend Developer",
    type: "Full-time",
    description: "Architect high-throughput NestJS microservices and Redis-based real-time ticker engines. Experience with Drizzle ORM and PostgreSQL is a plus.",
    icon: Terminal,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
  },
  {
    title: "Fullstack Developer",
    type: "Full-time",
    description: "Build beautiful, high-performance trading dashboards using Next.js 15, Tailwind v4, and Framer Motion. Bridge the gap between quant data and human intuition.",
    icon: Layers,
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
  }
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Navbar />

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Briefcase size={14} />
            <span>Careers at ThirdLeaf</span>
          </div>
          <h1 className="text-5xl lg:text-8xl font-black tracking-tight leading-[0.8] mb-8">
            Build the future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">Quant Trading.</span>
          </h1>
          <p className="text-text-muted text-xl max-w-2xl mx-auto leading-relaxed">
            We&apos;re a small, hyper-focused team building the professional quant infrastructure for the Indian stock market. Join us in making sophisticated trading tools accessible to everyone.
          </p>
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {JOBS.map((job) => (
            <div key={job.title} className="group p-8 rounded-[40px] bg-surface-2 border border-border hover:border-accent/30 transition-all relative overflow-hidden">
               <div className={`w-14 h-14 ${job.bgColor} ${job.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <job.icon size={28} />
               </div>
               <div className="mb-2">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{job.type}</span>
                 <h3 className="text-2xl font-bold text-text-primary mt-1">{job.title}</h3>
               </div>
               <p className="text-text-secondary text-sm leading-relaxed mb-8">
                 {job.description}
               </p>
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] blur-3xl -mr-16 -mt-16" />
            </div>
          ))}
        </div>

        {/* CTA Block */}
        <div className="relative group">
           <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
           <div className="relative p-12 lg:p-20 bg-surface border border-border rounded-[60px] text-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
              
              <Mail className="mx-auto text-emerald-400 mb-8" size={48} />
              <h2 className="text-3xl lg:text-5xl font-black mb-6 text-text-primary">Interested in joining the company?</h2>
              <p className="text-text-muted text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                We are always looking for obsessive builders. If you are passionate about trading and technology, we want to hear from you.
              </p>

              <a 
                href="mailto:hr@thirdleaf.in"
                className="inline-flex items-center gap-3 px-10 py-5 bg-text-primary text-bg font-black rounded-2xl hover:bg-accent transition-all group/btn"
              >
                <span>Email at hr@thirdleaf.in</span>
                <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={20} />
              </a>

              <p className="mt-8 text-xs text-text-disabled uppercase tracking-widest font-bold">
                Jaipur, RJ • Remote Friendly
              </p>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
