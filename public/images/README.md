# 🖼️ Image library — `public/images/`

Thư mục chứa **ảnh mẫu** và là nơi quy ước lưu ảnh cho website.
Mỗi ảnh ở đây được serve tĩnh tại đường dẫn `/images/<folder>/<file>`.

> Lưu ý phân biệt:
> - `public/assets/` — asset gốc copy từ prototype LongAnhCorp (không sửa).
> - `public/images/` — ảnh tổ chức theo nghiệp vụ, dùng cho seed Phase 3
>   và là fallback khi Media library (Phase 6) chưa có ảnh upload thật.

## Cấu trúc

| Thư mục       | Nội dung                                  | Dùng ở đâu                          |
| ------------- | ----------------------------------------- | ----------------------------------- |
| `products/`   | Ảnh sản phẩm (P-01 … P-05)                | `products`, `product_variants`      |
| `news/`       | Ảnh bìa bài viết                          | `articles.coverImageUrl`            |
| `certs/`      | Badge chứng chỉ (ISO, REACH, SGS, MSDS)   | `certifications.badgeImageUrl`      |
| `facility/`   | Ảnh nhà máy, kho bãi, dây chuyền          | `page_sections`, `pages` (about)    |
| `hero/`       | Ảnh banner hero                           | `pages` (home hero), OG images      |
| `team/`       | Ảnh nhân sự, lãnh đạo                     | `page_sections` (about leadership)  |

## Quy ước đặt tên

- chữ thường, dùng dấu gạch ngang: `p-01-caco3-uncoated.webp`
- ưu tiên `.webp` cho ảnh chụp (nhẹ), `.svg` cho badge/icon
- ảnh sản phẩm: tiền tố mã sản phẩm — `p-01-...`, `p-02-...`
- ảnh mẫu / placeholder: tiền tố `sample-` — sẽ thay khi có ảnh thật

## Ảnh mẫu hiện có

Các ảnh trong thư mục này được copy từ prototype làm mẫu. Khi có ảnh
chính thức từ khách hàng, thay thế trực tiếp (giữ nguyên tên file để
không phải sửa code/seed), hoặc upload qua Media library ở Phase 6.

## Khi seed (Phase 3)

`prisma/seed.ts` sẽ trỏ `coverImageUrl`, `badgeImageUrl`… vào các đường
dẫn `/images/...` này. Khi admin upload ảnh thật qua Media library, các
bản ghi DB sẽ được cập nhật sang URL S3/Cloudinary.
