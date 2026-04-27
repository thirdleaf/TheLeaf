import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { RATE_LIMIT_KEY, RateLimitOptions } from "../decorators/rate-limit.decorator";
import type { Request } from "express";

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RateLimitGuard.name);
  private redis: Redis | null = null;
  // Fallback map so the app doesn't crash if Redis is initially unconfigured
  private activeLimiters = new Map<string, Ratelimit>();

  constructor(private reflector: Reflector) {
    if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
      if (process.env.UPSTASH_REDIS_TOKEN !== "REPLACE_ME") {
        this.redis = new Redis({
          url: process.env.UPSTASH_REDIS_URL,
          token: process.env.UPSTASH_REDIS_TOKEN,
        });
      }
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const limits = this.reflector.get<RateLimitOptions>(
      RATE_LIMIT_KEY,
      context.getHandler()
    );

    // Skip if no rate limit decorator applied
    if (!limits) {
      return true;
    }

    if (!this.redis) {
      this.logger.warn("Upstash Redis not configured. Skipping rate limit guard.");
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    // Rate limit per user if logged in, else by IP
    const identifier =
      request.clerkUserId ||
      request.headers["x-forwarded-for"]?.toString() ||
      request.socket.remoteAddress ||
      "unknown_ip";

    const key = `ratelimit:${limits.limit}:${limits.windowSeconds}`;
    
    let limiter = this.activeLimiters.get(key);
    if (!limiter) {
      limiter = new Ratelimit({
        redis: this.redis,
        limiter: Ratelimit.slidingWindow(limits.limit, `${limits.windowSeconds} s`),
        ephemeralCache: new Map(),
      });
      this.activeLimiters.set(key, limiter);
    }

    const { success } = await limiter.limit(identifier);

    if (!success) {
      throw new HttpException(
        "Too many requests",
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    return true;
  }
}
