import { Injectable, NotFoundException } from "@nestjs/common";
import { db, journalEntries, ruleBreaks, dailySnapshots } from "@thirdleaf/db";
import { eq, and, sql, desc, count, avg } from "drizzle-orm";
import { UsersService } from "../users/users.service";

@Injectable()
export class DisciplineService {
  constructor(private readonly usersService: UsersService) {}

  async calculateDisciplineScore(clerkId: string) {
    const user = await this.usersService.findByClerkId(clerkId);
    if (!user) throw new NotFoundException("User not found");

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const dateStr = lastWeek.toISOString().split('T')[0];

    // 1. Get rule breaks in last 7 days
    const recentBreaks = await db
      .select({ count: count() })
      .from(ruleBreaks)
      .where(
        and(
          eq(ruleBreaks.userId, user.id), 
          sql`${ruleBreaks.date} >= ${dateStr}`
        )
      );

    // 2. Get average plan compliance from journal
    const avgCompliance = await db
      .select({ avg: avg(journalEntries.planCompliance) })
      .from(journalEntries)
      .where(
        and(
          eq(journalEntries.userId, user.id),
          sql`${journalEntries.date} >= ${dateStr}`
        )
      );

    const breakCount = Number(recentBreaks[0]?.count || 0);
    const compliance = Number(avgCompliance[0]?.avg || 80);

    // Score = Compliance - (Breaks * 5)
    const score = Math.max(0, Math.min(100, compliance - (breakCount * 5)));

    return {
      score,
      breakCount,
      avgCompliance: compliance,
    };
  }
}
