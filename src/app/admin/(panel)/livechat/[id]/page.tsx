import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead } from '@/components/admin/AdminPageHead';
import { ChatThread, type ChatMessageRow } from '@/components/admin/ChatThread';

export default async function AdminChatSessionPage({ params }: { params: { id: string } }) {
  await requireAuth();

  const session = await db.chatSession.findUnique({
    where: { id: params.id },
    include: {
      assignedAgent: { select: { id: true, fullName: true } },
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });
  if (!session) notFound();

  const messages: ChatMessageRow[] = session.messages.map((m) => ({
    id: m.id,
    senderType: m.senderType,
    message: m.message,
    createdAt: m.createdAt.toISOString(),
  }));

  const title = session.visitorName || 'Khách ẩn danh';

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Hỗ trợ trực tiếp', href: '/admin/livechat' }, { label: title }]}
        title={title}
        sub={session.visitorEmail || session.visitorIp || 'Không có thông tin liên hệ'}
      />
      <ChatThread
        sessionId={session.id}
        status={session.status === 'closed' ? 'closed' : 'open'}
        assignedAgentName={session.assignedAgent?.fullName ?? null}
        messages={messages}
      />
    </>
  );
}
