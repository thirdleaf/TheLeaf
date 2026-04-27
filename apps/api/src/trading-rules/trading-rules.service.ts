import { Injectable, Logger } from "@nestjs/common";
import { db } from "@thirdleaf/db";
import { tradingRules, ruleBreaks } from "@thirdleaf/db";
import { eq, and, desc } from "drizzle-orm";

@Injectable()
export class TradingRulesService {
  private readonly logger = new Logger(TradingRulesService.name);

  async getRules(userId: string) {
    return db.select().from(tradingRules).where(eq(tradingRules.userId, userId)).orderBy(desc(tradingRules.createdAt));
  }

  async createRule(userId: string, data: any) {
    const [rule] = await db.insert(tradingRules).values({ ...data, userId } as any).returning();
    return rule;
  }

  async logRuleBreak(userId: string, data: any) {
    return db.insert(ruleBreaks).values({
      ...data,
      userId,
      date: data.date || new Date().toISOString().split('T')[0],
    } as any).returning();
  }

  async getRuleBreaks(userId: string, ruleId?: string) {
    const filters = [eq(ruleBreaks.userId, userId)];
    if (ruleId) filters.push(eq(ruleBreaks.ruleId, ruleId));
    return db.select().from(ruleBreaks).where(and(...filters)).orderBy(desc(ruleBreaks.date));
  }
}
