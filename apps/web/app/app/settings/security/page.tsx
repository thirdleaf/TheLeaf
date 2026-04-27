"use client";

import React from "react";
import { Lock, ShieldCheck, Smartphone, Key, Monitor, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";

const SECURITY_ACTIONS = [
  {
    title: "Change Password",
    desc: "Update your account password regularly for better security.",
    icon: <Key className="text-indigo-400" />,
    path: "/app/profile/security", // Clerk usually handles this under /security
  },
  {
    title: "Two-Factor Auth",
    desc: "Add an extra layer of security to your trading account.",
    icon: <Smartphone className="text-emerald-400" />,
    path: "/app/profile/security",
  },
  {
    title: "Session Management",
    desc: "View and manage all active devices and browser sessions.",
    icon: <Monitor className="text-amber-400" />,
    path: "/app/profile/security",
  }
];

export default function SecurityPage() {
  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/app/settings" 
          className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Account Security</h1>
          <p className="text-sm text-zinc-500">Manage your credentials, 2FA, and active sessions.</p>
        </div>
      </div>

      {/* Security Status Banner */}
      <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl flex items-center justify-between overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-10 -mt-10" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3 className="text-white font-bold">Account Secure</h3>
            <p className="text-zinc-500 text-xs mt-0.5">Your account meets our current security standards.</p>
          </div>
        </div>
        <div className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest relative z-10">
          Verified
        </div>
      </div>

      {/* Security Actions Grid */}
      <div className="grid grid-cols-1 gap-4">
        {SECURITY_ACTIONS.map((action, i) => (
          <Link 
            key={i} 
            href={action.path}
            className="group flex items-center justify-between p-6 bg-zinc-900/50 border border-white/5 rounded-3xl hover:border-white/10 transition-all hover:bg-zinc-800/50"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-zinc-800/80 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <div>
                <h4 className="text-white font-bold">{action.title}</h4>
                <p className="text-sm text-zinc-500 mt-1">{action.desc}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      <div className="p-8 bg-zinc-900 border border-white/5 rounded-[32px] text-center space-y-4">
        <Lock size={40} className="text-zinc-700 mx-auto mb-2" />
        <h3 className="text-white font-bold tracking-tight">Advanced Security Policy</h3>
        <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed">
          ThirdLeaf implements enterprise-grade encryption for all broker credentials. We never store your raw master passwords.
        </p>
      </div>
    </div>
  );
}
