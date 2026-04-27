import { Injectable, NotFoundException } from "@nestjs/common";
import { ClientsRepository } from "./clients.repository";

@Injectable()
export class ClientsService {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  async findAll(userId: string) {
    return this.clientsRepository.findAll(userId);
  }

  async findOne(id: string, userId: string) {
    const client = await this.clientsRepository.findOne(id, userId);
    if (!client) throw new NotFoundException("Client not found");
    return client;
  }

  async create(userId: string, data: any) {
    return this.clientsRepository.create({
      ...data,
      userId,
    });
  }

  async update(id: string, userId: string, data: any) {
    await this.findOne(id, userId);
    return this.clientsRepository.update(id, userId, data);
  }
}
