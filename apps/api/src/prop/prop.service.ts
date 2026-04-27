import { Injectable } from "@nestjs/common";
import { PropRepository } from "./repository/prop.repository";

@Injectable()
export class PropService {
  constructor(private readonly propRepository: PropRepository) {}

  async createAccount(data: any) {
    return this.propRepository.createAccount(data);
  }

  async getAccounts(userId: string) {
    return this.propRepository.getAccounts(userId);
  }

  async fundAccount(accountId: string, data: any) {
    return this.propRepository.createTrade({
      ...data,
      accountId,
    });
  }

  async createTrade(accountId: string, data: any) {
    return this.propRepository.createTrade({
      ...data,
      accountId,
    });
  }

  async getTrades(accountId: string) {
    return this.propRepository.getTrades(accountId);
  }

  async getAnalytics(accountId: string) {
    return this.propRepository.getPropAnalytics(accountId);
  }
}
