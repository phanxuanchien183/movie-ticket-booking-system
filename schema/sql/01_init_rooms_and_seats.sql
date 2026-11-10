-- 01_init_rooms_and_seats.sql
-- Khởi tạo cấu trúc phòng chiếu và sơ đồ ghế tọa độ 3D

CREATE TABLE IF NOT EXISTS rooms (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    room_name VARCHAR(100) NOT NULL,
    total_rows INT NOT NULL,
    seats_per_row INT NOT NULL,
    screen_width DECIMAL(5,2) NOT NULL,      -- Chiều rộng màn hình (mét)
    screen_height DECIMAL(5,2) NOT NULL,     -- Chiều cao màn hình (mét)
    distance_to_row_a DECIMAL(5,2) NOT NULL, -- Khoảng cách từ màn hình đến hàng A (mét)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seats (
    seat_id VARCHAR(20) PRIMARY KEY,         -- Định danh ghế VD: "R1-E07"
    room_id INT NOT NULL,
    row_name VARCHAR(5) NOT NULL,            -- Tên hàng (A, B, C...)
    seat_number INT NOT NULL,                -- Số thứ tự ghế trong hàng (1, 2, 3...)
    seat_type ENUM('Standard', 'VIP', 'Sweetbox') DEFAULT 'Standard',
    coord_x DECIMAL(5,2) DEFAULT 0.00,       -- Tọa độ X trong không gian phòng (mét)
    coord_y DECIMAL(5,2) DEFAULT 0.00,       -- Tọa độ Y trong không gian phòng (mét)
    coord_z DECIMAL(5,2) DEFAULT 0.00,       -- Chiều cao bậc thềm sàn rạp (mét)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
);

CREATE INDEX idx_seats_room_row ON seats(room_id, row_name, seat_number);
