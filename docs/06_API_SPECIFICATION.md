# 🔌 TÀI LIỆU ĐẶC TẢ GIAO DIỆN LẬP TRÌNH ỨNG DỤNG (REST API SPECIFICATION)

Toàn bộ các API được xây dựng trên chuẩn **Next.js Route Handlers**, sử dụng định dạng JSON cho Request và Response.

---

## 1. Danh Sách Endpoint Tổng Hợp

| Phương thức | Đường dẫn Endpoint | Mục đích | Yêu cầu Auth |
| :---: | :--- | :--- | :---: |
| `GET` | `/api/movies` | Lấy danh sách phim đang chiếu & sắp chiếu | Không |
| `GET` | `/api/showtimes` | Lấy danh sách suất chiếu (hỗ trợ lọc `?movieId=`) | Không |
| `GET` | `/api/showtimes/[id]/seats` | Lấy sơ đồ ghế, trạng thái lock/book & metrics góc nhìn | Không |
| `POST` | `/api/seats/lock` | Khóa giữ chỗ ghế trong 5 phút qua Redis | User / Guest |
| `POST` | `/api/seats/release` | Giải phóng ghế đã khóa khi user hủy | User / Guest |
| `POST` | `/api/promotions/validate` | Xác thực mã giảm giá & kiểm tra ràng buộc ngân hàng | User / Guest |
| `POST` | `/api/bookings/checkout` | Tạo đơn hàng, ghi MySQL Transaction & xuất vé QR | User / Guest |
| `GET` | `/api/bookings/[id]` | Tra cứu thông tin vé đã thanh toán & mã QR | User / Guest |

---

## 2. Chi Tiết Từng Endpoint

### A. `GET /api/showtimes/{id}/seats`
Lấy toàn bộ sơ đồ ghế của phòng chiếu ứng với suất chiếu, kèm thông số hình học `view_metrics` do Seat View Engine tính toán.

* **Response Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "showtime": {
      "showtime_id": 1,
      "format_type": "IMAX Laser 2D",
      "start_time": "2026-11-11T19:30:00"
    },
    "room": {
      "room_id": 1,
      "room_name": "Rạp 01 - Laser IMAX Starlight",
      "screen_width": 12.0,
      "screen_height": 6.5,
      "distance_to_row_a": 4.5
    },
    "seats": [
      {
        "seat_id": "R1-E07",
        "row_name": "E",
        "seat_number": 7,
        "seat_type": "VIP",
        "status": "available",
        "price": 120000,
        "view_metrics": {
          "distance_to_screen": 8.72,
          "horizontal_angle": 2.6,
          "vertical_angle": 23.4,
          "distortion_ratio": 1.0,
          "rating": {
            "score": 5,
            "title": "Ghế trung tâm Hoàng Kim",
            "badge_variant": "success"
          }
        }
      }
    ],
    "total_seats": 90,
    "available_count": 88,
    "locked_count": 0,
    "booked_count": 2
  }
}
```

---

### B. `POST /api/seats/lock`
Khóa tạm thời một hoặc nhiều ghế qua Redis với thời hạn 300 giây (5 phút).

* **Request Body:**
```json
{
  "showtime_id": 1,
  "seat_ids": ["R1-E07", "R1-E08"],
  "user_id": 1
}
```

* **Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Đã khóa 2 ghế thành công trong 5 phút",
  "data": {
    "showtime_id": 1,
    "locked_seats": ["R1-E07", "R1-E08"],
    "user_id": 1,
    "ttl_seconds": 300
  }
}
```

* **Response Conflict (409 Conflict):**
```json
{
  "success": false,
  "error": "Ghế R1-E07 đang được người khác giữ chỗ. Vui lòng chọn ghế khác!",
  "failed_seat": "R1-E07"
}
```

---

### C. `POST /api/promotions/validate`
Xác thực điều kiện áp dụng mã giảm giá và đối chiếu phương thức thanh toán ngân hàng.

* **Request Body:**
```json
{
  "code": "ACB50",
  "total_amount": 240000,
  "payment_method": "ACB_CREDIT"
}
```

* **Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Áp dụng thành công \"Giảm 50% cùng Thẻ ACB\". Bạn được giảm 100.000 VNĐ!",
  "data": {
    "promotion": {
      "code": "ACB50",
      "discount_type": "Percentage",
      "discount_value": 50,
      "max_discount_amount": 100000
    },
    "discount_amount": 100000,
    "final_amount": 140000
  }
}
```

* **Response Error - Sai ngân hàng (400 Bad Request):**
```json
{
  "success": false,
  "error_code": "INVALID_BANK_PAYMENT_METHOD",
  "message": "Mã giảm giá \"ACB50\" chỉ áp dụng cho hình thức thanh toán qua ngân hàng ACB (VD: ACB_CREDIT, ACB_QR). Phương thức hiện tại \"MOMO_WALLET\" không hợp lệ."
}
```

---

### D. `POST /api/bookings/checkout`
Khởi tạo đơn đặt vé, thực thi MySQL Transaction, trừ lượt dùng voucher và tự động xóa khóa ghế trên Redis.

* **Request Body:**
```json
{
  "showtime_id": 1,
  "seat_ids": ["R1-E07"],
  "user_id": 1,
  "customer_name": "Phan Xuân Chiến",
  "customer_email": "phanxuanchien183@gmail.com",
  "customer_phone": "0987654321",
  "promo_code": "ACB50",
  "payment_method": "ACB_CREDIT"
}
```

* **Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Đặt vé và thanh toán thành công!",
  "data": {
    "booking": {
      "booking_id": "BK-234567-XYZ789",
      "user_id": 1,
      "total_amount": 120000,
      "discount_amount": 60000,
      "final_amount": 60000,
      "payment_method": "ACB_CREDIT",
      "payment_status": "Paid",
      "qr_code": "TICKET:BK-234567-XYZ789:ST1:R1-E07",
      "created_at": "2026-11-11T02:00:00.000Z"
    },
    "seats": [
      {
        "seat_id": "R1-E07",
        "price": 120000,
        "type": "VIP"
      }
    ]
  }
}
```

