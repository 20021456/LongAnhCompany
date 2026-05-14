import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead } from '@/components/admin/AdminPageHead';
import { MenuEditor, type MenuData } from '@/components/admin/MenuEditor';

export default async function AdminMenuPage() {
  await requirePermission('menu.update');

  const menus = await db.menu.findMany({
    include: { items: { orderBy: { sortOrder: 'asc' } } },
  });

  const toData = (loc: string): MenuData => {
    const m = menus.find((x) => x.location === loc);
    return {
      location: loc,
      items: (m?.items ?? []).map((it) => ({
        labelVi: it.labelVi,
        labelEn: it.labelEn ?? '',
        labelZh: it.labelZh ?? '',
        url: it.url,
        target: it.target === '_blank' ? '_blank' : '_self',
        isActive: it.isActive,
      })),
    };
  };

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Menu navigation' }]}
        title="Menu navigation"
        sub="Quản lý menu đầu trang và chân trang — dùng chung toàn website"
      />
      <MenuEditor header={toData('header')} footer={toData('footer')} />
    </>
  );
}
