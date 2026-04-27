import { Injectable, NotFoundException } from "@nestjs/common";
import { ToolsRepository } from "./tools.repository";

@Injectable()
export class ToolsService {
  constructor(private readonly toolsRepository: ToolsRepository) {}

  async findAll() {
    return this.toolsRepository.findAll();
  }

  async findOne(id: string) {
    const template = await this.toolsRepository.findOne(id);
    if (!template) throw new NotFoundException("Template not found");
    return template;
  }

  async create(data: any) {
    return this.toolsRepository.create(data);
  }

  async update(id: string, data: any) {
    return this.toolsRepository.update(id, data);
  }
}
