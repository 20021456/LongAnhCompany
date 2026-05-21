import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-helpers';
import { uploadObject } from '@/lib/storage';

/** Image uploads only — keep the surface small. */
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_FOLDERS = ['articles', 'products', 'media', 'pages'];

/**
 * Authenticated upload endpoint used by the admin forms. Streams the file to
 * S3 when configured, otherwise returns an inline data URL (see
 * `lib/storage.ts`). Either way the client just gets `{ url }` back.
 */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Thiếu tệp tải lên.' }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Chỉ chấp nhận tệp ảnh.' }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Ảnh vượt quá 8MB.' }, { status: 413 });
  }

  const folderRaw = String(form.get('folder') ?? 'uploads');
  const folder = ALLOWED_FOLDERS.includes(folderRaw) ? folderRaw : 'uploads';

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadObject({
      buffer,
      contentType: file.type,
      filename: file.name || 'image',
      folder,
    });
    return NextResponse.json({ url: result.url, stored: result.stored });
  } catch (err) {
    console.error('[upload] failed:', err);
    return NextResponse.json({ error: 'Tải ảnh lên thất bại.' }, { status: 500 });
  }
}
