import { Module } from "@nestjs/common";
import { PropController } from "./prop.controller";
import { PropService } from "./prop.service";
import { PropRepository } from "./repository/prop.repository";

@Module({
  controllers: [PropController],
  providers: [PropService, PropRepository],
  exports: [PropService],
})
export class PropModule {}
