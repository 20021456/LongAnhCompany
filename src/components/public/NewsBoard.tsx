'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { NewsItem } from '@/data/news';
import { SmartImage } from '@/components/ui/SmartImage';
import { PageHero } from '@/components/public/PageHero';
import { fmtNumberVn } from '@/lib/format';
import type { NewsPageSectionsLocale } from '@/lib/news-page-content';

interface Props {
  locale: Locale;
  items: NewsItem[];
  sections: NewsPageSectionsLocale;
}

const I18N: Record<
  Locale,
  {
    home: string;
    news: string;
    pageTitle: string;
    filterAll: string;
    categories: Record<string, string>;
    hotTopics: string;
    viewCount: string;
    commentCount: string;
    sectionRecent: string;
    tabLatest: string;
    tabPopular: string;
    newsletterTitle: string;
    newsletterBody: string;
    emailPlaceholder: string;
    subscribe: string;
    hot: string[];
    sectionByCat: string;
    byCatTitle: string;
    viewAll: string;
    minRead: string;
  }
> = {
  vi: {
    home: 'Trang chủ',
    news: 'Tin tức',
    pageTitle: 'Cập nhật mới nhất từ Long Anh',
    filterAll: 'Tất cả',
    categories: {
      business: 'Kinh doanh',
      product: 'Sản phẩm',
      event: 'Sự kiện',
      csr: 'CSR',
      tech: 'Công nghệ',
      milestone: 'Cột mốc',
    },
    hotTopics: 'Tiêu điểm',
    viewCount: 'lượt xem',
    commentCount: 'bình luận',
    sectionRecent: 'Cập nhật mới nhất',
    tabLatest: 'Tin mới',
    tabPopular: 'Đọc nhiều',
    newsletterTitle: 'Đăng ký nhận tin Long Anh',
    newsletterBody:
      'Tin tức ngành, báo cáo thị trường và bảng giá xuất khẩu hàng tháng — gửi trực tiếp đến hộp thư của bạn.',
    emailPlaceholder: 'Email của bạn',
    subscribe: 'Đăng ký nhận tin',
    hot: ['Xuất khẩu', 'CaCO₃', 'ISO 9001', 'Báo giá tháng 5', 'Vietbuild 2026', 'Quỳ Hợp', '20 năm Long Anh'],
    sectionByCat: 'Tin theo chủ đề',
    byCatTitle: 'Khám phá tin tức theo chủ đề',
    viewAll: 'Xem tất cả',
    minRead: 'phút đọc',
  },
  en: {
    home: 'Home',
    news: 'News',
    pageTitle: 'Latest updates from Long Anh',
    filterAll: 'All',
    categories: {
      business: 'Business',
      product: 'Products',
      event: 'Events',
      csr: 'CSR',
      tech: 'Technology',
      milestone: 'Milestone',
    },
    hotTopics: 'Hot Topics',
    viewCount: 'views',
    commentCount: 'comments',
    sectionRecent: 'Latest updates',
    tabLatest: 'Latest',
    tabPopular: 'Popular',
    newsletterTitle: 'Subscribe to Long Anh news',
    newsletterBody:
      'Industry news, market reports and monthly export price lists — straight to your inbox.',
    emailPlaceholder: 'Your email',
    subscribe: 'Subscribe',
    hot: ['Export', 'CaCO₃', 'ISO 9001', 'May Pricing', 'Vietbuild 2026', 'Quy Hop', '20 Years'],
    sectionByCat: 'News by category',
    byCatTitle: 'Explore news by category',
    viewAll: 'View all',
    minRead: 'min read',
  },
  zh: {
    home: '首页',
    news: '新闻',
    pageTitle: '龙英最新动态',
    filterAll: '全部',
    categories: {
      business: '商业',
      product: '产品',
      event: '活动',
      csr: 'CSR',
      tech: '技术',
      milestone: '里程碑',
    },
    hotTopics: '热点话题',
    viewCount: '浏览',
    commentCount: '评论',
    sectionRecent: '最新动态',
    tabLatest: '最新',
    tabPopular: '热门',
    newsletterTitle: '订阅龙英新闻',
    newsletterBody: '行业新闻、市场报告和每月出口价目表 — 直接发送到您的收件箱。',
    emailPlaceholder: '您的邮箱',
    subscribe: '订阅',
    hot: ['出口', '碳酸钙', 'ISO 9001', '5月报价', '河内建筑展', '归合', '20周年'],
    sectionByCat: '按主题分类',
    byCatTitle: '按主题探索新闻',
    viewAll: '查看全部',
    minRead: '分钟阅读',
  },
};

function fmtDate(iso: string, lang: Locale) {
  const [y, m, d] = iso.split('-');
  if (lang === 'en') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
  }
  if (lang === 'zh') return `${y}年${parseInt(m)}月${parseInt(d)}日`;
  return `${d}/${m}/${y}`;
}

const FALLBACK_CATS = ['all', 'business', 'milestone', 'tech', 'product', 'event', 'csr'];

export function NewsBoard({ locale, items, sections }: Props) {
  const t = I18N[locale];
  const [activeCat, setActiveCat] = useState('all');
  const [tab, setTab] = useState<'latest' | 'popular'>('latest');

  // Category chips: use CMS list if provided, else the hardcoded fallback.
  const catSlugs =
    sections.categories.items.length > 0
      ? sections.categories.items.map((c) => c.slug)
      : FALLBACK_CATS.filter((c) => c !== 'all');
  const catLabels = new Map<string, string>(
    sections.categories.items.map((c) => [c.slug, c.label]),
  );
  const labelFor = (slug: string) => catLabels.get(slug) ?? t.categories[slug] ?? slug;

  const filtered = activeCat === 'all' ? items : items.filter((n) => n.cat === activeCat);

  // Featured-article selection.
  const display = (() => {
    const mode = sections.featured.mode;
    if (mode === 'manual') {
      const byId = new Map(items.map((n) => [String(n.id), n]));
      const picked = sections.featured.articleIds
        .map((id) => byId.get(id))
        .filter(Boolean) as typeof items;
      const pickedIds = new Set(picked.map((n) => n.id));
      // Manual picks first, then the rest in the current filter order.
      return [...picked, ...filtered.filter((n) => !pickedIds.has(n.id))];
    }
    if (mode === 'auto-views') {
      return [...filtered].sort((a, b) => b.views - a.views);
    }
    // 'flag' (or anything else) → keep the current filter order.
    return filtered;
  })();

  const featured = display[0];
  const sub3 = display.slice(1, 4);
  const restAll = display.slice(4);
  const perPage = sections.listConfig.perPage > 0 ? sections.listConfig.perPage : restAll.length;
  const rest = restAll.slice(0, Math.max(0, perPage - 4));

  const sortedByDate = [...items].sort((a, b) => b.date.localeCompare(a.date));
  const sortedByViews = [...items].sort((a, b) => b.views - a.views);
  const sidebarList = (tab === 'latest' ? sortedByDate : sortedByViews).slice(0, 6);

  // Group by category for the "tin theo chủ đề" section
  const byCat: Record<string, typeof items> = {};
  items.forEach((n) => {
    (byCat[n.cat] ??= []).push(n);
  });
  const catRows: [string, string][] = [
    ['business', 'milestone'],
    ['tech', 'product'],
  ];

  return (
    <div className="nw">
      {/* PAGE HERO (full photo) */}
      <PageHero
        eyebrow={sections.hero.eyebrow || t.news}
        title={sections.hero.title || t.pageTitle}
        sub={sections.hero.sub || undefined}
        breadcrumb={[{ label: t.home, href: `/${locale}` }, { label: t.news }]}
        bgImage={sections.hero.imageUrl || '/assets/kho-hang-xuat-khau.webp'}
      />

      {/* SUBNAV */}
      <div className="nw-subnav">
        <div className="va-wrap">
          <div className="nw-subnav-row">
            <a
              className={activeCat === 'all' ? 'on' : ''}
              onClick={(e) => {
                e.preventDefault();
                setActiveCat('all');
              }}
              href="#all"
            >
              {t.filterAll}
            </a>
            {catSlugs.map((c) => (
              <a
                key={c}
                className={activeCat === c ? 'on' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveCat(c);
                }}
                href={`#${c}`}
              >
                {labelFor(c)}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* HOT TOPICS */}
      {sections.listConfig.sidebarHotTopics ? (
        <div className="nw-hot">
          <div className="va-wrap nw-hot-row">
            <div className="nw-hot-label">
              <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="14" height="14">
                <path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4-1 3 0 4 2 4 2 0 1-5 1-11z" />
              </svg>
              {t.hotTopics}
            </div>
            <div className="nw-hot-tags">
              {t.hot.map((h, i) => (
                <a key={i} className="nw-hot-tag" href="#">
                  {h}
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* MAIN */}
      <section className="nw-main">
        <div className="va-wrap">
          <div className="nw-main-grid">
            <div>
              {featured ? (
                <Link className="nw-feat-card" href={`/${locale}/news/${featured.id}`}>
                  <div className="nw-feat-img">
                    <SmartImage src={featured.img} alt="" width={1200} height={750} />
                  </div>
                  <h2>{featured.title[locale]}</h2>
                  <p>{featured.excerpt[locale]}</p>
                  <div className="nw-feat-meta">
                    <b>{t.categories[featured.cat]}</b>
                    <span>·</span>
                    <span>{fmtDate(featured.date, locale)}</span>
                    <span>·</span>
                    <span>
                      {fmtNumberVn(featured.views)} {t.viewCount}
                    </span>
                    <span>·</span>
                    <span>
                      {featured.comments} {t.commentCount}
                    </span>
                  </div>
                </Link>
              ) : null}

              {sub3.length > 0 ? (
                <div className="nw-sub-grid">
                  {sub3.map((n) => (
                    <Link key={n.id} className="nw-sub-card" href={`/${locale}/news/${n.id}`}>
                      <div className="nw-img">
                        <SmartImage src={n.img} alt="" width={600} height={400} sizes="400px" />
                      </div>
                      <h3>{n.title[locale]}</h3>
                    </Link>
                  ))}
                </div>
              ) : null}

              {rest.length > 0 ? (
                <>
                  <div className="nw-sec-head">
                    <h3>{t.sectionRecent}</h3>
                  </div>
                  <div className="nw-list">
                    {rest.map((n) => (
                      <Link key={n.id} className="nw-list-item" href={`/${locale}/news/${n.id}`}>
                        <div className="nw-img">
                          <SmartImage src={n.img} alt="" width={400} height={300} sizes="220px" />
                        </div>
                        <div className="nw-body">
                          <span className="nw-cat-pill">{t.categories[n.cat]}</span>
                          <h4>{n.title[locale]}</h4>
                          <p>{n.excerpt[locale]}</p>
                          <div className="nw-list-meta">
                            <span>{fmtDate(n.date, locale)}</span>
                            <span>·</span>
                            <span>
                              {fmtNumberVn(n.views)} {t.viewCount}
                            </span>
                            <span>·</span>
                            <span>
                              {n.comments} {t.commentCount}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            {/* SIDEBAR */}
            <aside className="nw-side">
              {sections.listConfig.sidebarLatest ? (
              <div className="nw-side-card">
                <div className="nw-tabs" style={{ display: 'flex', borderBottom: '1px solid var(--va-line)' }}>
                  <button
                    type="button"
                    onClick={() => setTab('latest')}
                    style={{
                      flex: 1,
                      fontSize: 13,
                      fontWeight: 700,
                      padding: '14px 0',
                      background: 'transparent',
                      border: 0,
                      cursor: 'pointer',
                      color: tab === 'latest' ? 'var(--brand-accent,#F08023)' : 'var(--va-text)',
                      opacity: tab === 'latest' ? 1 : 0.55,
                      borderBottom:
                        tab === 'latest'
                          ? '2px solid var(--brand-accent,#F08023)'
                          : '2px solid transparent',
                    }}
                  >
                    {t.tabLatest}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('popular')}
                    style={{
                      flex: 1,
                      fontSize: 13,
                      fontWeight: 700,
                      padding: '14px 0',
                      background: 'transparent',
                      border: 0,
                      cursor: 'pointer',
                      color: tab === 'popular' ? 'var(--brand-accent,#F08023)' : 'var(--va-text)',
                      opacity: tab === 'popular' ? 1 : 0.55,
                      borderBottom:
                        tab === 'popular'
                          ? '2px solid var(--brand-accent,#F08023)'
                          : '2px solid transparent',
                    }}
                  >
                    {t.tabPopular}
                  </button>
                </div>
                <div className="nw-side-list">
                  {sidebarList.map((n, i) => (
                    <Link key={n.id} className="nw-side-item" href={`/${locale}/news/${n.id}`}>
                      <div className="nw-side-num">{i + 1}</div>
                      <div>
                        <h5>{n.title[locale]}</h5>
                        <div className="nw-when">{fmtDate(n.date, locale)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              ) : null}

              {sections.listConfig.sidebarNewsletter ? (
                <div className="nw-side-news">
                  <h4>{sections.newsletter.title || t.newsletterTitle}</h4>
                  <p>{sections.newsletter.sub || t.newsletterBody}</p>
                  <input
                    type="email"
                    placeholder={sections.newsletter.inputPlaceholder || t.emailPlaceholder}
                  />
                  <button type="button">
                    {sections.newsletter.buttonLabel || t.subscribe}
                  </button>
                  {sections.newsletter.footer ? (
                    <div
                      style={{ marginTop: 8, fontSize: 11.5, opacity: 0.6, lineHeight: 1.5 }}
                    >
                      {sections.newsletter.footer}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </section>

      {/* TIN THEO CHỦ ĐỀ — categorized sections */}
      <section className="nw-bycat" style={{ background: 'var(--va-bg-alt)' }}>
        <div className="va-wrap">
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: 'var(--brand-accent,#F08023)',
                marginBottom: 8,
              }}
            >
              {sections.byCategory.eyebrow || t.sectionByCat}
            </div>
            <h2 style={{ fontSize: 'clamp(22px,2.4vw,30px)' }}>
              {sections.byCategory.title || t.byCatTitle}
            </h2>
          </div>

          {catRows.map((pair, row) => (
            <div key={row} className="nw-bycat-grid">
              {pair.map((catKey) => {
                const perCat =
                  sections.byCategory.mode === 'top-2'
                    ? 2
                    : sections.byCategory.mode === 'top-3'
                      ? 3
                      : sections.byCategory.articlesPerCategory > 0
                        ? sections.byCategory.articlesPerCategory
                        : 3;
                const catItems = (byCat[catKey] ?? []).slice(0, perCat);
                if (catItems.length === 0) return null;
                const feat = catItems[0];
                const others = catItems.slice(1);
                return (
                  <div key={catKey}>
                    <div className="nw-sec-head">
                      <h3>{labelFor(catKey)}</h3>
                      <a
                        className="more"
                        href={`#${catKey}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveCat(catKey);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        {t.viewAll} →
                      </a>
                    </div>
                    <Link className="nw-cat-feat" href={`/${locale}/news/${feat.id}`}>
                      <div className="nw-img">
                        <SmartImage src={feat.img} alt="" width={900} height={560} />
                      </div>
                      <h3>{feat.title[locale]}</h3>
                      <p>{feat.excerpt[locale]}</p>
                      <div className="nw-meta">
                        {fmtDate(feat.date, locale)} · {feat.readMin} {t.minRead}
                      </div>
                    </Link>
                    {others.length > 0 ? (
                      <div className="nw-list" style={{ marginTop: 16 }}>
                        {others.map((n) => (
                          <Link
                            key={n.id}
                            className="nw-list-item"
                            href={`/${locale}/news/${n.id}`}
                          >
                            <div className="nw-img">
                              <SmartImage src={n.img} alt="" width={400} height={300} sizes="220px" />
                            </div>
                            <div className="nw-body">
                              <h4>{n.title[locale]}</h4>
                              <div className="nw-list-meta">
                                <span>{fmtDate(n.date, locale)}</span>
                                <span>·</span>
                                <span>
                                  {fmtNumberVn(n.views)} {t.viewCount}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
