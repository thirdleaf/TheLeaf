import { Injectable } from "@nestjs/common";
import { db } from "@thirdleaf/db";
import { propAccounts, propTrades } from "@thirdleaf/db";
import { eq, desc } from "drizzle-orm";

@Injectable()
export class PropRepository {
  /**
   * TODO: The propAccounts table schema is missing a userId column.
   * This needs a migration to support multi-user prop firm tracking.
   * For now, returning all accounts to satisfy build.
   */
  async getAccounts(_userId: string) {
    return db.select().from(propAccounts);
  }

  async createAccount(data: any) {
    const [account] = await db.insert(propAccounts).values(data).returning();
    return account;
  }

  async findAccountById(id: string) {
    const [account] = await db.select().from(propAccounts).where(eq(propAccounts.id, id)).limit(1);
    return account;
  }

  async createTrade(data: any) {
    const [trade] = await db.insert(propTrades).values(data).returning();
    return trade;
  }

  async getTrades(accountId: string) {
    return db.select().from(propTrades).where(eq(propTrades.accountId, accountId)).orderBy(desc(propTrades.createdAt));
  }

  async getPropAnalytics(accountId: string) {
    return db.select().from(propTrades).where(eq(propTrades.accountId, accountId));
  }
}
