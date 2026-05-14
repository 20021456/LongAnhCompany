'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth-helpers';
import { recordAudit } from '@/lib/audit';

const lines = z.string().transform((s) =>
  s
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean),
);

const schema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  departmentId: z.string().min(1),
  titleVi: z.string().min(1),
  titleEn: z.string().optional(),
  titleZh: z.string().optional(),
  location: z.string().optional(),
  salaryTextVi: z.string().optional(),
  salaryTextEn: z.string().optional(),
  salaryTextZh: z.string().optional(),
  experienceVi: z.string().optional(),
  experienceEn: z.string().optional(),
  experienceZh: z.string().optional(),
  levelVi: z.string().optional(),
  levelEn: z.string().optional(),
  levelZh: z.string().optional(),
  typeVi: z.string().optional(),
  typeEn: z.string().optional(),
  typeZh: z.string().optional(),
  tagsText: z.string().default(''),
  descriptionVi: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionZh: z.string().optional(),
  respVi: lines.default(''),
  respEn: lines.default(''),
  respZh: lines.default(''),
  reqVi: lines.default(''),
  reqEn: lines.default(''),
  reqZh: lines.default(''),
  benVi: lines.default(''),
  benEn: lines.default(''),
  benZh: lines.default(''),
  deadlineText: z.string().optional(),
  slots: z.coerce.number().int().min(1).default(1),
  isActive: z.boolean().default(true),
});

export type JobInput = z.input<typeof schema>;
export type ActionResult = { ok?: boolean; error?: string };

function parseDeadline(d?: string): Date | null {
  if (!d) return null;
  const m = d.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!m) return null;
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
}

export async function saveJob(raw: JobInput): Promise<ActionResult> {
  const user = await requirePermission('jobs.update');
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' };
  }
  const d = parsed.data;

  try {
    const data = {
      departmentId: d.departmentId,
      titleVi: d.titleVi,
      titleEn: d.titleEn || null,
      titleZh: d.titleZh || null,
      location: d.location || null,
      salaryTextVi: d.salaryTextVi || null,
      salaryTextEn: d.salaryTextEn || null,
      salaryTextZh: d.salaryTextZh || null,
      experienceVi: d.experienceVi || null,
      experienceEn: d.experienceEn || null,
      experienceZh: d.experienceZh || null,
      levelVi: d.levelVi || null,
      levelEn: d.levelEn || null,
      levelZh: d.levelZh || null,
      typeVi: d.typeVi || null,
      typeEn: d.typeEn || null,
      typeZh: d.typeZh || null,
      tags: d.tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      descriptionVi: d.descriptionVi || null,
      descriptionEn: d.descriptionEn || null,
      descriptionZh: d.descriptionZh || null,
      responsibilities: { vi: d.respVi, en: d.respEn, zh: d.respZh },
      requirements: { vi: d.reqVi, en: d.reqEn, zh: d.reqZh },
      benefits: { vi: d.benVi, en: d.benEn, zh: d.benZh },
      deadline: parseDeadline(d.deadlineText),
      deadlineText: d.deadlineText || null,
      slots: d.slots,
      isActive: d.isActive,
    };

    const job = await db.job.upsert({
      where: { slug: d.slug },
      update: data,
      create: { slug: d.slug, ...data },
    });

    await recordAudit({
      userId: user.id,
      action: d.id ? 'update' : 'create',
      entityType: 'job',
      entityId: job.id,
    });

    revalidatePath('/admin/jobs');
    revalidatePath('/[locale]/career', 'page');
    return { ok: true };
  } catch (err) {
    console.error('saveJob error:', err);
    return { error: 'Không lưu được — slug có thể đã tồn tại.' };
  }
}

export async function deleteJob(id: string): Promise<ActionResult> {
  const user = await requirePermission('jobs.delete');
  try {
    await db.job.delete({ where: { id } });
    await recordAudit({ userId: user.id, action: 'delete', entityType: 'job', entityId: id });
    revalidatePath('/admin/jobs');
    revalidatePath('/[locale]/career', 'page');
    return { ok: true };
  } catch (err) {
    console.error('deleteJob error:', err);
    return { error: 'Không xoá được vị trí.' };
  }
}

export async function setApplicationStatus(id: string, status: string): Promise<ActionResult> {
  const user = await requirePermission('applications.update');
  try {
    await db.jobApplication.update({ where: { id }, data: { status } });
    await recordAudit({
      userId: user.id,
      action: 'update',
      entityType: 'job_application',
      entityId: id,
      changes: { status },
    });
    revalidatePath('/admin/jobs');
    return { ok: true };
  } catch (err) {
    console.error('setApplicationStatus error:', err);
    return { error: 'Không cập nhật được trạng thái.' };
  }
}
