import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { getArticles } from '@/lib/queries';
import { Icon } from '@/components/ui/Icon';

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

  return (
    <div className="nw">
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
