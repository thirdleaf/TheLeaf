import { Injectable, Logger } from "@nestjs/common";
import { db } from "@thirdleaf/db";
import { trades } from "@thirdleaf/db";
import { eq, and, between } from "drizzle-orm";
import { getFYDateRange, categorizeTrade, TaxCategory, TradeForTax } from "./tax-rules";

@Injectable()
export class TaxService {
  private readonly logger = new Logger(TaxService.name);

  async getYearlyTaxSummary(userId: string, fy: string) {
    const { start, end } = getFYDateRange(fy);
    
    // Fetch all closed trades for this user in the FY
    const closedTrades = await db
      .select()
      .from(trades)
      .where(
        and(
          eq(trades.userId, userId),
          between(trades.exitTime, start, end)
        )
      );

    const summary: Record<TaxCategory, { turnover: number; pnl: number; count: number }> = {
      INTRADAY_EQUITY: { turnover: 0, pnl: 0, count: 0 },
      STCG_EQUITY: { turnover: 0, pnl: 0, count: 0 },
      LTCG_EQUITY: { turnover: 0, pnl: 0, count: 0 },
      FO_BUSINESS: { turnover: 0, pnl: 0, count: 0 },
      SPECULATIVE: { turnover: 0, pnl: 0, count: 0 },
    };

    for (const trade of closedTrades) {
      if (!trade.exitTime) continue; 

      const normalizedTrade: TradeForTax = {
        id: trade.id,
        symbol: trade.symbol,
        instrumentType: trade.instrumentType || "EQ",
        entryTime: trade.entryTime,
        exitTime: trade.exitTime,
        quantity: trade.quantity,
        entryPrice: trade.entryPrice,
        exitPrice: trade.exitPrice || trade.entryPrice,
        grossPnl: trade.grossPnl || 0, // Strict fallback
        isIntraday: (trade as any).isIntraday ?? (trade.instrumentType === 'EQ' && (trade.exitTime.getTime() - trade.entryTime.getTime()) < 24 * 3600 * 1000),
      };

      const category = categorizeTrade(normalizedTrade);
      const turnover = (trade.entryPrice + (trade.exitPrice || trade.entryPrice)) * trade.quantity;

      summary[category].turnover += turnover;
      summary[category].pnl += trade.netPnl || 0;
      summary[category].count += 1;
    }

    return {
      fy,
      period: { start, end },
      summary,
    };
  }
}
