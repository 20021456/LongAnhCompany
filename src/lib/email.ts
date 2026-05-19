/**
 * Resend-based email helper. Used by the contact + job-application API
 * routes to notify the sales / HR inbox when a new submission arrives.
 *
 * Behaviour: when `RESEND_API_KEY` is not set, this is a no-op (logs a
 * warning instead of throwing) so local dev and the build sandbox don't
 * choke. Failure to send is always swallowed — the calling route has
 * already persisted the row to the database.
 */

import { Resend } from 'resend';

const FROM = process.env.EMAIL_FROM || 'Long Anh <onboarding@resend.dev>';

let cached: Resend | null | undefined;
function client(): Resend | null {
  if (cached !== undefined) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn('[email] RESEND_API_KEY is not set — outbound email disabled.');
    cached = null;
    return null;
  }
  cached = new Resend(key);
  return cached;
}

export interface NotificationEmail {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendNotificationEmail(msg: NotificationEmail): Promise<void> {
  const r = client();
  if (!r || !msg.to) return;
  try {
    await r.emails.send({
      from: FROM,
      to: [msg.to],
      subject: msg.subject,
      html: msg.html,
      ...(msg.replyTo ? { replyTo: msg.replyTo } : {}),
    });
  } catch (err) {
    console.error('[email] send failed:', err);
  }
}

/** Tiny HTML escape for safe embedding of user-submitted strings. */
export function esc(s: string | null | undefined): string {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
