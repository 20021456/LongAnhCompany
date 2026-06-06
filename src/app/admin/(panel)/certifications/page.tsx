import Link from 'next/link';
import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead, AdminEmpty } from '@/components/admin/AdminPageHead';
import { AdminIcon } from '@/components/admin/AdminIcon';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteCertification } from './actions';

export default async function AdminCertificationsPage() {
  await requirePermission('pages.read');

  const certs = await db.certification.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Chứng nhận' }]}
        title="Chứng nhận"
        sub={`${certs.length} chứng nhận hiển thị trên trang Giới thiệu`}
        actions={
          <Link href="/admin/certifications/new" className="lac-btn primary">
            <AdminIcon name="plus" size={15} /> Thêm chứng nhận
          </Link>
        }
      />

      {certs.length === 0 ? (
        <AdminEmpty>
          Chưa có chứng nhận nào.{' '}
          <Link
            href="/admin/certifications/new"
            style={{ color: 'var(--ad-primary)', fontWeight: 600 }}
          >
            Thêm chứng nhận đầu tiên
          </Link>
        </AdminEmpty>
      ) : (
        <div className="lac-table-wrap">
          <table className="lac-table">
            <thead>
              <tr>
                <th style={{ width: 70 }}>Thứ tự</th>
                <th>Chứng nhận</th>
                <th style={{ width: 140 }}>Mã</th>
                <th style={{ width: 110 }}>Tài liệu</th>
                <th style={{ width: 130 }} />
              </tr>
            </thead>
            <tbody>
              {certs.map((c) => (
                <tr key={c.id}>
                  <td style={{ color: 'var(--ad-text-soft)' }}>{c.sortOrder}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="lac-iconbox">
                        {c.badgeImageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={c.badgeImageUrl}
                            alt={c.name}
                            style={{ width: 24, height: 24, objectFit: 'contain' }}
                          />
                        ) : (
                          <AdminIcon name="shield" size={15} />
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>
                          {c.descriptionVi || '—'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <code className="slug-chip">{c.code}</code>
                  </td>
                  <td>
                    {c.documentUrl ? (
                      <a
                        href={c.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--ad-primary)', fontWeight: 600 }}
                      >
                        Xem PDF
                      </a>
                    ) : (
                      <span style={{ color: 'var(--ad-text-mute)' }}>—</span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions tight">
                      <Link
                        href={`/admin/certifications/${c.id}`}
                        className="lac-btn ghost sm"
                        title="Sửa chứng nhận"
                        aria-label="Sửa chứng nhận"
                      >
                        <AdminIcon name="edit" size={13} />
                      </Link>
                      <DeleteButton id={c.id} action={deleteCertification} iconOnly />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="lac-pag">
            <div>Hiển thị {certs.length} chứng nhận</div>
          </div>
        </div>
      )}
    </>
  );
}
