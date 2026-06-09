import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead, AdminEmpty } from '@/components/admin/AdminPageHead';
import { SettingsForm, type SettingRow } from '@/components/admin/SettingsForm';

const GROUP_ORDER = ['brand', 'contact', 'social', 'general'];

export default async function AdminSettingsPage() {
  await requirePermission('settings.update');

  // Đảm bảo các kênh mạng xã hội mới luôn có row để chỉnh sửa, kể cả với DB
  // đã seed từ trước (idempotent — không ghi đè giá trị đang có).
  await db.setting.upsert({
    where: { key: 'social.whatsapp' },
    update: {},
    create: {
      key: 'social.whatsapp',
      group: 'social',
      valueVi: 'https://wa.me/84942224499',
      valueEn: 'https://wa.me/84942224499',
      valueZh: 'https://wa.me/84942224499',
    },
  });

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
