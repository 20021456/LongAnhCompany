'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { Icon } from '@/components/ui/Icon';
import { SmartImage } from '@/components/ui/SmartImage';
import type { ProductsTile, ProductsParticleSection } from '@/lib/products-page-content';

interface Product {
  code: string;
  cat: number;
  img: string;
  name: string;
  meta: string;
  desc: string;
  tags: string[];
}

interface Props {
  locale: Locale;
  products: Product[];
  cats: string[];
  /** Visual category tiles — driven by the products page CMS section. */
  tiles: ProductsTile[];
  /** Particle-size visualizer — driven by the products page CMS section. */
  particle: ProductsParticleSection;
  /** Ordered list of product codes to show. Empty → show all (catalog order). */
  skuListCodes: string[];
}

/**
 * Big intro headers shown above each category group. These are layout copy
 * (not per-page CMS content) so they stay hard-coded by category index.
 */
const CAT_HEAD: Record<number, { title: Record<Locale, string>; desc: Record<Locale, string> }> = {
  0: {
    title: {
      vi: 'Từ đá vôi nguyên sinh — đến bột mịn cho công nghiệp',
      en: 'From raw limestone — to fine powder for industry',
      zh: '从原始石灰岩 — 到工业用细粉',
    },
    desc: {
      vi: 'Sản phẩm bột đá CaCO₃ được nghiền từ đá vôi trắng nguyên sinh tại Quỳ Hợp – Nghệ An, độ trắng > 98% và CaCO₃ > 98.5%. Cỡ hạt 3–20 µm, dùng làm phụ gia cho nhiều ngành công nghiệp.',
      en: 'Our CaCO₃ powder is milled from pristine white limestone at our Quy Hop quarry in Nghe An — whiteness above 98% and CaCO₃ content above 98.5%. Particle sizes range from 3 to 20 µm, used as an additive across many industries.',
      zh: '我们的碳酸钙粉是从义安省归合矿场的原始白石灰岩研磨加工而成 — 白度超过98%,碳酸钙含量超过98.5%。粒径范围3至20微米,用作多个行业的添加剂。',
    },
  },
  1: {
    title: {
      vi: 'Đá tự nhiên — cho công trình và không gian sống',
      en: 'Natural stone — for architecture and living spaces',
      zh: '天然石材 — 用于建筑和生活空间',
    },
    desc: {
      vi: 'Đá tự nhiên Long Anh được khai thác và chế biến trực tiếp tại mỏ — đảm bảo chất lượng đồng đều, nguồn cung ổn định. Gồm đá Slab tấm lớn, đá xẻ quy cách và đá trang trí ngoại thất với nhiều hoàn thiện.',
      en: 'Long Anh natural stone is mined and processed in-house — ensuring consistent quality and reliable supply. Includes large-format Slab, cut-to-size tile and decorative outdoor stone with various finishes.',
      zh: '龙英天然石材在矿场直接开采加工 — 确保品质均匀和稳定供应。包括大板、定制石材和装饰石材,提供多种表面饰面选择。',
    },
  },
};

/** "5, 8, 10, 12, 15, 17, 18, 20" → [5, 8, 10, 12, 15, 17, 18, 20] */
function parseSizes(raw: string): number[] {
  return raw
    .split(/[,;\s]+/)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n) && n > 0);
}

export function ProductsBrowser({
  locale,
  products,
  cats,
  tiles,
  particle,
  skuListCodes,
}: Props) {
  // null = show both categories; 0 / 1 = filter to that category
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const loc = locale;

  // Apply the CMS sku-list ordering when provided.
  const visibleProducts =
    skuListCodes.length > 0
      ? (skuListCodes
          .map((code) => products.find((p) => p.code === code))
          .filter(Boolean) as Product[])
      : products;

  const onTileClick = (catIndex: number, anchor: string) => {
    const next = activeCat === catIndex ? null : catIndex;
    setActiveCat(next);
    if (next !== null && anchor) {
      setTimeout(() => {
        document
          .getElementById(`cat-${anchor}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  const groups = tiles
    .map((tile, ti) => ({
      ci: ti,
      anchor: tile.anchor || (ti === 0 ? 'powder' : 'stone'),
      products: visibleProducts.filter((p) => p.cat === ti),
    }))
    .filter((g) => activeCat === null || activeCat === g.ci);

  // Particle size visualizer only relevant for the first category (CaCO₃ powder)
  const showSizes = activeCat === null || activeCat === 0;
  const uncoatedSizes = parseSizes(particle.uncoatedSizes);
  const coatedSizes = parseSizes(particle.coatedSizes);

  return (
    <>
      {/* CATEGORY TILES */}
      <section className="pr-section tight">
        <div className="va-wrap">
          <div className="pr-cat-tiles">
            {tiles.map((tile, ti) => {
              const anchor = tile.anchor || (ti === 0 ? 'powder' : 'stone');
              const cnt = visibleProducts.filter((p) => p.cat === ti).length;
              const isActive = activeCat === ti;
              return (
                <a
                  key={anchor || ti}
                  href={`#cat-${anchor}`}
                  className="pr-cat-tile"
                  aria-current={isActive ? 'true' : undefined}
                  style={
                    isActive ? { outline: '3px solid var(--brand-accent,#F08023)' } : undefined
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    onTileClick(ti, anchor);
                  }}
                >
                  <SmartImage
                    src={tile.imageUrl}
                    alt=""
                    className="pr-cat-tile-img"
                    width={800}
                    height={600}
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className="pr-cat-tile-overlay" />
                  <div className="pr-cat-tile-arrow">
                    <Icon name="arrow" size={16} />
                  </div>
                  <div className="pr-cat-tile-body">
                    <div className="pr-cat-tile-num">
                      — {tile.number || String(ti + 1).padStart(2, '0')} · {cnt}{' '}
                      {loc === 'zh' ? '款' : loc === 'en' ? 'SKUs' : 'sản phẩm'}
                    </div>
                    <h3>{tile.title}</h3>
                    <p>{tile.desc}</p>
                  </div>
                </a>
              );
            })}
          </div>
          {activeCat !== null ? (
            <div style={{ marginTop: 16 }}>
              <button
                type="button"
                onClick={() => setActiveCat(null)}
                className="pr-btn pr-btn-g"
                style={{ background: 'var(--va-bg-alt)', color: 'var(--va-text)' }}
              >
                <Icon name="grid" size={15} />
                {loc === 'zh'
                  ? '查看全部产品'
                  : loc === 'en'
                    ? 'Show all products'
                    : 'Xem tất cả sản phẩm'}
              </button>
            </div>
          ) : null}
        </div>
      </section>

      {/* PRODUCTS BY CATEGORY */}
      <section className="pr-section">
        <div className="va-wrap">
          {groups.map((group) => (
            <div key={group.ci} className="pr-cat-block" id={`cat-${group.anchor}`}>
              <div className="pr-cat-head">
                <div>
                  <div className="pr-cat-head-meta">
                    — {String(group.ci + 1).padStart(2, '0')} · {group.products.length}{' '}
                    {loc === 'zh' ? '款产品' : loc === 'en' ? 'products' : 'sản phẩm'}
                  </div>
                  <h2>{(CAT_HEAD[group.ci] ?? CAT_HEAD[0]).title[loc]}</h2>
                </div>
                <p>{(CAT_HEAD[group.ci] ?? CAT_HEAD[0]).desc[loc]}</p>
              </div>

              <div className="pr-grid">
                {group.products.map((p) => (
                  <Link
                    key={p.code}
                    className="pr-card"
                    href={`/${loc}/products/${p.code.toLowerCase()}`}
                  >
                    <div className="pr-card-img">
                      <SmartImage src={p.img} alt={p.name} width={600} height={450} sizes="380px" />
                      <div className="pr-card-cat">{cats[p.cat]}</div>
                    </div>
                    <div className="pr-card-body">
                      <h3>{p.name}</h3>
                      <p>{p.desc}</p>
                      <div className="pr-card-tags">
                        {p.tags.map((tag, j) => (
                          <span key={j}>{tag}</span>
                        ))}
                      </div>
                      <div className="pr-card-foot">
                        <div className="pr-card-foot-cell">
                          <div className="lbl">
                            {loc === 'zh' ? '白度' : loc === 'en' ? 'Whiteness' : 'Độ trắng'}
                          </div>
                          <div className="val">{p.cat === 0 ? '≥ 98%' : '90–95%'}</div>
                        </div>
                        <div className="pr-card-foot-cell">
                          <div className="lbl">
                            {loc === 'zh' ? '包装' : loc === 'en' ? 'Packaging' : 'Đóng gói'}
                          </div>
                          <div className="val">
                            {p.cat === 0 ? '25kg / 1T' : 'Crate / pallet'}
                          </div>
                        </div>
                        <div className="pr-card-cta">
                          <Icon name="arrow" size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PARTICLE SIZE VISUALIZER — only for CaCO₃ powder */}
      {showSizes && (uncoatedSizes.length > 0 || coatedSizes.length > 0) ? (
        <section className="pr-sizes-section">
          <div className="va-wrap">
            <div
              style={{ textAlign: 'center', marginBottom: 48, maxWidth: 680, marginInline: 'auto' }}
            >
              <div className="pr-eyebrow">{particle.eyebrow}</div>
              <h2 style={{ fontSize: 'clamp(26px,3vw,38px)' }}>{particle.title}</h2>
            </div>
            {uncoatedSizes.length > 0 ? (
              <div className="pr-sizes-row">
                <div className="pr-sizes-label">
                  <div className="pr-sizes-label-eyebrow">CaCO₃ ≥ 98.5%</div>
                  <h4>{loc === 'zh' ? '未涂层' : loc === 'en' ? 'Uncoated' : 'Bột không phủ'}</h4>
                  <span>
                    {uncoatedSizes.length}{' '}
                    {loc === 'zh' ? '种规格' : loc === 'en' ? 'sizes' : 'quy cách'}
                  </span>
                </div>
                <div className="pr-sizes-viz">
                  {uncoatedSizes.map((value) => {
                    const size = 22 + (value - 5) * 3.6;
                    return (
                      <div key={value} className="pr-size-circle">
                        <div
                          className="pr-size-circle-dot"
                          style={{ width: size, height: size }}
                        >
                          {value < 13 ? value : ''}
                        </div>
                        <div className="pr-size-circle-label">{value} µm</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
            {coatedSizes.length > 0 ? (
              <div className="pr-sizes-row">
                <div className="pr-sizes-label">
                  <div className="pr-sizes-label-eyebrow">
                    + Stearic {particle.stearicRatio || '1.0–1.5%'}
                  </div>
                  <h4>
                    {loc === 'zh' ? '硬脂酸涂层' : loc === 'en' ? 'Stearic-coated' : 'Bột phủ Stearic'}
                  </h4>
                  <span>
                    {coatedSizes.length}{' '}
                    {loc === 'zh' ? '种规格' : loc === 'en' ? 'sizes' : 'quy cách'}
                  </span>
                </div>
                <div className="pr-sizes-viz">
                  {coatedSizes.map((value) => {
                    const size = 22 + (value - 5) * 3.6;
                    return (
                      <div key={value} className="pr-size-circle">
                        <div
                          className="pr-size-circle-dot"
                          style={{ width: size, height: size }}
                        >
                          {value < 13 ? value : ''}
                        </div>
                        <div className="pr-size-circle-label">{value} µm</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
}
