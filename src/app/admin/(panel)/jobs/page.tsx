import Link from 'next/link';
import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead, AdminEmpty, StatusBadge } from '@/components/admin/AdminPageHead';
import { AdminIcon } from '@/components/admin/AdminIcon';
import { DeleteButton } from '@/components/admin/DeleteButton';
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

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Tuyển dụng' }]}
        title="Tuyển dụng"
        sub={`${jobs.length} vị trí`}
        actions={
          <Link href="/admin/jobs/new" className="ad-btn primary">
            <AdminIcon name="plus" size={15} /> Thêm vị trí
          </Link>
        }
      />

      {jobs.length === 0 ? (
        <AdminEmpty>
          Chưa có vị trí nào.{' '}
          <Link href="/admin/jobs/new" style={{ color: 'var(--ad-primary)', fontWeight: 600 }}>
            Thêm vị trí đầu tiên
          </Link>
        </AdminEmpty>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Vị trí</th>
                <th>Phòng ban</th>
                <th>Hạn nộp</th>
                <th>Đơn ứng tuyển</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{j.titleVi}</div>
                    <div style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>{j.location}</div>
                  </td>
                  <td>{j.department.nameVi}</td>
                  <td>{j.deadlineText ?? '—'}</td>
                  <td>
                    {j._count.applications > 0 ? (
                      <Link
                        href={`/admin/jobs/${j.slug}/applications`}
                        style={{ color: 'var(--ad-primary)', fontWeight: 600 }}
                      >
                        {j._count.applications} đơn
                      </Link>
                    ) : (
                      <span style={{ color: 'var(--ad-text-mute)' }}>0</span>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={j.isActive ? 'active' : 'hide'} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <Link href={`/admin/jobs/${j.slug}`} className="ad-btn sm">
                        <AdminIcon name="file" size={13} /> Sửa
                      </Link>
                      <DeleteButton id={j.id} action={deleteJob} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
