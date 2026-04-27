import { Injectable } from "@nestjs/common";
import { db } from "@thirdleaf/db";
import { scriptTemplates } from "@thirdleaf/db";
import { eq, desc } from "drizzle-orm";

@Injectable()
export class ToolsRepository {
  async findAll() {
    return db.select().from(scriptTemplates).orderBy(desc(scriptTemplates.createdAt));
  }

  async findOne(id: string) {
    const [template] = await db.select().from(scriptTemplates).where(eq(scriptTemplates.id, id)).limit(1);
    return template;
  }

  async create(data: any) {
    const [template] = await db.insert(scriptTemplates).values(data).returning();
    return template;
  }

  async update(id: string, data: any) {
    const [template] = await db.update(scriptTemplates).set(data).where(eq(scriptTemplates.id, id)).returning();
    return template;
  }
}
