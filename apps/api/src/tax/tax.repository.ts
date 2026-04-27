import { Injectable } from "@nestjs/common";
import { db } from "@thirdleaf/db";
import { trades, taxClassifications } from "@thirdleaf/db";
import { eq, and, gte, lte } from "drizzle-orm";

@Injectable()
export class TaxRepository {
  async getTradesForFY(userId: string, startDate: Date, endDate: Date) {
    return db
      .select()
      .from(trades)
      .where(
        and(
          eq(trades.userId, userId),
          gte(trades.entryTime, startDate),
          lte(trades.entryTime, endDate)
        )
      );
  }

  async clearClassificationsForFY(userId: string, fy: string) {
    return db
      .delete(taxClassifications)
      .where(and(eq(taxClassifications.userId, userId), eq(taxClassifications.fy, fy)));
  }

  async saveClassifications(data: any[]) {
    if (data.length === 0) return;
    return db.insert(taxClassifications).values(data);
  }

  async getSummaryForFY(userId: string, fy: string) {
    return db
      .select()
      .from(taxClassifications)
      .where(and(eq(taxClassifications.userId, userId), eq(taxClassifications.fy, fy)));
  }
}
