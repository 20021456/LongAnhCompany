'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth-helpers';
import { recordAudit } from '@/lib/audit';
import { PERMISSIONS } from '@/lib/permissions';

export type ActionResult = { ok?: boolean; error?: string };

const createSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  fullName: z.string().min(1, 'Họ tên không được để trống'),
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
  roleId: z.string().min(1, 'Phải chọn vai trò'),
  isActive: z.boolean().default(true),
});

export async function createUser(raw: z.input<typeof createSchema>): Promise<ActionResult> {
  const actor = await requirePermission('users.manage');
  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' };
  }
  const d = parsed.data;

  try {
    const user = await db.user.create({
      data: {
        email: d.email.toLowerCase().trim(),
        fullName: d.fullName,
        passwordHash: await bcrypt.hash(d.password, 10),
        roleId: d.roleId,
        isActive: d.isActive,
      },
    });
    await recordAudit({
      userId: actor.id,
      action: 'create',
      entityType: 'user',
      entityId: user.id,
    });
    revalidatePath('/admin/roles');
    return { ok: true };
  } catch (err) {
    console.error('createUser error:', err);
    return { error: 'Không tạo được người dùng — email có thể đã tồn tại.' };
  }
}

const updateSchema = z.object({
  id: z.string().min(1),
  fullName: z.string().min(1, 'Họ tên không được để trống'),
  roleId: z.string().min(1, 'Phải chọn vai trò'),
  isActive: z.boolean(),
  password: z.string().optional(),
});

export async function updateUser(raw: z.input<typeof updateSchema>): Promise<ActionResult> {
  const actor = await requirePermission('users.manage');
  const parsed = updateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' };
  }
  const d = parsed.data;
  if (d.id === actor.id && !d.isActive) {
    return { error: 'Không thể tự khoá tài khoản của chính bạn.' };
  }
  if (d.password && d.password.length < 8) {
    return { error: 'Mật khẩu mới tối thiểu 8 ký tự.' };
  }

  try {
    await db.user.update({
      where: { id: d.id },
      data: {
        fullName: d.fullName,
        roleId: d.roleId,
        isActive: d.isActive,
        ...(d.password ? { passwordHash: await bcrypt.hash(d.password, 10) } : {}),
      },
    });
    await recordAudit({
      userId: actor.id,
      action: 'update',
      entityType: 'user',
      entityId: d.id,
    });
    revalidatePath('/admin/roles');
    return { ok: true };
  } catch (err) {
    console.error('updateUser error:', err);
    return { error: 'Không cập nhật được người dùng.' };
  }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  const actor = await requirePermission('users.manage');
  if (id === actor.id) {
    return { error: 'Không thể xoá tài khoản của chính bạn.' };
  }
  try {
    await db.user.delete({ where: { id } });
    await recordAudit({ userId: actor.id, action: 'delete', entityType: 'user', entityId: id });
    revalidatePath('/admin/roles');
    return { ok: true };
  } catch (err) {
    console.error('deleteUser error:', err);
    return { error: 'Không xoá được — người dùng có thể đang gắn với dữ liệu khác.' };
  }
}

const VALID_PERMS = new Set(Object.keys(PERMISSIONS));

export async function saveRolePermissions(raw: {
  roleId: string;
  permissions: Record<string, boolean>;
}): Promise<ActionResult> {
  const actor = await requirePermission('users.manage');
  if (!raw.roleId) return { error: 'Thiếu vai trò.' };

  try {
    const role = await db.role.findUnique({ where: { id: raw.roleId } });
    if (!role) return { error: 'Vai trò không tồn tại.' };
    if (role.name === 'super_admin') {
      return { error: 'Vai trò super_admin luôn có toàn quyền — không thể chỉnh.' };
    }

    // Keep only known permission keys that are explicitly enabled.
    const clean: Record<string, boolean> = {};
    for (const [k, v] of Object.entries(raw.permissions)) {
      if (v === true && VALID_PERMS.has(k)) clean[k] = true;
    }

    await db.role.update({
      where: { id: raw.roleId },
      data: { permissions: clean },
    });
    await recordAudit({
      userId: actor.id,
      action: 'update',
      entityType: 'role',
      entityId: raw.roleId,
    });
    revalidatePath('/admin/roles');
    return { ok: true };
  } catch (err) {
    console.error('saveRolePermissions error:', err);
    return { error: 'Không lưu được phân quyền.' };
  }
}
