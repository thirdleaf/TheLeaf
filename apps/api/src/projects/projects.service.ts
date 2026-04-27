import { Injectable, NotFoundException } from "@nestjs/common";
import { ProjectsRepository } from "./projects.repository";

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async findAll(userId: string, filters: any = {}) {
    return this.projectsRepository.findAll(userId, filters);
  }

  async findOne(id: string, userId: string) {
    const project = await this.projectsRepository.findOne(id, userId);
    if (!project) throw new NotFoundException("Project not found");
    return project;
  }

  async create(userId: string, data: any) {
    return this.projectsRepository.create({
      ...data,
      userId,
    });
  }

  async update(id: string, userId: string, data: any) {
    await this.findOne(id, userId);
    return this.projectsRepository.update(id, userId, data);
  }

  async addMilestone(id: string, userId: string, data: any) {
    await this.findOne(id, userId);
    return this.projectsRepository.addMilestone({
      ...data,
      projectId: id,
    });
  }

  async getMilestones(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.projectsRepository.getMilestones(id);
  }

  async completeMilestone(id: string, userId: string, milestoneId: string) {
    await this.findOne(id, userId);
    return this.projectsRepository.updateMilestone(milestoneId, {
      completedAt: new Date(),
    });
  }

  async getMessages(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.projectsRepository.getMessages(id);
  }

  async sendMessage(id: string, userId: string, content: string, senderType: 'FOUNDER' | 'CLIENT' = 'FOUNDER') {
    await this.findOne(id, userId);
    // In real app, identify senderId correctly from request
    return this.projectsRepository.addMessage({
      projectId: id,
      senderId: userId, // Assuming founder for now
      senderType,
      content,
    });
  }
}
