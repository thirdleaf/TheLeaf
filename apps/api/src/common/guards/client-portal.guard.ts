import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";

@Injectable()
export class ClientPortalGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers["authorization"];

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing client portal token");
    }

    const token = authHeader.slice(7);
    const secret = process.env["CLIENT_PORTAL_JWT_SECRET"];

    if (!secret) {
      throw new Error("CLIENT_PORTAL_JWT_SECRET not configured");
    }

    try {
      const decoded = jwt.verify(token, secret) as { clientId: string };
      request.clientId = decoded.clientId;
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired client portal token");
    }
  }
}
