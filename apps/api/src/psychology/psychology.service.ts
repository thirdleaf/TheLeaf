import { Injectable, Logger } from "@nestjs/common";
import { PsychologyRepository } from "./psychology.repository";

@Injectable()
export class PsychologyService {
  private readonly logger = new Logger(PsychologyService.name);

  constructor(private readonly psychologyRepository: PsychologyRepository) {}

  async saveCheckin(userId: string, data: any) {
    return this.psychologyRepository.saveCheckin({
      ...data,
      userId,
      date: data.date || new Date().toISOString().split("T")[0]!,
    });
  }

  async getCheckins(userId: string, dateFrom: string, dateTo: string) {
    return this.psychologyRepository.getCheckins(userId, dateFrom, dateTo);
  }

  async getDailyInsights(userId: string) {
    const today = new Date().toISOString().split("T")[0]!;
    const checkin = await this.psychologyRepository.getTodayCheckin(userId, today);
    
    if (!checkin) {
      return { hasCheckin: false, message: "Don't forget to log your mindset today!" };
    }

    const [sleepData, stressData] = await Promise.all([
      this.psychologyRepository.getSleepVsWinRate(userId),
      this.psychologyRepository.getStressVsPnl(userId),
    ]);

    const insights: string[] = [];
    const sleepRows = (sleepData as any).rows || [];
    const goodSleep = sleepRows.find((r: any) => r.sleepQuality >= 4);
    const badSleep = sleepRows.find((r: any) => r.sleepQuality < 4);

    if (goodSleep && badSleep) {
      insights.push(`When you sleep 4+ hours, your win rate is ${goodSleep.avgWinRate}% vs ${badSleep.avgWinRate}% on poor sleep days.`);
    }

    return {
      hasCheckin: true,
      checkin,
      insights,
    };
  }

  async getRules(userId: string) {
    return this.psychologyRepository.getRules(userId);
  }

  async createRule(userId: string, data: any) {
    return this.psychologyRepository.createRule({
      ...data,
      userId,
    });
  }

  async logRuleBreak(userId: string, data: any) {
    return this.psychologyRepository.logRuleBreak({
      ...data,
      userId,
      date: data.date || new Date().toISOString().split("T")[0]!,
    });
  }

  async getCorrelations(userId: string) {
    const [sleep, stress, emotion] = await Promise.all([
      this.psychologyRepository.getSleepVsWinRate(userId),
      this.psychologyRepository.getStressVsPnl(userId),
      this.psychologyRepository.getEmotionVsPnl(userId),
    ]);
    return {
      sleepCorrelation: sleep,
      stressCorrelation: stress,
      emotionCorrelation: emotion,
    };
  }

  async getMoodPnL(userId: string) {
    const res = await this.psychologyRepository.getMoodVsPnl(userId);
    return { success: true, data: res.rows };
  }
}
