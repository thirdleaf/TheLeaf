import { Module } from '@nestjs/common';
import { StrategiesController } from './strategies.controller';
import { StrategiesService } from './strategies.service';
import { StrategiesRepository } from './repository/strategies.repository';

@Module({
  controllers: [StrategiesController],
  providers: [StrategiesService, StrategiesRepository],
  exports: [StrategiesService],
})
export class StrategiesModule {}
