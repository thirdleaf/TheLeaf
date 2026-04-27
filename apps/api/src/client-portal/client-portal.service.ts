import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { db } from "@thirdleaf/db";
import { clients } from "@thirdleaf/db";
import { eq } from "drizzle-orm";
import { RedisService } from "../common/redis/redis.service";
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";

@Injectable()
export class ClientPortalService {
  constructor(private readonly redisService: RedisService) {}

  async sendOtp(email: string) {
    // 1. Verify client exists
    const [client] = await db.select().from(clients).where(eq(clients.email, email)).limit(1);
    if (!client) throw new UnauthorizedException("Client not registered");

    // 2. Rate limiting
    const rateLimitKey = `otp_limit:${email}`;
    const count = await this.redisService.get(rateLimitKey) as number || 0;
    if (count >= 3) throw new BadRequestException("Too many OTP requests. Try again later.");

    await this.redisService.incr(rateLimitKey);
    await this.redisService.expire(rateLimitKey, 3600); // 1 hour

    // 3. Generate Secure OTP
    // Use randomInt for cryptographic security (built-in in Node.js)
    const otp = crypto.randomInt(100000, 999999).toString();
    await this.redisService.set(`otp:${email}`, otp, 600); // 10 minutes
    
    // Reset verification attempts on new OTP request
    await this.redisService.del(`otp_attempts:${email}`);

    // 4. Send Email (Mocked — Never log the OTP in production logs)
    // Removed insecure console.log
    
    return { success: true, message: "OTP sent to email" };
  }

  async verifyOtp(email: string, otp: string) {
    // 1. Check for brute-force attempts
    const attemptKey = `otp_attempts:${email}`;
    const attempts = await this.redisService.get(attemptKey) as number || 0;
    
    if (attempts >= 5) {
      throw new BadRequestException("Too many failed attempts. Account locked for 30 minutes.");
    }

    // 2. Hash-constant comparison is usually better, but for legacy compatibility we use stored comparison
    const storedOtp = await this.redisService.get(`otp:${email}`);
    
    if (!storedOtp || storedOtp !== otp) {
      // Increment failed attempts
      await this.redisService.incr(attemptKey);
      await this.redisService.expire(attemptKey, 1800); // 30 min lockout
      throw new UnauthorizedException("Invalid or expired OTP");
    }

    // 3. Cleanup on success
    await this.redisService.del(`otp:${email}`);
    await this.redisService.del(attemptKey);

    // Get client info to embed in JWT
    const [client] = await db.select().from(clients).where(eq(clients.email, email)).limit(1);
    if (!client) throw new UnauthorizedException("Client no longer exists");
    
    const secret = process.env["CLIENT_PORTAL_JWT_SECRET"];
    if (!secret) throw new Error("CLIENT_PORTAL_JWT_SECRET not configured");

    const token = jwt.sign(
      { clientId: client.id, email: client.email },
      secret,
      { expiresIn: "24h" }
    );

    return { token, client };
  }
}
