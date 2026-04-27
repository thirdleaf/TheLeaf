import { Module } from "@nestjs/common";
import { ClientPortalController } from "./client-portal.controller";
import { ClientPortalService } from "./client-portal.service";
import { RedisService } from "../common/redis/redis.service";
import { ModerationModule } from "../common/security/moderation.module";

@Module({
  imports: [ModerationModule],
  controllers: [ClientPortalController],
  providers: [ClientPortalService, RedisService],
})
export class ClientPortalModule {}
