import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { COPY } from '@/data/copy';
import {
  PageForm,
  type PageFormValue,
  type PageHeroValue,
  type PageHeroLocale,
} from '@/components/admin/PageForm';
import { KNOWN_PAGES } from '../known';

type HeroJson = Record<string, Partial<PageHeroLocale>>;

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

  // The home page exposes an editable Hero block. Pre-fill it from the saved
  // page_sections row, falling back to the static COPY content.
  let initialHero: PageHeroValue | undefined;
  if (known.key === 'home') {
    let heroJson: HeroJson | null = null;
    if (row) {
      const section = await db.pageSection.findUnique({
        where: { pageId_sectionKey: { pageId: row.id, sectionKey: 'hero' } },
      });
      heroJson = (section?.content as HeroJson | undefined) ?? null;
    }
    const copy = COPY as unknown as Record<string, Record<string, unknown>>;
    const build = (loc: string): PageHeroLocale => {
      const saved = heroJson?.[loc];
      const c = copy[loc] ?? {};
      const heroH = (c.heroH as string[] | undefined) ?? [];
      return {
        eyebrow: saved?.eyebrow ?? (c.heroEy as string) ?? '',
        titleLine1: saved?.titleLine1 ?? heroH[0] ?? '',
        titleLine2: saved?.titleLine2 ?? heroH[1] ?? '',
        sub: saved?.sub ?? (c.heroSub as string) ?? '',
        ctaPrimary: saved?.ctaPrimary ?? (c.ctaPrimary as string) ?? '',
        ctaSecondary: saved?.ctaSecondary ?? (c.ctaGhost as string) ?? '',
      };
    };
    initialHero = { vi: build('vi'), en: build('en'), zh: build('zh') };
  }

  return (
    <PageForm initial={initial} label={known.label} path={known.path} initialHero={initialHero} />
  );
}
