# GymShop - Website bán sản phẩm gym & xuất hóa đơn (Vue 3 + Vite)

Website tối giản theo yêu cầu: khách hàng **không cần đăng nhập**, xem/chọn sản phẩm, tính tổng tiền, xuất hóa đơn; admin đăng nhập quản lý danh mục + sản phẩm (ảnh, giá, trạng thái).

## 1. Cấu trúc thư mục chính

```
Weblistproductgym/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── docs/
│   ├── project_brief.md              ← Requirement chi tiết
│   └── supabase_setup.sql            ← Migration tạo bảng/bucket Supabase
└── src/
    ├── main.js
    ├── App.vue
    ├── router/
    │   ├── index.js                  ← Các route khách hàng & admin
    │   └── guards.js                 ← Guard bảo vệ /admin (requiresAuth)
    ├── stores/
    │   ├── cart.js                   ← Pinia store giỏ hàng (lưu localStorage)
    │   └── auth.js                   ← Store đăng nhập admin (Supabase Auth)
    ├── styles/main.css               ← Tailwind + component classes (btn, chip, card,...)
    ├── utils/format.js               ← formatVND, mã hóa đơn, ngày tháng
    ├── lib/supabase.js               ← Khởi tạo client + helper ảnh public URL
    ├── services/products.js          ← Dual mode: Supabase thật / Mock data
    ├── components/
    │   ├── ProductCard.vue           ← Card + thêm vào giỏ
    │   └── CartItem.vue              ← Dòng sản phẩm trong giỏ
    └── views/
        ├── HomeView.vue              ← Trang chủ: xem/lọc/sắp xếp sản phẩm
        ├── CartView.vue              ← Giỏ hàng + tổng tiền
        ├── InvoiceView.vue           ← Xem hóa đơn + tải ảnh PNG + In PDF
        └── admin/
            ├── AdminLoginView.vue    ← Đăng nhập admin
            └── AdminDashboardView.vue← Quản lý danh mục + sản phẩm (CRUD + upload ảnh)
```

## 2. Chạy dự án trên máy

Máy cần cài **Node.js 18+** (để có `npm`).

```bash
# 1) Cài gói (chỉ chạy 1 lần đầu / khi package.json đổi)
npm install

# 2) Chạy dev server
npm run dev
# Mở đường dẫn hiển thị trong terminal, thường là http://localhost:5173
```

Lệnh build / preview:

```bash
npm run build     # tạo dist/
npm run preview   # chạy thử build output
```

## 3. Chế độ "Dữ liệu mẫu" vs "Dữ liệu thật"

Ở bản đầu tiên (chưa cấu hình `.env`), website sẽ tự động chạy **chế độ dữ liệu mẫu** để bạn xem giao diện ngay:

- 1 trang chủ với 7 sản phẩm mẫu (Whey/Creatine/EAA/Soy)
- Thêm/xóa sản phẩm trong giỏ vẫn hoạt động (lưu localStorage)
- Xuất hóa đơn, tải ảnh hóa đơn, in PDF đều hoạt động
- Trang `/admin/login` đăng nhập bằng:
  - Email: `admin@demo.com`
  - Mật khẩu: `admin123`
- **Lưu ý:** ở chế độ mẫu, các CRUD admin **không lưu thật**.

Muốn admin thêm/sửa/xóa dữ liệu thật (cho cả hai người quản lý đều nhìn thấy), cấu hình **Supabase** theo mục 4.

## 4. Cấu hình Supabase (Backend + DB + Storage + Auth) - hoàn toàn FREE

> Gói Free Supabase là đủ cho dự án này (500MB DB, 1GB Storage, 50k user MAU, unlimited auth).

### Bước 1. Tạo project Supabase
- Đăng nhập https://supabase.com → New project (chọn region gần VN nhất có thể, ví dụ Singapore).
- Đợi vài phút cho project khởi tạo xong.

### Bước 2. Chạy migration SQL
- Mở Dashboard → SQL Editor → New Query
- Mở file `docs/supabase_setup.sql` trong dự án, copy toàn bộ nội dung dán vào và Run.
- Sau đó vào **Storage** → Create bucket với tên `products` → **bật Public** (Make bucket public).
  - Bucket này đã có policy trong file SQL cho phép guest đọc ảnh & admin upload/sửa/xóa.

### Bước 3. Lấy URL + ANON KEY gán vào `.env`
- Dashboard → Project Settings → **API** (sidebar)
  - Copy `Project URL` → dán vào `VITE_SUPABASE_URL`
  - Copy `Project API keys` → `anon public` → dán vào `VITE_SUPABASE_ANON_KEY`
- Tạo file `.env` ở thư mục gốc bằng cách copy `.env.example`:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_SUPABASE_BUCKET=products
```

> Lưu ý: **ANON KEY** là public (gửi xuống trình duyệt vẫn được), RLS + Policies đã giới hạn quyền cho guest. Không bao giờ dùng service_role key trong frontend.

### Bước 4. Tạo tài khoản admin
- Dashboard → **Authentication** → Users → **Add user** → Create new user
  - Nhập email + mật khẩu admin → Create.
  - Vào `/admin/login` dùng chính email + mật khẩu này để đăng nhập.

### Bước 5. Bật/tắt email provider & confirm email tùy chọn
- Default: Email provider đã bật. Tuy nhiên default là **require email confirmation**.
- Nếu không muốn mở mail xác nhận (lưu cho 2 admin nội bộ):
  - Authentication → Providers → Email → tắt **Confirm email**.
- Ngược lại: giữ Confirm email ON cho bảo mật hơn.

## 5. Deploy (hosting frontend miễn phí)

Frontend chỉ là static SPA build bằng Vite, bạn có thể đẩy lên một trong 3 dịch vụ dưới đây hoàn toàn miễn phí:

### Phương án A: Netlify (dễ nhất)
- Chạy `npm run build` → thư mục `dist/`
- Netlify → Add new site → Deploy manually → kéo thả folder `dist/` là xong
- Hoặc kết nối Git repo, Netlify tự build khi push.

### Phương án B: Vercel
- `npm i -g vercel` → chạy `vercel` trong project, chọn framework Vite, auto-detect.
- Vercel tự nhận file `.env` nếu bạn điền vào Project settings → Env vars.

### Phương án C: Cloudflare Pages
- Connect Git → Framework preset: Vite → Build command `npm run build` → Output `dist`.

Sau khi deploy xong, bạn sẽ có **subdomain miễn phí** (`.netlify.app` / `.vercel.app` / `.pages.dev`). Gửi subdomain này cho khách dùng ngay. Nếu muốn domain riêng, mua 1 tên miền giá rẻ rồi trỏ CNAME/A record theo hướng dẫn của nhà cung cấp hosting.

## 6. Dữ liệu khách hàng & bảo mật

- Dữ liệu khách: **không lưu gì ngoài giỏ hàng trên trình duyệt (localStorage)**, đúng requirement.
- Không có form thanh toán / tài khoản khách.
- Admin đăng nhập qua Supabase Auth, bảo mật 2 lớp tuỳ chọn (tích hợp sau nếu cần).

## 7. Kiểm tra nhanh "Bắt buộc"

- [x] Website truy cập được (npm run dev)
- [x] Khách không cần đăng nhập (HomeView)
- [x] Xem sản phẩm, lọc danh mục, sắp xếp (HomeView)
- [x] Thêm vào giỏ, đổi số lượng, tính tổng tiền (CartView)
- [x] Xem hóa đơn, tải hóa đơn PNG, In/PDF (InvoiceView)
- [x] Admin đăng nhập (AdminLoginView)
- [x] Admin quản lý danh mục + sản phẩm (CRUD, upload ảnh, bật/tắt hiển thị) (AdminDashboardView)

Nếu gặp lỗi hoặc muốn mở rộng (lọc giá, lịch sử đơn hàng), báo mình nhé.
