'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { Icon } from '@/components/ui/Icon';

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
}

const CAT_TILES = [
  {
    id: 'powder',
    cat: 0,
    img: '/assets/bot-caco3-sieu-min.webp',
    title: { vi: 'Bột đá CaCO₃', en: 'CaCO₃ powder', zh: '碳酸钙粉' },
    desc: {
      vi: 'Coated · Uncoated · 3–20 µm — phụ gia cho nhựa, sơn, giấy, thức ăn chăn nuôi.',
      en: 'Coated · Uncoated · 3–20 µm — additive for plastics, paint, paper, animal feed.',
      zh: '涂层 · 未涂层 · 3–20 µm — 用于塑料、涂料、纸张、动物饲料的添加剂。',
    },
  },
  {
    id: 'stone',
    cat: 1,
    img: '/assets/da-slab-sieu-trang.webp',
    title: { vi: 'Đá ốp lát tự nhiên', en: 'Natural cladding stone', zh: '天然石材饰面' },
    desc: {
      vi: 'Slab · Đá xẻ · Đá trang trí — cho công trình và không gian sống cao cấp.',
      en: 'Slab · Cut tile · Decorative — for premium architecture and living spaces.',
      zh: '大板 · 定制石材 · 装饰石材 — 用于高端建筑和生活空间。',
    },
  },
] as const;

const CAT_HEAD = {
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
} as const;

const SIZE_ROWS = (loc: Locale) => [
  {
    name: loc === 'zh' ? '未涂层' : loc === 'en' ? 'Uncoated' : 'Bột không phủ',
    sub: loc === 'zh' ? '8 种规格' : loc === 'en' ? '8 sizes' : '8 quy cách',
    eyebrow: 'CaCO₃ ≥ 98.5%',
    values: [5, 8, 10, 12, 15, 17, 18, 20],
  },
  {
    name: loc === 'zh' ? '硬脂酸涂层' : loc === 'en' ? 'Stearic-coated' : 'Bột phủ Stearic',
    sub: loc === 'zh' ? '7 种规格' : loc === 'en' ? '7 sizes' : '7 quy cách',
    eyebrow: '+ Stearic 1.0–1.5%',
    values: [5, 10, 12, 15, 17, 18, 20],
  },
];

export function ProductsBrowser({ locale, products, cats }: Props) {
  // null = show both categories; 0 / 1 = filter to that category
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const loc = locale;

  const onTileClick = (cat: number, id: string) => {
    const next = activeCat === cat ? null : cat;
    setActiveCat(next);
    if (next !== null) {
      setTimeout(() => {
        document
          .getElementById(`cat-${id}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  const groups = [0, 1]
    .filter((ci) => activeCat === null || activeCat === ci)
    .map((ci) => ({ ci, products: products.filter((p) => p.cat === ci) }));

  // Particle size visualizer only relevant for CaCO₃ powder (cat 0)
  const showSizes = activeCat === null || activeCat === 0;

  return (
    <>
      {/* CATEGORY TILES */}
      <section className="pr-section tight">
        <div className="va-wrap">
          <div className="pr-cat-tiles">
            {CAT_TILES.map((tile, ti) => {
              const cnt = products.filter((p) => p.cat === tile.cat).length;
              const isActive = activeCat === tile.cat;
              return (
                <a
                  key={tile.id}
                  href={`#cat-${tile.id}`}
                  className="pr-cat-tile"
                  aria-pressed={isActive}
                  style={isActive ? { outline: '3px solid var(--brand-accent,#F08023)' } : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    onTileClick(tile.cat, tile.id);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={tile.img} alt="" className="pr-cat-tile-img" />
                  <div className="pr-cat-tile-overlay" />
                  <div className="pr-cat-tile-arrow">
                    <Icon name="arrow" size={16} />
                  </div>
                  <div className="pr-cat-tile-body">
                    <div className="pr-cat-tile-num">
                      — 0{ti + 1} · {cnt} {loc === 'zh' ? '款' : loc === 'en' ? 'SKUs' : 'sản phẩm'}
                    </div>
                    <h3>{tile.title[loc]}</h3>
                    <p>{tile.desc[loc]}</p>
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
            <div
              key={group.ci}
              className="pr-cat-block"
              id={`cat-${group.ci === 0 ? 'powder' : 'stone'}`}
            >
              <div className="pr-cat-head">
                <div>
                  <div className="pr-cat-head-meta">
                    — 0{group.ci + 1} · {group.products.length}{' '}
                    {loc === 'zh' ? '款产品' : loc === 'en' ? 'products' : 'sản phẩm'}
                  </div>
                  <h2>{CAT_HEAD[group.ci as 0 | 1].title[loc]}</h2>
                </div>
                <p>{CAT_HEAD[group.ci as 0 | 1].desc[loc]}</p>
              </div>

              <div className="pr-grid">
                {group.products.map((p) => (
                  <Link
                    key={p.code}
                    className="pr-card"
                    href={`/${loc}/products/${p.code.toLowerCase()}`}
                  >
                    <div className="pr-card-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.img} alt={p.name} />
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
      {showSizes ? (
        <section className="pr-sizes-section">
          <div className="va-wrap">
            <div
              style={{ textAlign: 'center', marginBottom: 48, maxWidth: 680, marginInline: 'auto' }}
            >
              <div className="pr-eyebrow">
                {loc === 'zh' ? '粒径选择' : loc === 'en' ? 'Particle sizes' : 'Cỡ hạt khả dụng'}
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3vw,38px)' }}>
                {loc === 'zh'
                  ? '从超细到标准 — 选择适合您应用的粒径'
                  : loc === 'en'
                    ? 'From ultra-fine to standard — pick the size for your application'
                    : 'Từ siêu mịn đến tiêu chuẩn — chọn cỡ hạt phù hợp ứng dụng'}
              </h2>
            </div>
            {SIZE_ROWS(loc).map((row, ri) => (
              <div key={ri} className="pr-sizes-row">
                <div className="pr-sizes-label">
                  <div className="pr-sizes-label-eyebrow">{row.eyebrow}</div>
                  <h4>{row.name}</h4>
                  <span>{row.sub}</span>
                </div>
                <div className="pr-sizes-viz">
                  {row.values.map((value) => {
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
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
