import { Injectable, Logger } from "@nestjs/common";
import { CommunityRepository } from "../community/repository/community.repository";

@Injectable()
export class AchievementService {
  private readonly logger = new Logger(AchievementService.name);

  constructor(private readonly communityRepository: CommunityRepository) {}

  async checkAndAward(userId: string, eventType: string, metadata: any) {
    this.logger.log(`Checking achievement for user ${userId} on event ${eventType}`);
    
    // Achievement Logic Map
    switch (eventType) {
      case "trade:created":
        await this.handleTradeCreated(userId, metadata);
        break;
      case "journal:created":
        await this.handleJournalCreated(userId);
        break;
      case "playbook:published":
        await this.handlePlaybookPublished(userId);
        break;
    }
  }

  private async handleTradeCreated(userId: string, metadata: any) {
    if (metadata.totalCount === 1) {
      await this.communityRepository.createAchievement({
        userId,
        type: "FIRST_TRADE",
        title: "First Step",
        description: "You logged your very first trade on TradeForge!",
      });
    } else if (metadata.totalCount === 50) {
      await this.communityRepository.createAchievement({
        userId,
        type: "ACTIVE_TRADER",
        title: "Active Trader",
        description: "50 trades logged. Consistency is building.",
      });
    }
  }

  private async handleJournalCreated(userId: string) {
    await this.communityRepository.createAchievement({
      userId,
      type: "JOURNAL_HABIT",
      title: "Journal Habit",
      description: "You've successfully built a 7-day journaling streak.",
    });
  }

  private async handlePlaybookPublished(userId: string) {
    await this.communityRepository.createAchievement({
      userId,
      type: "KNOWLEDGE_SHARER",
      title: "Knowledge Sharer",
      description: "You published your first playbook to the community library.",
    });
  }
}
