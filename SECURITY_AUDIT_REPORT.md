# TradeForge — Security Audit & Hardening Report
**Date**: April 17, 2026
**Status**: IN PROGRESS (Remediation underway)

## 1. Executive Summary
A comprehensive security assessment of the TradeForge monorepo was conducted. The application demonstrates a strong foundation in financial data security (AES-256-GCM for broker keys) and authentication (Clerk RS256). However, significant risks were identified in dependency health and the storage of unencrypted PII/personal content.

## 2. Vulnerability Assessment

### 2.1 Dependency Health (`npm audit`)
- **Findings**: 39 vulnerabilities discovered (3 Critical, 12 High).
- **Core Risks**: 
    - `webpack`: SSRF vulnerability via URL userinfo bypass.
    - `inquirer`: Vulnerable `external-editor` dependency.
- **Status**: Remediation successfully performed by upgrading to NestJS 11 and Next.js 15. Remaining "low" risk issues are being monitored.

### 2.2 Data at Rest (Encryption)
| Data Type | Protected? | Method | Recommendation |
| :--- | :--- | :--- | :--- |
| Broker API Keys/Secrets | ✅ Yes | AES-256-GCM | None (Secure) |
| User Name & Email | ❌ No | Plain-text | **Encrypt at rest** (PII Protection) |
| Journal Entries | ❌ No | Plain-text | **Encrypt at rest** (Privacy Protection) |
| Strategy Rules | ❌ No | Plain-text | **Encrypt at rest** (IP Protection) |

### 2.3 Authentication & Authorization
- **Clerk Identity**: Correctly implemented with `ClerkGuard`.
- **JWT Integrity**: Uses RS256 with JWKS validation (High Security).
- **Rate Limiting**: `RateLimitGuard` active on auth and trade endpoints.

## 3. Loop Holes & Logic Gaps

### 3.1 Environment Misconfiguration
- Found `REPLACE_ME` placeholders in `app.module.ts`. 
- **Risk**: If these are deployed to production, rate-limiting or queuing might fail silently or with default insecure credentials.
- **Fix**: Implemented strict validation to throw error if placeholders exist in `NODE_ENV=production`.

### 3.2 IDOR Scoping
- A manual code audit of 20+ service methods confirmed that `userId` is consistently used in `WHERE` clauses for database operations. 
- **Risk**: Low. Ownership checks are robust.

## 4. Hardening Roadmap (Task List)

### ✅ Completed
- [x] Full ESM Migration (resolving dependency loading issues).
- [x] NestJS 11 & Next.js 15 upgrades for security patching.
- [x] PWA security upgrade to `@ducanh2912/next-pwa`.

### 🚧 In Progress
- [/] Stabilization of build logic following major jumps.
- [/] Implementation of Encryption for the `users` and `journal_entries` tables.

### 📅 Planned
- [ ] Audit of Cloudflare R2 bucket policies for "Least Privilege".
- [ ] Implementation of strict CSP (Content Security Policy) headers (started in `next.config.ts`).
