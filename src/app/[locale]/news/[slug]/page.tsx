import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { getArticles } from '@/lib/queries';
import { Icon } from '@/components/ui/Icon';
import { hreflangAlternates, absUrl } from '@/lib/site-url';
import { JsonLd, articleSchema, breadcrumbSchema } from '@/components/seo/JsonLd';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const loc = params.locale as Locale;
  let title = params.slug;
  let description = '';
  let ogImage: string | undefined;
  try {
    const all = await getArticles();
    const article = all.find((n) => String(n.id) === params.slug);
    if (article) {
      title = article.title[loc] || article.title.vi;
      description = article.excerpt[loc] || article.excerpt.vi || '';
      ogImage = article.img;
    }
  } catch {
    /* DB unavailable */
  }
  const { canonical, languages } = hreflangAlternates(loc, `/news/${params.slug}`);
  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      ...(ogImage ? { images: [{ url: absUrl(ogImage) }] } : {}),
    },
    twitter: {
      title,
      description,
      ...(ogImage ? { images: [absUrl(ogImage)] } : {}),
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(params.locale);
  const loc = params.locale as Locale;
  const C = COPY[loc];

  // Phase 4: articles come from the database
  const allNews = await getArticles();
  const article = allNews.find((n) => String(n.id) === params.slug);
  if (!article) notFound();

  const related = allNews.filter((n) => n.id !== article.id && n.cat === article.cat).slice(0, 3);
  const fmtDate = (iso: string) => {
    const [y, m, d] = iso.split('-');
    if (loc === 'en') {
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
    }
    if (loc === 'zh') return `${y}年${parseInt(m)}月${parseInt(d)}日`;
    return `${d}/${m}/${y}`;
  };

  const articleUrl = `/${loc}/news/${params.slug}`;
  const homeLabel = loc === 'zh' ? '首页' : loc === 'en' ? 'Home' : 'Trang chủ';
  const newsLabel = C.nav[4];

  return (
    <div className="nw">
      <JsonLd
        data={articleSchema({
          headline: article.title[loc] || article.title.vi,
          description: article.excerpt[loc] || article.excerpt.vi,
          imageUrl: article.img,
          datePublished: article.date,
          publisherName: 'KS Long Anh',
          publisherLogo: '/assets/long-anh-logo.png',
          url: articleUrl,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: homeLabel, url: `/${loc}` },
          { name: newsLabel, url: `/${loc}/news` },
          { name: article.title[loc] || article.title.vi, url: articleUrl },
        ])}
      />
      <section className="nw-head">
        <div className="va-wrap">
          <nav className="nw-bcrumb">
            <Link href={`/${loc}`}>{C.nav[0]}</Link>
            <Icon name="chevron" size={11} />
            <Link href={`/${loc}/news`}>{C.nav[4]}</Link>
          </nav>
        </div>
      </section>

      <article
        className="va-wrap"
        style={{ maxWidth: 820, margin: '0 auto', padding: '48px 0 80px' }}
      >
        <div
          style={{
            fontSize: 12.5,
            fontFamily: 'ui-monospace, Menlo, monospace',
            color: 'var(--brand-accent,#F08023)',
            fontWeight: 700,
            letterSpacing: '.06em',
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          {article.cat} · {fmtDate(article.date)} · {article.readMin} min
        </div>
        <h1
          style={{
            fontSize: 'clamp(28px,3.4vw,46px)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            margin: '0 0 24px',
          }}
        >
          {article.title[loc]}
        </h1>

        <div
          style={{
            borderRadius: 16,
            overflow: 'hidden',
            aspectRatio: '16 / 9',
            marginBottom: 32,
            background: 'var(--va-bg-alt)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.img}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ fontSize: 16, lineHeight: 1.8, opacity: 0.85 }}>
          <p style={{ fontWeight: 500, fontSize: 18, marginBottom: 20 }}>{article.excerpt[loc]}</p>
          {article.content?.[loc] ? (
            <div
              className="nw-prose"
              // Content is HTML produced by the Tiptap editor in the admin and
              // saved into `articles.content_*`. The editor only emits a known
              // tag set (paragraphs, headings, lists, blockquotes, inline
              // marks) so rendering as HTML here is safe.
              dangerouslySetInnerHTML={{ __html: article.content[loc] }}
            />
          ) : (
            <p>
              {loc === 'vi'
                ? 'Nội dung chi tiết của bài viết sẽ được biên tập viên cập nhật qua hệ thống CMS.'
                : loc === 'en'
                  ? 'The full article body will be managed through the CMS.'
                  : '文章的详细内容将通过CMS系统由编辑更新。'}
            </p>
          )}
        </div>

        {(() => {
          // Gallery rendered below the body. Skip the tile already used as
          // the cover (either explicitly flagged or, if none was flagged,
          // the first item — matching the admin's coverImageUrl logic).
          const gallery = article.gallery ?? [];
          if (gallery.length === 0) return null;
          const featuredIdx = (() => {
            const i = gallery.findIndex((g) => g.featured);
            return i >= 0 ? i : 0;
          })();
          const rest = gallery.filter((_, i) => i !== featuredIdx);
          if (rest.length === 0) return null;
          return (
            <div style={{ marginTop: 40 }}>
              <h3
                style={{
                  fontSize: 18,
                  letterSpacing: '-0.01em',
                  margin: '0 0 16px',
                }}
              >
                {loc === 'vi' ? 'Thư viện ảnh' : loc === 'en' ? 'Gallery' : '图片库'}
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
                  gap: 12,
                }}
              >
                {rest.map((g, i) => (
                  <figure
                    key={`${g.src}-${i}`}
                    style={{
                      margin: 0,
                      borderRadius: 12,
                      overflow: 'hidden',
                      aspectRatio: '4 / 3',
                      background: 'var(--va-bg-alt)',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={g.src}
                      alt={g.alt ?? ''}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </figure>
                ))}
              </div>
            </div>
          );
        })()}
      </article>

      {related.length > 0 ? (
        <section className="nw-main" style={{ borderTop: '1px solid var(--va-line)' }}>
          <div className="va-wrap">
            <div className="nw-sec-head">
              <h3>
                {loc === 'vi'
                  ? 'Bài viết liên quan'
                  : loc === 'en'
                    ? 'Related articles'
                    : '相关文章'}
              </h3>
            </div>
            <div className="nw-sub-grid" style={{ borderBottom: 0, marginBottom: 0 }}>
              {related.map((n) => (
                <Link key={n.id} className="nw-sub-card" href={`/${loc}/news/${n.id}`}>
                  <div className="nw-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={n.img} alt="" />
                  </div>
                  <h3>{n.title[loc]}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
