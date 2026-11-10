# 🎬 CineTicket Pro - Movie & Event Ticket Booking System
### Hệ Thống Đặt Vé Xem Phim & Sự Kiện Trực Tuyến Thời Gian Thực (Fullstack Next.js)

[![Next.js](https://img.shields.io/badge/Next.js-16.4+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Redis](https://img.shields.io/badge/Redis-Locking_TTL-DC382D?style=for-the-badge&logo=redis)](https://redis.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0_InnoDB-4479A1?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![Zod](https://img.shields.io/badge/Zod-Type_Safety-3068B7?style=for-the-badge&logo=zod)](https://zod.dev/)

---

## 🌟 Giới Thiệu Tổng Quan (Overview)

**CineTicket Pro** là giải pháp phần mềm đặt vé xem phim và sự kiện cao cấp được thiết kế theo kiến trúc **Next.js Fullstack Monolithic** (App Router). Hệ thống giải quyết các bài toán kỹ thuật phức tạp nhất trong ngành bán vé trực tuyến:

1. **Khóa ghế thời gian thực chống Double-Booking:** Sử dụng cơ chế phân tán **Redis Key-Value với TTL 300s (5 phút)** và lệnh nguyên tử `SET NX EX`.
2. **Động cơ mô phỏng góc nhìn rạp chiếu (Seat View Engine):** Tính toán lượng giác từ tọa độ không gian 3D thực tế $(X, Y, Z)$ của ghế đến màn hình cong IMAX để dựng hình ảnh phối cảnh và xếp hạng góc nhìn (5 sao).
3. **Chính sách khuyến mãi ràng buộc ngân hàng nghiêm ngặt (Bank Binding Check):** Chống gian lận voucher, bắt buộc đối chiếu phương thức thanh toán của ngân hàng tài trợ (VD: Mã `ACB50` bắt buộc thanh toán qua Ngân hàng ACB).
4. **Trải nghiệm giao diện điện ảnh mượt mà:** Xây dựng bằng Tailwind CSS v4, Canvas/SVG, đồng hồ đếm ngược 5:00 phút trực quan, hiệu ứng pháo hoa chúc mừng và vé điện tử E-Ticket kèm mã QR.

---

## 🏗️ Kiến Trúc Hệ Thống (Architecture Flow)

```
[ Browser / Khách Hàng ]
       │
       ▼ (HTTP / JSON)
[ Next.js 16 Fullstack App Router ]
 ├── UI Layer: MovieSelector, ShowtimeSelector, SeatMap, SeatViewModal, CheckoutDrawer
 ├── API Handlers: /api/movies, /api/showtimes, /api/seats/lock, /api/promotions/validate, /api/bookings/checkout
 ├── Zod Validation Schemas
 └── Domain Services: SeatLockService, PromotionService, SeatViewEngine
       │                                     │
       ▼ (ioredis)                           ▼ (mysql2 connection pool)
[ Redis Seat Lock (TTL 300s) ]        [ MySQL 8.0 Primary DB ]
```

---

## 🚀 Tính Năng Cốt Lõi (Key Features)

### 1. Phân Bổ & Khóa Ghế Redis (Seat Locking Engine)
* **Key Format:** `lock:showtime:{showtime_id}:seat:{seat_id}`
* **Nguyên tử tính (Atomic):** `SET key userId NX EX 300`.
* **Cơ chế Rollback:** Khi chọn nhiều ghế, nếu phát sinh 1 ghế bị tranh chấp sẽ tự động giải phóng toàn bộ các ghế đã chọn trước đó.
* **Tự động mở khóa (Auto-release):** Khi hết 300s mà chưa thanh toán, Redis tự động giải phóng ghế về trạng thái khả dụng.
* **Zero-Friction Fallback:** Tích hợp sẵn `InMemoryLockManager` tự kích hoạt khi chạy local không có Redis.

### 2. Mô Phỏng Góc Nhìn Ghế (Seat View Engine)
* **Khoảng cách:**
  $$\text{Distance} = \sqrt{\left(X_{\text{seat}} - \frac{\text{screenWidth}}{2}\right)^2 + Y_{\text{seat}}^2}$$
* **Góc lệch ngang:**
  $$\text{Angle} = \arctan\left(\frac{X_{\text{seat}} - \frac{\text{screenWidth}}{2}}{Y_{\text{seat}}}\right) \times \frac{180}{\pi}$$
* **Canvas Renderer:** Vẽ màn hình cong IMAX phát sáng với điểm tụ (Vanishing Point) dịch chuyển tương ứng theo góc lệch và độ cao sàn $Z$.
* **Đánh giá tự động:** Xếp hạng 5 sao cho Ghế trung tâm Hoàng Kim, cảnh báo nếu ghế ở quá sát màn hình hoặc góc nghiêng lớn.

### 3. Ràng Buộc Thanh Toán Ngân Hàng (Bank Binding Promotions)
* Áp dụng điều kiện kiểm tra nghiêm ngặt: Hạn dùng, số lượt dùng tối đa, giá trị đơn tối thiểu.
* **Đối chiếu mã ngân hàng:** Nếu `promotions.bank_code = 'ACB'`, chỉ chấp nhận phương thức thanh toán `ACB_CREDIT` hoặc `ACB_QR`. Từ chối mọi phương thức khác (`INVALID_BANK_PAYMENT_METHOD`).
* Tự động tính phần trăm giảm giá có chặn trần tối đa (`max_discount_amount`).

### 4. Vé Điện Tử & Mã QR Vào Rạp (E-Ticket)
* Cấp mã đơn hàng duy nhất dạng `BK-XXXXXX-YYYYYY`.
* Chuỗi bảo mật QR Code `TICKET:{bookingId}:ST{showtimeId}:{seats}` để nhân viên rạp quét vé tại cổng.
* Tích hợp tính năng In vé và Tải vé.

---

## 📂 Cấu Trúc Thư Mục Dự Án (Project Structure)

```text
movie-ticket-booking/
├── schema/sql/                     # DDL & Data Seeding cho MySQL
│   ├── 01_init_rooms_and_seats.sql # Phòng chiếu & sơ đồ ghế 3D (X, Y, Z)
│   ├── 02_init_movies_and_showtimes.sql # Phim & suất chiếu
│   ├── 03_init_promotions_and_pricing.sql # Giá vé linh hoạt & mã ưu đãi
│   ├── 04_init_bookings.sql        # Đơn đặt vé & chi tiết ghế
│   └── 05_seed_data.sql            # Dữ liệu mẫu rạp IMAX, phim, suất chiếu
├── src/
│   ├── app/
│   │   ├── api/                    # Route Handlers Next.js
│   │   │   ├── movies/             # GET danh sách phim
│   │   │   ├── showtimes/          # GET suất chiếu & sơ đồ ghế
│   │   │   ├── seats/lock/         # POST khóa ghế qua Redis
│   │   │   ├── seats/release/      # POST giải phóng ghế
│   │   │   ├── promotions/validate/# POST validate mã ưu đãi ngân hàng
│   │   │   └── bookings/checkout/  # POST checkout & xuất vé
│   │   ├── layout.tsx              # Root HTML & Metadata
│   │   └── page.tsx                # Trang chủ ứng dụng đặt vé
│   ├── components/                 # Các UI Component
│   │   ├── Navbar.tsx              # Thanh điều hướng & Stepper tiến trình
│   │   ├── MovieSelector.tsx       # Lựa chọn phim
│   │   ├── ShowtimeSelector.tsx    # Chọn khung giờ & định dạng (IMAX 2D...)
│   │   ├── SeatMap.tsx             # Sơ đồ ghế SVG tương tác & timer
│   │   ├── SeatViewModal.tsx       # Canvas 3D mô phỏng góc nhìn rạp
│   │   ├── CheckoutDrawer.tsx      # Form thanh toán & kiểm tra ngân hàng
│   │   └── TicketSuccessModal.tsx  # Modal vé điện tử & mã QR
│   ├── lib/
│   │   ├── db.ts                   # mysql2 connection pool + In-Memory Fallback
│   │   ├── redis.ts                # ioredis client + In-Memory TTL Lock
│   │   └── seat-view-engine.ts     # Công thức hình học tọa độ & góc nhìn
│   ├── schemas/                    # Zod validation schemas
│   ├── services/                   # Business domain services
│   └── types/                      # TypeScript definitions
├── docs/                           # Bộ tài liệu kỹ thuật hoàn chỉnh
│   ├── 01_ARCHITECTURE.md          # Tài liệu kiến trúc toàn diện
│   ├── 02_DATABASE_SCHEMA.md       # Thiết kế CSDL & ERD
│   ├── 03_REDIS_SEAT_LOCKING.md    # Phân tích khóa ghế phân tán Redis
│   ├── 04_SEAT_VIEW_ENGINE.md      # Công thức hình học lượng giác
│   ├── 05_PROMOTION_BANK_BINDING.md# Ràng buộc ngân hàng thanh toán
│   ├── 06_API_SPECIFICATION.md     # Đặc tả REST API đầy đủ
│   └── 07_DEPLOYMENT_GUIDE.md      # Hướng dẫn triển khai Docker / Local
├── skills/movie-ticket-booking/    # Universal AI Agent Skill (Agent-Agnostic)
│   └── SKILL.md
├── docker-compose.yml              # Đóng gói Next.js + MySQL + Redis
├── Dockerfile                      # Multi-stage production build
└── package.json
```

---

## ⚡ Hướng Dẫn Cài Đặt & Chạy Ứng Dụng (Quickstart)

### Cách 1: Chạy Cục Bộ Nhanh (Local - Không Cần Cài MySQL/Redis)
Hệ thống tự động kích hoạt **In-Memory Store** nếu phát hiện không có kết nối MySQL hoặc Redis:

```bash
# 1. Đi tới thư mục dự án
cd D:\source\movie-ticket-booking

# 2. Cài đặt dependencies
npm install

# 3. Tạo cấu hình môi trường
copy .env.example .env.local

# 4. Khởi chạy Server
npm run dev
```
👉 Mở trình duyệt và trải nghiệm tại: **`http://localhost:3000`**

---

### Cách 2: Triển Khai Hoàn Chỉnh Bằng Docker Compose (Production)
Chạy đồng thời ứng dụng Next.js, MySQL 8.0 và Redis 7:

```bash
# Khởi động toàn bộ các dịch vụ
docker compose up -d --build
```

---

## 🧪 Hệ Thống Kiểm Thử Toàn Diện (Testing Suite)

Dự án áp dụng chính sách **Bắt buộc 100% kiểm thử (Mandatory Testing Policy)**. Mọi tính năng, service và component màn hình mới đều đi kèm file test chuyên biệt:

* **Domain Services:** [`seat-lock.service.test.ts`](file:///D:/source/movie-ticket-booking/src/services/__tests__/seat-lock.service.test.ts) (Khóa ghế phân tán, xử lý tranh chấp đồng thời, gia hạn TTL, rollback), [`promotion.service.test.ts`](file:///D:/source/movie-ticket-booking/src/services/__tests__/promotion.service.test.ts) (Ràng buộc ngân hàng ACB/VCB, chặn trần giảm giá, đơn hàng tối thiểu).
* **Mathematical Engine:** [`seat-view-engine.test.ts`](file:///D:/source/movie-ticket-booking/src/lib/__tests__/seat-view-engine.test.ts) (Công thức lượng giác Pytago, góc lệch tâm, phân cấp định tính 5 sao).
* **UI Components:** [`SeatMap.test.tsx`](file:///D:/source/movie-ticket-booking/src/components/__tests__/SeatMap.test.tsx), [`ShowtimeSelector.test.tsx`](file:///D:/source/movie-ticket-booking/src/components/__tests__/ShowtimeSelector.test.tsx), [`MovieSelector.test.tsx`](file:///D:/source/movie-ticket-booking/src/components/__tests__/MovieSelector.test.tsx).

```bash
# Chạy toàn bộ 22/22 test cases
npm test

# Chạy test ở chế độ theo dõi (Watch mode)
npm run test:watch
```

---

## 🎟️ Dữ Liệu Demo & Mã Khuyến Mãi (Test Scenarios)

| Mã Voucher | Giảm giá | Ràng buộc Ngân hàng | Thử nghiệm phù hợp |
| :---: | :---: | :---: | :--- |
| **`ACB50`** | Giảm 50% (tối đa 100k) | **Bắt buộc thẻ ACB** (`ACB_CREDIT`, `ACB_QR`) | Chọn phương thức thanh toán ACB để được giảm giá. Nếu chọn Momo hoặc VCB sẽ bị hệ thống từ chối. |
| **`VCB30K`** | Giảm 30.000 VNĐ | **Bắt buộc Vietcombank** (`VCB_DIGIBANK`) | Áp dụng cho đơn hàng từ 180.000 VNĐ. |
| **`CINEMA20`** | Giảm 20% (tối đa 50k) | Không ràng buộc ngân hàng | Áp dụng cho tất cả hình thức thanh toán. |

---

## 🤖 Universal Agent Skill (Dành Cho AI Coding Assistants)
Dự án cung cấp bộ kỹ năng chuẩn hóa (Agent-Agnostic Skill) tại:
* [`skills/movie-ticket-booking/SKILL.md`](file:///D:/source/movie-ticket-booking/skills/movie-ticket-booking/SKILL.md)
* [`.agent/skills/movie-ticket-booking/SKILL.md`](file:///D:/source/movie-ticket-booking/.agent/skills/movie-ticket-booking/SKILL.md)

Mọi AI Agent (Antigravity, Claude, Cursor, Copilot, Codex) đều có thể nạp tệp này để nắm bắt toàn bộ kiến trúc và quy tắc vận hành dự án.

---

## 👨‍💻 Tác Giả & Bản Quyền (Author & License)
* **Tác giả:** [Phan Xuân Chiến](https://github.com/phanxuanchien183)
* **GitHub Repository:** [movie-ticket-booking-system](https://github.com/phanxuanchien183/movie-ticket-booking-system)
* **Giấy phép:** MIT License
