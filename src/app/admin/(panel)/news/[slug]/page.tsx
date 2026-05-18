import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import {
  ArticleForm,
  type ArticleFormValue,
  type CategoryOption,
  type AuthorOption,
} from '@/components/admin/ArticleForm';

/** Today as yyyy-mm-dd (browser-locale-independent) — used for new articles. */
function todayIso(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

const EMPTY = (): ArticleFormValue => ({
  slug: '',
  categoryId: '',
  authorId: '',
  titleVi: '',
  titleEn: '',
  titleZh: '',
  excerptVi: '',
  excerptEn: '',
  excerptZh: '',
  contentVi: '',
  contentEn: '',
  contentZh: '',
  coverImageUrl: '',
  readTimeMin: 3,
  status: 'draft',
  isFeatured: false,
  publishedDate: todayIso(),
  tags: [],
  metaTitleVi: '',
  metaDescVi: '',
  views: 0,
  comments: 0,
});

/** Cast `tags Json?` (whatever shape) into a `string[]` for the form. */
function tagsFromJson(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((t): t is string => typeof t === 'string');
  return [];
}

export default async function ArticleEditPage({ params }: { params: { slug: string } }) {
  await requirePermission('news.update');

  const [catRows, userRows] = await Promise.all([
    db.newsCategory.findMany({ orderBy: { nameVi: 'asc' } }),
    db.user.findMany({
      where: { isActive: true },
      include: { role: true },
      orderBy: { fullName: 'asc' },
    }),
  ]);

  const categories: CategoryOption[] = catRows.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.nameVi,
  }));
  const authors: AuthorOption[] = userRows.map((u) => ({
    id: u.id,
    name: u.fullName || u.email,
    role: u.role?.name ?? '—',
  }));

  const isNew = params.slug === 'new';
  let initial = EMPTY();

  if (!isNew) {
    const a = await db.article.findUnique({ where: { slug: params.slug } });
    if (!a) notFound();

    initial = {
      id: a.id,
      slug: a.slug,
      categoryId: a.categoryId ?? '',
      authorId: a.authorId ?? '',
      titleVi: a.titleVi,
      titleEn: a.titleEn ?? '',
      titleZh: a.titleZh ?? '',
      excerptVi: a.excerptVi ?? '',
      excerptEn: a.excerptEn ?? '',
      excerptZh: a.excerptZh ?? '',
      contentVi: a.contentVi ?? '',
      contentEn: a.contentEn ?? '',
      contentZh: a.contentZh ?? '',
      coverImageUrl: a.coverImageUrl ?? '',
      readTimeMin: a.readTimeMin ?? 3,
      status: a.status as ArticleFormValue['status'],
      isFeatured: a.isFeatured,
      publishedDate: a.publishedAt ? a.publishedAt.toISOString().slice(0, 10) : todayIso(),
      tags: tagsFromJson(a.tags),
      metaTitleVi: a.metaTitleVi ?? '',
      metaDescVi: a.metaDescVi ?? '',
      views: a.views,
      comments: a.commentCount,
    };
  }

  return <ArticleForm initial={initial} categories={categories} authors={authors} isNew={isNew} />;
}
