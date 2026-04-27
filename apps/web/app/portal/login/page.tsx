"use client";

import React, { useState } from "react";
import { Mail, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { useClientAuth } from "../layout";
import { useRouter } from "next/navigation";

export default function PortalLoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);
  const { setToken, setClient } = useClientAuth();
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // In real app, call API POST /client-portal/auth/login
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
    }, 1500);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // In real app, call API POST /client-portal/auth/verify
    setTimeout(() => {
      setIsLoading(false);
      setToken("mock-jwt-token");
      setClient({ name: "Ravi Kumar", email: "ravi@growth.in" });
      router.push("/portal");
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,rgba(192,132,252,0.05)_0,transparent_70%)]">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center font-black text-2xl text-black mx-auto mb-6 shadow-2xl">TF</div>
          <h1 className="text-3xl font-black text-white tracking-tight">Client Portal</h1>
          <p className="text-zinc-500 font-medium">Authentication required to access project deliverables.</p>
        </div>

        <div className="bg-[#09090b] border border-white/5 p-8 rounded-[2rem] shadow-2xl">
          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
                <div className="relative group">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-zinc-400 transition-colors" size={20} />
                   <input 
                     required
                     type="email" 
                     placeholder="name@company.com" 
                     className="w-full bg-zinc-950 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-brand-primary/50 transition-all font-medium"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                   />
                </div>
              </div>
              <button 
                disabled={isLoading}
                className="w-full h-14 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="animate-spin" size={20} /> : <>Get OTP <ArrowRight size={20} /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">One-Time Password</label>
                <div className="relative group">
                   <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-zinc-400 transition-colors" size={20} />
                   <input 
                     required
                     type="text" 
                     maxLength={6}
                     placeholder="000000" 
                     className="w-full bg-zinc-950 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white text-center text-3xl tracking-[0.5em] font-black focus:outline-none focus:border-brand-primary/50 transition-all"
                     value={otp}
                     onChange={(e) => setOtp(e.target.value)}
                   />
                </div>
                <p className="text-center text-xs text-zinc-600 font-bold mt-2">Checking inbox for {email}</p>
              </div>
              <button 
                disabled={isLoading}
                className="w-full h-14 bg-brand-primary text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-primary/90 transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="animate-spin" size={20} /> : "Verify Identity"}
              </button>
              <button 
                type="button"
                onClick={() => setStep("email")}
                className="w-full text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-all underline underline-offset-4"
              >
                Change Email
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-[10px] text-zinc-700 font-bold max-w-xs mx-auto">
          Secure access via JWT & OTP. Session expires in 24 hours. Data processed under TradeForge DP Amendment.
        </p>
      </div>
    </div>
  );
}
