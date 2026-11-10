---
name: movie-ticket-booking
description: "Universal Agent Skill for Movie & Event Ticket Booking System (Next.js fullstack, Redis seat locking, Seat View Engine 3D trigonometry, bank binding promotions, MySQL schema)."
---

# 🤖 MOVIE & EVENT TICKET BOOKING SYSTEM - AGENT SKILL SPECIFICATION

> **Note for AI Coding Assistants (Agent-Agnostic):**
> Tài liệu này được thiết kế theo tiêu chuẩn Skill mở, dành cho bất kỳ AI coding assistant nào (Antigravity, Claude Code, Cursor, Copilot, Codex, Gemini CLI...) khi làm việc với codebase này. Hãy đọc kỹ các quy chuẩn thiết kế bên dưới trước khi sửa đổi hoặc mở rộng tính năng.

---

## 1. Bản Đồ Cấu Trúc Dự Án (Project Map)

```text
movie-ticket-booking/
├── schema/sql/                     # Các file migration SQL thuần (DDL + Seeds)
│   ├── 01_init_rooms_and_seats.sql # Rooms, Seats (X, Y, Z coordinates, seat types)
│   ├── 02_init_movies_and_showtimes.sql # Movies, Showtimes
│   ├── 03_init_promotions_and_pricing.sql # Pricing rules, Promotions
│   ├── 04_init_bookings.sql        # Bookings, Booking Seats
│   └── 05_seed_data.sql            # Dữ liệu mẫu rạp IMAX, phim, suất chiếu, voucher
├── src/
│   ├── app/
│   │   ├── api/                    # Route Handlers Next.js
│   │   │   ├── movies/             # GET /api/movies
│   │   │   ├── showtimes/          # GET /api/showtimes & /[id]/seats
│   │   │   ├── seats/lock/         # POST /api/seats/lock
│   │   │   ├── seats/release/      # POST /api/seats/release
│   │   │   ├── promotions/validate/# POST /api/promotions/validate
│   │   │   └── bookings/checkout/  # POST /api/bookings/checkout & /[id]
│   │   ├── layout.tsx              # Root HTML & metadata
│   │   └── page.tsx                # Client interactive booking application
│   ├── components/                 # React UI Components
│   │   ├── Navbar.tsx              # Thanh điều hướng & stepper
│   │   ├── MovieSelector.tsx       # Chọn phim & thông tin phim
│   │   ├── ShowtimeSelector.tsx    # Lịch chiếu & định dạng (IMAX 2D...)
│   │   ├── SeatMap.tsx             # Sơ đồ ghế tương tác SVG & timer 5:00
│   │   ├── SeatViewModal.tsx       # Canvas mô phỏng góc nhìn rạp 3D
│   │   ├── CheckoutDrawer.tsx      # Form thanh toán & kiểm tra ngân hàng
│   │   └── TicketSuccessModal.tsx  # Vé điện tử & mã QR
│   ├── lib/
│   │   ├── db.ts                   # mysql2 connection pool + In-Memory Fallback
│   │   ├── redis.ts                # ioredis client + In-Memory TTL Lock Manager
│   │   └── seat-view-engine.ts     # Công thức hình học khoảng cách & góc nhìn
│   ├── schemas/                    # Zod validation schemas
│   │   ├── booking.ts              # CheckoutSchema
│   │   ├── seat.ts                 # LockSeatsSchema, ReleaseSeatsSchema
│   │   └── promotion.ts            # ValidatePromoSchema
│   ├── services/                   # Business domain services
│   │   ├── seat-lock.service.ts    # Redis lock logic & batch rollback
│   │   └── promotion.service.ts    # Strict bank binding validator
│   └── types/                      # TypeScript domain types & interfaces
│       └── index.ts
├── docs/                           # Tài liệu kỹ thuật chi tiết
│   ├── 01_ARCHITECTURE.md
│   ├── 02_DATABASE_SCHEMA.md
│   ├── 03_REDIS_SEAT_LOCKING.md
│   ├── 04_SEAT_VIEW_ENGINE.md
│   ├── 05_PROMOTION_BANK_BINDING.md
│   ├── 06_API_SPECIFICATION.md
│   └── 07_DEPLOYMENT_GUIDE.md
├── scripts/
│   └── migrate.js                  # Node.js script chạy migration MySQL
├── docker-compose.yml              # Cụm Docker Next.js + MySQL + Redis
└── Dockerfile                      # Multi-stage production container
```

---

## 2. Quy Tắc Cốt Lõi Khi Lập Trình & Can Thiệp Codebase

### Quy Tắc 1: Bảo Toàn Tính Nguyên Tử Của Redis Lock
* **Key Pattern Bắt Buộc:** `lock:showtime:{showtime_id}:seat:{seat_id}`
* **Lệnh Khóa:** `SET key userId NX EX 300` (TTL cố định 300 giây).
* **Rollback Bắt Buộc:** Khi khóa danh sách nhiều ghế trong `seat-lock.service.ts`, nếu có bất kỳ ghế nào trả về `nil` (đã bị người khác khóa), Agent **phải giải phóng toàn bộ các ghế đã khóa thành công trước đó** trong cùng một transaction.
* **Auto-fallback:** Không được xóa bỏ lớp `InMemoryLockManager` trong `src/lib/redis.ts` vì nó đảm bảo dự án chạy được trên môi trường dev không có Redis.

### Quy Tắc 2: Kiểm Duyệt Ràng Buộc Ngân Hàng Tuyệt Đối (Bank Binding Check)
* Khi xử lý mã giảm giá trong `src/services/promotion.service.ts`:
  * Nếu `promotion.bank_code` có giá trị (VD: `"ACB"`), phải so sánh với `payment_method`.
  * Nếu phương thức thanh toán **không chứa** chuỗi mã ngân hàng (so sánh không phân biệt hoa thường) $\rightarrow$ Bắt buộc ném lỗi `INVALID_BANK_PAYMENT_METHOD`.
  * Không cho phép bypass hoặc bỏ qua bước kiểm tra này trong API Checkout.

### Quy Tắc 3: Tính Toán Seat View Engine Đúng Chuẩn Lượng Giác
* Khi tính toán góc nhìn trong `src/lib/seat-view-engine.ts`:
  * Khoảng cách đến tâm màn hình:
    $$\text{Distance} = \sqrt{\left(X_{\text{seat}} - \frac{\text{screenWidth}}{2}\right)^2 + Y_{\text{seat}}^2}$$
  * Góc lệch ngang:
    $$\text{Angle} = \arctan\left(\frac{X_{\text{seat}} - \frac{\text{screenWidth}}{2}}{Y_{\text{seat}}}\right) \times \frac{180}{\pi}$$
  * Giữ nguyên phân cấp đánh giá chất lượng vị trí ghế:
    * $|\text{Angle}| \le 8^\circ$: Ghế trung tâm Hoàng Kim (5 sao)
    * $8^\circ < |\text{Angle}| \le 18^\circ$: Ghế tiêu chuẩn tốt (4.5 sao)
    * $18^\circ < |\text{Angle}| \le 28^\circ$: Ghế góc cánh bên (3.5 sao)
    * $> 28^\circ$: Ghế góc rìa (3 sao)

### Quy Tắc 4: Toàn Vẹn Giao Dịch Đặt Vé (ACID Transaction)
* Khi gọi `db.createBooking`:
  * Phải kiểm tra lại tính khả dụng của ghế trong DB (`booking_seats` của các đơn đã thanh toán).
  * Nếu thành công, tự động giải phóng Redis Lock của `userId`.
  * Ghi nhận lượt sử dụng mã ưu đãi (`used_count = used_count + 1`).

---

## 3. Các Lệnh Thao Tác Thường Dùng (Agent Operational Commands)

### A. Kiểm tra biên dịch & Typecheck
```bash
npm run build
```

### B. Khởi chạy môi trường phát triển cục bộ
```bash
npm run dev
```

### C. Chạy migrations SQL vào MySQL
```bash
npm run db:migrate
```

### D. Khởi động với Docker Compose
```bash
docker compose up -d --build
```

