'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth-helpers';
import { recordAudit } from '@/lib/audit';

const itemSchema = z.object({
  labelVi: z.string().min(1, 'Nhãn (VI) không được để trống'),
  labelEn: z.string().optional(),
  labelZh: z.string().optional(),
  url: z.string().min(1, 'Đường dẫn không được để trống'),
  target: z.enum(['_self', '_blank']).default('_self'),
  isActive: z.boolean().default(true),
});

const schema = z.object({
  location: z.enum(['header', 'footer']),
  items: z.array(itemSchema),
});

export type MenuItemInput = z.input<typeof itemSchema>;
export type ActionResult = { ok?: boolean; error?: string };

/**
 * Replace every item of a menu in one shot. The editor sends the full
 * ordered list, so we delete-then-recreate inside a transaction — the
 * same strategy the seed uses.
 */
export async function saveMenu(raw: {
  location: string;
  items: MenuItemInput[];
}): Promise<ActionResult> {
  const user = await requirePermission('menu.update');
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' };
  }
  const d = parsed.data;

  try {
    const menu = await db.menu.upsert({
      where: { location: d.location },
      update: {},
      create: { location: d.location, name: `${d.location} menu` },
    });

    await db.$transaction([
      db.menuItem.deleteMany({ where: { menuId: menu.id } }),
      db.menuItem.createMany({
        data: d.items.map((it, i) => ({
          menuId: menu.id,
          labelVi: it.labelVi,
          labelEn: it.labelEn || null,
          labelZh: it.labelZh || null,
          url: it.url,
          target: it.target,
          isActive: it.isActive,
          sortOrder: i,
        })),
      }),
    ]);

    await recordAudit({
      userId: user.id,
      action: 'update',
      entityType: 'menu',
      entityId: d.location,
    });

    revalidatePath('/admin/menu');
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (err) {
    console.error('saveMenu error:', err);
    return { error: 'Không lưu được menu.' };
  }
}
