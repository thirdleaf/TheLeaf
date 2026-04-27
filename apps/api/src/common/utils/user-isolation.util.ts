import { ForbiddenException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';

/**
 * Utility to ensure database queries always include a userId filter.
 */
export function withUser(userId: string, condition?: any) {
  if (condition) {
    return and(eq((condition.table || {}).userId, userId), condition);
  }
  return eq((condition?.table || {}).userId, userId);
}

/**
 * Ensures the record belongs to the user or throws 403.
 */
export function validateOwnership(record: any, userId: string) {
  if (!record || record.userId !== userId) {
    throw new ForbiddenException('You do not have permission to access this record');
  }
  return true;
}
