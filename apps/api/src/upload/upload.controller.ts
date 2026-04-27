import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ClerkGuard } from '../common/guards/clerk.guard';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { Request } from 'express';

@Controller('upload')
@UseGuards(ClerkGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get()
  @RateLimit({ limit: 120, windowSeconds: 60 })
  async findAll(@Req() req: Request) {
    return this.uploadService.findAll(req.clerkUserId!);
  }

  @Get(':id')
  @RateLimit({ limit: 120, windowSeconds: 60 })
  async findOne(@Param('id') id: string, @Req() req: Request) {
    return this.uploadService.findOne(id, req.clerkUserId!);
  }
}
