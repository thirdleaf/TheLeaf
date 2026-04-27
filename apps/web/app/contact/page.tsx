"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { 
  Mail, 
  MessageSquare, 
  MapPin, 
  Send, 
  Loader2, 
  CheckCircle2, 
  ArrowRight,
  Linkedin
} from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          
          {/* Left Column: Info */}
          <div className="space-y-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
                <MessageSquare size={14} />
                <span>Get in Touch</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[0.9] mb-6">
                Let&apos;s talk about your <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-400">trading edge.</span>
              </h1>
              <p className="text-text-muted text-lg max-w-lg leading-relaxed">
                Whether you have questions about broker connectivity, feature requests, or just want to talk shop about quant strategies, we&apos;re here.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6 group">
                <div className="w-12 h-12 bg-surface-2 border border-border rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">Email Us</h4>
                  <p className="text-text-muted text-sm">support@thirdleaf.com</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-12 h-12 bg-surface-2 border border-border rounded-2xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">Headquarters</h4>
                  <p className="text-text-muted text-sm">Jaipur, RJ, India</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-12 h-12 bg-surface-2 border border-border rounded-2xl flex items-center justify-center text-text-muted group-hover:bg-surface-3 transition-all">
                  <Linkedin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">Social</h4>
                  <div className="flex gap-4 mt-1">
                    <Link href="https://linkedin.com/company/thirdleaf" className="text-xs text-accent hover:underline">LinkedIn</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote/Testimonial bit */}
            <div className="p-8 bg-surface-2 border border-border rounded-[40px] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-16 -mt-16 group-hover:opacity-100 opacity-50 transition-opacity" />
               <p className="text-text-secondary italic mb-4 relative z-10">
                 &quot;ThirdLeaf has transformed how we look at our risk. The team is incredibly responsive to the needs of Indian retail traders.&quot;
               </p>
               <div className="flex items-center gap-3 relative z-10">
                 <div className="w-8 h-8 rounded-full bg-surface-3 border border-border" />
                 <div>
                   <h5 className="text-xs font-bold text-text-primary">Karthik R.</h5>
                   <p className="text-[10px] text-text-muted">Full-time Options Trader</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="relative">
            <div className="bg-surface border border-border p-10 rounded-[48px] shadow-2xl shadow-accent/5">
              {success ? (
                <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-black mb-3 text-text-primary">Message Sent!</h3>
                  <p className="text-text-muted max-w-xs mx-auto mb-8">
                    Thanks for reaching out. A human on our team will get back to you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="btn btn-secondary w-full"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="John Doe"
                        className="w-full bg-surface-2 border border-border rounded-2xl px-5 py-4 focus:outline-none focus:border-accent focus:bg-surface-3 transition-all text-text-primary placeholder:text-text-disabled" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        required
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full bg-surface-2 border border-border rounded-2xl px-5 py-4 focus:outline-none focus:border-accent focus:bg-surface-3 transition-all text-text-primary placeholder:text-text-disabled" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Topic</label>
                    <select className="w-full bg-surface-2 border border-border rounded-2xl px-5 py-4 focus:outline-none focus:border-accent focus:bg-surface-3 transition-all text-text-primary appearance-none cursor-pointer">
                      <option>General Inquiry</option>
                      <option>Broker Integration Issue</option>
                      <option>Feature Suggestion</option>
                      <option>Prop Trading Support</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Message</label>
                    <textarea 
                      required
                      placeholder="How can we help?"
                      rows={5}
                      className="w-full bg-surface-2 border border-border rounded-2xl px-5 py-4 focus:outline-none focus:border-accent focus:bg-surface-3 transition-all text-text-primary placeholder:text-text-disabled resize-none" 
                    />
                  </div>

                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 transition-all group overflow-hidden relative shadow-lg shadow-accent/20"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <span>Broadcast Message</span>
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-text-muted uppercase tracking-wider font-bold">
                    By submitting, you agree to our <Link href="/privacy" className="text-text-disabled hover:text-text-primary underline">Privacy Policy</Link>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
