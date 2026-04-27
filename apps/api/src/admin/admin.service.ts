import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AdminRepository } from "./repository/admin.repository";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly jwtService: JwtService,
  ) {}

  async getUsers() {
    return this.adminRepository.getUsers();
  }

  async updateUserPlan(id: string, plan: string) {
    return this.adminRepository.updateUserPlan(id, plan);
  }

  async suspendUser(id: string, isSuspended: boolean) {
    this.logger.log(`User ${id} suspended status changed to: ${isSuspended}`);
    return this.adminRepository.suspendUser(id, isSuspended);
  }

  async getAdminStats() {
    const stats = await this.adminRepository.getRevenueStats();
    return stats;
  }

  async createAnnouncement(userId: string, data: any) {
    const announcement = await this.adminRepository.createAnnouncement({
      ...data,
      authorId: userId,
    });
    
    // Log audit
    if (announcement) {
      await this.adminRepository.logAudit({
        userId,
        action: 'CREATE_ANNOUNCEMENT',
        metadata: { announcementId: (announcement as any).id },
      });
    }

    return announcement;
  }

  async getAuditLogs() {
    return this.adminRepository.getAuditLogs();
  }
}
