FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ── Stage 1: Dependencies ──────────────────────────
FROM base AS builder
WORKDIR /app
RUN pnpm install turbo --global

COPY . .
RUN turbo prune @thirdleaf/web --docker

# ── Stage 2: Install and Build ─────────────────────
FROM base AS installer
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
# Enable standalone output in next.config.ts if not already present
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm turbo run build --filter=@thirdleaf/web

# ── Stage 3: Runner ─────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000
ENV PORT=3000

# server.js is created by next build from the standalone output
CMD HOSTNAME="0.0.0.0" node apps/web/server.js
