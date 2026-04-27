import { Module, MiddlewareConsumer, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { TradesModule } from "./trades/trades.module";
import { JournalModule } from "./journal/journal.module";
import { StrategiesModule } from "./strategies/strategies.module";
import { TagsModule } from "./tags/tags.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { TaxModule } from "./tax/tax.module";
import { UploadModule } from "./upload/upload.module";
import { PropModule } from "./prop/prop.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { ClientsModule } from "./clients/clients.module";
import { ProjectsModule } from "./projects/projects.module";
import { ClientPortalModule } from "./client-portal/client-portal.module";
import { ToolsModule } from "./tools/tools.module";
import { PsychologyModule } from "./psychology/psychology.module";
import { AiCoachModule } from "./ai-coach/ai-coach.module";
import { AdminModule } from "./admin/admin.module";
import { CommunityModule } from "./community/community.module";
import { GamificationModule } from "./gamification/gamification.module";
import { BillingModule } from "./billing/billing.module";
import { SyncModule } from "./sync/sync.module";
import { HealthModule } from "./health/health.module";
import { RateLimitMiddleware } from "./common/middleware/rate-limit.middleware";
import { APP_GUARD } from "@nestjs/core";
import { RateLimitGuard } from "./common/guards/rate-limit.guard";
import { BullModule } from "@nestjs/bullmq";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ["../../.env", ".env.local", ".env"],
    }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const upstashUrl = config.get<string>("UPSTASH_REDIS_URL");
        const redisHost = config.get<string>("REDIS_HOST");
        
        let host = redisHost || "localhost";
        let port = parseInt(config.get<string>("REDIS_PORT") || "6379", 10);
        
        if (!redisHost && upstashUrl) {
          try {
            const url = new URL(upstashUrl);
            host = url.hostname;
            port = parseInt(url.port) || 6379;
          } catch (err: any) {
            console.warn(`[BullMQ Config] Failed to parse UPSTASH_REDIS_URL: ${err.message}`);
          }
        }

        const isTls = (upstashUrl?.includes("upstash.io") || config.get<string>("REDIS_TLS") === "true");

        console.log(`[BullMQ Config] Connecting to Redis ${host}:${port} (TLS: ${isTls ? "Enabled" : "Disabled"})`);

        return {
          connection: {
            host,
            port,
            password: config.get<string>("UPSTASH_REDIS_TOKEN"),
            tls: isTls ? {} : undefined,
            maxRetriesPerRequest: null,
          },
        };
      },
    }),
    AuthModule,
    UsersModule,
    TradesModule,
    JournalModule,
    StrategiesModule,
    TagsModule,
    AnalyticsModule,
    TaxModule,
    UploadModule,
    PropModule,
    NotificationsModule,
    ClientsModule,
    ProjectsModule,
    ClientPortalModule,
    ToolsModule,
    PsychologyModule,
    AiCoachModule,
    AdminModule,
    CommunityModule,
    GamificationModule,
    BillingModule,
    SyncModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // Apply rate limiting to all routes
    consumer.apply(RateLimitMiddleware).forRoutes({
      path: "*",
      method: RequestMethod.ALL,
    });
  }
}
