/**
 * Permission keys used across the admin panel.
 *
 * Format: `<resource>.<action>` — checked by middleware/handlers against
 * `roles.permissions` JSON loaded into the JWT.
 */

export const PERMISSIONS = {
  // Content
  'pages.read': 'View pages',
  'pages.update': 'Edit page content',
  'products.read': 'View products',
  'products.create': 'Create products',
  'products.update': 'Edit products',
  'products.delete': 'Delete products',
  'news.read': 'View articles',
  'news.create': 'Create articles',
  'news.update': 'Edit articles',
  'news.delete': 'Delete articles',
  // HR
  'jobs.read': 'View jobs',
  'jobs.create': 'Create jobs',
  'jobs.update': 'Edit jobs',
  'jobs.delete': 'Delete jobs',
  'applications.read': 'View job applications',
  'applications.update': 'Update application status',
  // Sales / CRM
  'contacts.read': 'View leads',
  'contacts.update': 'Update lead status / assign',
  // Media
  'media.read': 'Browse media',
  'media.upload': 'Upload media',
  'media.delete': 'Delete media',
  // System
  'menu.update': 'Edit menu',
  'seo.update': 'Edit SEO',
  'i18n.update': 'Edit translations',
  'settings.update': 'Edit settings',
  'users.read': 'View users',
  'users.manage': 'Manage users & roles',
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(
  userPermissions: Record<string, boolean> | undefined,
  perm: Permission,
): boolean {
  if (!userPermissions) return false;
  return userPermissions[perm] === true;
}

// Default permission set per role — used when seeding the database.
export const DEFAULT_ROLE_PERMISSIONS: Record<string, Record<string, boolean>> = {
  super_admin: Object.fromEntries(
    (Object.keys(PERMISSIONS) as Permission[]).map((k) => [k, true]),
  ),
  editor: {
    'pages.read': true,
    'pages.update': true,
    'products.read': true,
    'products.create': true,
    'products.update': true,
    'products.delete': true,
    'news.read': true,
    'news.create': true,
    'news.update': true,
    'news.delete': true,
    'jobs.read': true,
    'jobs.create': true,
    'jobs.update': true,
    'jobs.delete': true,
    'media.read': true,
    'media.upload': true,
    'media.delete': true,
    'menu.update': true,
    'seo.update': true,
    'i18n.update': true,
  },
  sales: {
    'contacts.read': true,
    'contacts.update': true,
    'products.read': true,
  },
  hr: {
    'jobs.read': true,
    'jobs.create': true,
    'jobs.update': true,
    'jobs.delete': true,
    'applications.read': true,
    'applications.update': true,
  },
  viewer: Object.fromEntries(
    (Object.keys(PERMISSIONS) as Permission[])
      .filter((k) => k.endsWith('.read'))
      .map((k) => [k, true]),
  ),
};
