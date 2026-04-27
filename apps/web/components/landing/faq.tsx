"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    id: "q1",
    question: "Is ThirdLeaf a trading platform where I can place orders?",
    answer:
      "No. ThirdLeaf is purely a technology platform — a journal, analytics tool, and strategy workspace. You cannot place trades or orders through ThirdLeaf. We are not a broker, sub-broker, or SEBI-registered investment advisor. All trading must be done through your own SEBI-registered broker.",
  },
  {
    id: "q2",
    question: "Which brokers does ThirdLeaf support for import?",
    answer:
      "We support direct CSV/Excel import from Zerodha (Kite), Upstox, Angel One, Fyers, and Dhan. We're adding Groww and IIFL in Q3 2026. You can also manually log any trade from any broker.",
  },
  {
    id: "q3",
    question: "How does the India Tax Engine work?",
    answer:
      "Our tax engine reads your imported trades and automatically categorizes them as STCG (Short-Term Capital Gains), LTCG (Long-Term Capital Gains), or F&O business income per Indian tax law. It calculates STT, GST, brokerage, exchange fees, and stamp duty. You can download a CA-ready P&L statement for your ITR. Note: This is for reference only — always consult a chartered accountant for final tax filing.",
  },
  {
    id: "q4",
    question: "Is my trade data secure and private?",
    answer:
      "Yes. Your data is encrypted at rest (AES-256) and in transit (TLS 1.3). We store data on Neon Serverless PostgreSQL in AWS ap-south-1 (Mumbai region). We never share or sell your data. You can export or delete your data at any time from Settings → Data.",
  },
  {
    id: "q5",
    question: "Can I try ThirdLeaf before paying?",
    answer:
      "Yes — all plans include a 14-day free trial with full access. No credit card required. After trial, you can choose a plan or export your data and leave. We don't auto-charge.",
  },
  {
    id: "q6",
    question: "What is the Prop/Mentor plan for?",
    answer:
      "The Prop/Mentor plan is for proprietary trading desks, small investment clubs, or trading mentors who manage multiple accounts or have students. It supports multi-account journaling, mentee sub-accounts with view-only access, and white-label PDF reports. Contact us for custom pricing for larger teams.",
  },
] as const;

// ─────────────────────────────────────────────────────────────
// FAQ Section — accordion
// ─────────────────────────────────────────────────────────────
export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <section id="faq" className="section" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="container-xl">
        {/* Header */}
        <div
          style={{ textAlign: "left", marginBottom: "var(--spacing-12)" }}
        >
          <span
            className="badge badge-accent"
            style={{ marginBottom: "var(--spacing-4)", display: "inline-block", backgroundColor: "var(--color-surface-2)", color: "var(--color-accent)", border: "1px solid var(--color-border)" }}
          >
            FAQ
          </span>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--color-text-primary)",
              marginBottom: "var(--spacing-4)",
            }}
          >
            Frequently asked questions
          </h2>
          <p
            style={{
              fontSize: "var(--font-size-lg)",
              color: "var(--color-text-muted)",
              maxWidth: 500,
            }}
          >
            Have a different question?{" "}
            <a
              href="mailto:support@thirdleaf.com"
              id="link-faq-email"
              style={{ color: "var(--color-accent)" }}
            >
              Email us
            </a>
          </p>
        </div>

        {/* Accordion */}
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-2)",
          }}
        >
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                style={{
                  borderRadius: "var(--radius-lg)",
                  border: `1px solid ${isOpen ? "var(--color-border-accent)" : "var(--color-border)"}`,
                  backgroundColor: isOpen
                    ? "var(--color-surface-2)"
                    : "var(--color-surface)",
                  overflow: "hidden",
                  transition: "border-color var(--transition-normal), background-color var(--transition-normal)",
                }}
              >
                {/* Question button */}
                <button
                  id={`faq-toggle-${item.id}`}
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "var(--spacing-4)",
                    padding: "var(--spacing-5)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      fontSize: "var(--font-size-sm)",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                      lineHeight: "var(--line-height-snug)",
                    }}
                  >
                    {item.question}
                  </span>
                  <ChevronDown
                    size={18}
                    color="var(--color-text-muted)"
                    style={{
                      flexShrink: 0,
                      transition: "transform var(--transition-normal)",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                {/* Answer */}
                <div
                  id={`faq-answer-${item.id}`}
                  role="region"
                  style={{
                    maxHeight: isOpen ? "500px" : "0",
                    overflow: "hidden",
                    transition: "max-height var(--transition-slow)",
                  }}
                >
                  <p
                    style={{
                      padding: "0 var(--spacing-5) var(--spacing-5)",
                      fontSize: "var(--font-size-sm)",
                      color: "var(--color-text-muted)",
                      lineHeight: "var(--line-height-relaxed)",
                    }}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
