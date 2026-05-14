import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead } from '@/components/admin/AdminPageHead';

export default async function AdminRolesPage() {
  await requirePermission('users.manage');
  const [users, roles] = await Promise.all([
    db.user.findMany({ include: { role: true }, orderBy: { createdAt: 'asc' } }),
    db.role.findMany({ include: { _count: { select: { users: true } } } }),
  ]);

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Phân quyền' }]}
        title="Người dùng & Phân quyền"
        sub={`${users.length} người dùng · ${roles.length} vai trò`}
      />
      <div className="ad-table-wrap" style={{ marginBottom: 20 }}>
        <table className="ad-table">
          <thead>
            <tr><th>Người dùng</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ fontWeight: 600 }}>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.role.name}</td>
                <td>
                  <span className={'ad-badge ' + (u.isActive ? 'pub' : 'hide')}>
                    <span className="dot" />
                    {u.isActive ? 'hoạt động' : 'khoá'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr><th>Vai trò</th><th>Số quyền</th><th>Số người dùng</th></tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600 }}>{r.name}</td>
                <td>{Object.values((r.permissions as unknown as Record<string, boolean>) ?? {}).filter(Boolean).length}</td>
                <td>{r._count.users}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--ad-text-mute)', marginTop: 14 }}>
        Tạo / sửa người dùng và chỉnh ma trận quyền chi tiết sẽ thêm ở bản cập nhật tiếp theo.
      </p>
    </>
  );
}
