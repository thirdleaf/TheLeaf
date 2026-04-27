import { Injectable } from '@nestjs/common';
import { db } from '@thirdleaf/db';
import { eq } from 'drizzle-orm';
// import { journal } from '@thirdleaf/db'; // Update the import once schemas match

@Injectable()
export class JournalRepository {
  async findAll(userId: string) {
    // return db.select().from(journal).where(eq(journal.userId, userId));
    return [];
  }

  async findOne(id: string, userId: string) {
    // const results = await db.select().from(journal).where(and(eq(journal.id, id), eq(journal.userId, userId)));
    return null;
  }
}
