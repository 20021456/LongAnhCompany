'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { SmartImage } from '@/components/ui/SmartImage';

interface Product {
  code: string;
  slug: string;
  cat: number;
  img: string;
  name: string;
  meta: string;
  desc: string;
  tags: string[];
}

interface Props {
  products: Product[];
  locale: Locale;
}

const AUTOPLAY_MS = 6000;

/**
 * Editorial product showcase (home). Same data contract as ProductCarousel:
 * one large media panel with crossfading imagery on the left, product story
 * on the right, and a numbered index that doubles as navigation. Autoplays,
 * pauses on hover.
 */
export function ProductShowcase({ products, locale }: Props) {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const n = products.length;

  useEffect(() => {
    if (hovering || n < 2) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % n), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, hovering, n]);

  if (n === 0) return null;
  const p = products[active];

  const badgeLabels =
    locale === 'en'
      ? ['CaCO₃ Powder', 'Natural Stone']
      : locale === 'zh'
        ? ['碳酸钙粉', '天然石材']
        : ['Bột đá CaCO₃', 'Đá ốp lát'];
  const ctaLabel = locale === 'vi' ? 'Xem chi tiết' : locale === 'en' ? 'See details' : '查看详情';
  const indexLabel = locale === 'vi' ? 'Dòng sản phẩm' : locale === 'en' ? 'Product lines' : '产品系列';

  const nn = (i: number) => String(i + 1).padStart(2, '0');

  return (
    <div
      className="la-sc"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* media */}
      <div className="la-sc-media">
        {products.map((it, i) => (
          <div key={it.code} className={'la-sc-slide ' + (i === active ? 'on' : '')} aria-hidden={i !== active}>
            <SmartImage src={it.img} alt={it.name} width={1200} height={900} sizes="60vw" />
          </div>
        ))}
        <div className="la-sc-media-shade" />
        <div className="la-sc-badge">{badgeLabels[p.cat] || 'Product'}</div>
        <div className="la-sc-ghost" key={`g-${active}`}>
          {nn(active)}
        </div>
      </div>

      {/* panel */}
      <div className="la-sc-panel">
        <div className="la-sc-story" key={active}>
          <div className="la-sc-meta">
            <span>{p.meta}</span>
            <span className="la-sc-count">
              {nn(active)} / {nn(n - 1)}
            </span>
          </div>
          <h3>{p.name}</h3>
          <p>{p.desc}</p>
          <div className="la-sc-tags">
            {p.tags.slice(0, 4).map((t, j) => (
              <span key={j}>{t}</span>
            ))}
          </div>
          <Link className="va-btn va-btn-p la-sc-cta" href={`/${locale}/products/${p.slug}`}>
            {ctaLabel}{' '}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <div className="la-sc-dots">
          {products.map((it, i) => (
            <button
              key={it.code}
              className={i === active ? 'on' : ''}
              onClick={() => setActive(i)}
              aria-label={it.name}
            />
          ))}
        </div>

        <div className="la-sc-index">
          <div className="la-sc-index-label">{indexLabel}</div>
          {products.map((it, i) => (
            <button
              key={it.code}
              className={'la-sc-row ' + (i === active ? 'on' : '')}
              onClick={() => setActive(i)}
              aria-label={it.name}
              aria-current={i === active}
            >
              <span className="num">{nn(i)}</span>
              <span className="name">{it.name}</span>
              <span className="track">
                {i === active && !hovering && n > 1 ? (
                  <span className="bar" key={`b-${active}`} style={{ animationDuration: `${AUTOPLAY_MS}ms` }} />
                ) : null}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
