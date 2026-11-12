# 🎬 CineTicket Pro - Movie & Concert Ticket Booking Marketplace
### Nền Tảng Thương Mại Đặt Vé Xem Phim & Concert Thời Gian Thực (Fullstack Next.js)

[![Next.js](https://img.shields.io/badge/Next.js-16.4+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Redis](https://img.shields.io/badge/Redis-Locking_TTL-DC382D?style=for-the-badge&logo=redis)](https://redis.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0_InnoDB-4479A1?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![Tests](https://img.shields.io/badge/Tests-52%20Passing-brightgreen?style=for-the-badge&logo=vitest)](https://vitest.dev/)

---

## 🌟 Giới Thiệu Tổng Quan (Overview)

**CineTicket Pro** là nền tảng thương mại điện tử đặt vé đa ngành (Ticketing Marketplace) tích hợp phong cách giao diện thương mại chuẩn **Ticketbox** và hệ thống rạp **CGV Cinemas**, xây dựng trên nền tảng **Next.js Fullstack Monolithic** (App Router). Hệ thống hỗ trợ song hành hai mô hình bán vé chủ lực:

1. **Vé xem phim tại các cụm rạp hàng đầu:** CGV Cinemas, Lotte Cinema, BHD Star, Galaxy Cinema, Beta Cinemas (Màn hình cong Laser IMAX, Sweetbox đôi, VIP trung tâm).
2. **Vé Live Concert, Fan Meeting & Sự kiện tại các nhà thi đấu, sân vận động:** Trung tâm Triển lãm Quốc Gia VEC, SVĐ Quốc gia Mỹ Đình, Nhà thi đấu Phú Thọ, Quân khu 7, Trung tâm Hội nghị Quốc gia NCC (Khán đài Sân khấu Arena 360°, T-Stage Runway, Catwalk, VVIP Stage, Fanzone, CAT 1/2/3, GA).

---

## 🚀 Các Trụ Cột Kỹ Thuật Đột Phá

1. **Phân Luồng Định Tuyến Độc Lập (Strict Route Separation):**
   - **Luồng Phim Rạp (`/movies/[id]`):** Hero banner, trailer YouTube, điểm đánh giá khán giả/IMDb, chọn chuỗi rạp $\rightarrow$ chọn chi nhánh cụm rạp $\rightarrow$ chọn khung giờ & định dạng phòng chiếu (Laser IMAX / 2D) $\rightarrow$ sơ đồ chọn ghế $\rightarrow$ thanh toán.
   - **Luồng Đại Nhạc Hội (`/events/[id]`):** Giới thiệu đêm nhạc, danh sách ca sĩ/nghệ sĩ, quy định tham gia, bảng giá vé phân khu $\rightarrow$ sơ đồ sân khấu Ticketbox tương tác $\rightarrow$ bảng câu hỏi & thanh toán.
   - Hỗ trợ đầy đủ điều hướng back / next trên trình duyệt mà không bị xung đột URL.

2. **Khóa Ghế Thời Gian Thực Chống Double-Booking (Redis Seat Locking):**
   - Phân tán **Redis Key-Value với TTL 300s (5 phút)** qua lệnh nguyên tử `SET NX EX`.
   - Cơ chế tự động giải phóng ghế sau 5 phút nếu khách hàng không hoàn tất thanh toán.
   - Tự động kích hoạt `InMemoryLockManager` khi chạy môi trường cục bộ không có Redis.

3. **Góc Seat View 360° Xoay Chuột (Interactive Pan-Tilt Look-Around Camera):**
   - Không chỉ tính toán lượng giác tĩnh, hệ thống trang bị công nghệ **Pan-Tilt Look-Around Camera**: Người dùng nhấp chuột và kéo rê trực tiếp trên màn hình chiếu để xoay góc nhìn toàn cảnh 360° (Yaw -180° đến +180°, Pitch -40° đến +40°), ngắm màn hình cong Laser IMAX, trần rạp kèm loa âm thanh vòm Dolby Atmos, cửa thoát hiểm EXIT và các hàng ghế xung quanh.
   - Bảng chỉ số quang học thực tế chuẩn **SMPTE & THX**: Khoảng cách màn hình (m), góc ngẩng cổ (Vertical Elevation Angle $\le 35^\circ$), góc lệch tâm ngang và phân loại *Golden Seat*.

4. **Trình Thiết Kế Sơ Đồ Sân Khấu Konva.js Canvas Đa Tầng:**
   - Cấu trúc container `<div class="konvajs-content" role="presentation">` đa tầng `<canvas>` mô phỏng Ticketbox Canvas:
     - **Layer 1:** Sàn nhà thi đấu, lưới tọa độ đo đạc, hướng sân khấu chính North Stage.
     - **Layer 2:** Kết cấu sân khấu chính (Stage), T-Stage runway, catwalk, và các khối phân khu (Sky Lounge, SVIP, VIP, Fanzone, CAT, GA, FOH).
     - **Layer 3:** Layer tương tác kéo thả chuột, chọn vùng, điều chỉnh kích thước & tooltip.
   - Cho phép kéo thả trực tiếp, đổi màu sắc, cập nhật giá vé và sức chứa khán giả thời gian thực.

5. **Chính Sách Ràng Buộc Ngân Hàng Thanh Toán (Bank Binding Check):**
   - Chống gian lận voucher tài trợ (ví dụ mã `ACB50` bắt buộc thanh toán qua Ngân hàng ACB).

---

## 🏛️ Trung Tâm Quản Trị Hệ Thống (Admin Portal - `/admin`)

Hệ thống quản trị bảo mật cao, yêu cầu đăng nhập (`admin` / `admin123`), bố cục chuẩn: Header chứa Logo & Thông tin Admin $\rightarrow$ Cột trái Menu phân cấp $\rightarrow$ Khung giữa Content làm việc.

### A. ĐẠI NHẠC HỘI (Concerts & Live Events)
1. **Quản lý danh mục sự kiện:** Phân loại Live Concert, Fan Meeting, Lễ Hội EDM, Nhạc Kịch, Talkshow.
2. **Quản lý sự kiện:** Tên sự kiện, nghệ sĩ, ngày diễn ra, giá từ, trạng thái vé, banner/poster, sức chứa & tiến độ bán vé.
3. **Ngoài trời hoặc trong nhà:** Phân loại địa điểm Trong Nhà (Indoor) vs Ngoài Trời (Outdoor), sức chứa, địa chỉ chi tiết theo Tỉnh/TP.
4. **Thiết kế sơ đồ sân khấu (Konva Canvas):** Kiến trúc Canvas đa tầng kéo thả phân khu, cấu hình giá vé, vé đứng/ngồi, quà tặng đặc quyền.

### B. RẠP CHIẾU PHIM (Cinemas & Movie Theaters)
1. **Quản lý chuỗi chiếu phim:** CGV Cinemas, Lotte Cinema, BHD Star, Galaxy Cinema, Beta Cinemas.
2. **Quản lý chi nhánh rạp:** Tên chi nhánh theo từng chuỗi (CGV Landmark 81, Lotte Nowzone, BHD Bitexco...).
3. **Quản lý địa chỉ rạp:** Tỉnh/TP, Quận/Huyện, địa chỉ chi tiết, hotline, liên kết định vị Google Maps.
4. **Quản lý phòng rạp:** Cấu hình phòng Laser IMAX, Gold Class, 4DX; kích thước màn hình rộng × cao, khoảng cách hàng A tới màn hình, công nghệ âm thanh Dolby Atmos.
5. **Thiết kế sơ đồ ghế phòng rạp:** Ma trận hàng A..H, Standard, VIP, Sweetbox đôi, lối đi Aisle, bảng giá từng hàng ghế.
6. **Góc Seat View khi chọn ghế (360° Look-Around):** Chọn ghế bất kỳ và rê chuột xoay 360° nhìn màn hình cong và khán phòng.
7. **Quản lý phim:** Tên phim, banner ngang 16:9, poster dọc, trailer YouTube, mô tả cốt truyện, đánh giá khán giả/IMDb, nhãn độ tuổi (P, T16, T18).

### C. VẬN HÀNH HỆ THỐNG
* **Tổng quan KPI:** Doanh thu, số vé đã xuất, tỷ lệ lấp đầy ghế.
* **Giám sát khóa ghế Redis:** Theo dõi TTL đếm ngược, cưỡng chế mở khóa ghế.
* **Khuyến mãi & Ngân hàng:** Quản lý voucher và tài trợ ngân hàng.
* **Lịch sử giao dịch:** Chi tiết các giao dịch đặt vé thành công.

---

## 🏗️ Kiến Trúc Hệ Thống (Architecture Flow)

```text
[ Trình Duyệt Người Dùng ]                      [ Quản Trị Viên (Admin Portal) ]
        │                                                     │
        ├── /movies/[id] (Chi tiết rạp)                       ├── /admin (Xác thực đăng nhập)
        ├── /events/[id] (Chi tiết concert)                   ├── A. Đại Nhạc Hội (4 mục)
        ├── /booking/[id] (Sơ đồ chọn vị trí)                 ├── B. Rạp Chiếu Phim (7 mục)
        └── /booking/[id]/checkout (Bảng câu hỏi)             └── C. Vận Hành Hệ Thống
        │                                                     │
        └──────────────────────────┬──────────────────────────┘
                                   │ HTTP / JSON
                                   ▼
                   [ Next.js 16 Fullstack App Router ]
 ├── Presentation Layer:
 │     ├── Consumer UI: MovieSelector, EventDetailView, TicketboxStageMap, SeatMap, SeatViewModal
 │     └── Admin UI: KonvaCanvasStageDesigner, CinemaSeatViewSimulator, Concert & Cinema Modules
 ├── API Handlers: /api/movies, /api/showtimes, /api/seats/lock, /api/seats/release, /api/bookings
 ├── Zod Validation Schemas
 └── Domain Services: SeatLockService, PromotionService, SeatViewEngine
        │                                     │
        ▼ (ioredis)                           ▼ (mysql2 connection pool)
 [ Redis Seat Lock (TTL 300s) ]        [ MySQL 8.0 Primary DB ]
```

---

## 📂 Cấu Trúc Thư Mục Dự Án (Project Structure)

```text
movie-ticket-booking/
├── schema/sql/                     # DDL & Data Seeding cho MySQL
│   ├── 01_init_rooms_and_seats.sql # Phòng chiếu & sơ đồ ghế 3D (X, Y, Z)
│   ├── 02_init_movies_and_showtimes.sql # Phim, concert & suất chiếu
│   ├── 03_init_promotions_and_pricing.sql # Giá vé linh hoạt & mã ưu đãi
│   ├── 04_init_bookings.sql        # Đơn đặt vé & chi tiết ghế
│   └── 05_seed_data.sql            # Dữ liệu mẫu rạp IMAX, nhà thi đấu, concert
├── src/
│   ├── app/
│   │   ├── api/                    # Route Handlers Next.js
│   │   │   ├── movies/             # GET danh sách phim & concert (?category=)
│   │   │   ├── showtimes/          # GET suất chiếu & sơ đồ ghế
│   │   │   ├── seats/lock/         # POST khóa ghế qua Redis
│   │   │   ├── seats/release/      # POST giải phóng ghế
│   │   │   ├── promotions/validate/# POST validate mã ưu đãi ngân hàng
│   │   │   └── bookings/checkout/  # POST checkout & xuất vé
│   │   ├── admin/                  # Cổng Quản Trị Hệ Thống (/admin)
│   │   │   ├── page.tsx            # Bố cục 3 phần chuẩn Admin
│   │   │   └── __tests__/AdminPage.test.tsx
│   │   ├── movies/[id]/            # Luồng xem phim rạp
│   │   ├── events/[id]/            # Luồng xem concert / đại nhạc hội
│   │   ├── booking/[showtimeId]/   # Màn hình sơ đồ chọn ghế / phân khu
│   │   │   └── checkout/           # Màn hình bảng câu hỏi & thanh toán
│   │   ├── layout.tsx              # Root HTML & Metadata
│   │   ├── page.tsx                # Trang chủ ứng dụng đặt vé
│   │   └── icon.svg                # Browser favicon custom
│   ├── components/                 # Các UI Component
│   │   ├── admin/                  # Component Quản Trị
│   │   │   ├── KonvaCanvasStageDesigner.tsx # Sơ đồ sân khấu đa tầng Konva.js
│   │   │   ├── CinemaSeatViewSimulator.tsx  # Seat View 360° xoay chuột
│   │   │   ├── ConcertAdminModules.tsx      # Quản lý sự kiện, danh mục, địa điểm
│   │   │   ├── CinemaAdminModules.tsx       # Quản lý chuỗi rạp, phòng chiếu, phim
│   │   │   └── StageZoneDesigner.tsx        # Trình thiết kế 2 mục con
│   │   ├── Navbar.tsx              # Thanh điều hướng người dùng
│   │   ├── MovieSelector.tsx       # Bộ lọc phim & concert
│   │   ├── EventDetailView.tsx     # Chi tiết sự kiện concert
│   │   ├── TicketboxStageMap.tsx   # Sơ đồ sân khấu người dùng
│   │   ├── SeatMap.tsx             # Sơ đồ ghế rạp chiếu phim
│   │   ├── SeatViewModal.tsx       # Modal góc nhìn ghế 3D
│   │   ├── CheckoutDrawer.tsx      # Drawer thanh toán
│   │   └── TicketSuccessModal.tsx  # Vé điện tử E-Ticket & mã QR
│   ├── lib/
│   │   ├── db.ts                   # mysql2 connection pool + In-Memory Fallback
│   │   ├── redis.ts                # ioredis client + In-Memory TTL Lock
│   │   └── seat-view-engine.ts     # Công thức hình học lượng giác SMPTE/THX
│   ├── schemas/                    # Zod validation schemas
│   ├── services/                   # Business domain services
│   └── types/                      # TypeScript definitions
├── docs/                           # Bộ tài liệu kỹ thuật hoàn chỉnh
│   ├── 01_ARCHITECTURE.md          # Tài liệu kiến trúc toàn diện
│   ├── 02_DATABASE_SCHEMA.md       # Thiết kế CSDL & ERD
│   ├── 03_REDIS_SEAT_LOCKING.md    # Phân tích khóa ghế phân tán Redis
│   ├── 04_SEAT_VIEW_ENGINE.md      # Công thức lượng giác & Seat View 360°
│   ├── 05_PROMOTION_BANK_BINDING.md# Ràng buộc ngân hàng thanh toán
│   ├── 06_API_SPECIFICATION.md     # Đặc tả REST API đầy đủ
│   ├── 07_DEPLOYMENT_GUIDE.md      # Hướng dẫn triển khai Docker / Local
│   └── 08_ADMIN_PORTAL.md          # Tài liệu chi tiết Cổng Quản Trị
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
👉 Mở trình duyệt và trải nghiệm:
- **Trang chủ Người Dùng:** `http://localhost:3000`
- **Cổng Quản Trị Admin:** `http://localhost:3000/admin` (Tài khoản: `admin` / `admin123`)

---

### Cách 2: Triển Khai Hoàn Chỉnh Bằng Docker Compose (Production)
Chạy đồng thời ứng dụng Next.js, MySQL 8.0 và Redis 7:

```bash
docker compose up -d --build
```

---

## 🧪 Hệ Thống Kiểm Thử Toàn Diện (Testing Suite)

Dự án áp dụng chính sách **Bắt buộc 100% kiểm thử (Mandatory Testing Policy)**. Toàn bộ **52/52 test cases** được kiểm thử nghiêm ngặt trên Vitest:

```bash
# Chạy toàn bộ 52/52 test cases
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

---

## 👨‍💻 Tác Giả & Bản Quyền (Author & License)
* **Tác giả:** [Phan Xuân Chiến](https://github.com/phanxuanchien183)
* **GitHub Repository:** [movie-ticket-booking-system](https://github.com/phanxuanchien183/movie-ticket-booking-system)
* **Giấy phép:** MIT License
