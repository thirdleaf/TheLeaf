import {
  Controller, Get, Post, Body, Param, UseGuards, Req,
} from '@nestjs/common';
import { PropService } from './prop.service';
import { ClerkGuard } from '../common/guards/clerk.guard';
import { Request } from 'express';

@Controller('prop')
@UseGuards(ClerkGuard)
export class PropController {
  constructor(private readonly propService: PropService) {}

  @Get('accounts')
  async getAccounts(@Req() req: Request) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error('Clerk User ID missing');
    const data = await this.propService.getAccounts(userId);
    return { success: true, data };
  }

  @Post('accounts')
  async createAccount(@Body() body: any) {
    const data = await this.propService.createAccount(body);
    return { success: true, data };
  }

  @Post('accounts/:id/fund')
  async fundAccount(@Param('id') id: string, @Body() body: any) {
    const data = await this.propService.fundAccount(id, body);
    return { success: true, data };
  }

  @Post('accounts/:id/trade')
  async createTrade(@Param('id') id: string, @Body() body: any) {
    const data = await this.propService.createTrade(id, body);
    return { success: true, data };
  }

  @Get('accounts/:id/trades')
  async getTrades(@Param('id') id: string) {
    const data = await this.propService.getTrades(id);
    return { success: true, data };
  }

  @Get('accounts/:id/analytics')
  async getAnalytics(@Param('id') id: string) {
    const data = await this.propService.getAnalytics(id);
    return { success: true, data };
  }
}
