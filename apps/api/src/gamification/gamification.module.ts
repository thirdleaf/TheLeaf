import { Module } from "@nestjs/common";
import { DisciplineService } from "./discipline.service";
import { AchievementService } from "./achievement.service";
import { CommunityModule } from "../community/community.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [CommunityModule, UsersModule],
  providers: [DisciplineService, AchievementService],
  exports: [DisciplineService, AchievementService],
})
export class GamificationModule {}
