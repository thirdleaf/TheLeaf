import { Injectable } from "@nestjs/common";
import { db } from "@thirdleaf/db";
import { clients, NewClient } from "@thirdleaf/db";
import { eq, desc } from "drizzle-orm";

@Injectable()
export class ClientsRepository {
  async findAll(userId: string) {
    return db
      .select()
      .from(clients)
      .where(eq(clients.userId, userId))
      .orderBy(desc(clients.createdAt));
  }

  async findOne(id: string, userId: string) {
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id))
      .limit(1);
    
    if (client && client.userId !== userId) return null;
    return client;
  }

  async create(data: NewClient) {
    const [client] = await db.insert(clients).values(data).returning();
    return client;
  }

  async update(id: string, userId: string, data: any) {
    const [client] = await db
      .update(clients)
      .set(data)
      .where(eq(clients.id, id))
      .returning();
    return client;
  }
}
