import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead } from '@/components/admin/AdminPageHead';
import { PagesTable, type PageRow } from '@/components/admin/PagesTable';
import { KNOWN_PAGES } from './known';

/** Compact initials from a full name or email (e.g. "Anh Nam" → "AN"). */
function initials(src: string | null | undefined): string {
  if (!src) return '';
  const s = src.trim();
  if (!s) return '';
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return s.slice(0, 2).toUpperCase();
}

export default async function AdminPagesPage() {
  await requirePermission('pages.read');

  const [pages, sectionCounts, latestAudits] = await Promise.all([
    db.page.findMany(),
    // Section count per page — only the home page actually has rows today.
    db.pageSection.groupBy({ by: ['pageId'], _count: { _all: true } }),
    // Most recent "update" audit log per page, with the actor's name.
    db.auditLog.findMany({
      where: { entityType: 'page', action: 'update' },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { fullName: true, email: true } } },
    }),
  ]);

  const sectionsByPageId = new Map(sectionCounts.map((s) => [s.pageId, s._count._all]));
  // First audit per pageId wins (rows are sorted desc).
  const latestAuditByEntity = new Map<string, (typeof latestAudits)[number]>();
  for (const log of latestAudits) {
    if (log.entityId && !latestAuditByEntity.has(log.entityId)) {
      latestAuditByEntity.set(log.entityId, log);
    }
  }
  const byKey = new Map(pages.map((p) => [p.key, p]));

  const rows: PageRow[] = KNOWN_PAGES.map((kp) => {
    const row = byKey.get(kp.key);
    const audit = row ? latestAuditByEntity.get(row.id) : undefined;
    return {
      key: kp.key,
      label: kp.label,
      path: kp.path,
      isPublished: row ? row.isPublished : true,
      sections: row ? (sectionsByPageId.get(row.id) ?? 0) : 0,
      updatedAt: row?.updatedAt ? row.updatedAt.toISOString() : null,
      updaterInitials: initials(audit?.user?.fullName ?? audit?.user?.email ?? null),
      starred: kp.key === 'home',
    };
  });

  const pubCount = rows.filter((r) => r.isPublished).length;
  const hideCount = rows.length - pubCount;

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Trang' }]}
        title="Trang"
        sub={`${rows.length} trang · ${pubCount} đã xuất bản · ${hideCount} đã ẩn`}
      />
      <PagesTable rows={rows} />
    </>
  );
}
