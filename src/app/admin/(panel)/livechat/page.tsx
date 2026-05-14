import { requireAuth } from '@/lib/auth-helpers';
import { ComingSoon } from '@/components/admin/ComingSoon';

export default async function AdminLivechatPage() {
  await requireAuth();
  return (
    <ComingSoon
      title="Hỗ trợ trực tiếp"
      crumb="Hỗ trợ trực tiếp"
      note="Live chat real-time (Socket.io) với khách truy cập website — sẽ thêm ở bản cập nhật tiếp theo."
    />
  );
}
