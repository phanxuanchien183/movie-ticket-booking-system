-- 04_init_bookings.sql
-- Khởi tạo bảng đặt vé, chi tiết ghế đặt và trạng thái thanh toán

CREATE TABLE IF NOT EXISTS bookings (
    booking_id VARCHAR(50) PRIMARY KEY,
    user_id INT NOT NULL,
    customer_name VARCHAR(150),
    customer_email VARCHAR(150),
    customer_phone VARCHAR(50),
    showtime_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    final_amount DECIMAL(10,2) NOT NULL,
    promo_id INT NULL,
    payment_method VARCHAR(50) NOT NULL,     -- Phương thức thanh toán (VD: "ACB_CREDIT", "MOMO", "VCB")
    payment_status ENUM('Pending', 'Paid', 'Cancelled', 'Failed') DEFAULT 'Pending',
    qr_code VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id),
    FOREIGN KEY (promo_id) REFERENCES promotions(promo_id)
);

CREATE TABLE IF NOT EXISTS booking_seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(50) NOT NULL,
    seat_id VARCHAR(20) NOT NULL,
    price_applied DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id)
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_showtime ON bookings(showtime_id);
CREATE INDEX idx_booking_seats_booking ON booking_seats(booking_id);
CREATE INDEX idx_booking_seats_seat ON booking_seats(seat_id);
