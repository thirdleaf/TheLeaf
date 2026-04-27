FROM node:20-alpine AS base

# Install necessary OS tools
RUN apk add --no-cache libc6-compat
# Setup environment
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ── Stage 1: Dependencies ──────────────────────────
FROM base AS builder
WORKDIR /app
# Install turbo globally
RUN pnpm install turbo --global

COPY . .
# Prune the workspace for the api app
RUN turbo prune @thirdleaf/api --docker

# ── Stage 2: Install and Build ─────────────────────
FROM base AS installer
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=@thirdleaf/api

# ── Stage 3: Runner ─────────────────────────────────
FROM base AS runner
WORKDIR /app

# Non-root user setup
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=installer /app/apps/api/package.json .
COPY --from=installer --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=installer --chown=nestjs:nodejs /app/node_modules ./node_modules

EXPOSE 3001
ENV PORT=3001

CMD ["node", "dist/main"]
