import { requirePermission } from '@/lib/auth-helpers';
import { ComingSoon } from '@/components/admin/ComingSoon';

export default async function AdminPagesPage() {
  await requirePermission('pages.read');
  return (
    <ComingSoon
      title="Quản lý Trang"
      crumb="Trang"
      note="Chỉnh sửa từng section của trang chủ / giới thiệu / sản phẩm — sẽ thêm ở bản cập nhật tiếp theo. Hiện nội dung trang đọc từ COPY + DB."
    />
  );
}
