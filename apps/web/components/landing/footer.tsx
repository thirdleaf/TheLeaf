"use client";

import Link from "next/link";
import { Linkedin, Mail, MapPin, ArrowUpRight } from "lucide-react";

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Changelog", href: "/changelog" },
    { label: "Roadmap", href: "/roadmap" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/docs/api" },
    { label: "Blog", href: "/blog" },
    { label: "Help Center", href: "/help" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
} as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-bg border-t border-border pt-24 pb-12 overflow-hidden">
      <div className="container-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">
          
          {/* Brand & Identity (Left Side) */}
          <div className="lg:col-span-5 flex flex-col space-y-10 lg:pr-12">
            <Link href="/" className="inline-block group">
               <div className="h-10 w-48 relative grayscale dark:grayscale-0 dark:brightness-150 contrast-125 dark:contrast-100 group-hover:scale-[1.05] transition-transform origin-left">
                  <img src="/logo.svg" alt="ThirdLeaf" className="h-full w-full object-contain object-left" />
               </div>
            </Link>
            
            <p className="text-text-secondary text-base leading-relaxed max-w-md">
              Democratizing professional-grade trading analytics for Indian retail traders. Built with precision in Jaipur.
            </p>

            {/* Structured Contact Block */}
            <div className="grid gap-6">
              <div className="flex items-center gap-4 text-text-muted text-sm">
                <div className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center border border-border shadow-sm">
                  <MapPin size={20} className="text-accent" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-disabled mb-0.5">Headquarters</span>
                  <span className="font-semibold text-text-primary">Jaipur, RJ, India</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-text-muted text-sm">
                <div className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center border border-border shadow-sm">
                  <Mail size={20} className="text-accent" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-disabled mb-0.5">Support Line</span>
                  <span className="font-semibold text-text-primary">contact@thirdleaf.in</span>
                </div>
              </div>
              
              <a 
                href="https://linkedin.com/company/thirdleaf" 
                target="_blank" 
                rel="noopener"
                className="flex items-center gap-4 text-text-muted text-sm group"
              >
                <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-border flex items-center justify-center group-hover:text-accent group-hover:border-accent transition-all group-hover:-translate-y-1 shadow-sm">
                  <Linkedin size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-disabled mb-0.5 group-hover:text-accent transition-colors">Social</span>
                  <span className="font-semibold text-text-primary group-hover:text-accent transition-colors">Follow us on LinkedIn</span>
                </div>
              </a>
            </div>
          </div>

          {/* Links Grid (Right Side) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12 lg:gap-8 pt-4">
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category} className="space-y-8">
                <h4 className="text-text-primary text-xs font-black uppercase tracking-[0.2em] pb-3 border-b-2 border-accent w-fit">{category}</h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link 
                        href={link.href} 
                        className="text-text-secondary text-sm hover:text-accent flex items-center gap-2 group transition-colors font-medium"
                      >
                        {link.label}
                        <ArrowUpRight size={14} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-accent" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Fine Print */}
        <div className="pt-12 border-t border-border/60">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-[10px] text-text-disabled uppercase tracking-[0.2em] font-black">
                <span>ISO 27001 Certified</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>Made in Bharat 🇮🇳</span>
              </div>
              <p className="text-text-disabled text-xs font-medium">
                © {currentYear} ThirdLeaf Technologies Pvt. Ltd. All rights reserved.
              </p>
            </div>

            {/* SEBI Disclaimer Box - Premium Styling */}
            <div className="max-w-3xl p-8 rounded-[40px] bg-surface-2/30 border border-border/40 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-accent/20" />
               <p className="text-[11px] leading-relaxed text-text-muted text-justify">
                 <span className="text-text-primary font-black uppercase mr-2 tracking-widest text-[9px]">Regulatory Disclaimer:</span>
                 ThirdLeaf is a technology platform and not a SEBI registered investment advisor, stock broker, or portfolio manager. We do not provide investment advice, trading signals, or manage client funds. Trading in equities, futures, options, and commodities involves substantial risk of loss. Past performance of any trading system is not indicative of future results. Please consult a qualified financial advisor before making any investment decisions.
               </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
