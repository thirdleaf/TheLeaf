import { NotFoundException } from "@nestjs/common";
import { db } from "@thirdleaf/db";
import { eq, and } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";

/**
 * Helper utility to enforce cross-tenant isolation and strict data ownership.
 * ALWAYS use this function when fetching a specific record by ID before updating or deleting it.
 *
 * @param userId - The UUID of the authenticated user
 * @param table - The Drizzle schema table object
 * @param id - The ID of the record being queried
 * @returns The queried record
 * @throws NotFoundException if the record doesn't exist or doesn't belong to the user
 */
export async function getUserOwnedRecord<T extends PgTable & { id: any; userId: any }>(
  userId: string,
  table: T,
  id: string
) {
  const [record] = await db
    .select()
    .from(table as any)
    .where(and(eq(table.id, id), eq(table.userId, userId)))
    .limit(1);

  if (!record) {
    throw new NotFoundException("Record not found or you do not have permission");
  }

  return record as T["$inferSelect"];
}
