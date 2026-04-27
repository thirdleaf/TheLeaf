import { Injectable } from "@nestjs/common";
import { Redis } from "@upstash/redis";

@Injectable()
export class RedisService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      url: process.env["UPSTASH_REDIS_URL"] || "",
      token: process.env["UPSTASH_REDIS_TOKEN"] || "",
    });
  }

  async set(key: string, value: any, ex?: number) {
    if (ex) {
      return this.redis.set(key, value, { ex });
    }
    return this.redis.set(key, value);
  }

  async get(key: string) {
    return this.redis.get(key);
  }

  async del(key: string) {
    return this.redis.del(key);
  }

  async incr(key: string) {
    return this.redis.incr(key);
  }

  async expire(key: string, seconds: number) {
    return this.redis.expire(key, seconds);
  }
}
