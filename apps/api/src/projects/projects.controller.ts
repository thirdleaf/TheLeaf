import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  Query,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { ClerkGuard } from "../common/guards/clerk.guard";
import { AdminGuard } from "../common/guards/admin.guard";
import { Request } from "express";

@Controller("projects")
@UseGuards(ClerkGuard, AdminGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Req() req: Request, @Body() data: any) {
    return this.projectsService.create(req.clerkUserId!, data);
  }

  @Get()
  findAll(@Req() req: Request, @Query("status") status: string) {
    return this.projectsService.findAll(req.clerkUserId!, { status });
  }

  @Get(":id")
  findOne(@Param("id") id: string, @Req() req: Request) {
    return this.projectsService.findOne(id, req.clerkUserId!);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Req() req: Request, @Body() data: any) {
    return this.projectsService.update(id, req.clerkUserId!, data);
  }

  @Get(":id/milestones")
  getMilestones(@Param("id") id: string, @Req() req: Request) {
    return this.projectsService.getMilestones(id, req.clerkUserId!);
  }

  @Post(":id/milestones")
  addMilestone(@Param("id") id: string, @Req() req: Request, @Body() data: any) {
    return this.projectsService.addMilestone(id, req.clerkUserId!, data);
  }

  @Patch(":id/milestones/:milestoneId/complete")
  completeMilestone(
    @Param("id") id: string,
    @Param("milestoneId") milestoneId: string,
    @Req() req: Request,
  ) {
    return this.projectsService.completeMilestone(id, req.clerkUserId!, milestoneId);
  }

  @Get(":id/messages")
  getMessages(@Param("id") id: string, @Req() req: Request) {
    return this.projectsService.getMessages(id, req.clerkUserId!);
  }

  @Post(":id/messages")
  sendMessage(@Param("id") id: string, @Req() req: Request, @Body("content") content: string) {
    return this.projectsService.sendMessage(id, req.clerkUserId!, content);
  }
}
