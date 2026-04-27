"use client";

import React from "react";
import Link from "next/link";
import { 
  Building2, 
  Bell, 
  User, 
  ShieldCheck, 
  ChevronRight, 
  CreditCard, 
  Smartphone, 
  Monitor, 
  Wallet,
  Settings,
  Mail,
  Lock,
  Zap,
  Clock,
  Globe
} from "lucide-react";

const SETTINGS_CATEGORIES = [
  {
    title: "Account & Security",
    items: [
      { id: "profile", name: "Manage Profile", desc: "Update your personal information and avatar", icon: <User className="text-indigo-400" />, path: "/app/profile" },
      { id: "security", name: "Security", desc: "Two-factor authentication and active sessions", icon: <Lock className="text-emerald-400" />, path: "/app/settings/security" },
      { id: "plan", name: "Billing & Plans", desc: "Manage your Solo/Elite subscription", icon: <CreditCard className="text-amber-400" />, path: "/app/settings/billing" },
    ]
  },
  {
    title: "Trading Engine",
    items: [
      { id: "brokers", name: "Broker Connections", desc: "Linked accounts for auto-syncing trades", icon: <Building2 className="text-blue-400" />, path: "/app/settings/brokers" },
      { id: "rules", name: "Trading Rules", desc: "Daily risk limits and psychology prompts", icon: <Zap className="text-purple-400" />, path: "/app/settings/rules" },
    ]
  },
  {
    title: "Preferences",
    items: [
      { id: "notifications", name: "Notifications", desc: "Email and push alert configurations", icon: <Bell className="text-rose-400" />, path: "/app/settings/notifications" },
      { id: "localization", name: "Regional Settings", desc: "Currency (INR/USD) and Timezone (IST)", icon: <Globe className="text-cyan-400" />, path: "/app/settings/local" },
    ]
  }
];

export default function SettingsLandingPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-text-primary tracking-tighter">Settings</h1>
          <p className="text-text-muted mt-2 text-lg">Configure your ThirdLeaf experience and trading parameters.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-accent/10 border border-accent/20 rounded-2xl">
          <Zap size={16} className="text-accent" />
          <span className="text-sm font-bold text-accent">Elite Plan Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar / Fast Nav */}
        <div className="space-y-1">
          {SETTINGS_CATEGORIES.map(cat => (
            <div key={cat.title} className="mb-6">
              <h3 className="text-[10px] font-black text-text-disabled uppercase tracking-widest px-4 mb-2">{cat.title}</h3>
              {cat.items.map(item => (
                <Link 
                  key={item.id} 
                  href={item.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-2 transition-all group"
                >
                  <span className="text-text-disabled group-hover:text-text-primary transition-colors">
                    {React.cloneElement(item.icon as React.ReactElement<{ size?: number }>, { size: 18 })}
                  </span>
                  <span className="text-sm font-bold">{item.name}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-10">
          {SETTINGS_CATEGORIES.map(category => (
            <div key={category.title} className="space-y-4">
              <h2 className="text-xl font-bold text-text-primary px-2">{category.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.items.map(item => (
                  <Link 
                    key={item.id} 
                    href={item.path}
                    className="group relative p-6 bg-surface-2/20 border border-border rounded-3xl hover:border-accent/30 transition-all hover:shadow-2xl hover:shadow-accent/5 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                      {React.cloneElement(item.icon as React.ReactElement<{ size?: number }>, { size: 80 })}
                    </div>
                    
                    <div className="flex items-start justify-between relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-surface-3 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <ChevronRight size={20} className="text-text-disabled group-hover:text-text-muted group-hover:translate-x-1 transition-all" />
                    </div>
                    
                    <h4 className="text-text-primary font-bold mb-1 relative z-10">{item.name}</h4>
                    <p className="text-sm text-text-muted leading-relaxed relative z-10">{item.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          
          {/* Support Banner */}
          <div className="p-8 bg-surface-2 border border-border rounded-[32px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-3xl -mr-10 -mt-10" />
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-accent/10 flex items-center justify-center shrink-0">
                <ShieldCheck size={32} className="text-accent" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-text-primary">Need help with your configuration?</h3>
                <p className="text-text-muted mt-1">Our technical team is available 24/7 to help you with broker security and compliance.</p>
              </div>
              <button className="px-8 py-3 bg-text-primary text-bg font-black text-sm rounded-2xl hover:opacity-90 transition-all shrink-0">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
