import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead } from '@/components/admin/AdminPageHead';
import { PageForm, type PageFormValue } from '@/components/admin/PageForm';
import { KNOWN_PAGES } from '../known';

export default async function AdminPageEditPage({ params }: { params: { key: string } }) {
  await requirePermission('pages.update');

  const known = KNOWN_PAGES.find((p) => p.key === params.key);
  if (!known) notFound();

  const row = await db.page.findUnique({ where: { key: known.key } });

  const initial: PageFormValue = {
    key: known.key,
    titleVi: row?.titleVi ?? known.label,
    titleEn: row?.titleEn ?? '',
    titleZh: row?.titleZh ?? '',
    metaTitleVi: row?.metaTitleVi ?? '',
    metaTitleEn: row?.metaTitleEn ?? '',
    metaTitleZh: row?.metaTitleZh ?? '',
    metaDescVi: row?.metaDescVi ?? '',
    metaDescEn: row?.metaDescEn ?? '',
    metaDescZh: row?.metaDescZh ?? '',
    ogImageUrl: row?.ogImageUrl ?? '',
    isPublished: row?.isPublished ?? true,
  };

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Trang', href: '/admin/pages' }, { label: known.label }]}
        title={`Sửa trang — ${known.label}`}
        sub={known.path}
      />
      <PageForm initial={initial} label={known.label} />
    </>
  );
}
