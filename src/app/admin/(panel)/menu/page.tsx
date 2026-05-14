import { requirePermission } from '@/lib/auth-helpers';
import { ComingSoon } from '@/components/admin/ComingSoon';

export default async function AdminMenuPage() {
  await requirePermission('menu.update');
  return (
    <ComingSoon
      title="Menu navigation"
      crumb="Menu navigation"
      note="Kéo-thả sắp xếp menu header / footer. Menu hiện được seed sẵn trong bảng menus."
    />
  );
}
