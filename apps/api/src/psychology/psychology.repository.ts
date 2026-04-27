import { Injectable, Logger } from "@nestjs/common";
import { db } from "@thirdleaf/db";
import { dailyCheckins, tradingRules, ruleBreaks } from "@thirdleaf/db";
import { eq, and, between, desc, sql } from "drizzle-orm";

@Injectable()
export class PsychologyRepository {
  async saveCheckin(data: any) {
    await db.execute(sql`
      INSERT INTO daily_checkins (user_id, date, mood_score, sleep_quality, stress_level, entry_energy, focus_level)
      VALUES (
        ${data.userId}, 
        ${data.date}, 
        ${data.moodScore ?? 5}, 
        ${data.sleepQuality ?? 5}, 
        ${data.stressLevel ?? 5}, 
        ${data.entryEnergy ?? 5}, 
        ${data.focusLevel ?? 5}
      )
      ON CONFLICT (user_id, date) DO UPDATE SET
        mood_score = EXCLUDED.mood_score,
        sleep_quality = EXCLUDED.sleep_quality,
        stress_level = EXCLUDED.stress_level,
        updated_at = NOW()
    `);
    
    return this.getTodayCheckin(data.userId, data.date);
  }

  async getCheckins(userId: string, dateFrom: string, dateTo: string) {
    return db.execute(sql`
      SELECT * FROM daily_checkins 
      WHERE user_id = ${userId} AND date BETWEEN ${dateFrom} AND ${dateTo}
      ORDER BY date DESC
    `);
  }

  async getTodayCheckin(userId: string, dateStr: string) {
    const res = await db.execute(sql`
      SELECT * FROM daily_checkins 
      WHERE user_id = ${userId} AND date = ${dateStr}
      LIMIT 1
    `);
    return res.rows[0] || null;
  }

  async getRules(userId: string) {
    return db.execute(sql`
      SELECT * FROM trading_rules WHERE user_id = ${userId} ORDER BY created_at DESC
    `);
  }

  async createRule(data: any) {
    const res = await db.execute(sql`
      INSERT INTO trading_rules (user_id, name, description, category, tags)
      VALUES (${data.userId}, ${data.name}, ${data.description}, ${data.category}, ${sql`${data.tags || []}::uuid[]`})
      RETURNING *
    `);
    return res.rows[0];
  }

  async logRuleBreak(data: any) {
    const res = await db.execute(sql`
      INSERT INTO rule_breaks (rule_id, user_id, trade_id, date, reason, cost)
      VALUES (${data.ruleId}, ${data.userId}, ${data.tradeId || null}, ${data.date}, ${data.reason}, ${data.cost || 0})
      RETURNING *
    `);
    
    await db.execute(sql`
      UPDATE trading_rules 
      SET break_count = break_count + 1, last_broken_at = NOW() 
      WHERE id = ${data.ruleId}
    `);
      
    return res.rows[0];
  }

  async getRuleBreaks(ruleId: string) {
    return db.execute(sql`
      SELECT * FROM rule_breaks WHERE rule_id = ${ruleId} ORDER BY created_at DESC
    `);
  }

  async getSleepVsWinRate(userId: string) {
    return db.execute(sql`
      SELECT 
        dc.sleep_quality as "sleepQuality",
        COUNT(t.id) as "tradeCount",
        AVG(CASE WHEN t.net_pnl > 0 THEN 100 ELSE 0 END)::int as "avgWinRate"
      FROM daily_checkins dc
      JOIN trades t ON t.user_id = dc.user_id AND t.entry_time::date = dc.date
      WHERE dc.user_id = ${userId}
      GROUP BY dc.sleep_quality
      ORDER BY dc.sleep_quality ASC
    `);
  }

  async getStressVsPnl(userId: string) {
    return db.execute(sql`
      SELECT 
        dc.stress_level as "stressLevel",
        AVG(t.net_pnl)::bigint as "avgPnl",
        AVG(CASE WHEN t.net_pnl > 0 THEN 100 ELSE 0 END)::int as "avgWinRate"
      FROM daily_checkins dc
      JOIN trades t ON t.user_id = dc.user_id AND t.entry_time::date = dc.date
      WHERE dc.user_id = ${userId}
      GROUP BY dc.stress_level
      ORDER BY dc.stress_level ASC
    `);
  }

  async getEmotionVsPnl(userId: string) {
    return db.execute(sql`
      SELECT 
        et.name as "emotion",
        AVG(t.net_pnl)::bigint as "avgPnl",
        SUM(t.net_pnl)::bigint as "totalPnl",
        COUNT(t.id) as "tradeCount"
      FROM trades t
      JOIN emotion_tags et ON t.emotion_at_entry = et.id
      WHERE t.user_id = ${userId}
      GROUP BY et.name
      ORDER BY AVG(t.net_pnl) DESC
    `);
  }

  async getMoodVsPnl(userId: string) {
    return db.execute(sql`
      SELECT 
        dc.mood_score as "moodScore",
        t.net_pnl as "netPnl"
      FROM daily_checkins dc
      JOIN trades t ON t.user_id = dc.user_id AND t.entry_time::date = dc.date
      WHERE dc.user_id = ${userId}
    `);
  }
}
