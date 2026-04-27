import {
  Controller, Get, Post, Body, Param, Query,
  UseGuards, Req, UseInterceptors, UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { JournalService } from './journal.service';
import { TradingRulesService } from '../trading-rules/trading-rules.service';
import { PsychologyService } from '../psychology/psychology.service';
import { ClerkGuard } from '../common/guards/clerk.guard';
import { Request } from 'express';

@Controller('journal')
@UseGuards(ClerkGuard)
export class JournalController {
  constructor(
    private readonly journalService: JournalService,
    private readonly rulesService: TradingRulesService,
    private readonly psychologyService: PsychologyService,
  ) {}

  @Post()
  async createEntry(@Req() req: Request, @Body() dto: any) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error('UserId missing');
    return this.journalService.createEntry(userId, dto);
  }

  @Get()
  async findAll(@Req() req: Request, @Query() filters: any) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error('UserId missing');
    return this.journalService.findAll(userId, filters);
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error('UserId missing');
    return this.journalService.findOne(userId, id);
  }

  // ── Rules Management (Delegated to TradingRulesService) ───────────────────

  @Get('rules')
  async getRules(@Req() req: Request) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error('UserId missing');
    return this.rulesService.getRules(userId);
  }

  @Post('rules')
  async createRule(@Req() req: Request, @Body() dto: any) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error('UserId missing');
    return this.rulesService.createRule(userId, dto);
  }

  @Post('rules/break')
  async logRuleBreak(@Req() req: Request, @Body() dto: any) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error('UserId missing');
    return this.rulesService.logRuleBreak(userId, dto);
  }

  @Get('analytics/rule-breaks')
  async getRuleBreakAnalytics(@Req() req: Request) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error('UserId missing');
    return this.psychologyService.getCorrelations(userId);
  }

  @Get('analytics/mood-pnl')
  async getMoodPnl(@Req() req: Request) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error('UserId missing');
    return this.psychologyService.getMoodPnL(userId);
  }
}
