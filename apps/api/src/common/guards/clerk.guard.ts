import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request } from "express";
import { createClerkClient, verifyToken } from "@clerk/backend";

// Extend Express Request to carry decoded Clerk user
declare module "express" {
  interface Request {
    clerkUserId: string | undefined;
    clerkSessionId: string | undefined;
    clerkUserRole: string | undefined;
    clerkUserEmail: string | undefined;
    clientId: string | undefined;
  }
}

@Injectable()
export class ClerkGuard implements CanActivate {
  private readonly logger = new Logger(ClerkGuard.name);

  constructor(private readonly configService: ConfigService) {
    console.log("[DEBUG-AUTH] ClerkGuard initialized");
    const secretKey = this.configService.get<string>("CLERK_SECRET_KEY");
    if (!secretKey) {
      console.error("[DEBUG-AUTH] CRITICAL: CLERK_SECRET_KEY is missing in ConfigService!");
    } else {
      console.log("[DEBUG-AUTH] CLERK_SECRET_KEY is present (starts with " + secretKey.substring(0, 7) + ")");
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers["authorization"];

    console.log(`[DEBUG-AUTH] Incoming request to: ${request.url}`);

    if (!authHeader?.startsWith("Bearer ")) {
      console.warn("[DEBUG-AUTH] Missing or invalid authorization header");
      throw new UnauthorizedException("Missing or invalid authorization header");
    }

    const token = authHeader.slice(7);
    console.log(`[DEBUG-AUTH] Token received (length: ${token.length}). Prefix: ${token.substring(0, 20)}...`);

    try {
      const secretKey = this.configService.get<string>("CLERK_SECRET_KEY");
      
      // Use Clerk's official SDK to verify the token
      const decoded = await verifyToken(token, {
        secretKey: secretKey,
      });

      console.log(`[ClerkGuard] Authentication SUCCESS for: ${decoded.sub}`);

      request.clerkUserId = decoded.sub;
      request.clerkSessionId = decoded.sid as string | undefined;
      request.clerkUserRole = ((decoded.metadata as any)?.role as string) ?? "trader";
      request.clerkUserEmail = (decoded as any).email;

      return true;
    } catch (error: any) {
      console.error(`[ClerkGuard] Authentication FAILED: ${error.message} (Reason: ${error.reason || "unknown"})`);
      
      if (error.attributes) {
        console.error(`[ClerkGuard] Error Attributes: ${JSON.stringify(error.attributes)}`);
      }
      
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
