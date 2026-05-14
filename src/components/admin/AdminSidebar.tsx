'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminIcon, type AdminIconName } from './AdminIcon';
import type { Permission } from '@/lib/permissions';

type NavEntry =
  | { type: 'section'; label: string }
  | {
      type: 'item';
      id: string;
      label: string;
      icon: AdminIconName;
      href: string;
      /** Permission required to see this item. undefined = always visible. */
      perm?: Permission;
      badge?: string;
    };

const NAV: NavEntry[] = [
  { type: 'item', id: 'dashboard', label: 'Dashboard', icon: 'home', href: '/admin/dashboard' },

  { type: 'section', label: 'Nội dung' },
  { type: 'item', id: 'pages', label: 'Trang', icon: 'file', href: '/admin/pages', perm: 'pages.read' },
  { type: 'item', id: 'news', label: 'Tin tức', icon: 'news', href: '/admin/news', perm: 'news.read' },
  { type: 'item', id: 'products', label: 'Sản phẩm', icon: 'rock', href: '/admin/products', perm: 'products.read' },
  { type: 'item', id: 'jobs', label: 'Tuyển dụng', icon: 'users', href: '/admin/jobs', perm: 'jobs.read' },
  { type: 'item', id: 'media', label: 'Thư viện ảnh', icon: 'image', href: '/admin/media', perm: 'media.read' },

  { type: 'section', label: 'Cấu hình' },
  { type: 'item', id: 'settings', label: 'Cài đặt site', icon: 'settings', href: '/admin/settings', perm: 'settings.update' },
  { type: 'item', id: 'menu', label: 'Menu navigation', icon: 'nav', href: '/admin/menu', perm: 'menu.update' },
  { type: 'item', id: 'i18n', label: 'Ngôn ngữ', icon: 'globe', href: '/admin/i18n', perm: 'i18n.update' },
  { type: 'item', id: 'seo', label: 'SEO mặc định', icon: 'seo', href: '/admin/seo', perm: 'seo.update' },

  { type: 'section', label: 'Tương tác' },
  { type: 'item', id: 'contacts', label: 'Liên hệ / Leads', icon: 'mail', href: '/admin/contacts', perm: 'contacts.read' },
  { type: 'item', id: 'livechat', label: 'Hỗ trợ trực tiếp', icon: 'chat', href: '/admin/livechat' },

  { type: 'section', label: 'Hệ thống' },
  { type: 'item', id: 'roles', label: 'Phân quyền', icon: 'shield', href: '/admin/roles', perm: 'users.manage' },
];

interface Props {
  role: string;
  permissions: Record<string, boolean>;
}

export function AdminSidebar({ role, permissions }: Props) {
  const pathname = usePathname();
  const isSuper = role === 'super_admin';

  const canSee = (perm?: Permission) => {
    if (!perm) return true;
    if (isSuper) return true;
    return permissions[perm] === true;
  };

  // Drop section headers whose items are all hidden
  const visible: NavEntry[] = [];
  NAV.forEach((entry, i) => {
    if (entry.type === 'section') {
      // look ahead until the next section — keep header only if it has a
      // visible item
      let hasVisibleItem = false;
      for (let j = i + 1; j < NAV.length && NAV[j].type !== 'section'; j++) {
        const e = NAV[j];
        if (e.type === 'item' && canSee(e.perm)) {
          hasVisibleItem = true;
          break;
        }
      }
      if (hasVisibleItem) visible.push(entry);
    } else if (canSee(entry.perm)) {
      visible.push(entry);
    }
  });

  return (
    <aside className="ad-side">
      <Link href="/admin/dashboard" className="ad-side-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/long-anh-logo.png" alt="Long Anh" />
        <div className="name">
          Long Anh
          <small>Admin</small>
        </div>
      </Link>
      <nav className="ad-side-nav">
        {visible.map((entry, i) =>
          entry.type === 'section' ? (
            <div key={`s-${i}`} className="ad-side-section">
              {entry.label}
            </div>
          ) : (
            <Link
              key={entry.id}
              href={entry.href}
              className={
                'ad-side-item' + (pathname.startsWith(entry.href) ? ' active' : '')
              }
            >
              <AdminIcon name={entry.icon} size={17} />
              <span>{entry.label}</span>
              {entry.badge ? <span className="ad-side-badge">{entry.badge}</span> : null}
            </Link>
          ),
        )}
      </nav>
      <div className="ad-side-foot">
        <AdminIcon name="check" size={13} /> Hệ thống ổn định · v1.0
      </div>
    </aside>
  );
}
