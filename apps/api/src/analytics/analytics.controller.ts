import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ClerkGuard } from '../common/guards/clerk.guard';
import { Request } from 'express';

@Controller('analytics')
@UseGuards(ClerkGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("dashboard")
  async getDashboardStats(@Req() req: Request) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error("UserId missing");
    return this.analyticsService.getDashboardStats(userId);
  }

  @Get("overview")
  async getOverview(@Req() req: Request) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error("UserId missing");
    const data = await this.analyticsService.getOverviewStats(userId);
    return { success: true, data };
  }

  @Get("equity-curve")
  async getEquityCurve(@Req() req: Request, @Query("days") days: number = 30) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error("UserId missing");
    const data = await this.analyticsService.getEquityCurve(userId, days);
    return { success: true, data };
  }

  @Get("breakdown")
  async getBreakdown(@Req() req: Request, @Query("groupBy") groupBy: string) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error("UserId missing");
    const data = await this.analyticsService.getBreakdownData(userId, groupBy);
    return { success: true, data };
  }

  @Get("mae-mfe")
  async getMaeMfe(@Req() req: Request) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error("UserId missing");
    const data = await this.analyticsService.getMaeMfeData(userId);
    return { success: true, data };
  }
}
