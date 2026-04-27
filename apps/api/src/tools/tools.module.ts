import { Module } from "@nestjs/common";
import { ToolsController } from "./tools.controller";
import { ToolsService } from "./tools.service";
import { ToolsRepository } from "./tools.repository";

@Module({
  controllers: [ToolsController],
  providers: [ToolsService, ToolsRepository],
})
export class ToolsModule {}
