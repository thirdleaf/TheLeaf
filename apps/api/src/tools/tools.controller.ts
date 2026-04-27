import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ToolsService } from "./tools.service";
import { ClerkGuard } from "../common/guards/clerk.guard";
import { AdminGuard } from "../common/guards/admin.guard";

@Controller("tools")
@UseGuards(ClerkGuard, AdminGuard)
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Get()
  findAll() {
    return this.toolsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.toolsService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.toolsService.create(data);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() data: any) {
    return this.toolsService.update(id, data);
  }
}
