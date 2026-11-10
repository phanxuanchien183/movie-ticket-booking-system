# 🏛️ TÀI LIỆU KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

## 1. Tổng Quan Kiến Trúc
Hệ thống **CineTicket Pro** được thiết kế theo mô hình **Next.js Fullstack Monolithic** (App Router), kết hợp sức mạnh của Server-Side Rendering (SSR), React Server Components (RSC), và Route Handlers hiệu năng cao nhằm cung cấp giải pháp đặt vé xem phim & sự kiện thời gian thực.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT / USER BROWSER                           │
│  - Interactive Seat Map (SVG / DOM / Canvas)                           │
│  - Real-time 5-minute Seat Lock Timer                                  │
│  - 3D Perspective Seat View Engine Simulation                          │
│  - Checkout & Bank Payment Gateway Binding Form                        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   NEXT.JS 15+ FULLSTACK APP ROUTER                     │
│                                                                        │
│  [UI Layer / React Components]                                         │
│    ├── MovieSelector, ShowtimeSelector, SeatMap                        │
│    └── SeatViewModal, CheckoutDrawer, TicketSuccessModal               │
│                                                                        │
│  [API Route Handlers (app/api/...)]                                    │
│    ├── GET  /api/movies                                                │
│    ├── GET  /api/showtimes & /api/showtimes/[id]/seats                 │
│    ├── POST /api/seats/lock & /api/seats/release                       │
│    ├── POST /api/promotions/validate                                   │
│    └── POST /api/bookings/checkout & GET /api/bookings/[id]            │
│                                                                        │
│  [Domain Service Layer]                                                │
│    ├── SeatLockService (ioredis + TTL memory fallback)                 │
│    ├── PromotionService (Bank binding check & discount algorithm)      │
│    ├── SeatViewEngine (Trigonometric coordinate projections)           │
│    └── Database Layer (mysql2 pool + smart in-memory fallback)         │
└───────────────────────┬──────────────────────────────┬─────────────────┘
                        │                              │
                        ▼                              ▼
        ┌──────────────────────────────┐    ┌─────────────────────────┐
        │        REDIS (ioredis)       │    │     PRIMARY DATABASE    │
        │ - Seat Locking (TTL 300s)    │    │ - MySQL 8.0             │
        │ - Key: lock:showtime:...     │    │ - Transactions (ACID)   │
        │ - Distributed Concurrency    │    │ - Bookings, Seats, Promos│
        └──────────────────────────────┘    └─────────────────────────┘
```

---

## 2. Các Tầng Trong Ứng Dụng (Layer Separation)

### A. Presentation & Interaction Layer (`src/components/`, `src/app/`)
* **Next.js App Router Client Components:** Sử dụng chỉ thị `'use client'` để kích hoạt tính tương tác cao:
  * `SeatMap.tsx`: Vẽ sơ đồ ghế theo hàng/cột, phản ánh trạng thái ghế thời gian thực (`available`, `locked`, `booked`).
  * `SeatViewModal.tsx`: Render Canvas giả lập tầm nhìn rạp chiếu phim từ tọa độ 3D thực tế của từng ghế.
  * `CheckoutDrawer.tsx`: Luồng xác nhận thanh toán, áp mã ưu đãi và kiểm tra ràng buộc phương thức thanh toán.

### B. Route Handlers & Zod Validation (`src/app/api/`, `src/schemas/`)
* Đảm bảo tính toàn vẹn dữ liệu từ Client gửi lên Server thông qua Zod:
  * `LockSeatsSchema`: Kiểm tra ID suất chiếu, mảng ghế hợp lệ.
  * `ValidatePromoSchema`: Xác thực mã giảm giá và phương thức thanh toán.
  * `CheckoutSchema`: Kiểm tra thông tin khách hàng, số điện thoại, email trước khi ghi đơn hàng.

### C. Concurrency & Locking Layer (`src/services/seat-lock.service.ts`)
* Bảo vệ tài nguyên ghế xem phim khỏi tình trạng **Double-Booking**:
  * Khi nhiều khách hàng cùng bấm vào 1 ghế trong cùng 1 mili-giây, lệnh Redis `SET key value NX EX 300` đảm bảo chỉ có 1 người duy nhất thành công.
  * Cơ chế tự động giải phóng (Auto-expire) sau 300 giây (5 phút) nếu khách hàng không hoàn tất thanh toán.
  * Cơ chế Fallback thông minh: Tự động chuyển sang In-Memory Lock Manager có thread dọn dẹp key định kỳ nếu môi trường dev không cài Redis.

### D. Persistence Layer (`src/lib/db.ts`, `schema/sql/`)
* Sử dụng kết nối Connection Pool của thư viện `mysql2/promise`.
* Mọi giao dịch đặt vé thanh toán đều được bọc trong **Database Transaction** (`START TRANSACTION ... COMMIT / ROLLBACK`) nhằm đảm bảo tính toàn vẹn dữ liệu ACID.
