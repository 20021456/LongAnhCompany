/**
 * Browser-side upload helper for the admin forms. POSTs a `File` to the
 * authenticated `/api/admin/upload` route and returns the stored URL.
 *
 * If the request fails for any reason (offline, expired session, server
 * error) it degrades gracefully to an inline base64 `data:` URL — exactly
 * what the forms produced before S3 was wired — so the editor never blocks.
 */

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () =>
      typeof r.result === 'string' ? resolve(r.result) : reject(new Error('not a string'));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

/** Upload one image file, returning a usable URL (S3 or inline data URL). */
export async function uploadImage(file: File, folder?: string): Promise<string> {
  try {
    const fd = new FormData();
    fd.append('file', file);
    if (folder) fd.append('folder', folder);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const json = (await res.json()) as { url?: string };
      if (json.url) return json.url;
    }
  } catch {
    /* fall through to the data-URL fallback */
  }
  return fileToDataUrl(file);
}
