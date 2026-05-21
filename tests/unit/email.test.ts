import { describe, expect, it } from 'vitest';
import { esc } from '@/lib/email';

describe('esc', () => {
  it('escapes the five HTML-significant characters', () => {
    expect(esc(`<script>"a" & 'b'</script>`)).toBe(
      '&lt;script&gt;&quot;a&quot; &amp; &#39;b&#39;&lt;/script&gt;',
    );
  });

  it('returns an empty string for null / undefined', () => {
    expect(esc(null)).toBe('');
    expect(esc(undefined)).toBe('');
  });

  it('leaves plain text untouched', () => {
    expect(esc('Nguyễn Văn A')).toBe('Nguyễn Văn A');
  });
});
