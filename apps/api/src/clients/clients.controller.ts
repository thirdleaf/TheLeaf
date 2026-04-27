import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { ClerkGuard } from "../common/guards/clerk.guard";
import { AdminGuard } from "../common/guards/admin.guard";
import { Request } from "express";

@Controller("clients")
@UseGuards(ClerkGuard, AdminGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Req() req: Request, @Body() data: any) {
    return this.clientsService.create(req.clerkUserId!, data);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.clientsService.findAll(req.clerkUserId!);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @Req() req: Request) {
    return this.clientsService.findOne(id, req.clerkUserId!);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Req() req: Request, @Body() data: any) {
    return this.clientsService.update(id, req.clerkUserId!, data);
  }
}
