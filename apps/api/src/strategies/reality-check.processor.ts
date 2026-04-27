import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { db, trades, journalEntries } from '@thirdleaf/db';
import { eq, and, sql } from 'drizzle-orm';

@Processor('reality-check')
export class RealityCheckProcessor extends WorkerHost {
  private readonly logger = new Logger(RealityCheckProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing reality check for job ${job.id}`);
    const { userId, tradeId } = job.data;

    // 1. Fetch trade and corresponding journal entry
    const [trade] = await db.select().from(trades).where(eq(trades.id, tradeId)).limit(1);
    
    if (!trade) {
      this.logger.warn(`Trade ${tradeId} not found, skipping reality check.`);
      return;
    }

    // 2. Cross-reference with journal entry for the same date
    const tradeDate = trade.entryTime?.toISOString().split('T')[0];
    if (!tradeDate) return;

    const [journal] = await db.select().from(journalEntries)
      .where(and(eq(journalEntries.userId, userId), eq(journalEntries.date, tradeDate)))
      .limit(1);

    if (!journal) {
      this.logger.log(`No journal entry found for date ${tradeDate}.`);
      return;
    }

    // 3. Logic: Check if trade PnL matches the "vibe" of the journal
    const netPnl = Number(trade.netPnl || 0);
    const dayScore = journal.dayScore || 5;

    if (netPnl > 0 && dayScore < 4) {
      this.logger.log(`Reality Check: Trader had a green day ($${netPnl}) but marked low day score (${dayScore}). Potential emotional hurdle or process failure despite profit.`);
    } else if (netPnl < 0 && dayScore > 7) {
      this.logger.log(`Reality Check: Trader had a red day ($${netPnl}) but marked high day score (${dayScore}). Positive reinforcement of process despite loss.`);
    }

    return { analyzed: true };
  }
}
