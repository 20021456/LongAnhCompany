import { requirePermission, can } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import {
  MediaLibrary,
  type MediaItem,
  type MediaFolderOption,
} from '@/components/admin/MediaLibrary';

export default async function AdminMediaPage() {
  const user = await requirePermission('media.read');

  const [media, folders] = await Promise.all([
    db.media.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        folder: { select: { name: true } },
        uploadedBy: { select: { fullName: true } },
      },
    }),
    db.mediaFolder.findMany({ orderBy: { name: 'asc' } }),
  ]);

  const items: MediaItem[] = media.map((m) => ({
    id: m.id,
    url: m.url,
    filename: m.filename,
    altVi: m.altVi ?? '',
    altEn: m.altEn ?? '',
    altZh: m.altZh ?? '',
    caption: m.caption ?? '',
    tags: m.tags,
    folderId: m.folderId,
    folderName: m.folder?.name ?? null,
    width: m.width,
    height: m.height,
    size: m.size,
    mimeType: m.mimeType,
    uploadedByName: m.uploadedBy?.fullName ?? null,
    createdAt: m.createdAt.toISOString(),
  }));

  const folderOptions: MediaFolderOption[] = folders.map((f) => ({
    id: f.id,
    name: f.name,
  }));

  const totalSize = media.reduce((sum, m) => sum + (m.size ?? 0), 0);

  return (
    <MediaLibrary
      items={items}
      folders={folderOptions}
      canUpload={can(user, 'media.upload')}
      totalSizeBytes={totalSize}
    />
  );
}
