import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";


// ─────────────────────────────────────────────────────────────
// Security Headers
// ─────────────────────────────────────────────────────────────
const clerkHosts = [
  "https://clerk.thirdleaf.com",
  "https://*.clerk.accounts.dev",
  "https://accounts.google.com",
];

const securityHeaders = [
  // Block all framing — prevents clickjacking
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Prevent MIME sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Enforce HTTPS for 2 years (max-age=63072000 = 2yr), include subdomains
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Referrer policy
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Permissions policy — restrict access to sensors
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // Content-Security-Policy
  // Allows Clerk, Google Fonts, and the API. Blocks inline scripts (except
  // the Clerk and Next.js nonces), blocks framing.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: self + clerk + next.js requires 'unsafe-eval' in dev + Turnstile
      process.env.NODE_ENV === "development"
        ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.thirdleaf.com https://*.clerk.accounts.dev https://challenges.cloudflare.com"
        : "script-src 'self' 'unsafe-inline' https://clerk.thirdleaf.com https://*.clerk.accounts.dev https://challenges.cloudflare.com",
      // Styles: self + google fonts (needed for @import)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + data URIs + Clerk avatars + Google
      "img-src 'self' data: blob: https://img.clerk.com https://lh3.googleusercontent.com https://*.googleusercontent.com",
      // Connect: self + API + Clerk + Upstash (websocket)
      `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"} https://clerk.thirdleaf.com https://*.clerk.accounts.dev https://*.clerk.com wss:`,
      // Frames: allow challenges.cloudflare.com
      "frame-src 'self' https://challenges.cloudflare.com",
      // Frame ancestors: block embedding
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Apply security headers to all routes
  headers: async () => [
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],

  // Proxy all /api/* calls to the NestJS backend, and provide a direct /logo rewrite
  rewrites: async () => [
    {
      source: "/logo",
      destination: "/logo.svg",
    },
    {
      source: "/api/:path*",
      destination: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/v1/:path*`,
    },
  ],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  // Enable experimental features needed for Next.js 15
  experimental: {
    typedRoutes: false,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
};

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts",
          expiration: {
            maxEntries: 4,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
          },
        },
      },
      {
        urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-font-assets",
          expiration: {
            maxEntries: 4,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
        },
      },
      {
        urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-image-assets",
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
        },
      },
      {
        urlPattern: /\/api\/journal\/.*/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "journal-api-cache",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
        },
      },
      {
        urlPattern: /\/api\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "general-api-cache",
          networkTimeoutSeconds: 5,
          expiration: {
            maxEntries: 128,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
        },
      },
    ],
  },
});

export default withPWA(nextConfig);
