import { Injectable } from '@nestjs/common';
import { db } from '@thirdleaf/db';
import { eq } from 'drizzle-orm';
// import { upload } from '@thirdleaf/db'; // Update the import once schemas match

@Injectable()
export class UploadRepository {
  async findAll(userId: string) {
    // return db.select().from(upload).where(eq(upload.userId, userId));
    return [];
  }

  async findOne(id: string, userId: string) {
    // const results = await db.select().from(upload).where(and(eq(upload.id, id), eq(upload.userId, userId)));
    return null;
  }
}
