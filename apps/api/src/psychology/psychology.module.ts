import { Module } from "@nestjs/common";
import { PsychologyController } from "./psychology.controller";
import { PsychologyService } from "./psychology.service";
import { PsychologyRepository } from "./psychology.repository";

@Module({
  controllers: [PsychologyController],
  providers: [PsychologyService, PsychologyRepository],
  exports: [PsychologyService],
})
export class PsychologyModule {}
