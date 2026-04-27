import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { ClientPortalService } from "./client-portal.service";
import { ClientPortalGuard } from "../common/guards/client-portal.guard";
import { ModerationService } from "../common/security/moderation.service";
import { Request } from "express";
import { db } from "@thirdleaf/db";
import { projects, projectMessages, invoices } from "@thirdleaf/db";
import { eq, and, desc } from "drizzle-orm";

@Controller("client-portal")
@UseGuards(ClientPortalGuard)
export class ClientPortalController {
  constructor(
    private readonly clientPortalService: ClientPortalService,
    private readonly moderationService: ModerationService
  ) {}

  @Post("auth/login")
  @UseGuards() // Explicitly remove guard for this method only
  login(@Body("email") email: string) {
    return this.clientPortalService.sendOtp(email);
  }

  @Post("auth/verify")
  @UseGuards() // Explicitly remove guard for this method only
  verify(@Body("email") email: string, @Body("otp") otp: string) {
    return this.clientPortalService.verifyOtp(email, otp);
  }

  @Get("projects")
  async getProjects(@Req() req: Request) {
    const clientId = (req as any).clientId;
    return db.select().from(projects).where(eq(projects.clientId, clientId)).orderBy(desc(projects.createdAt));
  }

  @Get("projects/:id")
  async getProject(@Param("id") id: string, @Req() req: Request) {
    const clientId = (req as any).clientId;
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.clientId, clientId)))
      .limit(1);
    
    if (project) {
      // Remove internal notes for clients
      delete (project as any).internalNotes;
    }
    
    return project;
  }

  @Get("projects/:id/messages")
  async getMessages(@Param("id") id: string, @Req() req: Request) {
    const clientId = (req as any).clientId;
    // Verify access
    const [project] = await db.select().from(projects).where(and(eq(projects.id, id), eq(projects.clientId, clientId))).limit(1);
    if (!project) return [];

    return db.select().from(projectMessages).where(eq(projectMessages.projectId, id)).orderBy(projectMessages.createdAt);
  }

  @Post("projects/:id/messages")
  async sendMessage(
    @Param("id") id: string,
    @Req() req: Request,
    @Body("content") content: string
  ) {
    const clientId = (req as any).clientId;
    // Verify access
    const [project] = await db.select().from(projects).where(and(eq(projects.id, id), eq(projects.clientId, clientId))).limit(1);
    if (!project) throw new UnauthorizedException();

    const [message] = await db.insert(projectMessages).values({
      projectId: id,
      senderId: clientId,
      senderType: "CLIENT",
      content: this.moderationService.sanitizeAndValidate(content) as any,
    }).returning();
    
    return message;
  }

  @Get("invoices")
  async getInvoices(@Req() req: Request) {
    const clientId = (req as any).clientId;
    return db.select().from(invoices).where(eq(invoices.clientId, clientId)).orderBy(desc(invoices.createdAt));
  }

  @Post("projects/:id/deliverables/:index/download")
  async trackDownload(
    @Param("id") id: string,
    @Param("index") index: number,
    @Req() req: Request
  ) {
    const clientId = (req as any).clientId;
    
    // 1. Fetch project with strict ownership
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.clientId, clientId)))
      .limit(1);
    
    if (!project) throw new NotFoundException("Project not found");

    // 2. Locate deliverable and update downloadedAt
    const deliverables = (project.deliverables as any) || { files: [] };
    if (!deliverables.files || !deliverables.files[index]) {
      throw new BadRequestException("Deliverable not found at specified index");
    }

    deliverables.files[index].downloadedAt = new Date();

    // 3. Persist update
    await db.update(projects).set({ deliverables }).where(eq(projects.id, id));

    return { 
      success: true, 
      downloadUrl: deliverables.files[index].url,
      message: "Download tracked"
    };
  }
}
