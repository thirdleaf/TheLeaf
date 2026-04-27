import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClerkGuard } from '../common/guards/clerk.guard';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { Request } from 'express';

@Controller('auth')
@UseGuards(ClerkGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @RateLimit({ limit: 120, windowSeconds: 60 })
  async findAll(@Req() req: Request) {
    return this.authService.findAll(req.clerkUserId!);
  }

  @Get(':id')
  @RateLimit({ limit: 120, windowSeconds: 60 })
  async findOne(@Param('id') id: string, @Req() req: Request) {
    return this.authService.findOne(id, req.clerkUserId!);
  }
}
