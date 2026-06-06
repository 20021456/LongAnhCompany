'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { AdminIcon } from './AdminIcon';

interface Props {
  name: string;
  email: string;
  role: string;
}

const ROLE_LABEL: Record<string, string> = {
  super_admin: 'Quản trị viên',
  editor: 'Biên tập viên',
  sales: 'Kinh doanh',
  hr: 'Nhân sự',
  viewer: 'Chỉ xem',
};

function initials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(-2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('') || '?'
  );
}

export function AdminTopbar({ name, email, role }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.lac-user-wrap')) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const ini = initials(name);
  const roleLabel = ROLE_LABEL[role] ?? role;

  return (
    <header className="lac-top">
      <div className="lac-search">
        <AdminIcon name="search" size={15} />
        <input placeholder="Tìm kiếm sản phẩm, tin tức, trang…" />
        <kbd>⌘K</kbd>
      </div>
      <div className="lac-top-r">
        <button className="lac-top-btn" title="Thông báo" type="button">
          <AdminIcon name="bell" size={17} />
          <span className="dot" />
        </button>
        <button className="lac-top-btn" title="Trợ giúp" type="button">
          <AdminIcon name="help" size={17} />
        </button>
        <div className="lac-user-wrap">
          <button
            type="button"
            className="lac-top-avatar"
            title={name}
            onClick={() => setMenuOpen((m) => !m)}
          >
            {ini}
          </button>
          {menuOpen ? (
            <div className="lac-user-menu">
              <div className="head">
                <div className="avatar">{ini}</div>
                <div>
                  <div className="name">{name}</div>
                  <div className="role">
                    {roleLabel} · {email}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="item danger"
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
              >
                <AdminIcon name="logout" size={15} /> Đăng xuất
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
