import { describe, expect, it } from 'vitest';
import { fmtDateVn, fmtDateTimeVn, fmtHM, fmtNumberVn } from '@/lib/format';

describe('fmtDateVn', () => {
  it('formats a Date as dd/mm/yyyy with zero padding', () => {
    expect(fmtDateVn(new Date(2026, 4, 9))).toBe('09/05/2026');
  });

  it('accepts an ISO string', () => {
    expect(fmtDateVn('2026-12-25T08:00:00')).toBe('25/12/2026');
  });
});

describe('fmtDateTimeVn', () => {
  it('appends a zero-padded 24h time', () => {
    expect(fmtDateTimeVn(new Date(2026, 0, 3, 7, 5))).toBe('03/01/2026 07:05');
  });
});

describe('fmtHM', () => {
  it('formats hours and minutes', () => {
    expect(fmtHM(new Date(2026, 0, 1, 23, 9))).toBe('23:09');
  });
});

describe('fmtNumberVn', () => {
  it('groups thousands with a dot', () => {
    expect(fmtNumberVn(12450)).toBe('12.450');
    expect(fmtNumberVn(1000000)).toBe('1.000.000');
  });

  it('leaves small numbers untouched', () => {
    expect(fmtNumberVn(42)).toBe('42');
  });

  it('keeps the sign on negatives', () => {
    expect(fmtNumberVn(-9500)).toBe('-9.500');
  });

  it('truncates the fractional part', () => {
    expect(fmtNumberVn(1234.99)).toBe('1.234');
  });
});
