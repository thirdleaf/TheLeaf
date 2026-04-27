import {
  Controller, Get, Post, Delete, Body, Param, Query,
  UseGuards, Req, Res, HttpCode, HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ClerkGuard } from '../common/guards/clerk.guard';
import { RequiresPlan, PlanGuard } from '../common/guards/plan.guard';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { SyncService } from './sync.service';
import { OAuthService } from './oauth.service';
import { EncryptionService } from '../common/security/encryption.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { db, users, brokerConnections } from '@thirdleaf/db';
import { eq, and } from 'drizzle-orm';
import { Request, Response } from 'express';
import { BrokerName } from './types/broker.types';

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';

@Controller('sync')
@UseGuards(ClerkGuard)
export class SyncController {
  constructor(
    private readonly syncService: SyncService,
    private readonly oauthService: OAuthService,
    private readonly enc: EncryptionService,
    @InjectQueue('broker-sync') private readonly syncQueue: Queue,
  ) {}

  private async resolveUser(req: Request) {
    const clerkId = req.clerkUserId;
    if (!clerkId) throw new BadRequestException('Unauthenticated');
    
    const [user] = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);
    
    if (!user) throw new BadRequestException('User profile not found. Please complete onboarding.');
    return user.id;
  }

  // ── Manual Sync Trigger ────────────────────────────────────────────────────

  @Post('trigger/:connectionId')
  @RateLimit({ limit: 1, windowSeconds: 300 })
  async triggerSync(
    @Param('connectionId') connectionId: string,
    @Req() req: Request,
  ) {
    const userId = await this.resolveUser(req);

    const [conn] = await db.select().from(brokerConnections)
      .where(and(eq(brokerConnections.id, connectionId), eq(brokerConnections.userId, userId)));
    if (!conn) throw new BadRequestException('Connection not found');

    const job = await this.syncQueue.add('sync-connection', {
      type: 'sync-connection',
      connectionId,
      triggeredBy: 'manual',
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    });

    return { success: true, data: { jobId: job.id, message: 'Sync queued.' } };
  }

  @Post('trigger-all')
  @RateLimit({ limit: 1, windowSeconds: 300 })
  async triggerAllSync(@Req() req: Request) {
    const userId = await this.resolveUser(req);

    const job = await this.syncQueue.add('sync-user', {
      type: 'sync-user',
      userId,
      triggeredBy: 'manual',
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    });

    return { success: true, data: { jobId: job.id } };
  }

  @Get('status/:connectionId')
  async getSyncStatus(@Param('connectionId') connectionId: string) {
    const data = await this.syncService.getSyncStatus(connectionId);
    return { success: true, data };
  }

  @Get('logs')
  async getSyncLogs(@Req() req: Request, @Query('limit') limit?: string) {
    const userId = await this.resolveUser(req);
    const data = await this.syncService.getRecentSyncLogs(userId, limit ? parseInt(limit) : 20);
    return { success: true, data };
  }

  @Post('connect/init')
  @UseGuards(PlanGuard)
  @RequiresPlan('pro')
  async initConnect(@Body() body: any, @Req() req: Request) {
    const userId = await this.resolveUser(req);
    const { broker, apiKey, apiSecret } = body;
    
    // Most brokers follow OAuth, some might need redirectUri
    const redirectUri = `${process.env.API_BASE_URL ?? 'http://localhost:4000'}/api/v1/sync/callback/${broker.toLowerCase()}`;
    
    // We store apiKey/apiSecret temporarily in the connection row for OAuth exchange
    await this.upsertConnection(userId, broker.toUpperCase(), { apiKey, apiSecret: apiSecret ?? '' });

    const redirectUrl = this.oauthService.getLoginUrl(broker.toUpperCase(), apiKey, redirectUri);
    return { success: true, data: { redirectUrl } };
  }

  @Post('connect/complete')
  @UseGuards(PlanGuard)
  @RequiresPlan('pro')
  async completeConnect(@Body() body: any, @Req() req: Request) {
    const userId = await this.resolveUser(req);
    const broker = body.broker.toUpperCase() as BrokerName;

    const [existing] = await db.select().from(brokerConnections)
      .where(and(eq(brokerConnections.userId, userId), eq(brokerConnections.broker, broker as any)));
    
    const dec = (v?: string | null) => (v ? this.enc.decrypt(v) : '');

    const apiKey = dec(existing?.encryptedApiKey) || body.apiKey;
    const apiSecret = dec(existing?.encryptedApiSecret) || body.apiSecret;
    const code = body.requestToken || body.code || body.accessToken;

    const tokens = await this.oauthService.exchangeCode(broker, code, apiKey, apiSecret);

    await this.upsertConnection(userId, broker as any, {
      accessToken: this.enc.decrypt(tokens.accessToken), // upsert encrypts it again
      refreshToken: tokens.refreshToken ? this.enc.decrypt(tokens.refreshToken) : undefined,
      isActive: true,
    });

    return { success: true, data: { connected: true } };
  }

  @Get('connections')
  async getConnections(@Req() req: Request) {
    const userId = await this.resolveUser(req);
    const conns = await db.select().from(brokerConnections).where(eq(brokerConnections.userId, userId));
    return { success: true, data: conns };
  }

  private async upsertConnection(userId: string, broker: string, data: any) {
    const row: any = { userId, broker, updatedAt: new Date() };
    if (data.apiKey) row.encryptedApiKey = this.enc.encrypt(data.apiKey);
    if (data.apiSecret) row.encryptedApiSecret = this.enc.encrypt(data.apiSecret);
    if (data.accessToken) row.encryptedAccessToken = this.enc.encrypt(data.accessToken);
    
    await db.insert(brokerConnections).values({ ...row, createdAt: new Date() })
      .onConflictDoUpdate({ target: [brokerConnections.userId, brokerConnections.broker], set: row });
  }
}
