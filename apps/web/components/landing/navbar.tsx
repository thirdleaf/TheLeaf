"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle";
import { useUser } from "@clerk/nextjs";

// ─────────────────────────────────────────────────────────────
// Landing Navbar
// ─────────────────────────────────────────────────────────────
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn } = useUser();

  const navLinks = [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: "var(--z-sticky)",
        backgroundColor: "var(--color-bg)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div
        className="container-xl"
        style={{
          display: "flex",
          alignItems: "center",
          height: 60,
          gap: "var(--spacing-6)",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          id="nav-logo"
          className="flex items-center no-underline flex-1 group"
        >
          <div className="h-8 w-40 relative grayscale dark:grayscale-0 dark:brightness-150 contrast-125 dark:contrast-100 group-hover:scale-[1.05] transition-transform origin-left">
            <img
              src="/logo.svg"
              alt="ThirdLeaf Logo"
              className="h-full w-full object-contain object-left scale-[3.5] origin-left"
            />
          </div>
        </Link>

        {/* Desktop nav links */}
        <nav
          aria-label="Main navigation"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--spacing-1)",
          }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              id={`nav-link-${link.label.toLowerCase()}`}
              style={{
                padding: "var(--spacing-1-5) var(--spacing-3)",
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-muted)",
                borderRadius: "var(--radius-md)",
                transition: "color var(--transition-fast), background-color var(--transition-fast)",
                textDecoration: "none",
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "var(--spacing-2)",
            flex: 1,
          }}
        >
          <ThemeToggle />

          {isSignedIn ? (
            <Link
              href="/app/dashboard"
              id="nav-cta-dashboard"
              className="btn btn-primary"
              style={{ fontSize: "var(--font-size-sm)", padding: "8px 16px" }}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                id="nav-cta-login"
                className="btn btn-ghost"
                style={{ fontSize: "var(--font-size-sm)", padding: "8px 16px" }}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                id="nav-cta-register"
                className="btn btn-primary"
                style={{ fontSize: "var(--font-size-sm)", padding: "8px 16px" }}
              >
                Start Free
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            id="nav-mobile-toggle"
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            style={{
              display: "none",
              background: "none",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "var(--spacing-1-5)",
              cursor: "pointer",
              color: "var(--color-text-muted)",
            }}
            className="show-mobile"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          style={{
            padding: "var(--spacing-3) var(--spacing-4) var(--spacing-5)",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-1)",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              id={`nav-mobile-link-${link.label.toLowerCase()}`}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: "var(--spacing-2-5) var(--spacing-3)",
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-muted)",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
              }}
            >
              {link.label}
            </a>
          ))}
          <div
            style={{
              display: "flex",
              gap: "var(--spacing-2)",
              marginTop: "var(--spacing-3)",
            }}
          >
            <Link
              href="/login"
              className="btn btn-secondary"
              style={{ flex: 1, fontSize: "var(--font-size-sm)" }}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="btn btn-primary"
              style={{ flex: 1, fontSize: "var(--font-size-sm)" }}
            >
              Start Free
            </Link>
          </div>
        </nav>
      )}

      <style jsx>{`
        @media (min-width: 768px) {
          .hidden-mobile {
            display: flex !important;
          }
          .show-mobile {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .hidden-mobile {
            display: none !important;
          }
          .show-mobile {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
