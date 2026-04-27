import { Injectable } from "@nestjs/common";
import { db } from "@thirdleaf/db";
import { projects, projectMilestones, projectMessages, NewProject } from "@thirdleaf/db";
import { eq, desc, and } from "drizzle-orm";

@Injectable()
export class ProjectsRepository {
  async findAll(userId: string, filters: any = {}) {
    let query = db.select().from(projects).where(eq(projects.userId, userId));
    
    if (filters.status) {
      query = db.select().from(projects).where(and(eq(projects.userId, userId), eq(projects.status, filters.status)));
    }
    
    return query.orderBy(desc(projects.createdAt));
  }

  async findOne(id: string, userId: string) {
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .limit(1);
    return project;
  }

  async create(data: NewProject) {
    const [project] = await db.insert(projects).values(data).returning();
    return project;
  }

  async update(id: string, userId: string, data: any) {
    const [project] = await db
      .update(projects)
      .set(data)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .returning();
    return project;
  }

  async addMilestone(data: any) {
    const [milestone] = await db.insert(projectMilestones).values(data).returning();
    return milestone;
  }

  async getMilestones(projectId: string) {
    return db
      .select()
      .from(projectMilestones)
      .where(eq(projectMilestones.projectId, projectId))
      .orderBy(projectMilestones.order);
  }

  async updateMilestone(milestoneId: string, data: any) {
    const [milestone] = await db
      .update(projectMilestones)
      .set(data)
      .where(eq(projectMilestones.id, milestoneId))
      .returning();
    return milestone;
  }

  async addMessage(data: any) {
    const [message] = await db.insert(projectMessages).values(data).returning();
    return message;
  }

  async getMessages(projectId: string) {
    return db
      .select()
      .from(projectMessages)
      .where(eq(projectMessages.projectId, projectId))
      .orderBy(projectMessages.createdAt);
  }
}
