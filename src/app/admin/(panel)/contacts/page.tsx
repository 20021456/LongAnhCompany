import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead, AdminEmpty } from '@/components/admin/AdminPageHead';
import {
  ContactsKanban,
  type KanbanCard,
  type AssignableUser,
} from '@/components/admin/ContactsKanban';

export default async function AdminContactsPage() {
  await requirePermission('contacts.read');

  const [contacts, users] = await Promise.all([
    db.contact.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { notes: true } } },
    }),
    // Anyone active can be assigned a lead; pickers can filter further later.
    db.user.findMany({
      where: { isActive: true },
      orderBy: { fullName: 'asc' },
      select: { id: true, fullName: true, email: true },
    }),
  ]);

  const cards: KanbanCard[] = contacts.map((c) => ({
    id: c.id,
    fullName: c.fullName,
    email: c.email,
    company: c.company,
    message: c.message,
    source: c.source,
    status: c.status,
    createdAt: c.createdAt.toISOString(),
    noteCount: c._count.notes,
    assignedToId: c.assignedToId,
  }));

  const assignable: AssignableUser[] = users.map((u) => ({
    id: u.id,
    fullName: u.fullName || u.email,
  }));

  const counts = {
    new: contacts.filter((c) => c.status === 'new').length,
    total: contacts.length,
  };

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Liên hệ / Leads' }]}
        title="Liên hệ / Leads"
        sub={`${counts.total} lead · ${counts.new} chưa xử lý · kéo thẻ giữa các cột để đổi trạng thái`}
      />

      {contacts.length === 0 ? (
        <AdminEmpty>Chưa có liên hệ nào gửi qua website.</AdminEmpty>
      ) : (
        <ContactsKanban cards={cards} users={assignable} />
      )}
    </>
  );
}
