import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Thirdleaf – Custom Algorithmic Trading Tools | Jaipur",
  description:
    "Thirdleaf builds custom algo trading systems, backtesting tools, broker API integrations and trade automation for traders across India. Based in Jaipur.",
  keywords: "algo trading tools India, backtesting software, broker API integration, Zerodha algo, Dhan API, trading automation Jaipur",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://thirdleaf.in",
  },
  openGraph: {
    title: "Thirdleaf – Custom Trading Technology",
    description: "We build algorithmic trading tools, backtesting engines and automation systems for serious traders across India.",
    url: "https://thirdleaf.in",
    type: "website",
  },
};

// ─────────────────────────────────────────────────────────────
// Landing Page — / (root)
// Full marketing page: Navbar → Hero → Features → Testimonials
// → Pricing → FAQ → Footer
// ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
