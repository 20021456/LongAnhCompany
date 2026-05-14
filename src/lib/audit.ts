/**
 * Audit-log helper — records admin mutations into the `audit_logs`
 * table. Call from admin route handlers / server actions after a
 * successful create / update / delete.
 *
 * Failures here never block the calling operation — audit logging is
 * best-effort and only logged to the console on error.
 */

import { db } from '@/lib/db';

type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'logout';

interface AuditInput {
  userId?: string | null;
  action: AuditAction;
  entityType: string; // 'product' | 'article' | 'job' | 'page' | …
  entityId?: string | null;
  changes?: unknown; // diff / snapshot
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function recordAudit(input: AuditInput): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        userId: input.userId ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        changes:
          input.changes === undefined ? undefined : (input.changes as object),
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
      },
    });
  } catch (err) {
    console.error('[audit] failed to record', input.action, input.entityType, err);
  }
}
