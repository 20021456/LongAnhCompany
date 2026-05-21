# App QA Context — Độ phủ chỉnh sửa của Admin CMS

> Mục tiêu: kiểm tra xem **mọi thông tin hiển thị trên site công khai** có chỉnh
> sửa được từ trang admin hay không, và liệt kê những phần **chưa sửa được**
> (component "mồ côi" — không có nút admin nào điều khiển nó).

## Tổng quan

- Trang công khai (public): `http://localhost:3000/vi` ← nơi cần verify thay đổi
  - Đổi `vi` → `en` / `zh` để kiểm tra cả 3 ngôn ngữ.
- Trang admin (CMS): `http://localhost:3000/admin`
- Đăng nhập: nhập tay lúc chạy (KHÔNG ghi mật khẩu vào file này).
- Tài khoản test có sẵn sau seed: `admin@longanhcorp.com` (super_admin).

> Khi chạy trên staging/production thì thay `localhost:3000` bằng domain thật.

## CMS hoạt động thế nào (đọc trước khi test)

- Mỗi trang public gồm nhiều **section**. Nội dung section lưu ở bảng
  `page_sections`, sửa tại `Admin → Nội dung → Trang → [chọn trang]`.
- Khi một section **chưa** được sửa, trang public hiển thị **giá trị mặc định**
  lấy từ code (`src/lib/*-content.ts`). Tức là: lần đầu vào trang public thấy
  có chữ **không** có nghĩa là nó "đã sửa được" — phải thử đổi trong admin rồi
  xem public có đổi theo không.
- Dữ liệu danh mục (Sản phẩm, Tin tức, Tuyển dụng) lưu ở bảng riêng, sửa ở
  module CRUD tương ứng.
- Sau khi lưu, trang public dùng ISR — thường cập nhật ngay; nếu chưa thấy đổi
  thì hard-refresh (Ctrl+F5).

## Cách verify chung cho mọi mục

1. Mở mục trong admin, đổi giá trị thành chuỗi test có prefix `[QA]`.
2. Bấm **Lưu** → xác nhận lưu thành công, **không** lỗi đỏ ở console / tab
   Network (status 4xx/5xx).
3. Mở trang public tương ứng (cả 3 ngôn ngữ nếu mục có đa ngôn ngữ) → kiểm tra
   thay đổi xuất hiện **đúng chỗ và đủ**.
4. Kiểm tra cả **mobile view** (DevTools responsive).
5. Revert lại giá trị gốc, lưu lại.

---

## Mapping admin → component public

### A. Trang chủ — `/admin/pages/home` → `/vi`

| Ô / section admin         | Component public                 | Cách verify                                     |
| ------------------------- | -------------------------------- | ----------------------------------------------- |
| Section **Hero**          | Banner đầu trang chủ             | Tiêu đề, mô tả, nút CTA, **ảnh hero** đổi đúng  |
| Section **Stats**         | Dải số liệu dưới hero            | Con số + nhãn đổi đúng                          |
| Section **Products**      | Carousel sản phẩm nổi bật        | Tiêu đề khối + danh sách sản phẩm chọn hiển thị |
| Section **About**         | Khối giới thiệu ngắn             | Text + các thẻ (card) đổi đúng                  |
| Section **Certs**         | Khối chứng nhận                  | Logo + tên chứng nhận đổi đúng                  |
| Section **ExportCap**     | Khối năng lực xuất khẩu / bản đồ | Text + danh sách tính năng đổi đúng             |
| Section **Contact**       | Form liên hệ cuối trang          | Tiêu đề + mô tả khối form đổi đúng              |
| Tab **SEO** (trong trang) | `<title>` / meta của `/`         | View-source kiểm tra meta title/description/OG  |

### B. Giới thiệu — `/admin/pages/about` → `/vi/about`

| Section admin | Component public               | Cách verify                            |
| ------------- | ------------------------------ | -------------------------------------- |
| **Header**    | Tiêu đề + breadcrumb đầu trang | Text đổi đúng                          |
| **Story**     | Khối câu chuyện công ty + ảnh  | Text + ảnh + chữ ký đổi đúng           |
| **Timeline**  | Dòng thời gian (các mốc năm)   | Thêm/xoá/sửa mốc phản ánh đúng         |
| **Values**    | Khối giá trị cốt lõi           | Tên + mô tả + icon đổi đúng            |
| **Caps**      | Khối năng lực sản xuất + ảnh   | Text + ảnh + các chỉ số đổi đúng       |
| **Warehouse** | Lưới ảnh nhà xưởng (4 ảnh)     | **Upload ảnh** → ảnh đổi đúng vị trí   |
| **Certs**     | Lưới chứng nhận                | Bật/tắt + nội dung chứng nhận đổi đúng |
| **CTA**       | Khối kêu gọi cuối trang        | Text + nút đổi đúng                    |

### C. Sản phẩm (trang danh sách) — `/admin/pages/products` → `/vi/products`

| Section admin | Component public           | Cách verify                      |
| ------------- | -------------------------- | -------------------------------- |
| **Header**    | Tiêu đề đầu trang sản phẩm | Text đổi đúng                    |
| **Stats**     | Dải số liệu                | Con số + nhãn đổi đúng           |
| **Tiles**     | Các ô danh mục lớn         | Tiêu đề + **ảnh ô** đổi đúng     |
| **SkuList**   | Danh sách mã SKU           | Sản phẩm được chọn hiển thị đúng |
| **Particle**  | Khối thông số hạt          | Text đổi đúng                    |
| **SpecTable** | Bảng thông số kỹ thuật     | Hàng/cột đổi đúng                |
| **CTA**       | Khối kêu gọi cuối trang    | Text + nút đổi đúng              |

### D. Sản phẩm (danh mục & chi tiết) — `/admin/products`

| Ô admin                              | Component public                                    | Cách verify                           |
| ------------------------------------ | --------------------------------------------------- | ------------------------------------- |
| Tạo / sửa sản phẩm                   | Card ở `/vi/products` + trang `/vi/products/[slug]` | Sản phẩm mới xuất hiện / nội dung đổi |
| Tên, mô tả ngắn / dài (vi/en/zh)     | Tiêu đề + mô tả trang chi tiết                      | Đổi đúng cả 3 ngôn ngữ                |
| Bảng **Variants** (giá, đơn vị, tồn) | Bảng chọn quy cách ở trang chi tiết                 | Variant hiển thị + giá đúng           |
| **Gallery** ảnh sản phẩm             | Thư viện ảnh ở trang chi tiết                       | Ảnh upload xuất hiện đủ               |
| Applications / Packaging / Specs     | Các khối tương ứng trang chi tiết                   | Hiển thị đúng                         |
| `isActive` (ẩn/hiện)                 | Sản phẩm biến mất khỏi `/products`                  | Ẩn → không còn trên public            |
| Xoá sản phẩm                         | Card biến mất                                       | Không còn trên public                 |

### E. Tin tức (trang danh sách) — `/admin/pages/news` → `/vi/news`

| Section admin  | Component public         | Cách verify                  |
| -------------- | ------------------------ | ---------------------------- |
| **Hero**       | Banner đầu trang tin tức | Text đổi đúng                |
| **Categories** | Bộ lọc danh mục          | Danh mục đổi đúng            |
| **Featured**   | Bài viết nổi bật         | Bài được chọn hiển thị       |
| **ListConfig** | Cấu hình danh sách bài   | Số lượng / cách sắp xếp đúng |
| **ByCategory** | Khối bài theo danh mục   | Hiển thị đúng                |
| **Newsletter** | Khối đăng ký nhận tin    | Text đổi đúng                |

### F. Tin tức (bài viết) — `/admin/news`

| Ô admin                               | Component public                         | Cách verify                                      |
| ------------------------------------- | ---------------------------------------- | ------------------------------------------------ |
| Tạo / sửa bài viết                    | Card ở `/vi/news` + `/vi/news/[slug]`    | Bài mới xuất hiện / nội dung đổi                 |
| Tiêu đề, tóm tắt (vi/en/zh)           | Tiêu đề + đoạn tóm tắt                   | Đổi đúng cả 3 ngôn ngữ                           |
| **Trình soạn thảo Tiptap** (nội dung) | Thân bài ở trang chi tiết                | Định dạng (đậm, danh sách, tiêu đề…) render đúng |
| **Thư viện ảnh** (gallery + alt)      | Ảnh xen kẽ giữa các đoạn + chú thích ảnh | Ảnh hiển thị xen kẽ, chú thích = alt text        |
| Ảnh bìa / tile featured               | Ảnh bìa ở card + đầu bài                 | Ảnh đổi đúng                                     |
| `status` (draft/published)            | Bài chỉ hiện khi `published`             | Draft → không có trên public                     |
| Xoá bài viết                          | Card biến mất                            | Không còn trên public                            |

### G. Tuyển dụng (trang danh sách) — `/admin/pages/career` → `/vi/career`

| Section admin | Component public            | Cách verify               |
| ------------- | --------------------------- | ------------------------- |
| **Hero**      | Banner đầu trang tuyển dụng | Text đổi đúng             |
| **Jobs**      | Khối danh sách vị trí       | Vị trí được chọn hiển thị |
| **Values**    | Khối giá trị / văn hoá      | Text đổi đúng             |
| **Benefits**  | Khối phúc lợi               | Text đổi đúng             |
| **Process**   | Khối quy trình tuyển dụng   | Các bước đổi đúng         |
| **CTA**       | Khối kêu gọi cuối trang     | Text + nút đổi đúng       |

### H. Tuyển dụng (vị trí) — `/admin/jobs`

| Ô admin                          | Component public                              | Cách verify                     |
| -------------------------------- | --------------------------------------------- | ------------------------------- |
| Tạo / sửa vị trí                 | List job ở `/vi/career` + `/vi/career/[slug]` | Job mới hiện / nội dung đổi     |
| Tiêu đề, mô tả (vi/en/zh)        | Tiêu đề + mô tả trang chi tiết                | Đổi đúng cả 3 ngôn ngữ          |
| Trách nhiệm / Yêu cầu / Phúc lợi | Các danh sách ở trang chi tiết                | Từng dòng đổi đúng              |
| Lương / kinh nghiệm / cấp bậc    | Thông tin tóm tắt vị trí                      | Đổi đúng                        |
| `isActive` (ẩn/hiện)             | Vị trí biến mất khỏi `/career`                | Ẩn → không còn trên public      |
| Tab **Applications**             | (admin nội bộ — không có public)              | Đơn ứng tuyển đổi trạng thái OK |

### I. Liên hệ — `/admin/pages/contact` → `/vi/contact`

| Section admin | Component public             | Cách verify                         |
| ------------- | ---------------------------- | ----------------------------------- |
| **Header**    | Tiêu đề đầu trang liên hệ    | Text đổi đúng                       |
| **Quick**     | Các thẻ liên hệ nhanh        | SĐT / email / giờ làm việc đổi đúng |
| **Offices**   | Danh sách văn phòng + bản đồ | Địa chỉ / map đổi đúng              |
| **Form**      | Form gửi yêu cầu báo giá     | Tiêu đề + mô tả form đổi đúng       |
| **Social**    | Khối mạng xã hội             | Link MXH đổi đúng                   |

### J. Mục dùng chung

| Ô admin                       | Ảnh hưởng tới                     | Cách verify                                     |
| ----------------------------- | --------------------------------- | ----------------------------------------------- |
| `/admin/media` — Thư viện ảnh | Kho ảnh dùng lại trong các editor | Upload ảnh từ máy → ảnh vào thư viện, dùng được |
| `/admin/seo` — SEO mặc định   | Meta mặc định toàn site           | View-source các trang chưa set meta riêng       |
| `/admin/pages/[key]` tab SEO  | `<title>` / meta / OG từng trang  | View-source trang tương ứng                     |
| `/admin/i18n` — Ngôn ngữ      | Chuỗi dịch (translations)         | ⚠️ Xem mục "Nghi vấn orphan"                    |

---

## ⚠️ Nghi vấn ORPHAN — kiểm tra kỹ trước tiên

> Theo review code, các mục dưới đây **nhiều khả năng là "mồ côi"**: có giao
> diện trong admin nhưng **không** điều khiển được gì trên site công khai (hoặc
> ngược lại — phần public không có nút admin nào sửa). Đây là trọng tâm của
> task này. Cách xác nhận: đổi trong admin → lưu → kiểm tra public. Nếu public
> **KHÔNG đổi** → xác nhận là orphan, ghi vào báo cáo.

| Khu vực nghi vấn                                            | Vì sao nghi ngờ                                                                           | Cách xác nhận                                                                                                  |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **`/admin/menu`** (menu header/footer)                      | Code public (`SiteHeader`, `SiteFooter`) **không** đọc dữ liệu menu từ DB — đang hardcode | Đổi 1 mục menu trong admin → lưu → xem thanh điều hướng + footer public có đổi không. Dự kiến **không đổi**    |
| **`/admin/settings`** (Thương hiệu / Liên hệ / MXH / chung) | Code public **không** thấy nơi nào đọc `settings` từ DB                                   | Đổi SĐT / email / tên thương hiệu → lưu → xem header, footer, các trang public. Dự kiến **không đổi**          |
| **Thanh điều hướng (header)** trên public                   | Nhãn menu lấy từ file code `src/data/copy.ts`, không từ admin                             | Tìm xem có nút admin nào sửa được tên các mục "Trang chủ / Giới thiệu / Sản phẩm…" không. Dự kiến **không có** |
| **Footer** (cột link, thông tin liên hệ, copyright)         | Footer render từ `src/data/copy.ts` hardcode                                              | Tìm nút admin sửa nội dung footer. Dự kiến **không có**                                                        |
| **`/admin/i18n`** (bảng translations)                       | Cần xác minh chuỗi dịch sửa ở đây có thực sự đổi text trên public không                   | Sửa 1 chuỗi → lưu → kiểm tra public ở ngôn ngữ tương ứng                                                       |
| Live chat widget                                            | Chỉ hiện khi `ENABLE_LIVE_CHAT="true"`                                                    | Xác nhận widget có/không theo cấu hình env                                                                     |

> Ngoài danh sách trên, khi rà từng trang public, nếu thấy **bất kỳ chữ / ảnh
> nào không khớp với ô admin nào** trong bảng mapping → ghi vào mục "Orphan phát
> hiện thêm" của báo cáo.

---

## Các task nên tạo

1. **Rà mapping từng trang** — mỗi trang public (chủ, giới thiệu, sản phẩm,
   chi tiết sản phẩm, tin tức, chi tiết bài viết, tuyển dụng, chi tiết vị trí,
   liên hệ) là 1 sub-task: đi hết các section, đối chiếu với bảng mapping.
2. **Xác minh các nghi vấn orphan** — 1 task riêng cho bảng ở mục ⚠️.
3. **Kiểm tra đa ngôn ngữ** — lặp lại trên `en` và `zh`, soi mục nào chỉ sửa
   được tiếng Việt.
4. **Kiểm tra upload ảnh** — upload ở editor bài viết / trang / thư viện ảnh,
   xác nhận ảnh hiển thị trên public.
5. **Tổng hợp danh sách orphan** — liệt kê đầy đủ phần public chưa sửa được.

## Pass criteria

- Mọi nút **Lưu** thành công, không lỗi console / Network (4xx, 5xx).
- Thay đổi phản ánh **đúng & đủ** trên trang public, ở cả 3 ngôn ngữ và mobile.
- Không có component public nào "mồ côi" — hoặc nếu có, **đã liệt kê đầy đủ**
  trong báo cáo (đây là kết quả chính của task).
- Ẩn/xoá bản ghi (sản phẩm, bài viết, vị trí) phản ánh đúng trên public.

## Ràng buộc

- Dùng giá trị test có prefix `[QA]`, **revert** sau khi check xong.
- **Không xoá bản ghi thật.** Cần test xoá thì tự tạo bản ghi `[QA]` rồi xoá.
- Không đổi mật khẩu / tài khoản người dùng thật.
- Test xong nhớ tắt các giá trị `[QA]` còn sót.

## Mẫu báo cáo kết quả

```
### Trang: <tên trang>
- [ ] Section <tên>: PASS / FAIL — ghi chú
...
### Orphan xác nhận
- <mô tả phần public không sửa được + nên thêm editor nào>
### Lỗi phát hiện
- <mô tả + bước tái hiện + ảnh chụp màn hình>
```
