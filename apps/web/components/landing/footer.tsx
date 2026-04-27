"use client";

import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
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
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
} as const;

// ─────────────────────────────────────────────────────────────
// Footer Section
// ─────────────────────────────────────────────────────────────
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="footer"
      style={{
        backgroundColor: "var(--color-surface)",
        padding: "var(--spacing-16) var(--spacing-6) var(--spacing-8)",
      }}
    >
      <div className="container-xl">
        {/* Top section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "var(--spacing-8)",
            marginBottom: "var(--spacing-12)",
          }}
        >
          {/* Brand column */}
          <div style={{ gridColumn: "span 2" }}>
            {/* Logo */}
            <Link
              href="/"
              id="footer-logo"
              style={{
                display: "inline-flex",
                alignItems: "center",
                marginBottom: "var(--spacing-4)",
                textDecoration: "none",
              }}
            >
              <img
                src="/logo.svg"
                alt="ThirdLeaf Logo"
                width={160}
                height={64}
                style={{ objectFit: "contain" }}
              />
            </Link>

            <p
              style={{
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-muted)",
                lineHeight: "var(--line-height-relaxed)",
                maxWidth: 260,
                marginBottom: "var(--spacing-5)",
              }}
            >
              India&apos;s professional trading journal, analytics, and quant
              workspace for serious traders.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: "var(--spacing-3)" }}>
              {[
                { icon: Twitter, href: "https://twitter.com/thirdleaf_in", label: "Twitter" },
                { icon: Linkedin, href: "https://linkedin.com/company/thirdleaf", label: "LinkedIn" },
                { icon: Github, href: "https://github.com/thirdleaf", label: "GitHub" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  id={`footer-social-${label.toLowerCase()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-text-muted)",
                    transition: "border-color var(--transition-fast), color var(--transition-fast)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "var(--color-accent)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--color-accent)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "var(--color-border)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--color-text-muted)";
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3
                style={{
                  fontSize: "var(--font-size-xs)",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "var(--spacing-4)",
                }}
              >
                {category}
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {links.map((link) => (
                  <li key={link.label} style={{ marginBottom: "var(--spacing-2)" }}>
                    <Link
                      href={link.href}
                      id={`footer-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                      style={{
                        fontSize: "var(--font-size-sm)",
                        color: "var(--color-text-muted)",
                        transition: "color var(--transition-fast)",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="divider" style={{ marginBottom: "var(--spacing-6)" }} />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "var(--spacing-4)",
          }}
        >
          <p
            style={{
              fontSize: "var(--font-size-xs)",
              color: "var(--color-text-disabled)",
            }}
          >
            © {currentYear} ThirdLeaf Technologies Pvt. Ltd. All rights reserved.
          </p>

          {/* SEBI Disclaimer */}
          <p
            style={{
              fontSize: "var(--font-size-xs)",
              color: "var(--color-text-disabled)",
              maxWidth: 560,
              lineHeight: "var(--line-height-relaxed)",
              textAlign: "right",
            }}
          >
            <strong style={{ color: "var(--color-text-muted)" }}>
              SEBI Disclaimer:{" "}
            </strong>
            ThirdLeaf is a technology platform. We do not provide investment
            advice or trading signals. Trading in securities, futures, and
            options involves substantial risk of loss. Past performance of any
            trading system is not indicative of future results. Please consult a
            SEBI-registered investment advisor before making investment
            decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
