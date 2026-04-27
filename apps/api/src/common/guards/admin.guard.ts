import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // ClerkGuard must have run before this to populate clerkUserRole
    if (request.clerkUserRole !== "admin") {
      throw new ForbiddenException("Admin access required");
    }

    const adminEmails = this.configService.get("ADMIN_EMAILS", "").split(",");
    if (!adminEmails.includes(request.clerkUserEmail)) {
      throw new ForbiddenException("Email not authorized");
    }

    return true;
  }
}
