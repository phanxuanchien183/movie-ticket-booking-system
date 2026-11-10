-- 05_seed_data.sql
-- Dữ liệu mẫu hệ thống phòng chiếu, phim, suất chiếu, chính sách giá và voucher ngân hàng

-- 1. Phòng chiếu Cinema 01
INSERT INTO rooms (room_id, room_name, total_rows, seats_per_row, screen_width, screen_height, distance_to_row_a)
VALUES (1, 'Rạp 01 - Laser IMAX Starlight', 8, 12, 12.00, 6.50, 4.50)
ON DUPLICATE KEY UPDATE room_name=VALUES(room_name);

-- 2. Ghế phòng chiếu 1 (Hàng A -> H, mỗi hàng 12 ghế, có Standard, VIP, Sweetbox)
-- Hàng A-C: Standard; Hàng D-G: VIP; Hàng H: Sweetbox
INSERT INTO seats (seat_id, room_id, row_name, seat_number, seat_type, coord_x, coord_y, coord_z)
VALUES
-- Hàng A (Standard)
('R1-A01', 1, 'A', 1, 'Standard', 1.00, 4.50, 0.00),
('R1-A02', 1, 'A', 2, 'Standard', 1.80, 4.50, 0.00),
('R1-A03', 1, 'A', 3, 'Standard', 2.60, 4.50, 0.00),
('R1-A04', 1, 'A', 4, 'Standard', 3.40, 4.50, 0.00),
('R1-A05', 1, 'A', 5, 'Standard', 4.80, 4.50, 0.00),
('R1-A06', 1, 'A', 6, 'Standard', 5.60, 4.50, 0.00),
('R1-A07', 1, 'A', 7, 'Standard', 6.40, 4.50, 0.00),
('R1-A08', 1, 'A', 8, 'Standard', 7.20, 4.50, 0.00),
('R1-A09', 1, 'A', 9, 'Standard', 8.60, 4.50, 0.00),
('R1-A10', 1, 'A', 10, 'Standard', 9.40, 4.50, 0.00),
('R1-A11', 1, 'A', 11, 'Standard', 10.20, 4.50, 0.00),
('R1-A12', 1, 'A', 12, 'Standard', 11.00, 4.50, 0.00),

-- Hàng B (Standard)
('R1-B01', 1, 'B', 1, 'Standard', 1.00, 5.50, 0.25),
('R1-B02', 1, 'B', 2, 'Standard', 1.80, 5.50, 0.25),
('R1-B03', 1, 'B', 3, 'Standard', 2.60, 5.50, 0.25),
('R1-B04', 1, 'B', 4, 'Standard', 3.40, 5.50, 0.25),
('R1-B05', 1, 'B', 5, 'Standard', 4.80, 5.50, 0.25),
('R1-B06', 1, 'B', 6, 'Standard', 5.60, 5.50, 0.25),
('R1-B07', 1, 'B', 7, 'Standard', 6.40, 5.50, 0.25),
('R1-B08', 1, 'B', 8, 'Standard', 7.20, 5.50, 0.25),
('R1-B09', 1, 'B', 9, 'Standard', 8.60, 5.50, 0.25),
('R1-B10', 1, 'B', 10, 'Standard', 9.40, 5.50, 0.25),
('R1-B11', 1, 'B', 11, 'Standard', 10.20, 5.50, 0.25),
('R1-B12', 1, 'B', 12, 'Standard', 11.00, 5.50, 0.25),

-- Hàng C (Standard)
('R1-C01', 1, 'C', 1, 'Standard', 1.00, 6.50, 0.50),
('R1-C02', 1, 'C', 2, 'Standard', 1.80, 6.50, 0.50),
('R1-C03', 1, 'C', 3, 'Standard', 2.60, 6.50, 0.50),
('R1-C04', 1, 'C', 4, 'Standard', 3.40, 6.50, 0.50),
('R1-C05', 1, 'C', 5, 'Standard', 4.80, 6.50, 0.50),
('R1-C06', 1, 'C', 6, 'Standard', 5.60, 6.50, 0.50),
('R1-C07', 1, 'C', 7, 'Standard', 6.40, 6.50, 0.50),
('R1-C08', 1, 'C', 8, 'Standard', 7.20, 6.50, 0.50),
('R1-C09', 1, 'C', 9, 'Standard', 8.60, 6.50, 0.50),
('R1-C10', 1, 'C', 10, 'Standard', 9.40, 6.50, 0.50),
('R1-C11', 1, 'C', 11, 'Standard', 10.20, 6.50, 0.50),
('R1-C12', 1, 'C', 12, 'Standard', 11.00, 6.50, 0.50),

-- Hàng D (VIP)
('R1-D01', 1, 'D', 1, 'VIP', 1.00, 7.60, 0.75),
('R1-D02', 1, 'D', 2, 'VIP', 1.80, 7.60, 0.75),
('R1-D03', 1, 'D', 3, 'VIP', 2.60, 7.60, 0.75),
('R1-D04', 1, 'D', 4, 'VIP', 3.40, 7.60, 0.75),
('R1-D05', 1, 'D', 5, 'VIP', 4.80, 7.60, 0.75),
('R1-D06', 1, 'D', 6, 'VIP', 5.60, 7.60, 0.75),
('R1-D07', 1, 'D', 7, 'VIP', 6.40, 7.60, 0.75),
('R1-D08', 1, 'D', 8, 'VIP', 7.20, 7.60, 0.75),
('R1-D09', 1, 'D', 9, 'VIP', 8.60, 7.60, 0.75),
('R1-D10', 1, 'D', 10, 'VIP', 9.40, 7.60, 0.75),
('R1-D11', 1, 'D', 11, 'VIP', 10.20, 7.60, 0.75),
('R1-D12', 1, 'D', 12, 'VIP', 11.00, 7.60, 0.75),

-- Hàng E (VIP - Hàng trung tâm vàng)
('R1-E01', 1, 'E', 1, 'VIP', 1.00, 8.70, 1.00),
('R1-E02', 1, 'E', 2, 'VIP', 1.80, 8.70, 1.00),
('R1-E03', 1, 'E', 3, 'VIP', 2.60, 8.70, 1.00),
('R1-E04', 1, 'E', 4, 'VIP', 3.40, 8.70, 1.00),
('R1-E05', 1, 'E', 5, 'VIP', 4.80, 8.70, 1.00),
('R1-E06', 1, 'E', 6, 'VIP', 5.60, 8.70, 1.00),
('R1-E07', 1, 'E', 7, 'VIP', 6.40, 8.70, 1.00),
('R1-E08', 1, 'E', 8, 'VIP', 7.20, 8.70, 1.00),
('R1-E09', 1, 'E', 9, 'VIP', 8.60, 8.70, 1.00),
('R1-E10', 1, 'E', 10, 'VIP', 9.40, 8.70, 1.00),
('R1-E11', 1, 'E', 11, 'VIP', 10.20, 8.70, 1.00),
('R1-E12', 1, 'E', 12, 'VIP', 11.00, 8.70, 1.00),

-- Hàng F (VIP)
('R1-F01', 1, 'F', 1, 'VIP', 1.00, 9.80, 1.25),
('R1-F02', 1, 'F', 2, 'VIP', 1.80, 9.80, 1.25),
('R1-F03', 1, 'F', 3, 'VIP', 2.60, 9.80, 1.25),
('R1-F04', 1, 'F', 4, 'VIP', 3.40, 9.80, 1.25),
('R1-F05', 1, 'F', 5, 'VIP', 4.80, 9.80, 1.25),
('R1-F06', 1, 'F', 6, 'VIP', 5.60, 9.80, 1.25),
('R1-F07', 1, 'F', 7, 'VIP', 6.40, 9.80, 1.25),
('R1-F08', 1, 'F', 8, 'VIP', 7.20, 9.80, 1.25),
('R1-F09', 1, 'F', 9, 'VIP', 8.60, 9.80, 1.25),
('R1-F10', 1, 'F', 10, 'VIP', 9.40, 9.80, 1.25),
('R1-F11', 1, 'F', 11, 'VIP', 10.20, 9.80, 1.25),
('R1-F12', 1, 'F', 12, 'VIP', 11.00, 9.80, 1.25),

-- Hàng G (VIP)
('R1-G01', 1, 'G', 1, 'VIP', 1.00, 10.90, 1.50),
('R1-G02', 1, 'G', 2, 'VIP', 1.80, 10.90, 1.50),
('R1-G03', 1, 'G', 3, 'VIP', 2.60, 10.90, 1.50),
('R1-G04', 1, 'G', 4, 'VIP', 3.40, 10.90, 1.50),
('R1-G05', 1, 'G', 5, 'VIP', 4.80, 10.90, 1.50),
('R1-G06', 1, 'G', 6, 'VIP', 5.60, 10.90, 1.50),
('R1-G07', 1, 'G', 7, 'VIP', 6.40, 10.90, 1.50),
('R1-G08', 1, 'G', 8, 'VIP', 7.20, 10.90, 1.50),
('R1-G09', 1, 'G', 9, 'VIP', 8.60, 10.90, 1.50),
('R1-G10', 1, 'G', 10, 'VIP', 9.40, 10.90, 1.50),
('R1-G11', 1, 'G', 11, 'VIP', 10.20, 10.90, 1.50),
('R1-G12', 1, 'G', 12, 'VIP', 11.00, 10.90, 1.50),

-- Hàng H (Sweetbox ghế đôi)
('R1-H01', 1, 'H', 1, 'Sweetbox', 1.40, 12.00, 1.75),
('R1-H02', 1, 'H', 2, 'Sweetbox', 3.00, 12.00, 1.75),
('R1-H03', 1, 'H', 3, 'Sweetbox', 5.20, 12.00, 1.75),
('R1-H04', 1, 'H', 4, 'Sweetbox', 6.80, 12.00, 1.75),
('R1-H05', 1, 'H', 5, 'Sweetbox', 9.00, 12.00, 1.75),
('R1-H06', 1, 'H', 6, 'Sweetbox', 10.60, 12.00, 1.75)
ON DUPLICATE KEY UPDATE row_name=VALUES(row_name);

-- 3. Phim mẫu
INSERT INTO movies (movie_id, title, duration_minutes, poster_url, backdrop_url, trailer_url, genre, age_rating, description, status)
VALUES
(1, 'Dune: Hành Tinh Cát - Phần Hai', 166, 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop', 'https://www.youtube.com/watch?v=Way9Dexny3w', 'Khoa học viễn tưởng, Hành động', 'T16', 'Paul Atreides hợp tác với Chani và người Fremen trong khi tìm kiếm sự trả thù cho gia tộc của mình.', 'NowShowing'),
(2, 'Oppenheimer', 180, 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop', 'https://www.youtube.com/watch?v=uYPbbksJxIg', 'Tiểu sử, Chính kịch, Lịch sử', 'T18', 'Câu chuyện về nhà vật lý lý thuyết J. Robert Oppenheimer và dự án Manhattan tạo ra bom nguyên tử.', 'NowShowing'),
(3, 'Mai - Trấn Thành Film', 131, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop', 'https://www.youtube.com/watch?v=dummy', 'Tâm lý, Tình cảm', 'T18', 'Một câu chuyện tình đầy xúc động và trắc trở giữa Mai và Dương trong bối cảnh xã hội hiện đại.', 'NowShowing'),
(4, 'Godzilla x Kong: The New Empire', 115, 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop', 'https://www.youtube.com/watch?v=dummy2', 'Hành động, Quái vật', 'T13', 'Hai gã khổng lồ cổ đại Godzilla và Kong đối mặt với một mối đe dọa to lớn tiềm ẩn dưới lòng Trái Đất.', 'ComingSoon')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 4. Bảng giá vé (pricing_rules)
INSERT INTO pricing_rules (rule_id, seat_type, is_weekend, price)
VALUES
(1, 'Standard', FALSE, 90000.00),
(2, 'Standard', TRUE, 110000.00),
(3, 'VIP', FALSE, 120000.00),
(4, 'VIP', TRUE, 140000.00),
(5, 'Sweetbox', FALSE, 220000.00),
(6, 'Sweetbox', TRUE, 260000.00)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- 5. Suất chiếu mẫu
INSERT INTO showtimes (showtime_id, movie_id, room_id, start_time, end_time, format_type, is_weekend_or_holiday)
VALUES
(1, 1, 1, '2026-11-11 19:30:00', '2026-11-11 22:15:00', 'IMAX Laser 2D', FALSE),
(2, 1, 1, '2026-11-11 22:45:00', '2026-11-12 01:30:00', 'IMAX Laser 2D', FALSE),
(3, 2, 1, '2026-11-12 18:00:00', '2026-11-12 21:00:00', '2D Phụ đề', FALSE),
(4, 3, 1, '2026-11-14 20:00:00', '2026-11-14 22:15:00', '2D Lồng tiếng', TRUE)
ON DUPLICATE KEY UPDATE start_time=VALUES(start_time);

-- 6. Khuyến mãi & Ràng buộc ngân hàng
INSERT INTO promotions (promo_id, code, title, description, discount_type, discount_value, max_discount_amount, bank_code, min_order_value, start_date, end_date, usage_limit, used_count)
VALUES
(1, 'ACB50', 'Giảm 50% cùng Thẻ ACB', 'Ưu đãi 50% tối đa 100.000 VNĐ dành riêng cho chủ thẻ Ngân hàng ACB (Credit / QR)', 'Percentage', 50.00, 100000.00, 'ACB', 150000.00, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 500, 12),
(2, 'VCB30K', 'Giảm 30K Vietcombank', 'Giảm trực tiếp 30.000 VNĐ cho đơn từ 180.000 VNĐ khi thanh toán qua Vietcombank', 'FixedAmount', 30000.00, 30000.00, 'VCB', 180000.00, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1000, 45),
(3, 'CINEMA20', 'Khách hàng thân thiết', 'Giảm 20% cho tất cả phương thức thanh toán', 'Percentage', 20.00, 50000.00, NULL, 100000.00, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 2000, 150)
ON DUPLICATE KEY UPDATE code=VALUES(code);
