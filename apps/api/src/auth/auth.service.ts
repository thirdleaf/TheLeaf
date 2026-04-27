import { Injectable, NotFoundException } from '@nestjs/common';


@Injectable()
export class AuthService {
  constructor() {}

  async findAll(userId: string) {
    return [];
  }

  async findOne(id: string, userId: string) {
    return null;
  }
}
