import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import {
  getHomeSections,
  getAboutSections,
  getProductsPageSections,
  getCareersPageSections,
  getNewsPageSections,
  getContactPageSections,
  getProducts,
  getJobs,
  getArticles,
} from '@/lib/queries';
import type { HomeSections } from '@/lib/home-content';
import type { AboutSections } from '@/lib/about-content';
import type { ProductsPageSections } from '@/lib/products-page-content';
import type { CareersPageSections } from '@/lib/careers-page-content';
import type { NewsPageSections } from '@/lib/news-page-content';
import type { ContactPageSections } from '@/lib/contact-page-content';
import {
  PageForm,
  type PageFormValue,
  type ProductChip,
  type JobChip,
  type ArticleChip,
} from '@/components/admin/PageForm';
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

  // home / about / products / career / news each expose a full section editor.
  let initialSections: HomeSections | undefined;
  let initialAboutSections: AboutSections | undefined;
  let initialProductsPageSections: ProductsPageSections | undefined;
  let initialCareersPageSections: CareersPageSections | undefined;
  let initialNewsPageSections: NewsPageSections | undefined;
  let initialContactPageSections: ContactPageSections | undefined;
  let currentProducts: ProductChip[] | undefined;
  let currentJobs: JobChip[] | undefined;
  let currentArticles: ArticleChip[] | undefined;

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
  } else if (known.key === 'products') {
    const [vi, en, zh, products] = await Promise.all([
      getProductsPageSections('vi'),
      getProductsPageSections('en'),
      getProductsPageSections('zh'),
      getProducts(),
    ]);
    initialProductsPageSections = { vi, en, zh };
    // Reuse the same ProductChip prop so the SKU-list section can display
    // each catalog entry's localized name/MOQ next to the code.
    currentProducts = Object.values(products).map((p) => ({
      code: p.code,
      nameVi: p.name.vi,
      nameEn: p.name.en,
      nameZh: p.name.zh,
    }));
  } else if (known.key === 'career') {
    const [vi, en, zh, jobs] = await Promise.all([
      getCareersPageSections('vi'),
      getCareersPageSections('en'),
      getCareersPageSections('zh'),
      getJobs(),
    ]);
    initialCareersPageSections = { vi, en, zh };
    currentJobs = Object.values(jobs).map((j) => ({
      slug: j.id,
      titleVi: j.title.vi,
      titleEn: j.title.en,
      titleZh: j.title.zh,
      deptVi: j.deptLabel.vi,
      deptEn: j.deptLabel.en,
      deptZh: j.deptLabel.zh,
      locationVi: j.loc.vi,
    }));
  } else if (known.key === 'news') {
    const [vi, en, zh, articles] = await Promise.all([
      getNewsPageSections('vi'),
      getNewsPageSections('en'),
      getNewsPageSections('zh'),
      getArticles(),
    ]);
    initialNewsPageSections = { vi, en, zh };
    currentArticles = articles.map((a) => ({
      id: String(a.id),
      titleVi: a.title.vi,
      titleEn: a.title.en,
      titleZh: a.title.zh,
      views: a.views,
      cat: a.cat,
      date: a.date,
    }));
  } else if (known.key === 'contact') {
    const [vi, en, zh] = await Promise.all([
      getContactPageSections('vi'),
      getContactPageSections('en'),
      getContactPageSections('zh'),
    ]);
    initialContactPageSections = { vi, en, zh };
  }

  return (
    <PageForm
      initial={initial}
      label={known.label}
      path={known.path}
      initialSections={initialSections}
      initialAboutSections={initialAboutSections}
      initialProductsPageSections={initialProductsPageSections}
      initialCareersPageSections={initialCareersPageSections}
      initialNewsPageSections={initialNewsPageSections}
      initialContactPageSections={initialContactPageSections}
      currentProducts={currentProducts}
      currentJobs={currentJobs}
      currentArticles={currentArticles}
    />
  );
}
