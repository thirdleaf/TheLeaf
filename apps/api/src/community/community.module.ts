import { Module } from "@nestjs/common";
import { CommunityController } from "./community.controller";
import { CommunityService } from "./community.service";
import { CommunityRepository } from "./repository/community.repository";
import { ModerationService } from "../common/security/moderation.service";

@Module({
  controllers: [CommunityController],
  providers: [CommunityService, CommunityRepository, ModerationService],
  exports: [CommunityService, CommunityRepository],
})
export class CommunityModule {}
