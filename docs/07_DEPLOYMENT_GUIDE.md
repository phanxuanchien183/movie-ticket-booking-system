# 🚀 HƯỚNG DẪN TRIỂN KHAI & CÀI ĐẶT (DEPLOYMENT & SETUP GUIDE)

## 1. Yêu Cầu Hệ Thống (Prerequisites)
* **Node.js:** Phiên bản 18.x, 20.x hoặc mới hơn (khuyên dùng Node 20 LTS trở lên).
* **Trình quản lý gói:** `npm`, `pnpm` hoặc `yarn`.
* **Cơ sở dữ liệu (Tùy chọn):** MySQL 8.0 & Redis 7.x (Nếu không có, ứng dụng sẽ tự động kích hoạt bộ nhớ đệm in-memory giả lập để chạy thử nghiệm mượt mà không cần cài đặt gì thêm).

---

## 2. Cách 1: Chạy Cục Bộ (Local Development - Không Cần Cài MySQL/Redis)

Hệ thống được lập trình với cơ chế **Zero-Friction In-Memory Fallback**, cho phép chạy ngay lập tức mà không cần cài đặt thêm bất kỳ service ngoại vi nào.

```bash
# 1. Đi tới thư mục dự án
cd D:\source\movie-ticket-booking

# 2. Cài đặt các gói thư viện
npm install

# 3. Tạo file cấu hình môi trường từ mẫu
copy .env.example .env.local

# 4. Khởi chạy máy chủ phát triển
npm run dev
```

Truy cập trình duyệt tại địa chỉ: `http://localhost:3000`

---

## 3. Cách 2: Triển Khai Toàn Diện Với Docker Compose (Production Ready)

Đây là phương thức triển khai khuyến nghị cho môi trường Production, đóng gói đầy đủ:
* Container `ticket-booking-app`: Ứng dụng Next.js Fullstack (Port `3000`)
* Container `ticket-booking-mysql`: MySQL 8.0 với các script khởi tạo tự động (Port `3306`)
* Container `ticket-booking-redis`: Redis 7 Alpine quản lý khóa ghế (Port `6379`)

```bash
# 1. Khởi động toàn bộ cụm dịch vụ qua Docker Compose
docker compose up -d --build

# 2. Kiểm tra trạng thái các container
docker compose ps

# 3. Xem nhật ký hoạt động (Logs)
docker compose logs -f app
```

Sau khi các container đạt trạng thái `healthy`, hệ thống sẵn sàng phục vụ tại `http://localhost:3000`.

---

## 4. Chạy Migration SQL Thủ Công Trên MySQL Đang Chạy
Nếu bạn muốn chạy trực tiếp trên máy chủ MySQL có sẵn:

```bash
# 1. Thiết lập biến môi trường trong file .env.local:
# MYSQL_HOST=localhost
# MYSQL_USER=root
# MYSQL_PASSWORD=mat_khau_cua_ban
# MYSQL_DATABASE=ticket_booking

# 2. Chạy lệnh migrate dữ liệu:
npm run db:migrate
```

Lệnh trên sẽ lần lượt thực thi các file trong `schema/sql/`:
* `01_init_rooms_and_seats.sql`
* `02_init_movies_and_showtimes.sql`
* `03_init_promotions_and_pricing.sql`
* `04_init_bookings.sql`
* `05_seed_data.sql`

---

## 5. Danh Mục Biến Môi Trường (Environment Variables)

| Biến môi trường | Giá trị mặc định | Mô tả ý nghĩa |
| :--- | :--- | :--- |
| `PORT` | `3000` | Port lắng nghe của máy chủ Next.js |
| `NODE_ENV` | `development` | Chế độ môi trường (`development` hoặc `production`) |
| `MYSQL_HOST` | `127.0.0.1` | Địa chỉ IP / Hostname của máy chủ MySQL |
| `MYSQL_PORT` | `3306` | Cổng kết nối MySQL |
| `MYSQL_USER` | `root` | Tài khoản đăng nhập MySQL |
| `MYSQL_PASSWORD`| - | Mật khẩu tài khoản MySQL |
| `MYSQL_DATABASE`| `ticket_booking`| Tên cơ sở dữ liệu |
| `REDIS_HOST` | `127.0.0.1` | Hostname Redis Server |
| `REDIS_PORT` | `6379` | Cổng Redis Server |
| `REDIS_PASSWORD`| - | Mật khẩu xác thực Redis (nếu có) |

