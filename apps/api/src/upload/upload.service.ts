import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadRepository } from './upload.repository';

@Injectable()
export class UploadService {
  constructor(private readonly uploadRepository: UploadRepository) {}

  async findAll(userId: string) {
    return this.uploadRepository.findAll(userId);
  }

  async findOne(id: string, userId: string) {
    return this.uploadRepository.findOne(id, userId);
  }
}
