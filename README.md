# TradeForge — Professional Trading Journal & Analytics OS

TradeForge is a high-performance, SEBI-compliant trading journal and analytics platform for systematic traders.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and fill in the required variables (Clerk, Neon DB, Redis, OpenAI).
```bash
cp .env.example .env
```

### 3. Database Migration
```bash
npm run db:generate
npm run db:migrate
```

### 4. Start Development
```bash
npm run dev
```
- Frontend: `http://localhost:3000`
- API: `http://localhost:4000/api/v1`

## 🏗️ Monorepo Structure

- `apps/web`: Next.js 15 (Tailwind v4, Shadcn)
- `apps/api`: NestJS (Drizzle ORM, BullMQ, Socket.IO)
- `packages/db`: Drizzle Schema and Migrations
- `packages/types`: Shared TypeScript definitions
- `packages/utils`: Currency formatting and math helpers

## 🛡️ Security & Compliance

- **Authentication**: Clerk JWT with multi-layer role verification.
- **Data Isolation**: Multi-tenant architecture enforced at the repository level.
- **Compliance**: SEBI-compliant moderation engine blocks investment advice language.
- **Encryption**: AES-256-GCM for broker credentials.

## 📊 Analytics Engine

Integrated daily snapshots via BullMQ correctly calculate equity curves, drawdowns, and 40+ trading metrics from raw trade data.
