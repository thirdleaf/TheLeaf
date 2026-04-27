import { Injectable } from "@nestjs/common";
import { db } from "@thirdleaf/db";
import { users, trades, auditLogs, announcements } from "@thirdleaf/db";
import { eq, desc, count, sql } from "drizzle-orm";

@Injectable()
export class AdminRepository {
  async getUsers() {
    return db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        plan: users.plan,
        isSuspended: users.isSuspended,
        createdAt: users.createdAt,
        tradeCount: count(trades.id),
      })
      .from(users)
      .leftJoin(trades, eq(trades.userId, users.id))
      .groupBy(users.id)
      .orderBy(desc(users.createdAt));
  }

  async getUserById(id: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user;
  }

  async updateUserPlan(id: string, plan: any) {
    const [user] = await db
      .update(users)
      .set({ plan })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async suspendUser(id: string, isSuspended: boolean) {
    const [user] = await db
      .update(users)
      .set({ isSuspended })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getRevenueStats() {
    return db.execute(sql`
      SELECT 
        plan, 
        COUNT(*) as "userCount",
        CASE 
          WHEN plan = 'solo' THEN COUNT(*) * 0
          WHEN plan = 'quant_builder' THEN COUNT(*) * 2900
          WHEN plan = 'prop_mentor' THEN COUNT(*) * 9900
          ELSE 0
        END as "estimatedMrr"
      FROM users
      GROUP BY plan
    `);
  }

  async logAudit(data: any) {
    await db.insert(auditLogs).values(data);
  }

  async getAuditLogs() {
    return db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(100);
  }

  async createAnnouncement(data: any) {
    const [announcement] = await db.insert(announcements).values(data).returning();
    return announcement;
  }

  async getActiveAnnouncements() {
    return db
      .select()
      .from(announcements)
      .where(eq(announcements.isActive, true))
      .orderBy(desc(announcements.createdAt));
  }
}
