import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead } from '@/components/admin/AdminPageHead';
import {
  CertificationForm,
  type CertificationFormValue,
} from '@/components/admin/CertificationForm';

const EMPTY: CertificationFormValue = {
  code: '',
  name: '',
  descriptionVi: '',
  descriptionEn: '',
  descriptionZh: '',
  badgeImageUrl: '',
  documentUrl: '',
  sortOrder: 0,
};

export default async function CertificationEditPage({ params }: { params: { id: string } }) {
  await requirePermission('pages.update');

  const isNew = params.id === 'new';
  let initial = EMPTY;

  if (!isNew) {
    const c = await db.certification.findUnique({ where: { id: params.id } });
    if (!c) notFound();
    initial = {
      id: c.id,
      code: c.code,
      name: c.name,
      descriptionVi: c.descriptionVi ?? '',
      descriptionEn: c.descriptionEn ?? '',
      descriptionZh: c.descriptionZh ?? '',
      badgeImageUrl: c.badgeImageUrl ?? '',
      documentUrl: c.documentUrl ?? '',
      sortOrder: c.sortOrder,
    };
  }

  return (
    <>
      <AdminPageHead
        crumbs={[
          { label: 'Chứng nhận', href: '/admin/certifications' },
          { label: isNew ? 'Thêm chứng nhận' : initial.name },
        ]}
        title={isNew ? 'Thêm chứng nhận' : `Sửa: ${initial.name}`}
      />
      <CertificationForm initial={initial} />
    </>
  );
}
