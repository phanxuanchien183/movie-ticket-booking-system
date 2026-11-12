# 🏛️ TÀI LIỆU KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

## 1. Tổng Quan Kiến Trúc
Hệ thống **CineTicket Pro** được thiết kế theo mô hình **Next.js Fullstack Monolithic** (App Router), kết hợp sức mạnh của Server-Side Rendering (SSR), React Server Components (RSC), và Route Handlers hiệu năng cao nhằm cung cấp giải pháp đặt vé xem phim & đại nhạc hội thời gian thực.

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT / USER BROWSER                                   │
│  - Phân Luồng Độc Lập: /movies/[id] (Phim rạp) & /events/[id] (Đại nhạc hội)           │
│  - Sơ đồ khán phòng Ticketbox & ma trận rạp chiếu Laser IMAX                           │
│  - Khóa ghế phân tán thời gian thực (Redis TTL 300s)                                   │
│  - Mô phỏng Seat View 360° tương tác chuột (Pan-Tilt Look-Around Camera)              │
│  - Bảng câu hỏi & xác nhận thông tin thanh toán ràng buộc ngân hàng                    │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │ HTTP / JSON
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS 16+ FULLSTACK APP ROUTER                                │
│                                                                                        │
│  [Consumer UI Layer / React Components]                                                │
│    ├── MovieSelector, EventDetailView, TicketboxStageMap, SeatMap                      │
│    └── SeatViewModal, CheckoutDrawer, TicketSuccessModal                               │
│                                                                                        │
│  [Admin Portal UI Layer (/admin)]                                                      │
│    ├── A. Đại Nhạc Hội: Danh mục, Sự kiện, Trong/Ngoài trời, Sơ đồ Konva.js Canvas     │
│    ├── B. Rạp Chiếu Phim: Chuỗi rạp, Chi nhánh, Địa chỉ, Phòng rạp, Ghế, 360°, Phim    │
│    └── C. Vận Hành Hệ Thống: Tổng quan KPI, Khóa ghế Redis, Khuyến mãi, Lịch sử        │
│                                                                                        │
│  [API Route Handlers (app/api/...)]                                                    │
│    ├── GET  /api/movies & /api/movies/[id]                                             │
│    ├── GET  /api/showtimes & /api/showtimes/[id]/seats                                 │
│    ├── POST /api/seats/lock & /api/seats/release                                       │
│    ├── POST /api/promotions/validate                                                   │
│    └── POST /api/bookings/checkout & GET /api/bookings/[id]                            │
│                                                                                        │
│  [Domain Service Layer]                                                                │
│    ├── SeatLockService (ioredis + TTL memory fallback)                                 │
│    ├── PromotionService (Bank binding check & discount algorithm)                      │
│    ├── SeatViewEngine (Trigonometric coordinate projections & 360° sightlines)         │
│    └── Database Layer (mysql2 pool + smart in-memory fallback)                         │
└────────────────────────────┬─────────────────────────────┬─────────────────────────────┘
                             │                             │
                             ▼                             ▼
             ┌──────────────────────────────┐   ┌─────────────────────────┐
             │        REDIS (ioredis)       │   │     PRIMARY DATABASE    │
             │ - Seat Locking (TTL 300s)    │   │ - MySQL 8.0             │
             │ - Key: lock:showtime:...     │   │ - Transactions (ACID)   │
             │ - Distributed Concurrency    │   │ - Bookings, Seats, Promos│
             └──────────────────────────────┘   └─────────────────────────┘
```

---

## 2. Các Tầng Trong Ứng Dụng (Layer Separation)

### A. Presentation & Interaction Layer (`src/components/`, `src/app/`)
* **Consumer Interface:**
  * `/movies/[id]`: Giới thiệu phim, trailer YouTube, điểm đánh giá khán giả & IMDb, bộ lọc theo chuỗi rạp $\rightarrow$ chi nhánh rạp $\rightarrow$ khung giờ chiếu.
  * `/events/[id]`: Chi tiết đêm nhạc, dàn nghệ sĩ, bảng giá vé phân khu, nội quy tham gia.
  * `/booking/[showtimeId]`: Sơ đồ ghế hoặc sơ đồ phân khu sân khấu Ticketbox.
  * `/booking/[showtimeId]/checkout`: Bảng câu hỏi thông tin người mua, xuất hóa đơn VAT và xác nhận thanh toán.
* **Admin Portal (`/admin`):**
  * Đăng nhập bảo mật tài khoản admin.
  * Nhóm A (Đại nhạc hội): Danh mục sự kiện, Quản lý sự kiện, Địa điểm Trong/Ngoài trời, Thiết kế sân khấu Konva Canvas.
  * Nhóm B (Rạp chiếu phim): Chuỗi rạp, Chi nhánh rạp, Địa chỉ rạp, Phòng chiếu, Thiết kế sơ đồ ghế, Góc Seat View 360° xoay chuột, Quản lý phim.
  * Nhóm C (Vận hành): Dashboard KPI, giám sát Redis khóa ghế, quản lý khuyến mãi, lịch sử giao dịch.

### B. Route Handlers & Zod Validation (`src/app/api/`, `src/schemas/`)
* Đảm bảo tính toàn vẹn dữ liệu từ Client gửi lên Server thông qua Zod:
  * `LockSeatsSchema`: Kiểm tra ID suất chiếu, mảng ghế hợp lệ.
  * `ValidatePromoSchema`: Xác thực mã giảm giá và đối chiếu mã ngân hàng bắt buộc.
  * `CheckoutSchema`: Kiểm tra thông tin khách hàng, số điện thoại, email trước khi ghi đơn hàng.

### C. Concurrency & Locking Layer (`src/services/seat-lock.service.ts`)
* Bảo vệ tài nguyên ghế xem phim khỏi tình trạng **Double-Booking**:
  * Khi nhiều khách hàng cùng chọn 1 ghế, lệnh Redis `SET key value NX EX 300` đảm bảo chỉ có 1 người giữ chỗ thành công.
  * Cơ chế tự động giải phóng (Auto-expire) sau 300 giây (5 phút) nếu khách hàng không thanh toán.
  * Cơ chế Fallback: Tự động chuyển sang `InMemoryLockManager` khi không có Redis ngoài đời thực.

### D. Persistence Layer (`src/lib/db.ts`, `schema/sql/`)
* Sử dụng kết nối Connection Pool của thư viện `mysql2/promise`.
* Mọi giao dịch đặt vé thanh toán đều được bọc trong **Database Transaction** (`START TRANSACTION ... COMMIT / ROLLBACK`) nhằm đảm bảo tính toàn vẹn dữ liệu ACID.
