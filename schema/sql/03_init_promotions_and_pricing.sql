-- 03_init_promotions_and_pricing.sql
-- Khởi tạo bảng quy tắc giá vé và chính sách khuyến mãi ràng buộc ngân hàng

CREATE TABLE IF NOT EXISTS pricing_rules (
    rule_id INT AUTO_INCREMENT PRIMARY KEY,
    seat_type ENUM('Standard', 'VIP', 'Sweetbox') NOT NULL,
    is_weekend BOOLEAN NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    UNIQUE KEY uq_seat_pricing (seat_type, is_weekend)
);

CREATE TABLE IF NOT EXISTS promotions (
    promo_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type ENUM('Percentage', 'FixedAmount') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,   -- Giá trị giảm (VD: 15 cho 15%, hoặc 50000 VNĐ)
    max_discount_amount DECIMAL(10,2) NULL,  -- Chặn trần số tiền giảm tối đa
    bank_code VARCHAR(50) NULL,              -- Ràng buộc bắt buộc thanh toán qua ngân hàng (VD: "ACB", "VCB")
    min_order_value DECIMAL(10,2) DEFAULT 0.00,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    usage_limit INT DEFAULT 1000,
    used_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_promotions_code ON promotions(code);
