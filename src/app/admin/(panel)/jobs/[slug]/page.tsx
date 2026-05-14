import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead } from '@/components/admin/AdminPageHead';
import { JobForm, type JobFormValue } from '@/components/admin/JobForm';

type LArr = { vi?: string[]; en?: string[]; zh?: string[] } | null;
const join = (arr: string[] | undefined) => (arr ?? []).join('\n');

const EMPTY: JobFormValue = {
  slug: '',
  departmentId: '',
  titleVi: '',
  titleEn: '',
  titleZh: '',
  location: '',
  salaryTextVi: '',
  salaryTextEn: '',
  salaryTextZh: '',
  experienceVi: '',
  experienceEn: '',
  experienceZh: '',
  levelVi: '',
  levelEn: '',
  levelZh: '',
  typeVi: 'Toàn thời gian',
  typeEn: 'Full-time',
  typeZh: '全职',
  tagsText: '',
  descriptionVi: '',
  descriptionEn: '',
  descriptionZh: '',
  respVi: '',
  respEn: '',
  respZh: '',
  reqVi: '',
  reqEn: '',
  reqZh: '',
  benVi: '',
  benEn: '',
  benZh: '',
  deadlineText: '',
  slots: 1,
  isActive: true,
};

export default async function JobEditPage({ params }: { params: { slug: string } }) {
  await requirePermission('jobs.update');

  const deptRows = await db.department.findMany({ orderBy: { nameVi: 'asc' } });
  const departments = deptRows.map((d) => ({ id: d.id, name: d.nameVi }));

  const isNew = params.slug === 'new';
  let initial = EMPTY;

  if (!isNew) {
    const j = await db.job.findUnique({ where: { slug: params.slug } });
    if (!j) notFound();
    const resp = j.responsibilities as unknown as LArr;
    const req = j.requirements as unknown as LArr;
    const ben = j.benefits as unknown as LArr;
    initial = {
      id: j.id,
      slug: j.slug,
      departmentId: j.departmentId,
      titleVi: j.titleVi,
      titleEn: j.titleEn ?? '',
      titleZh: j.titleZh ?? '',
      location: j.location ?? '',
      salaryTextVi: j.salaryTextVi ?? '',
      salaryTextEn: j.salaryTextEn ?? '',
      salaryTextZh: j.salaryTextZh ?? '',
      experienceVi: j.experienceVi ?? '',
      experienceEn: j.experienceEn ?? '',
      experienceZh: j.experienceZh ?? '',
      levelVi: j.levelVi ?? '',
      levelEn: j.levelEn ?? '',
      levelZh: j.levelZh ?? '',
      typeVi: j.typeVi ?? '',
      typeEn: j.typeEn ?? '',
      typeZh: j.typeZh ?? '',
      tagsText: ((j.tags as unknown as string[] | null) ?? []).join(', '),
      descriptionVi: j.descriptionVi ?? '',
      descriptionEn: j.descriptionEn ?? '',
      descriptionZh: j.descriptionZh ?? '',
      respVi: join(resp?.vi),
      respEn: join(resp?.en),
      respZh: join(resp?.zh),
      reqVi: join(req?.vi),
      reqEn: join(req?.en),
      reqZh: join(req?.zh),
      benVi: join(ben?.vi),
      benEn: join(ben?.en),
      benZh: join(ben?.zh),
      deadlineText: j.deadlineText ?? '',
      slots: j.slots,
      isActive: j.isActive,
    };
  }

  return (
    <>
      <AdminPageHead
        crumbs={[
          { label: 'Tuyển dụng', href: '/admin/jobs' },
          { label: isNew ? 'Thêm vị trí' : initial.titleVi },
        ]}
        title={isNew ? 'Thêm vị trí tuyển dụng' : `Sửa: ${initial.titleVi}`}
      />
      <JobForm initial={initial} departments={departments} />
    </>
  );
}
