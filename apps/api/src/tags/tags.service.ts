import { Injectable, NotFoundException } from '@nestjs/common';
import { TagsRepository } from './tags.repository';

@Injectable()
export class TagsService {
  constructor(private readonly tagsRepository: TagsRepository) {}

  async findAll(userId: string) {
    return this.tagsRepository.findAll(userId);
  }

  async findOne(id: string, userId: string) {
    return this.tagsRepository.findOne(id, userId);
  }
}
