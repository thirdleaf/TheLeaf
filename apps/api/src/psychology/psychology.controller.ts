import {
  Controller, Get, Post, Body, Query, UseGuards, Req,
} from '@nestjs/common';
import { PsychologyService } from './psychology.service';
import { ClerkGuard } from '../common/guards/clerk.guard';
import { Request } from 'express';

@Controller('psychology')
@UseGuards(ClerkGuard)
export class PsychologyController {
  constructor(private readonly psychologyService: PsychologyService) {}

  @Post('checkin')
  async saveCheckin(@Req() req: Request, @Body() body: any) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error('Clerk User ID missing');
    return this.psychologyService.saveCheckin(userId, body);
  }

  @Get('checkins')
  async getCheckins(
    @Req() req: Request,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error('Clerk User ID missing');
    return this.psychologyService.getCheckins(userId, from, to);
  }

  @Get('insights/daily')
  async getDailyInsights(@Req() req: Request) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error('Clerk User ID missing');
    return this.psychologyService.getDailyInsights(userId);
  }

  @Get('rules')
  async getRules(@Req() req: Request) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error('Clerk User ID missing');
    return this.psychologyService.getRules(userId);
  }

  @Post('rules')
  async createRule(@Req() req: Request, @Body() data: any) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error('Clerk User ID missing');
    return this.psychologyService.createRule(userId, data);
  }

  @Post('rule-break')
  async logRuleBreak(@Req() req: Request, @Body() body: any) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error('Clerk User ID missing');
    return this.psychologyService.logRuleBreak(userId, body);
  }

  @Get('correlations')
  async getCorrelations(@Req() req: Request) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error('Clerk User ID missing');
    return this.psychologyService.getCorrelations(userId);
  }
}
