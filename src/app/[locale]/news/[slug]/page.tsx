import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';

export default function ArticleDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(params.locale);
  const loc = params.locale as Locale;

  return (
    <main>
      <section className="border-b border-ink/5 bg-white py-6">
        <Container>
          <nav className="flex items-center gap-2 text-xs text-ink-muted">
            <Link href={`/${loc}`} className="hover:text-brand-600">
              {loc === 'vi' ? 'Trang chủ' : loc === 'en' ? 'Home' : '首页'}
            </Link>
            <Icon name="chevron-right" size={12} />
            <Link href={`/${loc}/news`} className="hover:text-brand-600">
              {loc === 'vi' ? 'Tin tức' : loc === 'en' ? 'News' : '新闻'}
            </Link>
          </nav>
        </Container>
      </section>

      <article className="py-12 sm:py-16">
        <Container size="md">
          <p className="text-xs font-semibold uppercase tracking-eyebrow text-brand-600">
            {loc === 'vi' ? 'Sự kiện' : loc === 'en' ? 'Event' : '活动'} · 15/04/2026 · 4 min read
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tighter sm:text-4xl">
            {params.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </h1>

          <div className="mt-10 aspect-[16/9] rounded-2xl bg-gradient-to-br from-navy-100 to-canvas" />

          <div className="prose prose-slate mt-10 max-w-none">
            <p className="lead">
              {loc === 'vi'
                ? 'Bài viết đang được biên tập. Nội dung đầy đủ sẽ có sau khi hệ thống CMS hoàn tất ở Phase 6.'
                : 'Article in progress. Full content will be available once the CMS is shipped in Phase 6.'}
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus
              hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend
              nibh porttitor.
            </p>
            <h2>Bước ngoặt sản lượng</h2>
            <p>
              Việc đưa xưởng đá Slab 1.6m vào vận hành nâng tổng công suất nhóm nhà máy lên 350,000
              tấn/năm — đáp ứng các đơn hàng container cỡ lớn từ thị trường Hàn Quốc, Nhật Bản và Trung
              Đông.
            </p>
            <h2>Kế hoạch xuất khẩu 2026</h2>
            <ul>
              <li>Tăng 35% sản lượng xuất sang Ấn Độ và Bangladesh</li>
              <li>Triển khai dây chuyền đóng gói jumbo bag 1 tấn cho thị trường EU</li>
              <li>Mở rộng kho FOB tại cảng Cửa Lò 4500 m²</li>
            </ul>
          </div>
        </Container>
      </article>
    </main>
  );
}
