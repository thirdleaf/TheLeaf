import { Injectable } from '@nestjs/common';
import { db } from '@thirdleaf/db';
import { eq } from 'drizzle-orm';
// import { analytics } from '@thirdleaf/db'; // Update the import once schemas match

@Injectable()
export class AnalyticsRepository {
  async findAll(userId: string) {
    // return db.select().from(analytics).where(eq(analytics.userId, userId));
    return [];
  }

  async findOne(id: string, userId: string) {
    // const results = await db.select().from(analytics).where(and(eq(analytics.id, id), eq(analytics.userId, userId)));
    return null;
  }
}
