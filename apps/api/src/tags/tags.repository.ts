import { Injectable } from '@nestjs/common';
import { db } from '@thirdleaf/db';
import { eq } from 'drizzle-orm';
// import { tags } from '@thirdleaf/db'; // Update the import once schemas match

@Injectable()
export class TagsRepository {
  async findAll(userId: string) {
    // return db.select().from(tags).where(eq(tags.userId, userId));
    return [];
  }

  async findOne(id: string, userId: string) {
    // const results = await db.select().from(tags).where(and(eq(tags.id, id), eq(tags.userId, userId)));
    return null;
  }
}
