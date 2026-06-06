import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead, AdminEmpty } from '@/components/admin/AdminPageHead';
import { StatusSelect } from '@/components/admin/StatusSelect';
import { setApplicationStatus } from '../../actions';

const STATUS_OPTIONS = [
  { value: 'new', label: 'Mới' },
  { value: 'reviewing', label: 'Đang xem' },
  { value: 'interview', label: 'Phỏng vấn' },
  { value: 'offered', label: 'Đã mời' },
  { value: 'hired', label: 'Đã tuyển' },
  { value: 'rejected', label: 'Từ chối' },
];

export default async function JobApplicationsPage({ params }: { params: { slug: string } }) {
  await requirePermission('applications.read');

  const job = await db.job.findUnique({
    where: { slug: params.slug },
    include: {
      applications: { orderBy: { createdAt: 'desc' } },
    },
  });
  if (!job) notFound();

  return (
    <>
      <AdminPageHead
        crumbs={[
          { label: 'Tuyển dụng', href: '/admin/jobs' },
          { label: job.titleVi, href: `/admin/jobs/${job.slug}` },
          { label: 'Đơn ứng tuyển' },
        ]}
        title={`Đơn ứng tuyển — ${job.titleVi}`}
        sub={`${job.applications.length} đơn`}
      />

      {job.applications.length === 0 ? (
        <AdminEmpty>Chưa có đơn ứng tuyển nào cho vị trí này.</AdminEmpty>
      ) : (
        <div className="lac-table-wrap">
          <table className="lac-table">
            <thead>
              <tr>
                <th>Ứng viên</th>
                <th>Liên hệ</th>
                <th>CV</th>
                <th>Ngày nộp</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {job.applications.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.fullName}</td>
                  <td>
                    <div>{a.email}</div>
                    {a.phone ? (
                      <div style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>{a.phone}</div>
                    ) : null}
                  </td>
                  <td>
                    <a
                      href={a.cvUrl}
                      target="_blank"
                      rel="noopener"
                      style={{ color: 'var(--ad-primary)', fontWeight: 600 }}
                    >
                      Xem CV
                    </a>
                  </td>
                  <td>{a.createdAt.toLocaleDateString('vi-VN')}</td>
                  <td>
                    <StatusSelect
                      id={a.id}
                      value={a.status}
                      options={STATUS_OPTIONS}
                      action={setApplicationStatus}
                    />
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
