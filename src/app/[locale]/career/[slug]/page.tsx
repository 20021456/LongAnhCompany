import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';

export default function JobDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(params.locale);
  const loc = params.locale as Locale;

  // Phase 4 will fetch real job from DB. For now show placeholder.
  return (
    <main>
      <section className="border-b border-ink/5 bg-white py-6">
        <Container>
          <nav className="flex items-center gap-2 text-xs text-ink-muted">
            <Link href={`/${loc}`} className="hover:text-brand-600">
              {loc === 'vi' ? 'Trang chủ' : loc === 'en' ? 'Home' : '首页'}
            </Link>
            <Icon name="chevron-right" size={12} />
            <Link href={`/${loc}/career`} className="hover:text-brand-600">
              {loc === 'vi' ? 'Tuyển dụng' : loc === 'en' ? 'Career' : '招聘'}
            </Link>
            <Icon name="chevron-right" size={12} />
            <span className="text-ink">{params.slug.replace(/-/g, ' ')}</span>
          </nav>
        </Container>
      </section>

      <section className="py-16">
        <Container size="md">
          <p className="text-xs font-semibold uppercase tracking-eyebrow text-brand-600">
            {loc === 'vi' ? 'Sản xuất' : loc === 'en' ? 'Manufacturing' : '生产'}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tighter sm:text-4xl">
            {params.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </h1>

          <div className="mt-8 grid gap-4 rounded-2xl bg-white p-6 ring-1 ring-ink/5 sm:grid-cols-4">
            <Spec label="Location" value="Quỳ Hợp, Nghệ An" />
            <Spec label="Salary" value="18 – 30 M" />
            <Spec label="Experience" value="2–5 years" />
            <Spec label="Deadline" value="30/06/2026" />
          </div>

          <div className="prose prose-slate mt-10 max-w-none">
            <h2>
              {loc === 'vi' ? 'Mô tả công việc' : loc === 'en' ? 'Job description' : '工作描述'}
            </h2>
            <p>
              {loc === 'vi'
                ? 'Vận hành và giám sát dây chuyền nghiền bột đá CaCO₃, đảm bảo chất lượng sản phẩm và an toàn lao động theo tiêu chuẩn ISO 9001.'
                : 'Operate and supervise CaCO₃ grinding lines, ensuring product quality and workplace safety to ISO 9001 standards.'}
            </p>

            <h2>{loc === 'vi' ? 'Trách nhiệm chính' : 'Key responsibilities'}</h2>
            <ul>
              <li>Vận hành dây chuyền sản xuất 8-tiếng/ca theo SOP</li>
              <li>Kiểm tra thông số kỹ thuật từng lô (cỡ hạt, độ trắng, độ ẩm)</li>
              <li>Phối hợp với phòng QC khi có lô không đạt</li>
              <li>Đào tạo công nhân mới về vận hành thiết bị</li>
            </ul>

            <h2>{loc === 'vi' ? 'Yêu cầu' : 'Requirements'}</h2>
            <ul>
              <li>Tốt nghiệp Đại học chuyên ngành Cơ khí / Hóa / Công nghệ vật liệu</li>
              <li>2-5 năm kinh nghiệm trong sản xuất công nghiệp</li>
              <li>Thành thạo PLC, biến tần, hệ thống điều khiển dây chuyền</li>
              <li>Tiếng Anh giao tiếp cơ bản (đọc tài liệu kỹ thuật)</li>
            </ul>

            <h2>{loc === 'vi' ? 'Quyền lợi' : 'Benefits'}</h2>
            <ul>
              <li>Lương cơ bản 18–30 triệu + phụ cấp ca + thưởng KPI</li>
              <li>BHXH/BHYT/BHTN đóng đủ trên lương thực tế</li>
              <li>Khám sức khoẻ định kỳ + bảo hiểm tai nạn 24/7</li>
              <li>Du lịch hằng năm, lương tháng 13</li>
            </ul>
          </div>

          <div className="mt-12 rounded-3xl bg-navy-700 p-8 text-white sm:p-12">
            <h2 className="text-2xl font-bold tracking-tight">
              {loc === 'vi'
                ? 'Sẵn sàng gia nhập?'
                : loc === 'en'
                  ? 'Ready to apply?'
                  : '准备好申请了吗?'}
            </h2>
            <p className="mt-2 max-w-md text-white/75">
              {loc === 'vi'
                ? 'Gửi CV về hr@longanhcorp.com với tiêu đề [Vị trí - Họ tên].'
                : 'Send your CV to hr@longanhcorp.com with subject [Position - Your name].'}
            </p>
            <a
              href="mailto:[email protected]"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600"
            >
              <Icon name="mail" size={16} />
              hr@longanhcorp.com
            </a>
          </div>
        </Container>
      </section>
    </main>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-eyebrow text-ink-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
