import { Injectable, Logger } from '@nestjs/common';
import { db } from '@thirdleaf/db';
import { trades } from '@thirdleaf/db';
import { eq, and, between, desc, sql } from 'drizzle-orm';
import { subDays, startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  async getDashboardStats(userId: string) {
    const [totalTrades, totalPnl] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(trades).where(and(eq(trades.userId, userId), eq(trades.isOpen, false))),
      db.select({ pnl: sql<number>`sum(net_pnl)` }).from(trades).where(eq(trades.userId, userId)),
    ]);

    return {
      totalTrades: totalTrades[0]?.count || 0,
      totalNetPnl: totalPnl[0]?.pnl || 0,
    };
  }

  async getOverviewStats(userId: string) {
    const allTrades = await db
      .select()
      .from(trades)
      .where(and(eq(trades.userId, userId), eq(trades.isOpen, false)))
      .orderBy(trades.exitTime);

    if (allTrades.length === 0) return this.getEmptyStats();

    const wins = allTrades.filter(t => (t.netPnl ?? 0) > 0);
    const losses = allTrades.filter(t => (t.netPnl ?? 0) < 0);
    const breakEvens = allTrades.filter(t => (t.netPnl ?? 0) === 0);

    const totalNetPnl = allTrades.reduce((sum, t) => sum + Number(t.netPnl || 0), 0);
    const totalWins = wins.reduce((sum, t) => sum + Number(t.netPnl || 0), 0);
    const totalLosses = Math.abs(losses.reduce((sum, t) => sum + Number(t.netPnl || 0), 0));

    const winRate = (wins.length / allTrades.length) * 100;
    const profitFactor = totalLosses === 0 ? totalWins : totalWins / totalLosses;

    const avgWin = wins.length === 0 ? 0 : totalWins / wins.length;
    const avgLoss = losses.length === 0 ? 0 : totalLosses / losses.length;

    // Simplified Sharpe (PnL based volatility)
    const returns = allTrades.map(t => Number(t.netPnl || 0));
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(returns.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / returns.length);
    const sharpeRatio = stdDev === 0 ? 0 : (mean / stdDev) * Math.sqrt(252); // Annualized approximation

    // Max Drawdown Calculation
    let maxEquity = 0;
    let currentEquity = 0;
    let maxDd = 0;
    for (const t of allTrades) {
      currentEquity += Number(t.netPnl || 0);
      if (currentEquity > maxEquity) maxEquity = currentEquity;
      const dd = maxEquity === 0 ? 0 : ((maxEquity - currentEquity) / maxEquity) * 100;
      if (dd > maxDd) maxDd = dd;
    }

    // Streaks
    let currentStreak = 0;
    let longestWinStreak = 0;
    let longestLossStreak = 0;
    let tempStreak = 0;

    allTrades.forEach((t, i) => {
      const isWin = (t.netPnl ?? 0) > 0;
      if (i === 0) tempStreak = isWin ? 1 : -1;
      else {
        if ((isWin && tempStreak > 0) || (!isWin && tempStreak < 0)) tempStreak += isWin ? 1 : -1;
        else tempStreak = isWin ? 1 : -1;
      }
      if (tempStreak > longestWinStreak) longestWinStreak = tempStreak;
      if (tempStreak < -longestLossStreak) longestLossStreak = Math.abs(tempStreak);
    });
    currentStreak = tempStreak;

    return {
      tradeCount: allTrades.length,
      winCount: wins.length,
      lossCount: losses.length,
      breakEvenCount: breakEvens.length,
      totalNetPnl,
      winRate: Math.round(winRate * 10) / 10,
      profitFactor: Math.round(profitFactor * 100) / 100,
      avgWin: Math.round(avgWin),
      avgLoss: Math.round(avgLoss),
      expectancy: Math.round(totalNetPnl / allTrades.length),
      sharpeRatio: Math.round(sharpeRatio * 100) / 100,
      maxDrawdown: Math.round(maxDd * 10) / 10,
      currentStreak,
      longestWinStreak,
      longestLossStreak,
      avgRMultiple: 0, // Placeholder
    };
  }

  async getBreakdownData(userId: string, groupBy: string) {
    const allTrades = await db
      .select()
      .from(trades)
      .where(and(eq(trades.userId, userId), eq(trades.isOpen, false)));

    const groups: Record<string, any> = {};

    allTrades.forEach(t => {
      let key = "Unknown";
      if (groupBy === "setup") key = "No Setup"; // Setup tags are array, handled differently below if needed
      else if (groupBy === "symbol") key = t.symbol;
      else if (groupBy === "direction") key = t.direction;
      // ... etc

      if (!groups[key]) groups[key] = { name: key, trades: 0, wins: 0, pnl: 0 };
      groups[key].trades++;
      if ((t.netPnl ?? 0) > 0) groups[key].wins++;
      groups[key].pnl += Number(t.netPnl || 0);
    });

    return Object.values(groups).map(g => ({
      ...g,
      winRate: (g.wins / g.trades) * 100,
      netPnl: g.pnl,
    }));
  }

  async getMaeMfeData(userId: string) {
    const data = await db
      .select({
        mae: trades.maePercent,
        mfe: trades.mfePercent,
        netPnl: trades.netPnl,
        qty: trades.quantity,
      })
      .from(trades)
      .where(and(eq(trades.userId, userId), eq(trades.isOpen, false)))
      .limit(200);

    return data.map(d => ({
      mae: -(Number(d.mae || 0) / 100), // bps to percent
      mfe: Number(d.mfe || 0) / 100,
      qty: d.qty,
      isWin: (d.netPnl ?? 0) > 0,
    }));
  }

  private getEmptyStats() {
    return {
      tradeCount: 0, winCount: 0, lossCount: 0, breakEvenCount: 0,
      totalNetPnl: 0, winRate: 0, profitFactor: 0, avgWin: 0, avgLoss: 0,
      expectancy: 0, sharpeRatio: 0, maxDrawdown: 0,
      currentStreak: 0, longestWinStreak: 0, longestLossStreak: 0, avgRMultiple: 0
    };
  }

  async getEquityCurve(userId: string, days: number = 30) {
    const startDate = subDays(new Date(), days);
    const data = await db.select({
      date: trades.exitTime,
      netPnl: trades.netPnl,
    })
    .from(trades)
    .where(and(eq(trades.userId, userId), between(trades.exitTime, startDate, new Date())))
    .orderBy(trades.exitTime);

    let runningEquity = 0;
    const curve = data.map(d => {
      runningEquity += Number(d.netPnl || 0);
      return {
        date: d.date ? d.date.toISOString().split('T')[0] : 'N/A',
        equity: runningEquity,
      };
    });

    return curve;
  }
}
