'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { NewsItem } from '@/data/news';
import { Icon } from '@/components/ui/Icon';

interface Props {
  locale: Locale;
  items: NewsItem[];
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

const CATS = ['all', 'business', 'milestone', 'tech', 'product', 'event', 'csr'];

export function NewsBoard({ locale, items }: Props) {
  const t = I18N[locale];
  const [activeCat, setActiveCat] = useState('all');
  const [tab, setTab] = useState<'latest' | 'popular'>('latest');

  const display = activeCat === 'all' ? items : items.filter((n) => n.cat === activeCat);
  const featured = display[0];
  const sub3 = display.slice(1, 4);
  const rest = display.slice(4);

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
      {/* PAGE HEADER (compact) */}
      <section className="nw-head">
        <div className="va-wrap">
          <nav className="nw-bcrumb">
            <Link href={`/${locale}`}>{t.home}</Link>
            <Icon name="chevron" size={11} />
            <span className="now">{t.news}</span>
          </nav>
          <h1>{t.pageTitle}</h1>
        </div>
      </section>

      {/* SUBNAV */}
      <div className="nw-subnav">
        <div className="va-wrap">
          <div className="nw-subnav-row">
            {CATS.map((c) => (
              <a
                key={c}
                className={activeCat === c ? 'on' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveCat(c);
                }}
                href={`#${c}`}
              >
                {c === 'all' ? t.filterAll : t.categories[c]}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* HOT TOPICS */}
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

      {/* MAIN */}
      <section className="nw-main">
        <div className="va-wrap">
          <div className="nw-main-grid">
            <div>
              {featured ? (
                <Link className="nw-feat-card" href={`/${locale}/news/${featured.id}`}>
                  <div className="nw-feat-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={featured.img} alt="" />
                  </div>
                  <h2>{featured.title[locale]}</h2>
                  <p>{featured.excerpt[locale]}</p>
                  <div className="nw-feat-meta">
                    <b>{t.categories[featured.cat]}</b>
                    <span>·</span>
                    <span>{fmtDate(featured.date, locale)}</span>
                    <span>·</span>
                    <span>
                      {featured.views.toLocaleString()} {t.viewCount}
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
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={n.img} alt="" />
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
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={n.img} alt="" />
                        </div>
                        <div className="nw-body">
                          <span className="nw-cat-pill">{t.categories[n.cat]}</span>
                          <h4>{n.title[locale]}</h4>
                          <p>{n.excerpt[locale]}</p>
                          <div className="nw-list-meta">
                            <span>{fmtDate(n.date, locale)}</span>
                            <span>·</span>
                            <span>
                              {n.views.toLocaleString()} {t.viewCount}
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

              <div className="nw-side-news">
                <h4>{t.newsletterTitle}</h4>
                <p>{t.newsletterBody}</p>
                <input type="email" placeholder={t.emailPlaceholder} />
                <button type="button">{t.subscribe}</button>
              </div>
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
              {t.sectionByCat}
            </div>
            <h2 style={{ fontSize: 'clamp(22px,2.4vw,30px)' }}>{t.byCatTitle}</h2>
          </div>

          {catRows.map((pair, row) => (
            <div key={row} className="nw-bycat-grid">
              {pair.map((catKey) => {
                const catItems = (byCat[catKey] ?? []).slice(0, 3);
                if (catItems.length === 0) return null;
                const feat = catItems[0];
                const others = catItems.slice(1);
                return (
                  <div key={catKey}>
                    <div className="nw-sec-head">
                      <h3>{t.categories[catKey]}</h3>
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
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={feat.img} alt="" />
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
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={n.img} alt="" />
                            </div>
                            <div className="nw-body">
                              <h4>{n.title[locale]}</h4>
                              <div className="nw-list-meta">
                                <span>{fmtDate(n.date, locale)}</span>
                                <span>·</span>
                                <span>
                                  {n.views.toLocaleString()} {t.viewCount}
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
