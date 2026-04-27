import { Injectable, Logger } from '@nestjs/common';
import { db } from '@thirdleaf/db';
import { trades, brokerConnections, syncLogs, userSettings } from '@thirdleaf/db';
import { eq, and, desc } from 'drizzle-orm';
import { EncryptionService } from '../common/security/encryption.service';
import { ConnectorRegistry } from './connectors/connector.registry';
import { BrokerName, SyncResult } from './types/broker.types';
import { calculateBrokerage } from './brokerage.calculator';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly enc: EncryptionService,
    private readonly registry: ConnectorRegistry,
  ) {}

  async syncBrokerTrades(
    connectionId: string,
    triggeredBy: 'auto' | 'manual' = 'auto',
    dateRange?: { from: Date; to: Date },
  ): Promise<SyncResult> {
    const startedAt = new Date();

    const [conn] = await db.select().from(brokerConnections).where(eq(brokerConnections.id, connectionId));
    if (!conn || !conn.isActive) throw new Error('Connection not found or inactive');

    const broker = conn.broker as BrokerName;
    const userId = conn.userId;

    const [logRow] = await db.insert(syncLogs).values({
      userId,
      connectionId,
      broker: conn.broker as any,
      startedAt,
      status: 'pending',
      triggeredBy,
    }).returning();

    if (!logRow) throw new Error('Failed to create sync log');

    const result: SyncResult = {
      connectionId,
      broker,
      newTrades: 0,
      duplicates: 0,
      errors: [],
      durationMs: 0,
    };

    try {
      const dec = (v: string | null) => (v ? this.enc.decrypt(v) : '');
      
      const connector = this.registry.getConnector(broker);
      
      const to = dateRange?.to ?? new Date();
      const from = dateRange?.from ?? new Date(conn.lastSyncAt?.getTime() ?? Date.now() - 30 * 864e5); // Default 30 days if no lastSync

      const paired = await connector.syncTrades({
        apiKey: dec(conn.encryptedApiKey),
        apiSecret: dec(conn.encryptedApiSecret),
        accessToken: dec(conn.encryptedAccessToken),
        clientId: dec(conn.encryptedClientId),
      }, from, to);

      const existingIds = new Set(
        (await db.select({ brokerOrderId: trades.brokerOrderId })
          .from(trades)
          .where(and(eq(trades.userId, userId), eq(trades.importSource, broker as any)))
        ).map(r => r.brokerOrderId).filter(Boolean)
      );

      const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId)).limit(1) as any[];
      
      const newTrades = paired.filter(t => !existingIds.has(t.brokerOrderId));
      result.duplicates = paired.length - newTrades.length;
      result.newTrades = newTrades.length;

      if (newTrades.length > 0) {
        const rows = newTrades.map(t => {
          const fees = calculateBrokerage(t, broker, {
            customBrokeragePaise: settings?.customBrokeragePaise,
            brokerageCapPaise: settings?.brokerageCapPaise,
          });
          return {
            userId,
            symbol: t.symbol,
            exchange: t.exchange as any,
            instrumentType: t.instrumentType as any,
            direction: t.direction as any,
            entryPrice: t.entryPrice,
            exitPrice: t.exitPrice || t.entryPrice,
            quantity: t.quantity,
            entryTime: t.entryTime,
            exitTime: t.exitTime || t.entryTime,
            grossPnl: t.grossPnl || 0,
            brokerage: fees.brokerage,
            taxes: fees.totalFees - fees.brokerage,
            netPnl: fees.netPnl,
            holdDurationSeconds: t.exitTime ? Math.floor((t.exitTime.getTime() - t.entryTime.getTime()) / 1000) : 0,
            importSource: broker as any,
            brokerOrderId: t.brokerOrderId,
            brokerTradeId: t.brokerTradeId,
            importedAt: new Date(),
          };
        });

        for (let i = 0; i < rows.length; i += 100) {
          await db.insert(trades).values(rows.slice(i, i + 100)).onConflictDoNothing();
        }

        await db.update(brokerConnections)
          .set({ totalTradesSynced: (conn.totalTradesSynced || 0) + result.newTrades })
          .where(eq(brokerConnections.id, connectionId));
      }

      await db.update(brokerConnections).set({
        lastSyncAt: new Date(),
        lastSyncStatus: 'SUCCESS',
        syncError: null,
      }).where(eq(brokerConnections.id, connectionId));

      await db.update(syncLogs).set({
        completedAt: new Date(),
        status: 'success',
        newTradesCount: result.newTrades,
        duplicateCount: result.duplicates,
      }).where(eq(syncLogs.id, logRow.id));

    } catch (err) {
      const errMsg = (err as Error).message;
      this.logger.error(`Failed to sync ${broker}: ${errMsg}`, (err as Error).stack);
      result.errors.push(errMsg);
      await db.update(brokerConnections).set({
        lastSyncStatus: 'ERROR',
        syncError: errMsg,
      }).where(eq(brokerConnections.id, connectionId));

      await db.update(syncLogs).set({
        completedAt: new Date(),
        status: 'failed',
        errorMessage: errMsg,
      }).where(eq(syncLogs.id, logRow.id));
    }

    result.durationMs = Date.now() - startedAt.getTime();
    return result;
  }

  async syncAllBrokers(userId: string, triggeredBy: 'auto' | 'manual' = 'auto') {
    const connections = await db.select().from(brokerConnections)
      .where(and(eq(brokerConnections.userId, userId), eq(brokerConnections.isActive, true)));

    return Promise.allSettled(
      connections.map(c => this.syncBrokerTrades(c.id, triggeredBy))
    );
  }

  async getRecentSyncLogs(userId: string, limit = 20) {
    return db.select().from(syncLogs)
      .where(eq(syncLogs.userId, userId))
      .orderBy(desc(syncLogs.startedAt))
      .limit(limit);
  }

  async getSyncStatus(connectionId: string) {
    const [conn] = await db.select().from(brokerConnections).where(eq(brokerConnections.id, connectionId));
    if (!conn) return null;
    const [latestLog] = await db.select().from(syncLogs)
      .where(eq(syncLogs.connectionId, connectionId))
      .orderBy(desc(syncLogs.startedAt))
      .limit(1);
    return { connection: conn, latestLog: latestLog ?? null };
  }
}
