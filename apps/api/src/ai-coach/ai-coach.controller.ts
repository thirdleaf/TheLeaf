import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  Query,
} from "@nestjs/common";
import { AiCoachService } from "./ai-coach.service";
import { ClerkGuard } from "../common/guards/clerk.guard";
import { Request } from "express";
import { db } from "@thirdleaf/db";
import { aiCoachReports } from "@thirdleaf/db";
import { eq, desc } from "drizzle-orm";

@Controller("ai-coach")
@UseGuards(ClerkGuard)
export class AiCoachController {
  constructor(private readonly aiCoachService: AiCoachService) {}

  @Get("reports")
  getReports(@Req() req: Request) {
    return db
      .select()
      .from(aiCoachReports)
      .where(eq(aiCoachReports.userId, req.clerkUserId!))
      .orderBy(desc(aiCoachReports.createdAt));
  }

  @Post("trade-analysis/:tradeId")
  async analyzeTrade(@Param("tradeId") tradeId: string, @Req() req: Request) {
    // In a real implementation, we would gather trade/rule/notes/checkin data here
    // For now, mock the input for the service
    const mockData = {
      trade: { symbol: "BANKNIFTY", netPnl: -2500, direction: "LONG" },
      rules: [{ title: "Wait for 15m candle close", isActive: true }],
      notes: "Entered early because I saw price moving fast.",
      checkin: { mindsetScore: 3, stressLevel: 4 }
    };

    return this.aiCoachService.analyzeTrade(req.clerkUserId!, tradeId, mockData);
  }
}
