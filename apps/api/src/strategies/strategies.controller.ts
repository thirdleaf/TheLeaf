import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { StrategiesService } from './strategies.service';
import { ClerkGuard } from '../common/guards/clerk.guard';
import { Request } from 'express';
import { RateLimit } from '../common/decorators/rate-limit.decorator';

@Controller('strategies')
@UseGuards(ClerkGuard)
export class StrategiesController {
  constructor(private readonly strategiesService: StrategiesService) {}

  @Post()
  @RateLimit({ limit: 10, windowSeconds: 60 })
  create(@Req() req: Request, @Body() body: any) {
    return this.strategiesService.create(req.clerkUserId!, body);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.strategiesService.findAll(req.clerkUserId!);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.strategiesService.findOne(id, req.clerkUserId!);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req: Request, @Body() body: any) {
    return this.strategiesService.update(id, req.clerkUserId!, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.strategiesService.remove(id, req.clerkUserId!);
  }

  @Get(':id/versions')
  getVersions(@Param('id') id: string, @Req() req: Request) {
    return this.strategiesService.getVersions(id, req.clerkUserId!);
  }

  @Get(':id/performance')
  getPerformance(@Param('id') id: string, @Req() req: Request) {
    return this.strategiesService.getPerformance(id, req.clerkUserId!);
  }

  @Post(':id/import-backtest')
  importBacktest(@Param('id') id: string, @Req() req: Request, @Body() body: any) {
    return this.strategiesService.importBacktest(id, req.clerkUserId!, body);
  }
}
