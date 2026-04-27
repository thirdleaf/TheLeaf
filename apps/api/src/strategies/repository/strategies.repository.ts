import { Injectable } from "@nestjs/common";
import { db } from "@thirdleaf/db";
import { strategies, strategyVersions, trades } from "@thirdleaf/db";
import { eq, and, desc, sql } from "drizzle-orm";

@Injectable()
export class StrategiesRepository {
  async create(data: any) {
    const [strategy] = await db.insert(strategies).values(data).returning();
    return strategy;
  }

  async findAll(userId: string) {
    return db.select().from(strategies).where(eq(strategies.userId, userId)).orderBy(desc(strategies.createdAt));
  }

  async findOne(id: string, userId: string) {
    const [strategy] = await db
      .select()
      .from(strategies)
      .where(and(eq(strategies.id, id), eq(strategies.userId, userId)))
      .limit(1);
    return strategy;
  }

  async update(id: string, userId: string, data: any) {
    const [updated] = await db
      .update(strategies)
      .set(data)
      .where(and(eq(strategies.id, id), eq(strategies.userId, userId)))
      .returning();
    return updated;
  }

  async remove(id: string, userId: string) {
    await db.delete(strategies).where(and(eq(strategies.id, id), eq(strategies.userId, userId)));
    return { deleted: true };
  }

  async getVersions(strategyId: string, userId: string) {
    return db
      .select()
      .from(strategyVersions)
      .where(eq(strategyVersions.strategyId, strategyId))
      .orderBy(desc(strategyVersions.createdAt));
  }

  async getPerformance(strategyId: string, _userId: string) {
    // Basic performance calculation
    return db
      .select({
        tradeCount: sql<number>`count(*)`,
        avgPnl: sql<number>`avg(${trades.netPnl})`,
        winRate: sql<number>`avg(case when ${trades.netPnl} > 0 then 1 else 0 end) * 100`,
      })
      .from(trades)
      .where(eq(trades.strategyId, strategyId));
  }
}
