import Link from "next/link";
import { Check, ArrowRight, Zap } from "lucide-react";
import { PRICING_TIERS } from "@thirdleaf/types";
import { formatIndianCurrency } from "@thirdleaf/utils";

// ─────────────────────────────────────────────────────────────
// Pricing Section
// ─────────────────────────────────────────────────────────────
export function Pricing() {
  return (
    <section
      id="pricing"
      className="section"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="container-xl">
        {/* Header */}
        <div
          style={{ textAlign: "left", marginBottom: "var(--spacing-12)" }}
        >
          <span
            className="badge badge-accent"
            style={{ marginBottom: "var(--spacing-4)", display: "inline-block", backgroundColor: "var(--color-surface-2)", color: "var(--color-accent)", border: "1px solid var(--color-border)" }}
          >
            Simple Pricing
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
            Start free. Scale as you grow.
          </h2>
          <p
            style={{
              fontSize: "var(--font-size-lg)",
              color: "var(--color-text-muted)",
              maxWidth: 500,
            }}
          >
            14-day free trial on all plans. Cancel anytime. No credit card
            required to start.
          </p>
        </div>

        {/* Pricing cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "var(--spacing-5)",
            alignItems: "start",
          }}
        >
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              id={`pricing-tier-${tier.id}`}
              style={{
                position: "relative",
                borderRadius: "var(--radius-xl)",
                border: tier.highlighted
                  ? "2px solid var(--color-border-accent)"
                  : "1px solid var(--color-border)",
                backgroundColor: tier.highlighted
                  ? "var(--color-surface-2)"
                  : "var(--color-bg)",
                padding: "var(--spacing-6)",
                overflow: "hidden",
                boxShadow: "none",
              }}
            >
              {/* Highlighted badge */}
              {tier.highlighted && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "var(--color-gold)",
                      color: "#000000",
                      fontSize: "var(--font-size-xs)",
                      fontWeight: 600,
                      padding: "3px 14px",
                      borderRadius: "0 0 var(--radius-md) var(--radius-md)",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    <Zap size={10} fill="#fff" />
                    Most Popular
                  </div>
                </div>
              )}

              <div style={{ marginTop: tier.highlighted ? "var(--spacing-5)" : 0 }}>
                {/* Tier name */}
                <h3
                  style={{
                    fontSize: "var(--font-size-base)",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    marginBottom: "var(--spacing-1)",
                  }}
                >
                  {tier.name}
                </h3>
                <p
                  style={{
                    fontSize: "var(--font-size-sm)",
                    color: "var(--color-text-muted)",
                    marginBottom: "var(--spacing-5)",
                  }}
                >
                  {tier.description}
                </p>

                {/* Price */}
                <div style={{ marginBottom: "var(--spacing-5)" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: "var(--font-size-4xl)",
                        fontWeight: 700,
                        color: "var(--color-text-primary)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {formatIndianCurrency(tier.price)}
                    </span>
                    <span
                      style={{
                        fontSize: "var(--font-size-sm)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      /mo
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "var(--font-size-xs)",
                      color: "var(--color-text-disabled)",
                      marginTop: "var(--spacing-0-5)",
                    }}
                  >
                    {formatIndianCurrency(tier.yearlyPrice)}/year (save 17%)
                  </p>
                </div>

                {/* CTA */}
                <Link
                  href={tier.id === "prop_mentor" ? "/contact" : "/register"}
                  id={`cta-pricing-${tier.id}`}
                  className={`btn ${tier.highlighted ? "btn-primary" : "btn-secondary"}`}
                  style={{ width: "100%", marginBottom: "var(--spacing-5)" }}
                >
                  {tier.ctaLabel}
                  {tier.id !== "prop_mentor" && <ArrowRight size={14} />}
                </Link>

                {/* Divider */}
                <div className="divider" style={{ marginBottom: "var(--spacing-5)" }} />

                {/* Features list */}
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "var(--spacing-2)",
                        marginBottom: "var(--spacing-2-5)",
                        fontSize: "var(--font-size-sm)",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      <Check
                        size={14}
                        color="var(--color-success)"
                        style={{ flexShrink: 0, marginTop: 2 }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p
          style={{
            textAlign: "center",
            marginTop: "var(--spacing-8)",
            fontSize: "var(--font-size-sm)",
            color: "var(--color-text-muted)",
          }}
        >
          All prices in Indian Rupees (INR) + applicable GST. Payments via
          Razorpay.
        </p>
      </div>
    </section>
  );
}
