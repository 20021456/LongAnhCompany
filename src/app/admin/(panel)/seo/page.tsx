import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead } from '@/components/admin/AdminPageHead';
import { SeoForm } from '@/components/admin/SeoForm';
import { SEO_FIELDS } from '@/components/admin/seo-fields';

export default async function AdminSeoPage() {
  await requirePermission('seo.update');

  const rows = await db.setting.findMany({ where: { group: 'seo' } });
  const initial: Record<string, { vi: string; en: string; zh: string }> = {};
  for (const f of SEO_FIELDS) {
    const r = rows.find((x) => x.key === f.key);
    initial[f.key] = {
      vi: r?.valueVi ?? '',
      en: r?.valueEn ?? '',
      zh: r?.valueZh ?? '',
    };
  }

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'SEO mặc định' }]}
        title="SEO mặc định"
        sub="Thẻ meta, ảnh chia sẻ và mã theo dõi áp dụng chung cho toàn website"
      />
      <SeoForm initial={initial} />
    </>
  );
}
