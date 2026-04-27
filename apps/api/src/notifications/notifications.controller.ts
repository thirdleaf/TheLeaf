import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req, Headers } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationService } from './notification.service';
import { ClerkGuard } from '../common/guards/clerk.guard';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { Request } from 'express';

@Controller('notifications')
@UseGuards(ClerkGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly pushService: NotificationService,
  ) {}

  @Get()
  @RateLimit({ limit: 120, windowSeconds: 60 })
  async findAll(@Req() req: Request) {
    return this.notificationsService.findAll(req.clerkUserId!);
  }

  @Get('public-key')
  async getPublicKey() {
    return { success: true, data: process.env.VAPID_PUBLIC_KEY };
  }

  @Post('subscribe')
  async subscribe(
    @Req() req: Request,
    @Body() subscription: any,
    @Headers('user-agent') userAgent?: string,
  ) {
    const userId = req.clerkUserId!;
    const sub = await this.pushService.subscribe(userId, subscription, userAgent);
    return { success: true, data: sub };
  }

  @Post('test-push')
  async testPush(@Req() req: Request) {
    const userId = req.clerkUserId!;
    await this.pushService.sendToUser(userId, {
      title: "Test Notification",
      body: "⚡ Ready to sync your trades!",
      tag: "test"
    }, "email"); // "email" is always implicitly on for testing
    return { success: true, message: "Test sent" };
  }

  @Get(':id')
  @RateLimit({ limit: 120, windowSeconds: 60 })
  async findOne(@Param('id') id: string, @Req() req: Request) {
    return this.notificationsService.findOne(id, req.clerkUserId!);
  }
}
