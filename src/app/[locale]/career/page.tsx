import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon } from '@/components/ui/Icon';

const JOBS = [
  {
    id: '1',
    dept: ['Sản xuất', 'Manufacturing', '生产'],
    title: ['Kỹ sư Vận hành nhà máy', 'Plant Operations Engineer', '工厂运营工程师'],
    location: 'Quỳ Hợp, Nghệ An',
    salary: '18–30M VND',
    exp: ['2–5 năm', '2–5 years', '2–5年'],
    deadline: '30/06/2026',
  },
  {
    id: '2',
    dept: ['Kinh doanh', 'Sales', '销售'],
    title: ['Chuyên viên Kinh doanh Xuất khẩu', 'Export Sales Executive', '出口销售专员'],
    location: 'Vinh, Nghệ An',
    salary: '15–25M + commission',
    exp: ['3+ năm', '3+ years', '3年以上'],
    deadline: '30/06/2026',
  },
  {
    id: '3',
    dept: ['Chất lượng', 'Quality', '质量'],
    title: ['Kỹ thuật viên Phòng QC', 'QC Technician', '质检技术员'],
    location: 'Quỳ Hợp, Nghệ An',
    salary: '12–20M VND',
    exp: ['1–3 năm', '1–3 years', '1–3年'],
    deadline: '15/07/2026',
  },
  {
    id: '4',
    dept: ['Kỹ thuật', 'Engineering', '工程'],
    title: ['Kỹ sư Bảo trì thiết bị', 'Equipment Maintenance Engineer', '设备维护工程师'],
    location: 'Quỳ Hợp, Nghệ An',
    salary: '20–35M VND',
    exp: ['3–7 năm', '3–7 years', '3–7年'],
    deadline: '30/07/2026',
  },
  {
    id: '5',
    dept: ['Hành chính', 'Admin', '行政'],
    title: ['Chuyên viên Nhân sự & Tuyển dụng', 'HR & Recruitment Specialist', '人力资源专员'],
    location: 'Vinh, Nghệ An',
    salary: '12–18M VND',
    exp: ['2–4 năm', '2–4 years', '2–4年'],
    deadline: '15/07/2026',
  },
  {
    id: '6',
    dept: ['Kinh doanh', 'Sales', '销售'],
    title: ['Trưởng phòng Kinh doanh Nội địa', 'Domestic Sales Manager', '国内销售经理'],
    location: 'Hà Nội',
    salary: '30–50M + bonus',
    exp: ['5+ năm', '5+ years', '5年以上'],
    deadline: '15/08/2026',
  },
];

export default function CareerPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const loc = locale as Locale;
  const C = COPY[loc];
  const li = loc === 'vi' ? 0 : loc === 'en' ? 1 : 2;

  return (
    <>
      <section className="va-hero" style={{ background: 'var(--va-bg-alt)' }}>
        <div className="va-wrap" style={{ padding: '90px 0', textAlign: 'center', maxWidth: 920, margin: '0 auto' }}>
          <div className="va-eyebrow">
            {loc === 'vi' ? 'Cơ hội nghề nghiệp' : loc === 'en' ? 'Career' : '职业机会'}
          </div>
          <h1 style={{ fontSize: 'clamp(36px,4.4vw,58px)', margin: '16px 0 22px' }}>
            {loc === 'vi'
              ? 'Gia nhập đội ngũ Long Anh — nơi tài năng được phát triển.'
              : loc === 'en'
                ? 'Join the Long Anh team — where talent grows.'
                : '加入龙英团队 — 让人才得以成长。'}
          </h1>
          <p className="va-hero-sub" style={{ margin: '0 auto', maxWidth: 680 }}>
            {loc === 'vi'
              ? 'Môi trường chuyên nghiệp, năng động, minh bạch — mỗi cá nhân đều có cơ hội đóng góp và trưởng thành.'
              : loc === 'en'
                ? 'A professional, dynamic and transparent workplace where every individual contributes and grows.'
                : '专业、活力、透明的工作环境,每个人都有机会贡献并成长。'}
          </p>
        </div>
      </section>

      <section className="va-section">
        <div className="va-wrap">
          <div className="va-shead">
            <div>
              <div className="va-eyebrow">
                {loc === 'vi' ? 'Vị trí đang tuyển' : loc === 'en' ? 'Open positions' : '招聘职位'}
              </div>
              <h2>{C.nav[3]}</h2>
            </div>
            <p>
              {loc === 'vi'
                ? `Đang có ${JOBS.length} vị trí tuyển dụng — gửi CV tới hr@longanhcorp.com với tiêu đề [Vị trí — Họ tên].`
                : `${JOBS.length} open positions — send CV to hr@longanhcorp.com with subject [Position — Your name].`}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {JOBS.map((j) => (
              <Link
                key={j.id}
                href={`/${loc}/career/${j.id}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: 24,
                  padding: '22px 24px',
                  border: '1px solid var(--va-line)',
                  borderRadius: 14,
                  background: 'var(--va-card)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: '.3s',
                }}
                className="job-row"
              >
                <div>
                  <div className="va-eyebrow" style={{ marginBottom: 6 }}>
                    {j.dept[li]}
                  </div>
                  <h3 style={{ fontSize: 18, margin: '4px 0 8px' }}>{j.title[li]}</h3>
                  <div style={{ display: 'flex', gap: 18, fontSize: 12.5, opacity: 0.7, flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                      <Icon name="pin" size={13} /> {j.location}
                    </span>
                    <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                      <Icon name="spark" size={13} /> {j.exp[li]}
                    </span>
                    <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                      <Icon name="check" size={13} /> {j.salary}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: 11, opacity: 0.55 }}>
                    {loc === 'vi' ? 'Hạn:' : loc === 'en' ? 'Deadline:' : '截止日期:'} {j.deadline}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--brand-accent,#F08023)',
                      display: 'inline-flex',
                      gap: 6,
                      alignItems: 'center',
                    }}
                  >
                    {loc === 'vi' ? 'Ứng tuyển' : loc === 'en' ? 'Apply' : '申请'}{' '}
                    <Icon name="arrow" size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
