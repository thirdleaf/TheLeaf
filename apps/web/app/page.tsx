import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "ThirdLeaf — India's Quant Trading Journal & Analytics Platform",
  description:
    "Journal, backtest, and automate your trading edge. The professional quant workspace built for NSE, BSE, and MCX traders. India-first tax engine included.",
  alternates: {
    canonical: "https://thirdleaf.com",
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
