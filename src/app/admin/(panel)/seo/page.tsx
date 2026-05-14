import { requirePermission } from '@/lib/auth-helpers';
import { ComingSoon } from '@/components/admin/ComingSoon';

export default async function AdminSeoPage() {
  await requirePermission('seo.update');
  return (
    <ComingSoon
      title="SEO mặc định"
      crumb="SEO mặc định"
      note="Meta title/description, OG image, sitemap, robots.txt — sẽ thêm cùng Phase 7 (SEO & performance)."
    />
  );
}
