import { Injectable } from '@nestjs/common';
import { db } from '@thirdleaf/db';
import { eq } from 'drizzle-orm';
// import { prop } from '@thirdleaf/db'; // Update the import once schemas match

@Injectable()
export class PropRepository {
  async findAll(userId: string) {
    // return db.select().from(prop).where(eq(prop.userId, userId));
    return [];
  }

  async findOne(id: string, userId: string) {
    // const results = await db.select().from(prop).where(and(eq(prop.id, id), eq(prop.userId, userId)));
    return null;
  }
}
