import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead } from '@/components/admin/AdminPageHead';
import { RolesManager, type UserRow, type RoleRow } from '@/components/admin/RolesManager';

export default async function AdminRolesPage() {
  const actor = await requirePermission('users.manage');

  const [users, roles] = await Promise.all([
    db.user.findMany({ include: { role: true }, orderBy: { createdAt: 'asc' } }),
    db.role.findMany({
      include: { _count: { select: { users: true } } },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  const userRows: UserRow[] = users.map((u) => ({
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    roleId: u.roleId,
    roleName: u.role.name,
    isActive: u.isActive,
    lastLoginAt: u.lastLoginAt ? u.lastLoginAt.toISOString() : null,
  }));

  const roleRows: RoleRow[] = roles.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description ?? '',
    permissions: (r.permissions as unknown as Record<string, boolean>) ?? {},
    userCount: r._count.users,
  }));

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Phân quyền' }]}
        title="Người dùng & Phân quyền"
        sub={`${userRows.length} người dùng · ${roleRows.length} vai trò`}
      />
      <RolesManager users={userRows} roles={roleRows} currentUserId={actor.id} />
    </>
  );
}
