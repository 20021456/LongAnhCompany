import { describe, expect, it } from 'vitest';
import { cn, pickLocale } from '@/lib/utils';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('drops falsy values', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b');
  });

  it('lets later Tailwind utilities win over earlier ones', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});

describe('pickLocale', () => {
  const row = { nameVi: 'Bột đá', nameEn: 'Powder', nameZh: '石粉' };

  it('returns the requested locale column', () => {
    expect(pickLocale(row, 'name', 'en')).toBe('Powder');
    expect(pickLocale(row, 'name', 'zh')).toBe('石粉');
  });

  it('falls back to Vietnamese when the locale column is missing', () => {
    expect(pickLocale({ nameVi: 'Bột đá' }, 'name', 'en')).toBe('Bột đá');
  });

  it('returns an empty string when nothing matches', () => {
    expect(pickLocale({}, 'name', 'en')).toBe('');
  });
});
