import Link from 'next/link';
import { requireAuth } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead, AdminEmpty } from '@/components/admin/AdminPageHead';
import { AdminIcon } from '@/components/admin/AdminIcon';

export default async function AdminLivechatPage() {
  await requireAuth();

  const sessions = await db.chatSession.findMany({
    orderBy: { startedAt: 'desc' },
    include: {
      assignedAgent: { select: { fullName: true } },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      _count: { select: { messages: true } },
    },
  });

  const openCount = sessions.filter((s) => s.status === 'open').length;

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Hỗ trợ trực tiếp' }]}
        title="Hỗ trợ trực tiếp"
        sub={`${sessions.length} phiên chat · ${openCount} đang mở`}
      />

      {sessions.length === 0 ? (
        <AdminEmpty>
          Chưa có phiên chat nào. Các cuộc trò chuyện từ widget chat trên website sẽ hiển thị ở đây.
        </AdminEmpty>
      ) : (
        <div className="lac-table-wrap">
          <table className="lac-table">
            <thead>
              <tr>
                <th>Khách</th>
                <th>Tin nhắn gần nhất</th>
                <th>Số tin</th>
                <th>Phụ trách</th>
                <th>Trạng thái</th>
                <th>Bắt đầu</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => {
                const last = s.messages[0];
                return (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{s.visitorName || 'Khách ẩn danh'}</div>
                      <div style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>
                        {s.visitorEmail || s.visitorIp || '—'}
                      </div>
                    </td>
                    <td
                      style={{
                        maxWidth: 320,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: 'var(--ad-text-soft)',
                      }}
                    >
                      {last ? `${last.senderType === 'agent' ? 'Bạn: ' : ''}${last.message}` : '—'}
                    </td>
                    <td>{s._count.messages}</td>
                    <td>{s.assignedAgent?.fullName ?? '— chưa gán —'}</td>
                    <td>
                      <span className={'lac-badge ' + (s.status === 'open' ? 'pub' : 'hide')}>
                        <span className="dot" />
                        {s.status === 'open' ? 'đang mở' : 'đã đóng'}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>
                      {s.startedAt.toLocaleString('vi-VN')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Link href={`/admin/livechat/${s.id}`} className="lac-btn sm">
                          <AdminIcon name="chat" size={13} /> Mở
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
