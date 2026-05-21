/**
 * Object storage helper for media uploads (article images, product gallery,
 * media library). Mirrors the env-gated pattern of `email.ts`:
 *
 *  - When the `S3_*` env vars are all set, files are uploaded to S3 and a
 *    public URL is returned.
 *  - When they are NOT set, the file is inlined as a base64 `data:` URL so
 *    local dev and the build sandbox keep working without any cloud account.
 *    (This is the behaviour the admin forms had before S3 was wired.)
 *
 * The caller never has to branch on configuration — it always gets a usable
 * URL back from `uploadObject()`.
 *
 * S3 note: this does NOT send an ACL. Modern buckets have ACLs disabled by
 * default; grant public read via a bucket policy (or front it with
 * CloudFront and set `S3_PUBLIC_URL`).
 */

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

interface S3Config {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicBaseUrl: string | null;
}

function readConfig(): S3Config | null {
  const bucket = process.env.S3_BUCKET;
  const region = process.env.S3_REGION;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!bucket || !region || !accessKeyId || !secretAccessKey) return null;
  return {
    bucket,
    region,
    accessKeyId,
    secretAccessKey,
    publicBaseUrl: process.env.S3_PUBLIC_URL?.trim() || null,
  };
}

/** True when S3 credentials are fully configured. */
export function isStorageConfigured(): boolean {
  return readConfig() !== null;
}

let cachedClient: S3Client | null | undefined;
function client(cfg: S3Config): S3Client {
  if (cachedClient) return cachedClient;
  cachedClient = new S3Client({
    region: cfg.region,
    credentials: { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey },
  });
  return cachedClient;
}

/** Slug-safe a filename so it is a valid, predictable S3 key segment. */
function safeName(name: string): string {
  const dot = name.lastIndexOf('.');
  const ext =
    dot > 0
      ? name
          .slice(dot)
          .toLowerCase()
          .replace(/[^.a-z0-9]/g, '')
      : '';
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return `${base || 'file'}${ext}`;
}

export interface UploadInput {
  buffer: Buffer;
  contentType: string;
  filename: string;
  /** Logical folder, e.g. "articles" or "products". Defaults to "uploads". */
  folder?: string;
}

export interface UploadResult {
  url: string;
  /** "s3" when uploaded to the bucket, "inline" when degraded to a data URL. */
  stored: 's3' | 'inline';
}

export async function uploadObject(input: UploadInput): Promise<UploadResult> {
  const cfg = readConfig();
  if (!cfg) {
    return {
      url: `data:${input.contentType};base64,${input.buffer.toString('base64')}`,
      stored: 'inline',
    };
  }

  const folder = (input.folder || 'uploads').replace(/[^a-z0-9/-]/gi, '');
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName(input.filename)}`;

  await client(cfg).send(
    new PutObjectCommand({
      Bucket: cfg.bucket,
      Key: key,
      Body: input.buffer,
      ContentType: input.contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );

  const base = cfg.publicBaseUrl
    ? cfg.publicBaseUrl.replace(/\/+$/, '')
    : `https://${cfg.bucket}.s3.${cfg.region}.amazonaws.com`;
  return { url: `${base}/${key}`, stored: 's3' };
}
