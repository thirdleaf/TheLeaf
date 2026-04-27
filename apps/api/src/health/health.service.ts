import { Injectable, Logger } from "@nestjs/common";
import { db } from "@thirdleaf/db";
import { sql } from "drizzle-orm";
// Assume Redis initialization exists in a shared provider or we use a simple Upstash fetch check
import Redis from "ioredis";

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private redis: Redis | null = null;

  constructor() {
    const rawUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL;
    if (rawUrl) {
      try {
        // If it's a REST/HTTPS URL, extract just the host for ioredis (TCP)
        if (rawUrl.startsWith("http")) {
          const url = new URL(rawUrl);
          this.redis = new Redis({
            host: url.hostname,
            port: parseInt(url.port) || 6379,
            password: process.env.REDIS_PASSWORD || process.env.UPSTASH_REDIS_TOKEN,
            tls: rawUrl.includes("upstash.io") ? {} : undefined,
            maxRetriesPerRequest: 1,
            connectTimeout: 2000,
          });
        } else {
          // Standard redis:// or rediss:// URL
          this.redis = new Redis(rawUrl, {
            maxRetriesPerRequest: 1,
            connectTimeout: 2000,
          });
        }
      } catch (err: any) {
        this.logger.warn(`Failed to initialize Redis health client: ${err.message}`);
      }
    }
  }

  async checkAll() {
    const services = {
      database: "loading",
      redis: "loading",
      version: "1.0.0"
    };

    let isOk = true;

    // Check DB
    try {
      await db.execute(sql`SELECT 1`);
      services.database = "ok";
    } catch (e) {
      this.logger.error("Database health check failed", e);
      services.database = "error";
      isOk = false;
    }

    // Check Redis
    if (this.redis) {
      try {
        await this.redis.ping();
        services.redis = "ok";
      } catch (e) {
        this.logger.error("Redis health check failed", e);
        services.redis = "error";
        isOk = false;
      }
    } else {
      services.redis = "not_configured";
    }

    return {
      status: isOk ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      services,
    };
  }
}
