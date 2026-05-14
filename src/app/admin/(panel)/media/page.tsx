import { requirePermission, can } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead } from '@/components/admin/AdminPageHead';
import { MediaLibrary, type MediaItem } from '@/components/admin/MediaLibrary';

export default async function AdminMediaPage() {
  const user = await requirePermission('media.read');

  const media = await db.media.findMany({ orderBy: { createdAt: 'desc' } });
  const items: MediaItem[] = media.map((m) => ({
    id: m.id,
    url: m.url,
    filename: m.filename,
    altVi: m.altVi ?? '',
    altEn: m.altEn ?? '',
    altZh: m.altZh ?? '',
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Thư viện ảnh' }]}
        title="Thư viện ảnh"
        sub={`${items.length} ảnh trong thư viện`}
      />
      <MediaLibrary items={items} canUpload={can(user, 'media.upload')} />
    </>
  );
}
