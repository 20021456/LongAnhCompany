import Link from 'next/link';
import { ConceptFx } from '../ConceptFx';

export const metadata = { title: 'Concept B — Precision Datasheet' };

/**
 * CONCEPT B — "Precision Datasheet" (Swiss / technical direction).
 * The website reads like a beautifully typeset spec document: visible
 * hairline grid, index numbers, tabular data as the hero, near-zero motion.
 * Navy is the single accent; data set in tabular/mono figures.
 */

const ROWS = [
  ['P-01', 'Bột đá CaCO₃ không phủ', 'Uncoated · 4–20 µm · ≥98% trắng', 'Sơn · Keo · Bột bả'],
  [
    'P-02',
    'Bột đá CaCO₃ phủ Stearic Acid',
    'Coated · 4–20 µm · ≥98% trắng',
    'PVC · PE/PP · Masterbatch',
  ],
  ['P-03', 'Đá Slab', 'Tấm lớn · 1.6 × 2.4 m', 'Nội thất · Mặt bàn'],
  ['P-04', 'Đá xẻ quy cách', '60×30 · 40×60 · 80×40 cm', 'Sàn · Tường · Mặt tiền'],
  ['P-05', 'Đá trang trí', 'Chống trượt · đa quy cách', 'Sân vườn · Bể bơi'],
];

export default function ConceptB() {
  return (
    <div className="cb">
      <ConceptFx />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="cb-ribbon">
        CONCEPT B — PRECISION DATASHEET · <Link href="/concept">← danh sách concept</Link>
      </div>

      <header className="cb-hd">
        <b>KS LONG ANH</b>
        <span className="cb-hd-doc">HỒ SƠ NĂNG LỰC · 2026</span>
        <nav>
          <a href="#sp">Sản phẩm</a>
          <a href="#ds">Thông số</a>
          <a href="#nl">Năng lực</a>
          <a href="#lh">Liên hệ</a>
        </nav>
      </header>

      {/* HERO — type-first, photo subordinate */}
      <section className="cb-hero">
        <div className="cb-hero-l" data-cr>
          <p className="cb-idx">KHOÁNG SẢN CÔNG NGHIỆP — NGHỆ AN, VIỆT NAM</p>
          <h1>
            CaCO₃ <em>≥ 98,5%</em>
            <br />
            Độ trắng <em>≥ 98%</em>
            <br />
            Cỡ hạt <em>4–20 µm</em>
          </h1>
          <p className="cb-lede">
            Long Anh sản xuất bột đá Canxi Cacbonat và đá tự nhiên từ mỏ riêng tại Quỳ Hợp — mỗi lô
            hàng kèm COA, MSDS và lịch giao FOB chính xác.
          </p>
          <a className="cb-btn" href="#lh">
            Nhận báo giá FOB →
          </a>
        </div>
        <figure className="cb-hero-r" data-cr style={{ transitionDelay: '.1s' }}>
          <img src="/assets/bot-caco3-sieu-min.webp" alt="" />
          <figcaption>H.01 — Bột CaCO₃ siêu mịn, nhà máy Quỳ Hợp</figcaption>
        </figure>
      </section>

      <div className="cb-strip" data-cr>
        {[
          ['20+', 'năm vận hành'],
          ['350.000', 'tấn / năm'],
          ['05', 'mỏ đá riêng'],
          ['12', 'quốc gia xuất khẩu'],
        ].map(([v, k]) => (
          <div key={k}>
            <b>{v}</b>
            <span>{k}</span>
          </div>
        ))}
      </div>

      {/* 01 — PRODUCT INDEX as table */}
      <section className="cb-sec" id="sp">
        <div className="cb-sec-head" data-cr>
          <span className="cb-no">01</span>
          <h2>Danh mục sản phẩm</h2>
        </div>
        <div className="cb-table">
          <div className="cb-tr cb-th">
            <span>Mã</span>
            <span>Sản phẩm</span>
            <span>Quy cách chính</span>
            <span>Ứng dụng</span>
            <span />
          </div>
          {ROWS.map((r, i) => (
            <a
              key={r[0]}
              className="cb-tr"
              href="#sp"
              data-cr
              style={{ transitionDelay: `${i * 0.04}s` }}
            >
              <span className="cb-mono">{r[0]}</span>
              <span className="cb-name">{r[1]}</span>
              <span className="cb-mono">{r[2]}</span>
              <span>{r[3]}</span>
              <span className="cb-arr">→</span>
            </a>
          ))}
        </div>
      </section>

      {/* 02 — DATASHEET */}
      <section className="cb-sec" id="ds">
        <div className="cb-sec-head" data-cr>
          <span className="cb-no">02</span>
          <h2>Thông số kỹ thuật — CaCO₃</h2>
        </div>
        <div className="cb-ds" data-cr>
          <div className="cb-ds-col">
            {[
              ['Hàm lượng CaCO₃', '≥ 98,5', '%'],
              ['Độ trắng', '≥ 98', '%'],
              ['Độ ẩm', '≤ 0,3', '%'],
            ].map(([k, v, u]) => (
              <div key={k} className="cb-ds-row">
                <span>{k}</span>
                <b className="cb-mono">
                  {v} <i>{u}</i>
                </b>
              </div>
            ))}
          </div>
          <div className="cb-ds-col">
            {[
              ['Tỷ trọng đổ đống', '0,9 – 1,1', 'g/cm³'],
              ['Cỡ hạt D50', '4 – 20', 'µm'],
              ['Chứng từ mỗi lô', 'COA · MSDS', ''],
            ].map(([k, v, u]) => (
              <div key={k} className="cb-ds-row">
                <span>{k}</span>
                <b className="cb-mono">
                  {v} <i>{u}</i>
                </b>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — CAPACITY columns */}
      <section className="cb-sec" id="nl">
        <div className="cb-sec-head" data-cr>
          <span className="cb-no">03</span>
          <h2>Năng lực &amp; logistics</h2>
        </div>
        <div className="cb-cols">
          {[
            [
              'Sản xuất',
              '06 dây chuyền nghiền khô, 02 dây chuyền phủ Stearic Acid theo công nghệ Châu Âu — kiểm tra từng lô.',
            ],
            [
              'Đóng gói',
              'Bao PP 25/50 kg, jumbo 1 tấn, container rời (bulk) — quy cách theo yêu cầu từng thị trường.',
            ],
            [
              'Giao hàng',
              'FOB Cửa Lò & Hải Phòng. Chứng từ đầy đủ, container niêm phong trước khi rời nhà máy.',
            ],
          ].map(([t, d], i) => (
            <div key={t} data-cr style={{ transitionDelay: `${i * 0.07}s` }}>
              <h4>{t}</h4>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 04 — CTA */}
      <section className="cb-final" id="lh" data-cr>
        <div>
          <span className="cb-no">04</span>
          <h2>Gửi yêu cầu — nhận spec sheet, COA và giá FOB trong 24h làm việc.</h2>
        </div>
        <div className="cb-final-r">
          <a className="cb-btn" href="mailto:info@longanhcorp.com">
            info@longanhcorp.com →
          </a>
          <span className="cb-mono">(+84) 942 224 499</span>
        </div>
      </section>

      <footer className="cb-ft">
        <span>KS LONG ANH — Quỳ Hợp · Nghệ An · Việt Nam</span>
        <span className="cb-mono">ISO 9001:2015 · REACH · SGS</span>
        <span>© 2026</span>
      </footer>
    </div>
  );
}

const CSS = `
.cb{--ink:#0b0e14;--mut:#6b7280;--line:#e5e7eb;--navy:#0f3d7a;
  background:#fff;color:var(--ink);font-family:var(--font-inter),sans-serif;font-size:15.5px;line-height:1.65}
.cb h1,.cb h2,.cb h4{font-family:var(--font-display),sans-serif;font-weight:500;letter-spacing:-.015em;margin:0}
.cb a{text-decoration:none;color:inherit}
.cb-mono{font-family:ui-monospace,Menlo,monospace;font-variant-numeric:tabular-nums}
.cb [data-cr]{opacity:0;transform:translateY(16px);transition:opacity .6s ease,transform .6s ease}
.cb [data-cr].in{opacity:1;transform:none}

.cb-ribbon{position:fixed;z-index:60;bottom:18px;left:18px;background:#0b0e14;color:#fff;
  font-size:11px;letter-spacing:.14em;padding:9px 14px;border-radius:99px;opacity:.92}
.cb-ribbon a{color:#8db4e8;margin-left:4px}

.cb-hd{display:flex;align-items:center;gap:26px;height:64px;padding:0 clamp(20px,3.5vw,56px);
  border-bottom:1px solid var(--ink);position:sticky;top:0;background:#fff;z-index:50}
.cb-hd b{letter-spacing:.14em;font-size:14px}
.cb-hd-doc{font-size:11px;letter-spacing:.14em;color:var(--mut)}
.cb-hd nav{margin-left:auto;display:flex;gap:26px}
.cb-hd nav a{font-size:13px;color:var(--mut)}
.cb-hd nav a:hover{color:var(--ink)}

.cb-hero{display:grid;grid-template-columns:1.4fr 1fr;gap:clamp(28px,4vw,72px);
  padding:clamp(60px,9vh,110px) clamp(20px,3.5vw,56px) 70px;align-items:end}
.cb-idx{font-size:11px;letter-spacing:.22em;color:var(--mut);margin:0 0 30px}
.cb-hero h1{font-size:clamp(36px,4.6vw,72px);line-height:1.08}
.cb-hero h1 em{font-style:normal;color:var(--navy)}
.cb-lede{max-width:52ch;color:var(--mut);margin:28px 0 34px}
.cb-btn{display:inline-block;border:1px solid var(--ink);padding:13px 24px;font-weight:600;font-size:14px;transition:.25s}
.cb-btn:hover{background:var(--ink);color:#fff}
.cb-hero-r{margin:0}
.cb-hero-r img{width:100%;aspect-ratio:4/3.4;object-fit:cover;filter:saturate(.92)}
.cb-hero-r figcaption{font-size:11px;letter-spacing:.1em;color:var(--mut);margin-top:10px;font-family:ui-monospace,Menlo,monospace}

.cb-strip{display:flex;border-top:1px solid var(--ink);border-bottom:1px solid var(--ink)}
.cb-strip>div{flex:1;padding:20px clamp(20px,3.5vw,56px);border-left:1px solid var(--line);display:flex;align-items:baseline;gap:12px}
.cb-strip>div:first-child{border-left:0}
.cb-strip b{font-size:24px;font-family:ui-monospace,Menlo,monospace}
.cb-strip span{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--mut)}

.cb-sec{padding:clamp(70px,10vh,120px) clamp(20px,3.5vw,56px) 0}
.cb-sec-head{display:flex;align-items:baseline;gap:22px;margin-bottom:36px}
.cb-no{font-family:ui-monospace,Menlo,monospace;color:var(--navy);font-size:13px}
.cb-sec h2{font-size:clamp(24px,2.6vw,38px)}

.cb-table{border-top:1px solid var(--ink)}
.cb-tr{display:grid;grid-template-columns:70px 1.4fr 1.2fr 1fr 40px;gap:18px;align-items:center;
  padding:18px 0;border-bottom:1px solid var(--line);font-size:14px;transition:background .2s}
.cb-th{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:var(--mut);border-bottom-color:var(--ink)}
a.cb-tr:hover{background:#f8fafc}
.cb-name{font-weight:600;font-size:15px}
.cb-arr{color:var(--navy)}

.cb-ds{display:grid;grid-template-columns:1fr 1fr;gap:0 clamp(30px,5vw,90px);border-top:1px solid var(--ink)}
.cb-ds-row{display:flex;justify-content:space-between;align-items:baseline;padding:16px 0;border-bottom:1px solid var(--line)}
.cb-ds-row span{color:var(--mut);font-size:14px}
.cb-ds-row b{font-size:17px}
.cb-ds-row i{font-style:normal;font-size:12px;color:var(--mut)}

.cb-cols{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(24px,3vw,48px);border-top:1px solid var(--ink);padding-top:34px}
.cb-cols h4{font-size:16px;margin-bottom:10px}
.cb-cols p{color:var(--mut);font-size:14px;margin:0}

.cb-final{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
  margin:clamp(80px,11vh,130px) clamp(20px,3.5vw,56px) 0;border-top:1px solid var(--ink);padding-top:44px;padding-bottom:70px}
.cb-final h2{font-size:clamp(22px,2.4vw,34px);max-width:22ch;margin-top:14px}
.cb-final-r{display:flex;flex-direction:column;gap:14px;align-items:flex-start}

.cb-ft{display:flex;justify-content:space-between;gap:18px;padding:22px clamp(20px,3.5vw,56px);
  border-top:1px solid var(--ink);font-size:12px;color:var(--mut)}

@media (max-width:860px){
  .cb-hd nav{display:none}
  .cb-hero{grid-template-columns:1fr}
  .cb-strip{flex-wrap:wrap}
  .cb-strip>div{flex:1 1 50%;border-left:0}
  .cb-tr{grid-template-columns:54px 1fr 40px}
  .cb-tr span:nth-child(3),.cb-tr span:nth-child(4){display:none}
  .cb-ds{grid-template-columns:1fr}
  .cb-cols{grid-template-columns:1fr}
  .cb-final{flex-direction:column;align-items:flex-start}
}
`;
