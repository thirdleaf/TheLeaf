import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { db } from '@thirdleaf/db';
import { brokerConnections, subscriptions } from '@thirdleaf/db';
import { eq, and, lt, isNotNull } from 'drizzle-orm';
import { EncryptionService } from '../common/security/encryption.service';
import { ConnectorRegistry } from './connectors/connector.registry';
import { BrokerName } from './types/broker.types';

const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5h30m in ms

function getISTHour(d: Date = new Date()): number {
  return new Date(d.getTime() + IST_OFFSET).getUTCHours();
}

@Injectable()
export class TokenRefreshService {
  private readonly logger = new Logger(TokenRefreshService.name);

  constructor(
    private readonly enc: EncryptionService,
    private readonly registry: ConnectorRegistry,
    @InjectQueue('broker-sync') private readonly syncQueue: Queue,
  ) {}

  // ── Cron: Daily EOD sync — 4:00 PM IST Mon–Fri ───────────────────────────
  @Cron('30 10 * * 1-5', { name: 'eod-sync', timeZone: 'UTC' })
  async triggerEodSync() {
    this.logger.log('⏰ EOD trigger: enqueuing daily sync...');

    const activeConnections = await db.select({
      userId: brokerConnections.userId,
    })
    .from(brokerConnections)
    .where(and(
      eq(brokerConnections.isActive, true),
      eq(brokerConnections.needsReauth, false),
    ));

    const userIds = [...new Set(activeConnections.map(c => c.userId))];

    for (const userId of userIds) {
      await this.syncQueue.add('sync-user', {
        type: 'sync-user',
        userId,
        triggeredBy: 'auto',
      }, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 30000 },
      });
    }
  }

  // ── Cron: Intraday sync — Elite plan only ─────────────────────────────────
  @Cron('*/15 3-9 * * 1-5', { name: 'intraday-sync', timeZone: 'UTC' })
  async triggerIntradaySync() {
    const istHour = getISTHour();
    if (istHour < 9 || istHour >= 16) return;

    const eliteConnections = await db
      .select({ connectionId: brokerConnections.id })
      .from(brokerConnections)
      .innerJoin(subscriptions, eq(subscriptions.userId, brokerConnections.userId))
      .where(and(
        eq(brokerConnections.isActive, true),
        eq(brokerConnections.needsReauth, false),
        eq(subscriptions.plan, 'elite'),
        eq(subscriptions.status, 'active'),
      ));

    for (const conn of eliteConnections) {
      await this.syncQueue.add('sync-connection', {
        type: 'sync-connection',
        connectionId: conn.connectionId,
        triggeredBy: 'auto',
      }, {
        attempts: 2,
        backoff: { type: 'fixed', delay: 60000 },
      });
    }
  }

  // ── Cron: Token expiry check ──────────────────────────────────────────────
  @Cron('0 * * * *', { name: 'token-refresh', timeZone: 'UTC' })
  async checkAndRefreshTokens() {
    const twoHoursFromNow = new Date(Date.now() + 2 * 3600_000);
    const expiring = await db.select().from(brokerConnections)
      .where(and(
        eq(brokerConnections.isActive, true),
        isNotNull(brokerConnections.encryptedRefreshToken),
        lt(brokerConnections.tokenExpiresAt, twoHoursFromNow),
      ));

    for (const conn of expiring) {
      await this.attemptRefresh(conn);
    }
  }

  private async attemptRefresh(conn: any): Promise<void> {
    const broker = conn.broker as BrokerName;

    try {
      const dec = (v: string | null) => (v ? this.enc.decrypt(v) : '');
      const connector = this.registry.getConnector(broker);

      if (!connector.refreshToken) {
        // Some brokers don't support automated refresh via API
        return;
      }

      const tokens = await connector.refreshToken({
        apiKey: dec(conn.encryptedApiKey),
        apiSecret: dec(conn.encryptedApiSecret),
        refreshToken: dec(conn.encryptedRefreshToken),
        accessToken: dec(conn.encryptedAccessToken),
      });

      await db.update(brokerConnections).set({
        encryptedAccessToken: this.enc.encrypt(tokens.accessToken),
        encryptedRefreshToken: tokens.refreshToken ? this.enc.encrypt(tokens.refreshToken) : conn.encryptedRefreshToken,
        tokenExpiresAt: tokens.expiresAt,
        needsReauth: false,
        syncError: null,
      }).where(eq(brokerConnections.id, conn.id));

      this.logger.log(`🔄 Refreshed token for ${broker} (User: ${conn.userId})`);
    } catch (err) {
      const errMsg = (err as Error).message;
      this.logger.error(`Failed to refresh ${broker}: ${errMsg}`);
      await this.markNeedsReauth(conn.id, errMsg);
    }
  }

  private async markNeedsReauth(connectionId: string, reason: string) {
    await db.update(brokerConnections).set({
      needsReauth: true,
      syncError: reason,
    }).where(eq(brokerConnections.id, connectionId));
  }
}
