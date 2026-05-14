import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead } from '@/components/admin/AdminPageHead';
import { ArticleForm, type ArticleFormValue } from '@/components/admin/ArticleForm';

const EMPTY: ArticleFormValue = {
  slug: '',
  categoryId: '',
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
};

export default async function ArticleEditPage({ params }: { params: { slug: string } }) {
  await requirePermission('news.update');

  const catRows = await db.newsCategory.findMany({ orderBy: { nameVi: 'asc' } });
  const categories = catRows.map((c) => ({ id: c.id, name: c.nameVi }));

  const isNew = params.slug === 'new';
  let initial = EMPTY;

  if (!isNew) {
    const a = await db.article.findUnique({ where: { slug: params.slug } });
    if (!a) notFound();
    initial = {
      id: a.id,
      slug: a.slug,
      categoryId: a.categoryId ?? '',
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
    };
  }

  return (
    <>
      <AdminPageHead
        crumbs={[
          { label: 'Tin tức', href: '/admin/news' },
          { label: isNew ? 'Viết bài mới' : initial.titleVi },
        ]}
        title={isNew ? 'Viết bài mới' : `Sửa: ${initial.titleVi}`}
      />
      <ArticleForm initial={initial} categories={categories} />
    </>
  );
}
