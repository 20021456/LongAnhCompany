import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead } from '@/components/admin/AdminPageHead';
import { StatusSelect } from '@/components/admin/StatusSelect';
import { ContactNoteForm } from '@/components/admin/ContactNoteForm';
import { setContactStatus } from '../actions';

const STATUS_OPTIONS = [
  { value: 'new', label: 'Mới' },
  { value: 'contacted', label: 'Đã liên hệ' },
  { value: 'quoted', label: 'Đã báo giá' },
  { value: 'won', label: 'Thành công' },
  { value: 'lost', label: 'Thất bại' },
];

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--ad-line-soft)' }}>
      <div style={{ width: 130, color: 'var(--ad-text-mute)', fontSize: 12.5, flexShrink: 0 }}>{label}</div>
      <div style={{ fontSize: 13.5 }}>{value || '—'}</div>
    </div>
  );
}

export default async function ContactDetailPage({ params }: { params: { id: string } }) {
  await requirePermission('contacts.read');

  const contact = await db.contact.findUnique({
    where: { id: params.id },
    include: {
      notes: { orderBy: { createdAt: 'desc' }, include: { user: true } },
      productInterest: true,
      variant: true,
    },
  });
  if (!contact) notFound();

  return (
    <>
      <AdminPageHead
        crumbs={[
          { label: 'Liên hệ / Leads', href: '/admin/contacts' },
          { label: contact.fullName },
        ]}
        title={contact.fullName}
        sub={`Gửi ${contact.createdAt.toLocaleString('vi-VN')}`}
        actions={
          <StatusSelect
            id={contact.id}
            value={contact.status}
            options={STATUS_OPTIONS}
            action={setContactStatus}
          />
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
        {/* Lead detail */}
        <div className="ad-card">
          <div className="ad-card-head">
            <h3>Thông tin liên hệ</h3>
          </div>
          <div className="ad-card-body">
            <Row label="Họ tên" value={contact.fullName} />
            <Row label="Email" value={<a href={`mailto:${contact.email}`}>{contact.email}</a>} />
            <Row label="Điện thoại" value={contact.phone} />
            <Row label="Công ty" value={contact.company} />
            <Row label="Quốc gia" value={contact.country} />
            <Row label="Nguồn" value={contact.source} />
            <Row
              label="Sản phẩm quan tâm"
              value={contact.productInterest ? contact.productInterest.nameVi : null}
            />
            <Row label="Số lượng" value={contact.quantity} />
            <Row label="Cảng đến" value={contact.destinationPort} />
            <Row
              label="Nội dung"
              value={<div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{contact.message}</div>}
            />
          </div>
        </div>

        {/* Internal notes */}
        <div className="ad-card">
          <div className="ad-card-head">
            <div>
              <h3>Ghi chú nội bộ</h3>
              <p>{contact.notes.length} ghi chú</p>
            </div>
          </div>
          <div className="ad-card-body">
            <ContactNoteForm contactId={contact.id} />
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {contact.notes.length === 0 ? (
                <div style={{ fontSize: 12.5, color: 'var(--ad-text-mute)' }}>
                  Chưa có ghi chú nào.
                </div>
              ) : (
                contact.notes.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      background: 'var(--ad-line-soft)',
                      borderRadius: 6,
                      padding: '10px 12px',
                    }}
                  >
                    <div style={{ fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{n.note}</div>
                    <div style={{ fontSize: 11, color: 'var(--ad-text-mute)', marginTop: 6 }}>
                      {n.user.fullName} · {n.createdAt.toLocaleString('vi-VN')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
