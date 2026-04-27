import { Injectable, Logger } from "@nestjs/common";
import OpenAI from "openai";
import { db } from "@thirdleaf/db";
import { aiCoachReports } from "@thirdleaf/db";
import { eq } from "drizzle-orm";

@Injectable()
export class AiCoachService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(AiCoachService.name);

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env["OPENAI_API_KEY"],
    });
  }

  async generateWeeklyReport(userId: string, data: any) {
    const prompt = `
      Week: ${data.weekStart} to ${data.weekEnd}
      P&L: ₹${data.pnl / 100} (win rate ${data.winRate}%, ${data.tradeCount} trades)
      Best performing setup: ${data.bestSetup}
      Worst performing setup: ${data.worstSetup}
      Most frequent emotion at entry: ${data.primaryEmotion}
      Average sleep quality: ${data.avgSleep}/5
      Rule breaks this week: ${data.ruleBreaks?.join(", ") ?? "None"}
      Most expensive mistake: ${data.worstMistake}
      Journal entries summary: ${data.journalSummary}
      
      Provide coaching in 4 sections:
      1. Three specific observations about this trader's week
      2. The single most impactful improvement for next week (be specific)
      3. One habit to continue (positive reinforcement)
      4. One warning pattern to watch for
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional trading performance coach. Analyze this trader's data and provide specific, actionable coaching. Do NOT provide investment advice or trade signals. Focus only on behavioral patterns, discipline, and process improvement.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const aiResponse = response.choices[0]?.message.content ?? "Analysis failed";

    // Save to DB
    const [report] = await db.insert(aiCoachReports).values({
      userId,
      weekStart: data.weekStart,
      weekEnd: data.weekEnd,
      reportData: data,
      aiResponse,
    }).returning();

    return report;
  }

  async analyzeTrade(userId: string, tradeId: string, tradeData: any) {
    const prompt = `
      Analyze this trade relative to the trader's rules and their mental state that day.
      Trade: ${JSON.stringify(tradeData.trade)}
      Rules: ${JSON.stringify(tradeData.rules)}
      Notes: ${tradeData.notes}
      Mental State: ${JSON.stringify(tradeData.checkin)}
      
      Was this a process trade or a results trade?
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional trading performance coach. Analyze this specific trade. Do NOT provide investment advice or predict price. Focus on process compliance and psychological state.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
    });

    return {
      analysis: response.choices[0]?.message.content ?? "Analysis failed",
    };
  }
}
