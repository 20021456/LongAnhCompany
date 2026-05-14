import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { getHomeSections } from '@/lib/queries';
import type { HomeSections } from '@/lib/home-content';
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

  // The home page exposes a full section editor. Load every section's content
  // for all three locales — getHomeSections merges saved rows with defaults.
  let initialSections: HomeSections | undefined;
  if (known.key === 'home') {
    const [vi, en, zh] = await Promise.all([
      getHomeSections('vi'),
      getHomeSections('en'),
      getHomeSections('zh'),
    ]);
    initialSections = { vi, en, zh };
  }

  return (
    <PageForm
      initial={initial}
      label={known.label}
      path={known.path}
      initialSections={initialSections}
    />
  );
}
