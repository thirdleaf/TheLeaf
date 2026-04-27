import { Injectable } from "@nestjs/common";
import { db } from "@thirdleaf/db";
import { trades, tradeLegs, NewTrade } from "@thirdleaf/db";
import { eq, and, desc, asc, lte, gte, sql } from "drizzle-orm";
import { getUserOwnedRecord } from "../common/utils/db.util";

@Injectable()
export class TradesRepository {
  async create(tradeData: NewTrade) {
    const [created] = await db.insert(trades).values(tradeData).returning();
    return created;
  }

  async bulkCreate(tradeData: NewTrade[]) {
    return db.insert(trades).values(tradeData).returning();
  }

  async findMany(
    userId: string,
    filters: any,
    sortField: string,
    sortDir: "asc" | "desc",
    limit: number,
    cursorId?: string
  ) {
    const conditions = [eq(trades.userId, userId), sql`${trades.deletedAt} IS NULL`];

    if (filters.symbol) conditions.push(eq(trades.symbol, filters.symbol));
    if (filters.exchange) conditions.push(eq(trades.exchange, filters.exchange));
    if (filters.direction) conditions.push(eq(trades.direction, filters.direction));
    if (filters.strategyId) conditions.push(eq(trades.strategyId, filters.strategyId));
    if (filters.isOpen !== undefined) conditions.push(eq(trades.isOpen, filters.isOpen));

    if (filters.minPnl) conditions.push(gte(trades.netPnl, filters.minPnl));
    if (filters.maxPnl) conditions.push(lte(trades.netPnl, filters.maxPnl));
    
    if (filters.dateFrom) conditions.push(gte(trades.entryTime, new Date(filters.dateFrom)));
    if (filters.dateTo) conditions.push(lte(trades.entryTime, new Date(filters.dateTo)));

    if (cursorId) {
      const cmp = sortDir === "asc" ? sql`> ${cursorId}` : sql`< ${cursorId}`;
      conditions.push(sql`${trades.id} ${cmp}`);
    }

    const sortFn = sortDir === "asc" ? asc : desc;
    let orderCol: any = trades.entryTime;
    if (sortField === "pnl") orderCol = trades.netPnl;
    if (sortField === "holdDuration") orderCol = trades.holdDurationSeconds;
    if (sortField === "rMultipleActual") orderCol = trades.rMultipleActual;

    return db
      .select()
      .from(trades)
      .where(and(...conditions))
      .orderBy(sortFn(orderCol))
      .limit(limit);
  }

  async findOne(id: string, userId: string) {
    const [base] = await db
      .select()
      .from(trades)
      .where(and(eq(trades.id, id), eq(trades.userId, userId), sql`${trades.deletedAt} IS NULL`));
    
    if (!base) return null;

    const legs = await db.select().from(tradeLegs).where(eq(tradeLegs.tradeId, id));
    return { ...base, legs };
  }

  async update(id: string, userId: string, updateData: Partial<NewTrade>) {
    // Update
    const [updated] = await db
      .update(trades)
      .set({ ...updateData, updatedAt: new Date() })
      .where(and(eq(trades.id, id), eq(trades.userId, userId), sql`${trades.deletedAt} IS NULL`))
      .returning();
      
    return updated;
  }

  async delete(id: string, userId: string) {
    // Soft delete
    await db
      .update(trades)
      .set({ deletedAt: new Date() })
      .where(and(eq(trades.id, id), eq(trades.userId, userId)));
    return true;
  }
}
