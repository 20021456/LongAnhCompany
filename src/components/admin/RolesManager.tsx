'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from './AdminIcon';
import { Field, FieldRow } from './FormBits';
import { PERMISSIONS } from '@/lib/permissions';
import { fmtDateVn } from '@/lib/format';
import {
  createUser,
  updateUser,
  deleteUser,
  saveRolePermissions,
  type ActionResult,
} from '@/app/admin/(panel)/roles/actions';

export interface UserRow {
  id: string;
  email: string;
  fullName: string;
  roleId: string;
  roleName: string;
  isActive: boolean;
  lastLoginAt: string | null;
}

export interface RoleRow {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, boolean>;
  userCount: number;
}

interface RoleOption {
  id: string;
  name: string;
}

const GROUP_LABEL: Record<string, string> = {
  pages: 'Trang',
  products: 'Sản phẩm',
  news: 'Tin tức',
  jobs: 'Tuyển dụng',
  applications: 'Hồ sơ ứng tuyển',
  contacts: 'Liên hệ / Leads',
  media: 'Thư viện ảnh',
  menu: 'Menu',
  seo: 'SEO',
  i18n: 'Ngôn ngữ',
  settings: 'Cài đặt',
  users: 'Người dùng & phân quyền',
};

const PERM_GROUPS: { group: string; keys: string[] }[] = (() => {
  const map = new Map<string, string[]>();
  for (const k of Object.keys(PERMISSIONS)) {
    const g = k.split('.')[0];
    if (!map.has(g)) map.set(g, []);
    map.get(g)!.push(k);
  }
  return [...map.entries()].map(([group, keys]) => ({ group, keys }));
})();

function Banner({ state }: { state: ActionResult | null }) {
  if (!state) return null;
  if (state.error)
    return (
      <div className="lg-err" style={{ marginBottom: 12 }}>
        <AdminIcon name="shield" size={14} />
        {state.error}
      </div>
    );
  if (state.ok)
    return (
      <div className="ad-badge pub" style={{ marginBottom: 12, padding: '8px 12px' }}>
        <span className="dot" />
        Đã lưu thành công.
      </div>
    );
  return null;
}

function AddUserForm({ roles, onDone }: { roles: RoleOption[]; onDone: () => void }) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(roles[0]?.id ?? '');
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setState(null);
    const res = await createUser({ email, fullName, password, roleId, isActive: true });
    setBusy(false);
    setState(res);
    if (res.ok) {
      setEmail('');
      setFullName('');
      setPassword('');
      onDone();
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ marginBottom: 18 }}>
      <Banner state={state} />
      <FieldRow cols={2}>
        <Field label="Email" required>
          <input
            className="ad-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field label="Họ tên" required>
          <input
            className="ad-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </Field>
      </FieldRow>
      <FieldRow cols={2}>
        <Field label="Mật khẩu" required help="Tối thiểu 8 ký tự.">
          <input
            className="ad-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        <Field label="Vai trò" required>
          <select
            className="ad-select"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            required
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </Field>
      </FieldRow>
      <button type="submit" className="ad-btn primary" disabled={busy}>
        <AdminIcon name="plus" size={15} />
        {busy ? 'Đang tạo…' : 'Tạo người dùng'}
      </button>
    </form>
  );
}

function UserRowItem({
  user,
  roles,
  currentUserId,
}: {
  user: UserRow;
  roles: RoleOption[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const [roleId, setRoleId] = useState(user.roleId);
  const [isActive, setIsActive] = useState(user.isActive);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const isSelf = user.id === currentUserId;

  async function onSave() {
    setBusy(true);
    const res = await updateUser({ id: user.id, fullName, roleId, isActive, password });
    setBusy(false);
    if (res.error) {
      alert(res.error);
      return;
    }
    setEditing(false);
    setPassword('');
    router.refresh();
  }

  async function onDelete() {
    setBusy(true);
    const res = await deleteUser(user.id);
    setBusy(false);
    if (res.error) {
      alert(res.error);
      setConfirming(false);
      return;
    }
    router.refresh();
  }

  if (editing) {
    return (
      <tr>
        <td>
          <div style={{ fontWeight: 600 }}>{user.email}</div>
          <input
            className="ad-input"
            style={{ marginTop: 4 }}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Họ tên"
          />
        </td>
        <td>
          <select className="ad-select" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </td>
        <td>
          <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12.5 }}>
            <input
              type="checkbox"
              checked={isActive}
              disabled={isSelf}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Hoạt động
          </label>
        </td>
        <td colSpan={2}>
          <input
            className="ad-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu mới (để trống = giữ nguyên)"
          />
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <button type="button" className="ad-btn sm primary" disabled={busy} onClick={onSave}>
              {busy ? '…' : 'Lưu'}
            </button>
            <button
              type="button"
              className="ad-btn sm ghost"
              disabled={busy}
              onClick={() => {
                setEditing(false);
                setPassword('');
              }}
            >
              Huỷ
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td>
        <div style={{ fontWeight: 600 }}>
          {user.fullName}
          {isSelf ? (
            <span className="ad-badge sched" style={{ marginLeft: 6 }}>
              <span className="dot" />
              bạn
            </span>
          ) : null}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>{user.email}</div>
      </td>
      <td>{user.roleName}</td>
      <td>
        <span className={'ad-badge ' + (user.isActive ? 'pub' : 'hide')}>
          <span className="dot" />
          {user.isActive ? 'hoạt động' : 'khoá'}
        </span>
      </td>
      <td style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>
        {user.lastLoginAt ? fmtDateVn(user.lastLoginAt) : 'chưa đăng nhập'}
      </td>
      <td>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <button type="button" className="ad-btn sm" onClick={() => setEditing(true)}>
            <AdminIcon name="file" size={13} /> Sửa
          </button>
          {confirming ? (
            <>
              <button type="button" className="ad-btn sm danger" disabled={busy} onClick={onDelete}>
                {busy ? '…' : 'Xác nhận'}
              </button>
              <button
                type="button"
                className="ad-btn sm ghost"
                onClick={() => setConfirming(false)}
              >
                Huỷ
              </button>
            </>
          ) : (
            <button
              type="button"
              className="ad-btn sm danger"
              disabled={isSelf}
              title={isSelf ? 'Không thể xoá chính bạn' : 'Xoá người dùng'}
              onClick={() => setConfirming(true)}
            >
              <AdminIcon name="logout" size={13} /> Xoá
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function RolePermissionsCard({ role }: { role: RoleRow }) {
  const router = useRouter();
  const isSuper = role.name === 'super_admin';
  const [perms, setPerms] = useState<Record<string, boolean>>(role.permissions);
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);

  const toggle = (key: string) => setPerms((p) => ({ ...p, [key]: !p[key] }));

  async function onSave() {
    setBusy(true);
    setState(null);
    const res = await saveRolePermissions({ roleId: role.id, permissions: perms });
    setBusy(false);
    setState(res);
    if (res.ok) router.refresh();
  }

  return (
    <div className="ad-card">
      <div className="ad-card-head">
        <div>
          <h3>
            {role.name}
            {isSuper ? (
              <span className="ad-badge pub" style={{ marginLeft: 8 }}>
                <span className="dot" />
                toàn quyền
              </span>
            ) : null}
          </h3>
          <p>
            {role.description || 'Không có mô tả'} · {role.userCount} người dùng
          </p>
        </div>
      </div>
      <div className="ad-card-body">
        <Banner state={state} />
        {isSuper ? (
          <p style={{ fontSize: 13, color: 'var(--ad-text-mute)' }}>
            Vai trò <strong>super_admin</strong> luôn có toàn bộ quyền và không thể chỉnh sửa.
          </p>
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 14,
              }}
            >
              {PERM_GROUPS.map(({ group, keys }) => (
                <div
                  key={group}
                  style={{ border: '1px solid var(--ad-line)', borderRadius: 8, padding: 12 }}
                >
                  <div style={{ fontWeight: 600, fontSize: 12.5, marginBottom: 8 }}>
                    {GROUP_LABEL[group] ?? group}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {keys.map((key) => (
                      <label
                        key={key}
                        style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12.5 }}
                      >
                        <input
                          type="checkbox"
                          checked={perms[key] === true}
                          onChange={() => toggle(key)}
                        />
                        {PERMISSIONS[key as keyof typeof PERMISSIONS]}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <button type="button" className="ad-btn primary" disabled={busy} onClick={onSave}>
                <AdminIcon name="check" size={15} />
                {busy ? 'Đang lưu…' : `Lưu quyền cho ${role.name}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function RolesManager({
  users,
  roles,
  currentUserId,
}: {
  users: UserRow[];
  roles: RoleRow[];
  currentUserId: string;
}) {
  const router = useRouter();
  const roleOptions: RoleOption[] = roles.map((r) => ({ id: r.id, name: r.name }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="ad-card">
        <div className="ad-card-head">
          <div>
            <h3>Người dùng</h3>
            <p>{users.length} tài khoản quản trị</p>
          </div>
        </div>
        <div className="ad-card-body">
          <AddUserForm roles={roleOptions} onDone={() => router.refresh()} />
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Đăng nhập gần nhất</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <UserRowItem
                    key={u.id}
                    user={u}
                    roles={roleOptions}
                    currentUserId={currentUserId}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {roles.map((r) => (
        <RolePermissionsCard key={r.id} role={r} />
      ))}
    </div>
  );
}
