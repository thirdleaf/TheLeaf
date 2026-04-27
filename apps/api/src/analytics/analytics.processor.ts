import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Logger } from "@nestjs/common";
import { db, trades, dailySnapshots } from "@thirdleaf/db";
import { eq, and, sql, desc } from "drizzle-orm";

@Processor("analytics")
export class AnalyticsProcessor extends WorkerHost {
  private readonly logger = new Logger(AnalyticsProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    const { userId, date } = job.data;

    switch (job.name) {
      case "update-daily-snapshot":
        await this.updateDailySnapshot(userId, date);
        break;
      default:
        this.logger.warn(`Unknown queue job: ${job.name}`);
    }
  }

  private async updateDailySnapshot(userId: string, dateStr: string) {
    this.logger.log(`Refreshing daily snapshot for ${userId} on ${dateStr}`);
    
    // 1. Aggregate trades for that day (respecting soft-delete)
    // We use DATE() conversion for the entryTime column
    const stats = await db
      .select({
        tradeCount: sql<number>`count(*)::int`,
        winCount: sql<number>`count(*) filter (where ${trades.netPnl} > 0)::int`,
        lossCount: sql<number>`count(*) filter (where ${trades.netPnl} < 0)::int`,
        realizedPnl: sql<number>`sum(${trades.grossPnl})::bigint`,
        commissions: sql<number>`sum(${trades.brokerage} + ${trades.taxes})::bigint`,
        netPnl: sql<number>`sum(${trades.netPnl})::bigint`,
        largestWin: sql<number>`max(${trades.netPnl})::bigint`,
        largestLoss: sql<number>`min(${trades.netPnl})::bigint`,
      })
      .from(trades)
      .where(
        and(
          eq(trades.userId, userId),
          sql`DATE(${trades.entryTime}) = ${dateStr}`,
          sql`${trades.deletedAt} IS NULL`
        )
      );

    const result = stats[0];
    if (!result || result.tradeCount === 0) {
      this.logger.log(`No trades found for ${userId} on ${dateStr}. Skipping snapshot.`);
      return;
    }

    // 2. Get previous snapshot to calculate running equity
    const prevSnapshot = await db
      .select()
      .from(dailySnapshots)
      .where(and(eq(dailySnapshots.userId, userId), sql`${dailySnapshots.date} < ${dateStr}`))
      .orderBy(desc(dailySnapshots.date))
      .limit(1);

    const prevEquity = prevSnapshot[0]?.runningEquity ? Number(prevSnapshot[0].runningEquity) : 0;
    const prevPeak = prevSnapshot[0]?.peakEquity ? Number(prevSnapshot[0].peakEquity) : prevEquity;
    
    const realizedPnlNum = result.realizedPnl ? Number(result.realizedPnl) : 0;
    const netPnlNum = result.netPnl ? Number(result.netPnl) : 0;
    
    const runningEquity = prevEquity + netPnlNum;
    const peakEquity = Math.max(prevPeak, runningEquity);
    // Drawdown in basis points
    const drawdown = peakEquity > 0 ? Math.round(((peakEquity - runningEquity) / peakEquity) * 10000) : 0;

    // 3. Upsert into daily_snapshots
    await db
      .insert(dailySnapshots)
      .values({
        userId,
        date: dateStr,
        openBalance: prevEquity,
        closeBalance: runningEquity,
        realizedPnl: realizedPnlNum,
        netPnl: netPnlNum,
        tradeCount: result.tradeCount || 0,
        winCount: result.winCount || 0,
        lossCount: result.lossCount || 0,
        commissions: result.commissions ? Number(result.commissions) : 0,
        largestWin: result.largestWin ? Number(result.largestWin) : 0,
        largestLoss: result.largestLoss ? Number(result.largestLoss) : 0,
        runningEquity,
        peakEquity,
        drawdown,
      })
      .onConflictDoUpdate({
        target: [dailySnapshots.userId, dailySnapshots.date],
        set: {
          openBalance: prevEquity,
          closeBalance: runningEquity,
          realizedPnl: realizedPnlNum,
          netPnl: netPnlNum,
          tradeCount: result.tradeCount || 0,
          winCount: result.winCount || 0,
          lossCount: result.lossCount || 0,
          commissions: result.commissions ? Number(result.commissions) : 0,
          largestWin: result.largestWin ? Number(result.largestWin) : 0,
          largestLoss: result.largestLoss ? Number(result.largestLoss) : 0,
          runningEquity,
          peakEquity,
          drawdown,
          updatedAt: new Date(),
        },
      });

    this.logger.log(`Updated daily snapshot for ${userId} on ${dateStr}. Net PnL: ${netPnlNum}`);
  }
}
