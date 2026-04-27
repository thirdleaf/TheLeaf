import { Controller, Get, Res, HttpStatus } from "@nestjs/common";
import { HealthService } from "./health.service";
import { Response } from "express";

@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async check(@Res() res: Response) {
    const status = await this.healthService.checkAll();
    
    // Determine overall HTTP status based on service degradation
    const httpStatus = status.status === "ok" ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
    
    return res.status(httpStatus).json(status);
  }
}
