# TÀI LIỆU YÊU CẦU WEBSITE BÁN SẢN PHẨM & XUẤT HÓA ĐƠN

## 1. Mục đích hệ thống

Website được xây dựng để khách hàng:

1. Truy cập website thông qua **một đường link**.
2. Xem danh sách sản phẩm.
3. Chọn sản phẩm và số lượng cần mua.
4. Hệ thống tự động tính tổng tiền.
5. Hệ thống tạo/xuất hóa đơn.
6. Khách hàng tự chụp màn hình hóa đơn và gửi lại cho người bán qua Facebook hoặc phương thức liên lạc hiện tại.

Website **không cần hướng tới việc xuất hiện trên Google** và không cần SEO/public rộng rãi.
Mục tiêu chính là làm một website đơn giản để gửi link trực tiếp cho khách hàng sử dụng.

---

## 2. Đối tượng sử dụng

Hệ thống có 2 loại người dùng:

### 2.1. Khách hàng

Khách hàng **không cần đăng nhập**.
Khách chỉ cần truy cập đường link website và sử dụng trực tiếp.
Khách hàng có thể:

* Xem sản phẩm.
* Lọc/phân loại sản phẩm.
* Chọn sản phẩm.
* Chọn số lượng.
* Xem tổng tiền.
* Xuất hóa đơn.
* Chụp màn hình hóa đơn để gửi cho người bán.

Không yêu cầu lưu tài khoản khách hàng. Không yêu cầu khách hàng đăng ký tài khoản.

---

### 2.2. Admin

Admin là người quản lý website. Admin **cần đăng nhập** để quản lý dữ liệu.
Admin có thể quản lý:

* Danh mục sản phẩm.
* Tên sản phẩm.
* Hình ảnh sản phẩm.
* Giá sản phẩm.
* Trạng thái sản phẩm.
* Các thông tin cần thiết khác của sản phẩm.

Mục tiêu là để người bán có thể tự thay đổi danh sách sản phẩm mà không cần sửa code.

---

## 3. Danh mục sản phẩm

Sản phẩm chủ yếu là thực phẩm bổ sung dành cho gym. Ví dụ các danh mục:

* Whey
* Soy
* Creatine
* EAA
* Các sản phẩm TPBS gym khác

Hệ thống cần hỗ trợ **phân loại sản phẩm theo danh mục**.
Ngoài ra có thể hỗ trợ lọc sản phẩm theo giá nếu việc này đơn giản và không làm tăng đáng kể độ phức tạp của hệ thống.

---

## 4. Hiển thị sản phẩm

Website khách hàng hiển thị danh sách sản phẩm. Mỗi sản phẩm tối thiểu gồm:

* Hình ảnh sản phẩm.
* Tên sản phẩm.
* Giá.
* Danh mục.

Người bán có thể đưa nhiều ảnh sản phẩm vào cùng một danh mục/group để khách hàng dễ xem và lựa chọn.
Ví dụ:

### Whey
* Sản phẩm A
* Sản phẩm B
* Sản phẩm C

### Creatine
* Sản phẩm D
* Sản phẩm E

### EAA
* Sản phẩm F
* Sản phẩm G

---

## 5. Chọn sản phẩm và số lượng

Khách hàng có thể chọn nhiều sản phẩm trong cùng một đơn hàng.
Ví dụ:

| Sản phẩm   |  Đơn giá | Số lượng | Thành tiền |
| ---------- | -------: | -------: | ---------: |
| Whey A     | 500.000đ |        2 | 1.000.000đ |
| Creatine B | 300.000đ |        1 |   300.000đ |
| EAA C      | 400.000đ |        2 |   800.000đ |

Hệ thống tự động tính:

**Thành tiền = Đơn giá × Số lượng**

Sau đó cộng tất cả sản phẩm: **Tổng tiền = Tổng thành tiền của các sản phẩm**.

---

## 6. Xuất hóa đơn

Sau khi khách hàng chọn sản phẩm và số lượng, website hiển thị hóa đơn. Hóa đơn tối thiểu gồm:

* Danh sách sản phẩm.
* Đơn giá.
* Số lượng.
* Thành tiền từng sản phẩm.
* Tổng tiền đơn hàng.

Khách hàng có thể xem hóa đơn ngay trên website.
Có thể cung cấp chức năng để khách hàng **tải/xuất ảnh hóa đơn** nếu triển khai đơn giản.

---

## 7. Quy trình sử dụng của khách hàng

Quy trình dự kiến:

**Bước 1:** Khách nhận link website.

↓

**Bước 2:** Khách mở website.

↓

**Bước 3:** Xem danh sách sản phẩm.

↓

**Bước 4:** Chọn sản phẩm.

↓

**Bước 5:** Nhập/chọn số lượng.

↓

**Bước 6:** Website tự động tính tổng tiền.

↓

**Bước 7:** Khách bấm xuất/xem hóa đơn.

↓

**Bước 8:** Khách chụp màn hình hóa đơn.

↓

**Bước 9:** Khách gửi ảnh hóa đơn cho người bán qua Facebook hoặc kênh liên lạc hiện tại.

Không cần xây dựng chức năng tự động gửi hóa đơn cho admin.

---

## 8. Không lưu dữ liệu khách hàng

Hệ thống **không cần quản lý tài khoản khách hàng**.
Không yêu cầu:

* Đăng ký.
* Đăng nhập.
* Hồ sơ khách hàng.
* Lịch sử mua hàng.
* Danh sách khách hàng.

Mục tiêu là giảm tối đa chi phí và độ phức tạp của hệ thống.

---

## 9. Quản lý dữ liệu

Do chỉ có khoảng **2 người sử dụng hệ thống ở phía quản lý**, hệ thống cần ưu tiên sự đơn giản.
Dữ liệu cần quản lý chủ yếu là:

* Danh mục sản phẩm.
* Sản phẩm.
* Hình ảnh.
* Giá.
* Trạng thái hiển thị.

Không cần xây dựng hệ thống quản lý bán hàng phức tạp.

---

## 10. Phạm vi truy cập website

Website **không cần public để mọi người tìm thấy trên Google**.
Chỉ cần: **Một đường link → gửi trực tiếp cho khách hàng → khách truy cập và sử dụng.**
Không yêu cầu:

* SEO.
* Đưa website lên Google.
* Marketing website.
* Trang giới thiệu công khai.
* Hệ thống tài khoản khách hàng.

---

## 11. Tên miền

Ưu tiên phương án đơn giản và tiết kiệm chi phí nhất. Không nhất thiết phải mua tên miền đẹp hoặc tên miền thương hiệu.
Có thể sử dụng:

* Domain miễn phí nếu phù hợp.
* Subdomain miễn phí.
* Hoặc một tên miền giá rẻ.

Nếu khách hàng chỉ cần truy cập bằng một đường link thì ưu tiên **chi phí vận hành thấp nhất**.

---

## 12. Yêu cầu về chi phí

Đây là dự án quy mô nhỏ, số lượng người dùng thấp. Ưu tiên:

* Hosting miễn phí hoặc giá rẻ.
* Database miễn phí hoặc giá rẻ.
* Storage miễn phí hoặc giá rẻ.
* Domain miễn phí hoặc giá rẻ.
* Không xây dựng các dịch vụ không cần thiết.
* Không lưu dữ liệu khách hàng nếu không cần thiết.

Mục tiêu là **tối giản chi phí triển khai và chi phí duy trì hàng tháng**.

---

## 13. Ưu tiên triển khai

Thứ tự ưu tiên:

### Bắt buộc

* Website khách hàng.
* Danh sách sản phẩm.
* Phân loại sản phẩm.
* Hình ảnh sản phẩm.
* Giá sản phẩm.
* Chọn sản phẩm.
* Chọn số lượng.
* Tính tổng tiền.
* Xuất/xem hóa đơn.
* Admin đăng nhập.
* Admin quản lý sản phẩm.

### Có thể bổ sung nếu triển khai đơn giản

* Lọc theo giá.
* Tải hóa đơn thành ảnh.
* Sắp xếp sản phẩm.
* Bật/tắt sản phẩm.

### Không cần triển khai

* Đăng nhập khách hàng.
* Đăng ký tài khoản.
* Quản lý khách hàng.
* Tự động gửi hóa đơn cho admin.
* Thanh toán online.
* Chat trực tiếp.
* SEO.
* Hệ thống đơn hàng phức tạp.
* CRM.
* Thống kê bán hàng phức tạp.

---

## 14. Tổng quan kiến trúc

Có thể chia hệ thống thành 2 phần:

**1. Website khách hàng**

Dùng để:
> Xem sản phẩm → chọn sản phẩm → chọn số lượng → tính tiền → xuất hóa đơn.

**2. Website Admin**

Dùng để:
> Đăng nhập → quản lý danh mục → quản lý sản phẩm → quản lý giá/hình ảnh.

Khách hàng không cần biết hoặc truy cập khu vực Admin.

---

## 15. Nguyên tắc quan trọng

Đây là một website bán hàng **đơn giản**, không phải một hệ thống thương mại điện tử đầy đủ.
Do đó cần ưu tiên:

**Đơn giản → dễ sử dụng → chi phí thấp → dễ bảo trì**

thay vì xây dựng quá nhiều chức năng không cần thiết.

---

## 16. Stack công nghệ (đã xác định)

- **Frontend**: Vue 3 + Vite (JavaScript cho sự đơn giản)
- **UI**: Tailwind CSS
- **Routing**: Vue Router (SPA cho cả khu vực khách hàng và admin)
- **Trạng thái giỏ hàng**: Pinia hoặc composable đơn giản
- **Backend/DB/Storage/Auth (chi phí thấp)**: Supabase (gói Free)
  - Supabase Auth: đăng nhập admin (email/mật khẩu)
  - Supabase Postgres: lưu danh mục, sản phẩm, giá, trạng thái
  - Supabase Storage: lưu ảnh sản phẩm
- **Xuất hóa đơn dạng ảnh (nếu cần)**: html2canvas + download trên client (không tốn chi phí server)
- **Hosting Frontend**: Vercel / Netlify gói Free
- **Domain**: Subdomain miễn phí hoặc domain giá rẻ tùy chọn

---

## 17. Schema dữ liệu đề xuất (Supabase Postgres)

Bảng `categories`:
- id (uuid, PK)
- name (text, ví dụ: Whey, Creatine)
- slug (text, unique)
- sort_order (int, mặc định 0)
- created_at / updated_at

Bảng `products`:
- id (uuid, PK)
- category_id (uuid, FK -> categories.id)
- name (text)
- description (text, nullable)
- price (numeric/bigint, đơn vị VND)
- image_url (text, public URL từ Storage)
- is_active (boolean, default true: bật/tắt hiển thị cho khách)
- sort_order (int, default 0)
- created_at / updated_at

Cơ chế RLS (Row Level Security):
- categories, products: cho phép khách hàng (anon) đọc (SELECT) các dòng active
- chỉ admin (role authenticated) mới được INSERT/UPDATE/DELETE
- Storage bucket `products`: admin được upload, public đọc ảnh
