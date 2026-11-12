---
name: movie-ticket-booking
description: "Universal Agent Skill for Movie & Event Ticket Booking System (Next.js 16 fullstack, Route Separation /movies & /events, Redis seat locking, 360° Pan-Tilt Look-Around Seat View, Konva.js Canvas Stage Designer, Comprehensive Admin Portal for Concerts & Cinemas, MySQL schema, and mandatory testing policies)."
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
│   │   │   ├── movies/             # GET /api/movies & /[id]
│   │   │   ├── showtimes/          # GET /api/showtimes & /[id]/seats
│   │   │   ├── seats/lock/         # POST /api/seats/lock (Redis TTL 300s)
│   │   │   ├── seats/release/      # POST /api/seats/release
│   │   │   ├── promotions/validate/# POST /api/promotions/validate (Bank binding)
│   │   │   └── bookings/checkout/  # POST /api/bookings/checkout & /[id]
│   │   ├── admin/                  # Cổng Quản Trị Hệ Thống (/admin)
│   │   │   ├── page.tsx            # Bố cục 3 phần chuẩn Admin (Header, Menu, Content)
│   │   │   └── __tests__/AdminPage.test.tsx
│   │   ├── movies/[id]/            # Luồng xem phim rạp: trailer, rating, chọn chi nhánh rạp & suất chiếu
│   │   ├── events/[id]/            # Luồng đại nhạc hội: chi tiết concert, nghệ sĩ, hạng vé, nội quy
│   │   ├── booking/[showtimeId]/   # Sơ đồ rạp chiếu hoặc sân khấu Ticketbox tương tác
│   │   │   └── checkout/           # Bảng câu hỏi & thông tin xuất hóa đơn Ticketbox
│   │   ├── layout.tsx              # Root HTML, Fonts & Metadata
│   │   ├── page.tsx                # Trang chủ ứng dụng đặt vé
│   │   └── icon.svg                # Browser favicon custom
│   ├── components/                 # React UI Components
│   │   ├── admin/                  # Bộ module quản trị Admin
│   │   │   ├── KonvaCanvasStageDesigner.tsx # Trình thiết kế sân khấu Konva Canvas đa tầng
│   │   │   ├── CinemaSeatViewSimulator.tsx  # Góc nhìn Seat View 360° xoay chuột (Pan-Tilt)
│   │   │   ├── ConcertAdminModules.tsx      # Quản lý sự kiện, danh mục, địa điểm Trong/Ngoài trời
│   │   │   ├── CinemaAdminModules.tsx       # Quản lý chuỗi rạp, chi nhánh, phòng chiếu, phim
│   │   │   └── StageZoneDesigner.tsx        # Trình thiết kế sơ đồ & hạng vé (Mục 1 & 2)
│   │   ├── Navbar.tsx              # Thanh điều hướng thương mại người dùng
│   │   ├── MovieSelector.tsx       # Lựa chọn phim & phân loại
│   │   ├── EventDetailView.tsx     # Chi tiết sự kiện concert
│   │   ├── TicketboxStageMap.tsx   # Sơ đồ sân khấu phong cách Ticketbox
│   │   ├── SeatMap.tsx             # Sơ đồ ghế rạp chiếu phim
│   │   ├── SeatViewModal.tsx       # Modal góc nhìn ghế 3D
│   │   ├── CheckoutDrawer.tsx      # Form thanh toán & kiểm tra ngân hàng
│   │   └── TicketSuccessModal.tsx  # Vé điện tử E-Ticket & mã QR
│   ├── lib/
│   │   ├── db.ts                   # mysql2 connection pool + In-Memory Fallback
│   │   ├── redis.ts                # ioredis client + In-Memory TTL Lock Manager
│   │   ├── seat-view-engine.ts     # Công thức hình học khoảng cách & góc nhìn THX/SMPTE
│   │   └── __tests__/seat-view-engine.test.ts
│   ├── schemas/                    # Zod validation schemas
│   ├── services/                   # Business domain services
│   │   ├── seat-lock.service.ts    # Redis lock logic & batch rollback
│   │   ├── promotion.service.ts    # Strict bank binding validator
│   │   └── __tests__/
│   └── types/                      # TypeScript domain types & interfaces
├── vitest.config.ts                # Cấu hình test runner Vitest + React Testing Library
├── docs/                           # Tài liệu kỹ thuật chi tiết
├── skills/movie-ticket-booking/    # Universal AI Agent Skill (Agent-Agnostic)
└── package.json
```

---

## 2. Quy Chuẩn Vận Hành Hai Lĩnh Vực Cốt Lõi

### Lĩnh Vực 1: Đại Nhạc Hội & Sự Kiện Biểu Diễn (Concerts & Live Events)
1. **Phân Luồng Riêng Biệt (`/events/[id]`):** Không dùng chung route với phim chiếu rạp. Đường dẫn hiển thị rõ thông tin ban tổ chức, danh sách nghệ sĩ, thời gian và địa điểm.
2. **Sơ Đồ Phân Khu Ticketbox (`TicketboxStageMap.tsx`):** Hiển thị sân khấu trung tâm (Main Stage, T-Stage, Runway), phân khu vé đứng (Fanzone A/B, GA 1/2) và vé ngồi (Sky Lounge, SVIP, VIP, CAT 1/2/3).
3. **Bảng Câu Hỏi & Thanh Toán (`/booking/[id]/checkout`):** Tuân thủ quy chuẩn Ticketbox gồm các điều khoản Ban tổ chức, thông tin cá nhân và xuất hóa đơn VAT.
4. **Trình Thiết Kế Sân Khấu Konva.js Canvas (`KonvaCanvasStageDesigner.tsx`):** Container `<div class="konvajs-content" role="presentation">` đa tầng `<canvas>` cho phép kéo thả phân khu, cấu hình giá vé và sức chứa.

### Lĩnh Vực 2: Rạp Chiếu Phim (Cinemas & Movie Theaters)
1. **Phân Luồng Riêng Biệt (`/movies/[id]`):** Hiển thị trailer YouTube, điểm đánh giá khán giả/IMDb, nhãn độ tuổi (P, T16, T18), bộ chọn chuỗi rạp $\rightarrow$ chọn chi nhánh cụm rạp $\rightarrow$ khung giờ chiếu.
2. **Phòng Chiếu & Ma Trận Ghế (`SeatMap.tsx` & `CinemaSeatDesigner.tsx`):** Hàng ghế A đến H, ghế Tiêu chuẩn (Standard), VIP trung tâm, Sweetbox đôi vách ngăn, lối đi Aisle.
3. **Mô Phỏng Góc Nhìn 360° Xoay Chuột (`CinemaSeatViewSimulator.tsx`):**
   - Hỗ trợ thao tác chuột kéo rê trực tiếp trên màn hình chiếu (Pan-Tilt Look-Around Camera: Yaw -180° đến +180°, Pitch -40° đến +40°).
   - Mô phỏng màn hình cong Laser IMAX, trần rạp kèm loa âm thanh vòm Dolby Atmos, cửa thoát hiểm EXIT và các hàng ghế xung quanh.
   - Bảng chỉ số quang học thực tế chuẩn SMPTE & THX: Khoảng cách màn hình (m), góc ngẩng cổ (Vertical Elevation Angle $\le 35^\circ$), góc lệch tâm ngang và phân loại *Golden Seat*.

---

## 3. Quy Tắc Cốt Lõi Khi Can Thiệp Codebase

### Quy Tắc 1: Bảo Toàn Tính Nguyên Tử Của Redis Lock
* **Key Pattern Bắt Buộc:** `lock:showtime:{showtime_id}:seat:{seat_id}`
* **Lệnh Khóa:** `SET key userId NX EX 300` (TTL cố định 300 giây).
* **Rollback Bắt Buộc:** Khi khóa danh sách nhiều ghế trong `seat-lock.service.ts`, nếu có bất kỳ ghế nào trả về `nil` (đã bị người khác khóa), Agent **phải giải phóng toàn bộ các ghế đã khóa thành công trước đó** trong cùng một transaction.
* **Auto-fallback:** Không được xóa bỏ lớp `InMemoryLockManager` trong `src/lib/redis.ts`.

### Quy Tắc 2: Kiểm Duyệt Ràng Buộc Ngân Hàng Tuyệt Đối (Bank Binding Check)
* Khi xử lý mã giảm giá trong `src/services/promotion.service.ts`:
  * Nếu `promotion.bank_code` có giá trị (VD: `"ACB"`), phải so sánh với `payment_method`.
  * Nếu phương thức thanh toán **không chứa** chuỗi mã ngân hàng $\rightarrow$ Bắt buộc ném lỗi `INVALID_BANK_PAYMENT_METHOD`.

### Quy Tắc 3: Tính Toán Tầm Nhìn Ghế Đúng Chuẩn Lượng Giác & SMPTE/THX
* Khi tính toán góc nhìn trong `src/lib/seat-view-engine.ts`:
  * Khoảng cách đến tâm màn hình:
    $$\text{Distance} = \sqrt{\left(X_{\text{seat}} - \frac{\text{screenWidth}}{2}\right)^2 + Y_{\text{seat}}^2}$$
  * Góc lệch ngang:
    $$\text{Angle} = \arctan\left(\frac{X_{\text{seat}} - \frac{\text{screenWidth}}{2}}{Y_{\text{seat}}}\right) \times \frac{180}{\pi}$$
  * Đánh giá tiêu chuẩn:
    * $|\text{Angle}| \le 8^\circ$: Ghế trung tâm Hoàng Kim (Golden Seat - 5 sao).
    * $8^\circ < |\text{Angle}| \le 18^\circ$: Ghế tiêu chuẩn tốt chuẩn THX.
    * Góc ngẩng cổ $\le 35^\circ$ theo khuyến nghị SMPTE.

### Quy Tắc 4: Toàn Vẹn Giao Dịch Đặt Vé (ACID Transaction)
* Khi gọi `db.createBooking`:
  * Phải kiểm tra lại tính khả dụng của ghế trong DB (`booking_seats` của các đơn đã thanh toán).
  * Nếu thành công, tự động giải phóng Redis Lock của `userId`.
  * Ghi nhận lượt sử dụng mã ưu đãi (`used_count = used_count + 1`).

---

## 4. Chính Sách Bắt Buộc Về Kiểm Thử (MANDATORY TESTING POLICY)

> ⚠️ **ĐIỀU KHOẢN BẮT BUỘC:**
> 1. Mọi chức năng mới (API, Service, Utility) đều **bắt buộc phải có file test unit/integration** tương ứng đặt trong thư mục `__tests__/` cùng cấp.
> 2. Mọi màn hình hoặc UI component mới đều **bắt buộc phải có file test component** sử dụng Vitest và `@testing-library/react`.
> 3. Trước khi hoàn tất bất kỳ lượt can thiệp nào, Agent **bắt buộc phải chạy lệnh `npm test`** và đảm bảo 100% test cases đều pass (xanh lá). Hiện tại dự án có **52/52 tests passing**.

---

## 5. Các Lệnh Thao Tác Thường Dùng (Agent Operational Commands)

### A. Chạy toàn bộ Test Suite (Bắt Buộc Trước Khi Hoàn Tất)
```bash
npm test
```

### B. Chạy Test ở chế độ Watch (Khi Đang Lập Trình)
```bash
npm run test:watch
```

### C. Kiểm tra biên dịch & Typecheck
```bash
npm run build
```

### D. Khởi chạy môi trường phát triển cục bộ
```bash
npm run dev
```

### E. Khởi động với Docker Compose
```bash
docker compose up -d --build
```
