import {
  Controller, Get, Post, Body, Param, Query,
  UseGuards, Req,
 } from '@nestjs/common';
 import { AdminService } from './admin.service';
 import { ClerkGuard } from '../common/guards/clerk.guard';
 import { Request } from 'express';
 
 import { AdminGuard } from '../common/guards/admin.guard';
 
 @Controller('admin')
 @UseGuards(ClerkGuard, AdminGuard)
 export class AdminController {
   constructor(private readonly adminService: AdminService) {}
 
   @Get('users')
   async getUsers() {
     return this.adminService.getUsers();
   }
 
   @Post('users/:id/plan')
   async updateUserPlan(
     @Param('id') id: string,
     @Body('plan') plan: string,
   ) {
     return this.adminService.updateUserPlan(id, plan);
   }
 
   @Post('users/:id/suspend')
   async suspendUser(
     @Param('id') id: string,
     @Body('isSuspended') isSuspended: boolean,
   ) {
     return this.adminService.suspendUser(id, isSuspended);
   }
 
   @Get('stats')
   async getAdminStats() {
     return this.adminService.getAdminStats();
   }
 
   @Post('announcements')
   async createAnnouncement(@Req() req: Request, @Body() dto: any) {
     const userId = req.clerkUserId;
     if (!userId) throw new Error('UserId missing');
     return this.adminService.createAnnouncement(userId, dto);
   }
 
   @Get('audit-logs')
   async getAuditLogs() {
     return this.adminService.getAuditLogs();
   }
 }
