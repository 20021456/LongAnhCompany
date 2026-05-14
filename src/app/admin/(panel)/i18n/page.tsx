import { requirePermission } from '@/lib/auth-helpers';
import { ComingSoon } from '@/components/admin/ComingSoon';

export default async function AdminI18nPage() {
  await requirePermission('i18n.update');
  return (
    <ComingSoon
      title="Ngôn ngữ / Bản dịch"
      crumb="Ngôn ngữ"
      note="Bảng quản lý chuỗi dịch (key / VI / EN / ZH) + import/export JSON. Hiện chuỗi UI nằm trong messages/*.json."
    />
  );
}
