import Link from 'next/link';
import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead, AdminEmpty } from '@/components/admin/AdminPageHead';
import { AdminIcon } from '@/components/admin/AdminIcon';
import { JobsTable, type JobRow } from '@/components/admin/JobsTable';
import { deleteJob } from './actions';

export default async function AdminJobsPage() {
  await requirePermission('jobs.read');

  const jobs = await db.job.findMany({
    orderBy: { slug: 'asc' },
    include: {
      department: true,
      _count: { select: { applications: true } },
    },
  });

  const rows: JobRow[] = jobs.map((j) => ({
    id: j.id,
    slug: j.slug,
    titleVi: j.titleVi,
    location: j.location ?? '',
    departmentName: j.department.nameVi,
    deadlineText: j.deadlineText ?? '',
    levelVi: j.levelVi ?? '',
    applicationCount: j._count.applications,
    isActive: j.isActive,
  }));

  const openCount = rows.filter((r) => r.isActive).length;

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Tuyển dụng' }]}
        title="Tuyển dụng"
        sub={`${rows.length} vị trí · ${openCount} đang tuyển · ${rows.length - openCount} đã đóng`}
        actions={
          <Link href="/admin/jobs/new" className="lac-btn primary">
            <AdminIcon name="plus" size={15} /> Thêm vị trí
          </Link>
        }
      />

      {rows.length === 0 ? (
        <AdminEmpty>
          Chưa có vị trí nào.{' '}
          <Link href="/admin/jobs/new" style={{ color: 'var(--ad-primary)', fontWeight: 600 }}>
            Thêm vị trí đầu tiên
          </Link>
        </AdminEmpty>
      ) : (
        <JobsTable rows={rows} deleteAction={deleteJob} />
      )}
    </>
  );
}
