// ─────────────────────────────────────────────────────────────
// Rate Limit Middleware — Upstash Redis sliding window
// Public routes: 100 req/min per IP
// Authenticated routes: 500 req/min per user (Clerk user ID)
// ─────────────────────────────────────────────────────────────

import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly publicLimiter: Ratelimit;
  private readonly authLimiter: Ratelimit;
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      url: process.env["UPSTASH_REDIS_URL"] ?? "",
      token: process.env["UPSTASH_REDIS_TOKEN"] ?? "",
    });

    // 100 requests per minute per IP for public routes
    this.publicLimiter = new Ratelimit({
      redis: this.redis,
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      prefix: "thirdleaf:rl:public",
      analytics: false,
    });

    // 500 requests per minute per user for authenticated routes
    this.authLimiter = new Ratelimit({
      redis: this.redis,
      limiter: Ratelimit.slidingWindow(500, "1 m"),
      prefix: "thirdleaf:rl:auth",
      analytics: false,
    });
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Skip rate limiting in test environment
    if (process.env["NODE_ENV"] === "test") {
      next();
      return;
    }

    const authHeader = req.headers["authorization"];
    const isAuthenticated = authHeader?.startsWith("Bearer ");

    // Determine identifier: user ID for auth, IP for public
    const userId = isAuthenticated
      ? this.extractUserIdFromToken(authHeader!.slice(7))
      : null;

    const identifier = userId ?? this.getClientIp(req);
    const limiter = isAuthenticated ? this.authLimiter : this.publicLimiter;

    try {
      const { success, limit, remaining, reset } =
        await limiter.limit(identifier);

      // Always set rate limit headers
      res.setHeader("X-RateLimit-Limit", limit.toString());
      res.setHeader("X-RateLimit-Remaining", remaining.toString());
      res.setHeader("X-RateLimit-Reset", reset.toString());

      if (!success) {
        throw new HttpException(
          {
            success: false,
            message: "Too many requests. Please slow down.",
            code: "RATE_LIMIT_EXCEEDED",
          },
          HttpStatus.TOO_MANY_REQUESTS
        );
      }

      next();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      // If Redis is unavailable, fail open (allow request) but log error
      console.error("[RateLimit] Redis error, allowing request:", error);
      next();
    }
  }

  private getClientIp(req: Request): string {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
      const firstIp = forwarded.split(",")[0];
      return (firstIp ?? "unknown").trim();
    }
    return req.socket.remoteAddress ?? "unknown";
  }

  private extractUserIdFromToken(token: string): string | null {
    try {
      // Decode without verification (verification happens in ClerkGuard)
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const payload = JSON.parse(
        Buffer.from(parts[1] ?? "", "base64url").toString("utf8")
      ) as { sub?: string };
      return payload.sub ?? null;
    } catch {
      return null;
    }
  }
}
