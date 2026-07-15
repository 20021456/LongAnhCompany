import Link from 'next/link';
import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead, AdminEmpty } from '@/components/admin/AdminPageHead';
import { StatusSelect } from '@/components/admin/StatusSelect';
import { AdminIcon } from '@/components/admin/AdminIcon';
import { setContactStatus } from './actions';

const STATUS_OPTIONS = [
  { value: 'new', label: 'Mới' },
  { value: 'contacted', label: 'Đã liên hệ' },
  { value: 'quoted', label: 'Đã báo giá' },
  { value: 'won', label: 'Thành công' },
  { value: 'lost', label: 'Thất bại' },
];

const SOURCE_LABEL: Record<string, string> = {
  home_form: 'Form trang chủ',
  product_quote: 'Báo giá sản phẩm',
  contact_page: 'Trang liên hệ',
};

export default async function AdminContactsPage() {
  await requirePermission('contacts.read');

  const contacts = await db.contact.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { notes: true } } },
  });

  const counts = {
    new: contacts.filter((c) => c.status === 'new').length,
    total: contacts.length,
  };

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Liên hệ / Leads' }]}
        title="Liên hệ / Leads"
        sub={`${counts.total} lead · ${counts.new} chưa xử lý`}
      />

      {contacts.length === 0 ? (
        <AdminEmpty>Chưa có liên hệ nào gửi qua website.</AdminEmpty>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Nội dung</th>
                <th>Nguồn</th>
                <th>Ngày</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.fullName}</div>
                    <div style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>
                      {c.email}
                      {c.company ? ` · ${c.company}` : ''}
                    </div>
                  </td>
                  <td style={{ maxWidth: 320 }}>
                    <div
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontSize: 13,
                      }}
                    >
                      {c.message ?? '—'}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 12.5 }}>
                      {SOURCE_LABEL[c.source ?? ''] ?? c.source ?? '—'}
                    </span>
                  </td>
                  <td>{c.createdAt.toLocaleDateString('vi-VN')}</td>
                  <td>
                    <StatusSelect
                      id={c.id}
                      value={c.status}
                      options={STATUS_OPTIONS}
                      action={setContactStatus}
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Link href={`/admin/contacts/${c.id}`} className="ad-btn sm">
                        <AdminIcon name="mail" size={13} />
                        Xem
                        {c._count.notes > 0 ? ` (${c._count.notes})` : ''}
                      </Link>
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
