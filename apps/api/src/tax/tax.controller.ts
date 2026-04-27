import {
  Controller, Get, Query, UseGuards, Req,
 } from '@nestjs/common';
 import { TaxService } from './tax.service';
 import { ClerkGuard } from '../common/guards/clerk.guard';
 import { RateLimit } from '../common/decorators/rate-limit.decorator';
 import { RequiresPlan, PlanGuard } from '../common/guards/plan.guard';
 import { Request } from 'express';
 
 @Controller('tax')
 @UseGuards(ClerkGuard)
 export class TaxController {
   constructor(private readonly taxService: TaxService) {}
 
   @Get('summary')
   @RateLimit({ limit: 60, windowSeconds: 60 })
   @UseGuards(PlanGuard)
   @RequiresPlan('pro')
   async getTaxSummary(
     @Req() req: Request,
     @Query('fy') fy?: string,
   ) {
     const userId = req.clerkUserId;
     if (!userId) throw new Error('UserId missing');
     return this.taxService.getYearlyTaxSummary(userId, fy || "2024-25");
   }
 }
