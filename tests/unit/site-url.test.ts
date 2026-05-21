import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { absUrl, hreflangAlternates, siteUrl } from '@/lib/site-url';

const ENV_KEYS = ['NEXT_PUBLIC_SITE_URL', 'NEXTAUTH_URL'] as const;

describe('site-url helpers', () => {
  let saved: Record<string, string | undefined>;

  beforeEach(() => {
    saved = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));
    for (const k of ENV_KEYS) delete process.env[k];
  });

  afterEach(() => {
    for (const k of ENV_KEYS) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  });

  describe('siteUrl', () => {
    it('prefers NEXT_PUBLIC_SITE_URL and strips trailing slashes', () => {
      process.env.NEXT_PUBLIC_SITE_URL = 'https://longanhcorp.com/';
      expect(siteUrl()).toBe('https://longanhcorp.com');
    });

    it('falls back to NEXTAUTH_URL', () => {
      process.env.NEXTAUTH_URL = 'https://staging.longanhcorp.com';
      expect(siteUrl()).toBe('https://staging.longanhcorp.com');
    });

    it('falls back to localhost in dev', () => {
      expect(siteUrl()).toBe('http://localhost:3000');
    });
  });

  describe('absUrl', () => {
    it('prefixes a relative path with the site URL', () => {
      process.env.NEXT_PUBLIC_SITE_URL = 'https://longanhcorp.com';
      expect(absUrl('/vi/products')).toBe('https://longanhcorp.com/vi/products');
    });

    it('adds a leading slash when missing', () => {
      process.env.NEXT_PUBLIC_SITE_URL = 'https://longanhcorp.com';
      expect(absUrl('vi/products')).toBe('https://longanhcorp.com/vi/products');
    });

    it('returns absolute URLs untouched', () => {
      expect(absUrl('https://cdn.example.com/a.png')).toBe('https://cdn.example.com/a.png');
    });
  });

  describe('hreflangAlternates', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_SITE_URL = 'https://longanhcorp.com';
    });

    it('builds a canonical for the current locale', () => {
      const { canonical } = hreflangAlternates('en', '/products');
      expect(canonical).toBe('https://longanhcorp.com/en/products');
    });

    it('emits one entry per locale plus x-default', () => {
      const { languages } = hreflangAlternates('vi', '/news');
      expect(languages).toEqual({
        vi: 'https://longanhcorp.com/vi/news',
        en: 'https://longanhcorp.com/en/news',
        zh: 'https://longanhcorp.com/zh/news',
        'x-default': 'https://longanhcorp.com/vi/news',
      });
    });

    it('strips an existing leading locale segment from the path', () => {
      const { canonical } = hreflangAlternates('zh', '/en/about');
      expect(canonical).toBe('https://longanhcorp.com/zh/about');
    });

    it('handles the site root', () => {
      const { canonical, languages } = hreflangAlternates('vi', '/');
      expect(canonical).toBe('https://longanhcorp.com/vi');
      expect(languages['x-default']).toBe('https://longanhcorp.com/vi');
    });
  });
});
