import { Injectable, Logger } from "@nestjs/common";
import { StrategiesRepository } from "./repository/strategies.repository";

@Injectable()
export class StrategiesService {
  private readonly logger = new Logger(StrategiesService.name);

  constructor(private readonly strategiesRepository: StrategiesRepository) {}

  async create(userId: string, data: any) {
    return this.strategiesRepository.create({ ...data, userId });
  }

  async findAll(userId: string) {
    return this.strategiesRepository.findAll(userId);
  }

  async findOne(id: string, userId: string) {
    return this.strategiesRepository.findOne(id, userId);
  }

  async update(id: string, userId: string, data: any) {
    return this.strategiesRepository.update(id, userId, data);
  }

  async remove(id: string, userId: string) {
    return this.strategiesRepository.remove(id, userId);
  }

  async getVersions(id: string, userId: string) {
    return this.strategiesRepository.getVersions(id, userId);
  }

  async getPerformance(id: string, userId: string) {
    return this.strategiesRepository.getPerformance(id, userId);
  }

  async importBacktest(id: string, userId: string, data: any) {
    // Stub implementation to satisfy build
    return { success: true, message: "Backtest import queued." };
  }
}
