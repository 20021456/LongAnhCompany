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
  accent?: string;
  sideArrows?: boolean;
}

export function ProductCarousel({ products, locale, accent = '#F08023', sideArrows = true }: Props) {
  const [start, setStart] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [activeIdx, setActiveIdx] = useState(1);
  const n = products.length;
  const visible = 3;

  useEffect(() => {
    if (hovering) return;
    const id = setInterval(() => setStart((s) => (s + 1) % n), 5000);
    return () => clearInterval(id);
  }, [hovering, n]);

  const slice = Array.from({ length: visible }, (_, i) => products[(start + i) % n]);
  const next = () => setStart((start + 1) % n);
  const prev = () => setStart((start - 1 + n) % n);

  const badgeLabels = ['CaCO₃ Powder', 'Natural Stone'];
  const badgeLabelsVi = ['Bột đá CaCO₃', 'Đá ốp lát'];

  return (
    <div
      className={'la-carousel ' + (sideArrows ? 'side-arrows' : '')}
      style={{ ['--carousel-accent' as string]: accent } as React.CSSProperties}
    >
      <div className="la-cc-row">
        {sideArrows && (
          <button className="la-cc-arrow la-cc-arrow-side" onClick={prev} aria-label="Previous">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        <div className="la-cc-track">
          {slice.map((p, i) => (
            <Link
              key={`${start}-${i}-${p.code}`}
              href={`/${locale}/products/${p.slug}`}
              className={'la-cc ' + (i === activeIdx ? 'is-active' : '')}
              onMouseEnter={() => {
                setHovering(true);
                setActiveIdx(i);
              }}
              onMouseLeave={() => setHovering(false)}
            >
              <div className="la-cc-img-wrap">
                <div className="la-cc-img">
                  <SmartImage src={p.img} alt={p.name} width={600} height={450} sizes="360px" />
                </div>
                <div className="la-cc-badge">
                  {(locale === 'en' ? badgeLabels : badgeLabelsVi)[p.cat] || 'Product'}
                </div>
              </div>
              <div className="la-cc-body">
                <div className="la-cc-meta">{p.meta}</div>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <div className="la-cc-tags">
                  {p.tags.slice(0, 3).map((t, j) => (
                    <span key={j}>{t}</span>
                  ))}
                </div>
                <div className="la-cc-go">
                  {locale === 'vi' ? 'Xem chi tiết' : locale === 'en' ? 'See details' : '查看详情'} →
                </div>
              </div>
            </Link>
          ))}
        </div>
        {sideArrows && (
          <button className="la-cc-arrow la-cc-arrow-side" onClick={next} aria-label="Next">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        )}
      </div>
      <div className={'la-cc-nav ' + (sideArrows ? 'dots-only' : '')}>
        <div className="la-cc-dots">
          {products.map((_, i) => (
            <button
              key={i}
              className={'la-cc-dot ' + (i === start ? 'on' : '')}
              onClick={() => setStart(i)}
              aria-label={`Go to ${i + 1}`}
            />
          ))}
        </div>
        <div className="la-cc-arrows">
          <button className="la-cc-arrow" onClick={prev} aria-label="Previous">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button className="la-cc-arrow" onClick={next} aria-label="Next">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
