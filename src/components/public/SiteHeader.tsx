import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon, Logo } from '@/components/ui/Icon';
import { LanguageSwitcher } from './LanguageSwitcher';
import { getMenu, getSettings } from '@/lib/queries';

interface Props {
  locale: Locale;
  active?: 'home' | 'about' | 'products' | 'career' | 'news' | 'contact';
}

/** Prefix a CMS menu URL with the active locale (external URLs untouched). */
function localizeHref(url: string, locale: Locale): string {
  if (/^https?:\/\//i.test(url)) return url;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `/${locale}${path === '/' ? '' : path}`;
}

const FALLBACK_PATHS = ['/', '/about', '/products', '/career', '/news', '/contact'];

export async function SiteHeader({ locale, active }: Props) {
  const C = COPY[locale];
  const [menu, settings] = await Promise.all([getMenu('header'), getSettings()]);

  const phone = settings.contact?.phone_main?.[locale] || C.phone[0];
  const email = settings.contact?.email_main?.[locale] || C.email;
  const shortBrand =
    settings.site?.brand_short?.[locale] ||
    (locale === 'zh' ? '龙英矿业' : locale === 'en' ? 'LONG ANH MINERAL' : 'KS LONG ANH');
  const tagline = settings.site?.tagline?.[locale] || C.tagline;

  // Nav comes from the CMS menu (Admin → Menu); fall back to the static COPY
  // nav when no menu has been configured yet.
  const navItems: { label: string; url: string }[] =
    menu.length > 0
      ? menu.map((m) => ({ label: m.label[locale] || m.label.vi, url: m.url }))
      : C.nav.map((label: string, i: number) => ({ label, url: FALLBACK_PATHS[i] }));

  return (
    <>
      {/* Top strip */}
      <div className="va-strip">
        <div className="va-wrap va-strip-in">
          <span>
            {locale === 'zh' ? '销售热线:' : locale === 'en' ? 'Sales hotline:' : 'Hotline kinh doanh:'}{' '}
            <b style={{ color: '#fff' }}>{phone}</b>
          </span>
          <div className="va-strip-r">
            <a href={`mailto:${email}`}>
              <Icon name="mail" size={13} /> {email}
            </a>
            <span style={{ opacity: 0.4 }}>·</span>
            <a href={`/${locale}/contact`}>ISO 9001 : 2015</a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="va-hd">
        <div className="va-wrap va-hd-in">
          <Link href={`/${locale}`} className="va-brand">
            <span className="va-brand-mark">
              <Logo size={48} />
            </span>
            <span className="va-brand-name">
              <b>{shortBrand}</b>
              <span>{tagline}</span>
            </span>
          </Link>

          <nav className="va-nav">
            {navItems.map((item, i) => {
              const href = localizeHref(item.url, locale);
              const isActive =
                (active === 'home' && item.url === '/') ||
                (!!active && item.url === `/${active}`);

              if (item.url === '/products') {
                return (
                  <div key={i} className="va-nav-item">
                    <Link href={href} className={isActive ? 'is-active' : ''}>
                      {item.label}
                    </Link>
                    <div className="va-nav-dropdown">
                      <Link href={`/${locale}/products#powder`}>
                        <b>
                          {locale === 'zh'
                            ? '碳酸钙粉'
                            : locale === 'en'
                              ? 'CaCO₃ Powder'
                              : 'Bột đá CaCO₃'}
                        </b>
                        <span>Coated · Uncoated · 3–20 µm</span>
                      </Link>
                      <Link href={`/${locale}/products#stone`}>
                        <b>
                          {locale === 'zh'
                            ? '天然石材饰面'
                            : locale === 'en'
                              ? 'Natural cladding stone'
                              : 'Đá ốp lát tự nhiên'}
                        </b>
                        <span>
                          {locale === 'zh'
                            ? '大板 · 定制石材 · 装饰石材'
                            : locale === 'en'
                              ? 'Slab · Cut tile · Decorative'
                              : 'Slab · Đá xẻ · Đá trang trí'}
                        </span>
                      </Link>
                    </div>
                  </div>
                );
              }

              if (item.url === '/career') {
                const cdept = [
                  ['Sản xuất', 'Manufacturing', '生产', 'san-xuat'],
                  ['Kinh doanh', 'Sales', '销售', 'kinh-doanh'],
                  ['Kỹ thuật', 'Engineering', '工程', 'ky-thuat'],
                  ['Chất lượng', 'Quality', '质量', 'chat-luong'],
                  ['Hành chính', 'Admin', '行政', 'hanh-chinh'],
                ];
                const cdepSubs = [
                  ['Vận hành nhà máy · Bảo trì thiết bị', 'Plant ops · Equipment maintenance', '工厂运营 · 设备维护'],
                  ['Xuất khẩu · Bán hàng nội địa', 'Export sales · Domestic sales', '出口销售 · 国内销售'],
                  ['Cải tiến quy trình · PLC', 'Process · PLC', '工艺改进 · PLC'],
                  ['Kỹ thuật QC · ISO', 'QC lab · ISO', 'QC实验室 · ISO'],
                  ['Nhân sự · Kế toán', 'HR · Accounting', '人力资源 · 会计'],
                ];
                const li = locale === 'vi' ? 0 : locale === 'en' ? 1 : 2;
                return (
                  <div key={i} className="va-nav-item">
                    <Link href={href} className={isActive ? 'is-active' : ''}>
                      {item.label}
                    </Link>
                    <div className="va-nav-dropdown">
                      {cdept.map((d, j) => (
                        <Link key={j} href={`/${locale}/career?dept=${d[3]}`}>
                          <b>{d[li]}</b>
                          <span>{cdepSubs[j][li]}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link key={i} href={href} className={isActive ? 'is-active' : ''}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="va-cta-row">
            <LanguageSwitcher current={locale} />
          </div>
        </div>
      </header>
    </>
  );
}
