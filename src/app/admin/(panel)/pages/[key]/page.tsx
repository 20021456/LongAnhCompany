import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { getHomeSections, getAboutSections, getProducts } from '@/lib/queries';
import type { HomeSections } from '@/lib/home-content';
import type { AboutSections } from '@/lib/about-content';
import { PageForm, type PageFormValue, type ProductChip } from '@/components/admin/PageForm';
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

  // The home and about pages expose full section editors. Load every
  // section's content for all three locales — get*Sections merges saved
  // rows with defaults so the editor always has something to render.
  let initialSections: HomeSections | undefined;
  let initialAboutSections: AboutSections | undefined;
  let currentProducts: ProductChip[] | undefined;

  if (known.key === 'home') {
    const [vi, en, zh, products] = await Promise.all([
      getHomeSections('vi'),
      getHomeSections('en'),
      getHomeSections('zh'),
      getProducts(),
    ]);
    initialSections = { vi, en, zh };
    currentProducts = Object.values(products).map((p) => ({
      code: p.code,
      nameVi: p.name.vi,
      nameEn: p.name.en,
      nameZh: p.name.zh,
    }));
  } else if (known.key === 'about') {
    const [vi, en, zh] = await Promise.all([
      getAboutSections('vi'),
      getAboutSections('en'),
      getAboutSections('zh'),
    ]);
    initialAboutSections = { vi, en, zh };
  }

  return (
    <PageForm
      initial={initial}
      label={known.label}
      path={known.path}
      initialSections={initialSections}
      initialAboutSections={initialAboutSections}
      currentProducts={currentProducts}
    />
  );
}
