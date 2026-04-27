import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ClerkGuard } from '../common/guards/clerk.guard';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { Request } from 'express';

@Controller('tags')
@UseGuards(ClerkGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @RateLimit({ limit: 120, windowSeconds: 60 })
  async findAll(@Req() req: Request) {
    return this.tagsService.findAll(req.clerkUserId!);
  }

  @Get(':id')
  @RateLimit({ limit: 120, windowSeconds: 60 })
  async findOne(@Param('id') id: string, @Req() req: Request) {
    return this.tagsService.findOne(id, req.clerkUserId!);
  }
}
