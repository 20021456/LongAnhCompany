import { requirePermission } from '@/lib/auth-helpers';
import { ComingSoon } from '@/components/admin/ComingSoon';

export default async function AdminMediaPage() {
  await requirePermission('media.read');
  return (
    <ComingSoon
      title="Thư viện ảnh"
      crumb="Thư viện ảnh"
      note="Upload, sắp xếp và quản lý ảnh (S3 / Cloudinary). Hiện ảnh phục vụ từ public/assets."
    />
  );
}
