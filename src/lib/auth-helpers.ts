/**
 * Server-side auth helpers for the admin panel.
 *
 * Use in Server Components / route handlers to read the current admin
 * user and gate access by permission. The middleware already redirects
 * unauthenticated visitors away from /admin/* — these helpers add
 * fine-grained permission checks inside pages.
 */

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { hasPermission, type Permission } from '@/lib/permissions';

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  permissions: Record<string, boolean>;
}

/** Current admin user, or null if not signed in. */
export async function getCurrentUser(): Promise<AdminUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const u = session.user;
  return {
    id: u.id,
    email: u.email,
    name: u.name ?? null,
    role: u.role,
    permissions: u.permissions ?? {},
  };
}

/** Returns the user, or redirects to /admin/login if not signed in. */
export async function requireAuth(): Promise<AdminUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  return user;
}

/**
 * Returns the user, or redirects to /admin/dashboard if they lack the
 * given permission. super_admin always passes.
 */
export async function requirePermission(perm: Permission): Promise<AdminUser> {
  const user = await requireAuth();
  if (user.role === 'super_admin') return user;
  if (!hasPermission(user.permissions, perm)) {
    redirect('/admin/dashboard');
  }
  return user;
}

/** Non-redirecting check — handy for conditionally rendering UI. */
export function can(user: AdminUser | null, perm: Permission): boolean {
  if (!user) return false;
  if (user.role === 'super_admin') return true;
  return hasPermission(user.permissions, perm);
}
