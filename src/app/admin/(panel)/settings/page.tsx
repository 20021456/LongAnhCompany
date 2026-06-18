import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead, AdminEmpty } from '@/components/admin/AdminPageHead';
import { SettingsForm, type SettingRow } from '@/components/admin/SettingsForm';

const GROUP_ORDER = ['brand', 'contact', 'social', 'general'];

export default async function AdminSettingsPage() {
  await requirePermission('settings.update');

  // Đảm bảo các kênh mạng xã hội mới luôn có row để chỉnh sửa, kể cả với DB
  // đã seed từ trước (idempotent — không ghi đè giá trị đang có).
  const SOCIAL_DEFAULTS: Record<string, string> = {
    'social.whatsapp': 'https://wa.me/84942224499',
    'social.youtube': 'https://www.youtube.com/@longanhcorp',
  };
  await db.$transaction(
    Object.entries(SOCIAL_DEFAULTS).map(([key, url]) =>
      db.setting.upsert({
        where: { key },
        update: {},
        create: { key, group: 'social', valueVi: url, valueEn: url, valueZh: url },
      }),
    ),
  );

  const settings = await db.setting.findMany();
  const rows: SettingRow[] = settings
    .map((s) => ({
      key: s.key,
      group: s.group,
      vi: s.valueVi ?? '',
      en: s.valueEn ?? '',
      zh: s.valueZh ?? '',
    }))
    .sort(
      (a, b) =>
        GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group) ||
        a.key.localeCompare(b.key),
    );

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Cài đặt site' }]}
        title="Cài đặt site"
        sub="Thông tin thương hiệu, liên hệ và mạng xã hội — dùng chung toàn website"
      />
      {rows.length === 0 ? (
        <AdminEmpty>Chưa có cài đặt nào. Chạy `npm run prisma:seed` để khởi tạo.</AdminEmpty>
      ) : (
        <SettingsForm rows={rows} />
      )}
    </>
  );
}
