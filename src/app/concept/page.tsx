import Link from 'next/link';

export const metadata = { title: 'Danh sách concept' };

/** Index of the three design-concept previews. Internal, never indexed. */

const CONCEPTS = [
  {
    href: '/concept/a',
    tag: 'A · KHUYẾN NGHỊ',
    name: 'Quarry Editorial',
    img: '/assets/da-slab-sieu-trang.webp',
    desc: 'Hướng Kettal: nền trắng ngà màu đá vôi, ảnh full-bleed là ngôi sao, chữ ít và lớn, cam chỉ còn trên đúng một nút CTA. Nhịp lặp: ảnh → tuyên ngôn → lưới.',
    points: [
      'Nhịp section thống nhất',
      'Motion: fade-up một lần + hover ảnh',
      'Sang, tối giản, giàu cảm xúc thương hiệu',
    ],
  },
  {
    href: '/concept/b',
    tag: 'B',
    name: 'Precision Datasheet',
    img: '/assets/bot-caco3-sieu-min.webp',
    desc: 'Hướng Swiss kỹ thuật: website như một tài liệu spec được dàn trang đẹp — lưới hairline lộ rõ, bảng dữ liệu là nhân vật chính, navy là màu nhấn duy nhất, gần như không animation.',
    points: ['Số liệu & spec là hero', 'Bảng sản phẩm dạng index', 'Hợp khách kỹ sư thu mua B2B'],
  },
  {
    href: '/concept/c',
    tag: 'C',
    name: 'Warm Industrial',
    img: '/assets/nha-may-bot-sieu-min.webp',
    desc: 'Bản "kỷ luật hoá" site hiện tại: giữ nhận diện navy + cam và ngôn ngữ card, nhưng chỉ một kiểu card, một khối navy mỗi trang, bỏ marquee/đếm số/parallax.',
    points: [
      'Ít thay đổi nhất so với hiện tại',
      'Một khối navy / trang',
      'Giữ nhận diện thương hiệu cũ',
    ],
  },
];

export default function ConceptIndex() {
  return (
    <div className="cx">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="cx-head">
        <p>KS LONG ANH · DESIGN CONCEPTS · 07/2026</p>
        <h1>Ba hướng thiết kế — mở từng trang để cảm nhận nhịp cuộn thật.</h1>
        <p className="cx-note">
          Cả ba đều dùng ảnh thật, font thật và nội dung thật của site. Điểm cần để ý khi xem: nhịp
          lặp của section, tốc độ animation (chỉ chạy một lần), và mật độ màu nhấn.
        </p>
      </header>
      <div className="cx-list">
        {CONCEPTS.map((c) => (
          <Link key={c.href} href={c.href} className="cx-card">
            <div className="cx-img">
              <img src={c.img} alt="" />
              <span className="cx-tag">{c.tag}</span>
            </div>
            <div className="cx-body">
              <h2>{c.name}</h2>
              <p>{c.desc}</p>
              <ul>
                {c.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <span className="cx-go">Xem concept →</span>
            </div>
          </Link>
        ))}
      </div>
      <footer className="cx-ft">
        So sánh với site hiện tại: <a href="/vi">mở trang chủ đang chạy →</a>
      </footer>
    </div>
  );
}

const CSS = `
.cx{min-height:100svh;background:#111214;color:#ececec;font-family:var(--font-inter),sans-serif;
  padding:clamp(40px,7vh,90px) clamp(20px,4vw,72px) 60px;line-height:1.65}
.cx a{text-decoration:none;color:inherit}
.cx-head{max-width:880px;margin-bottom:56px}
.cx-head>p{font-size:11.5px;letter-spacing:.22em;color:#9a9a93;margin:0 0 22px}
.cx-head h1{font-family:var(--font-display),sans-serif;font-weight:500;font-size:clamp(26px,3.4vw,44px);
  line-height:1.18;letter-spacing:-.02em;margin:0 0 18px}
.cx-note{color:#9a9a93;font-size:15px;max-width:64ch;margin:0}
.cx-list{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.cx-card{background:#1a1b1e;border:1px solid #2a2b2f;border-radius:14px;overflow:hidden;
  display:flex;flex-direction:column;transition:transform .35s cubic-bezier(.22,.61,.24,1),border-color .35s}
.cx-card:hover{transform:translateY(-5px);border-color:#4a4b50}
.cx-img{position:relative;aspect-ratio:16/9;overflow:hidden}
.cx-img img{width:100%;height:100%;object-fit:cover;transition:transform .9s cubic-bezier(.22,.61,.24,1)}
.cx-card:hover .cx-img img{transform:scale(1.04)}
.cx-tag{position:absolute;top:14px;left:14px;background:rgba(17,18,20,.85);backdrop-filter:blur(6px);
  font-size:10.5px;letter-spacing:.16em;padding:6px 11px;border-radius:99px;color:#f4b27a}
.cx-body{padding:24px 24px 26px;display:flex;flex-direction:column;flex:1}
.cx-body h2{font-family:var(--font-display),sans-serif;font-weight:500;font-size:22px;margin:0 0 10px;letter-spacing:-.01em}
.cx-body>p{font-size:13.5px;color:#b9b9b2;margin:0 0 16px}
.cx-body ul{margin:0 0 22px;padding:0;list-style:none;display:flex;flex-direction:column;gap:7px}
.cx-body li{font-size:12.5px;color:#8f8f88;padding-left:16px;position:relative}
.cx-body li::before{content:'—';position:absolute;left:0;color:#5a5b60}
.cx-go{margin-top:auto;font-size:13.5px;font-weight:600;color:#f4b27a}
.cx-ft{margin-top:52px;font-size:13.5px;color:#9a9a93}
.cx-ft a{color:#f4b27a;border-bottom:1px solid rgba(244,178,122,.4);padding-bottom:2px}
@media (max-width:960px){.cx-list{grid-template-columns:1fr}}
`;
