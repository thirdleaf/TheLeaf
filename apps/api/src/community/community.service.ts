import { Injectable, BadRequestException } from "@nestjs/common";
import { CommunityRepository } from "./repository/community.repository";
import { ModerationService } from "../common/security/moderation.service";

@Injectable()
export class CommunityService {
  constructor(
    private readonly communityRepository: CommunityRepository,
    private readonly moderationService: ModerationService
  ) {}

  async getFeed() {
    return this.communityRepository.findPosts();
  }

  async createPost(userId: string, data: any) {
    const sanitizedContent = this.moderationService.sanitizeAndValidate(data.content);
    const sanitizedTitle = this.moderationService.sanitizeAndValidate(data.title);
    
    const postData = {
      ...data,
      userId,
      content: sanitizedContent,
      title: sanitizedTitle,
      anonymousAlias: data.isAnonymous ? this.moderationService.generateAnonymousAlias() : null,
    };

    return this.communityRepository.createPost(postData);
  }

  async createReply(userId: string, postId: string, data: any) {
    const sanitizedContent = this.moderationService.sanitizeAndValidate(data.content);
    
    return this.communityRepository.createReply({
      postId,
      userId,
      content: sanitizedContent,
      isAnonymous: data.isAnonymous,
      anonymousAlias: data.isAnonymous ? this.moderationService.generateAnonymousAlias() : null,
    });
  }

  async getPlaybooks() {
    return this.communityRepository.findPlaybooks();
  }

  async createPlaybook(userId: string, data: any) {
    const sanitizedContent = this.moderationService.sanitizeAndValidate(data.content);
    
    // Mandatory disclaimer check
    if (!data.disclaimer || data.disclaimer.length < 50) {
      throw new BadRequestException("Mandatory disclosure/disclaimer is missing or too short.");
    }

    const playbookData = {
      ...data,
      userId,
      content: sanitizedContent,
    };

    return this.communityRepository.createPlaybook(playbookData);
  }

  async getLeaderboard(period: string) {
    return this.communityRepository.getLeaderboard(period);
  }

  async getAchievements(userId: string) {
    return this.communityRepository.findAchievements(userId);
  }
}
