import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Req,
} from "@nestjs/common";
import { CommunityService } from "./community.service";
import { ClerkGuard } from "../common/guards/clerk.guard";
import { Request } from "express";

@Controller("community")
@UseGuards(ClerkGuard)
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get("feed")
  getFeed() {
    return this.communityService.getFeed();
  }

  @Post("posts")
  createPost(@Req() req: Request, @Body() data: any) {
    return this.communityService.createPost(req.clerkUserId!, data);
  }

  @Post("posts/:id/reply")
  createReply(@Req() req: Request, @Param("id") id: string, @Body() data: any) {
    return this.communityService.createReply(req.clerkUserId!, id, data);
  }

  @Get("playbooks")
  getPlaybooks() {
    return this.communityService.getPlaybooks();
  }

  @Post("playbooks")
  createPlaybook(@Req() req: Request, @Body() data: any) {
    return this.communityService.createPlaybook(req.clerkUserId!, data);
  }

  @Get("leaderboard")
  getLeaderboard(@Query("period") period: string) {
    return this.communityService.getLeaderboard(period || "WEEKLY");
  }

  @Get("achievements")
  getAchievements(@Req() req: Request) {
    return this.communityService.getAchievements(req.clerkUserId!);
  }
}
