import mysql from 'mysql2/promise';
import { Movie, Room, Seat, Showtime, PricingRule, Promotion, Booking } from '@/types';

// Biến lưu trữ MySQL Pool (nếu có cấu hình)
let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool | null {
  if (pool) return pool;

  const host = process.env.MYSQL_HOST || process.env.DB_HOST;
  const user = process.env.MYSQL_USER || process.env.DB_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '';
  const database = process.env.MYSQL_DATABASE || process.env.DB_NAME || 'ticket_booking';
  const port = Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306);

  if (host) {
    try {
      pool = mysql.createPool({
        host,
        user,
        password,
        database,
        port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      return pool;
    } catch (err) {
      console.warn('[DB] Không thể khởi tạo MySQL Pool, sử dụng In-Memory Store.', err);
    }
  }
  return null;
}

// ==========================================
// IN-MEMORY SEED DATA STORE (Auto-fallback)
// ==========================================

const mockRooms: Room[] = [
  {
    room_id: 1,
    room_name: 'Rạp 01 - Laser IMAX Starlight',
    total_rows: 8,
    seats_per_row: 12,
    screen_width: 12.0,
    screen_height: 6.5,
    distance_to_row_a: 4.5,
  },
];

// Sinh danh sách ghế mẫu cho Rạp 1
function generateMockSeats(): Seat[] {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const yDistances = [4.5, 5.5, 6.5, 7.6, 8.7, 9.8, 10.9, 12.0];
  const zElevations = [0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75];

  rows.forEach((row, rIdx) => {
    const isSweetbox = row === 'H';
    const isVIP = ['D', 'E', 'F', 'G'].includes(row);
    const seatType = isSweetbox ? 'Sweetbox' : isVIP ? 'VIP' : 'Standard';
    const seatCount = isSweetbox ? 6 : 12;

    for (let num = 1; num <= seatCount; num++) {
      const seatId = `R1-${row}${num < 10 ? '0' + num : num}`;
      // Tọa độ X từ 1.0m đến 11.0m
      let x = isSweetbox
        ? 1.4 + (num - 1) * 1.8
        : 1.0 + (num - 1) * (num > 4 && num <= 8 ? 0.8 : 0.85);

      seats.push({
        seat_id: seatId,
        room_id: 1,
        row_name: row,
        seat_number: num,
        seat_type: seatType,
        coord_x: Math.round(x * 100) / 100,
        coord_y: yDistances[rIdx],
        coord_z: zElevations[rIdx],
      });
    }
  });

  return seats;
}

const mockSeats: Seat[] = generateMockSeats();

const mockMovies: Movie[] = [
  {
    movie_id: 1,
    title: 'Dune: Hành Tinh Cát - Phần Hai',
    duration_minutes: 166,
    poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    genre: 'Khoa học viễn tưởng, Hành động',
    age_rating: 'T16',
    description: 'Paul Atreides hợp tác với Chani và người Fremen trong khi tìm kiếm sự trả thù cho gia tộc của mình.',
    status: 'NowShowing',
  },
  {
    movie_id: 2,
    title: 'Oppenheimer',
    duration_minutes: 180,
    poster_url: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    genre: 'Tiểu sử, Chính kịch, Lịch sử',
    age_rating: 'T18',
    description: 'Câu chuyện về nhà vật lý lý thuyết J. Robert Oppenheimer và dự án Manhattan tạo ra bom nguyên tử.',
    status: 'NowShowing',
  },
  {
    movie_id: 3,
    title: 'Mai - Bộ phim của Trấn Thành',
    duration_minutes: 131,
    poster_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=MaiTrailer',
    genre: 'Tâm lý, Tình cảm',
    age_rating: 'T18',
    description: 'Một câu chuyện tình đầy xúc động và trắc trở giữa Mai và Dương trong bối cảnh xã hội hiện đại.',
    status: 'NowShowing',
  },
  {
    movie_id: 4,
    title: 'Godzilla x Kong: The New Empire',
    duration_minutes: 115,
    poster_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
    trailer_url: 'https://www.youtube.com/watch?v=GxKongTrailer',
    genre: 'Hành động, Quái vật',
    age_rating: 'T13',
    description: 'Hai gã khổng lồ cổ đại Godzilla và Kong đối mặt với một mối đe dọa to lớn tiềm ẩn dưới lòng Trái Đất.',
    status: 'ComingSoon',
  },
];

const mockShowtimes: Showtime[] = [
  {
    showtime_id: 1,
    movie_id: 1,
    room_id: 1,
    start_time: '2026-11-11T19:30:00',
    end_time: '2026-11-11T22:15:00',
    format_type: 'IMAX Laser 2D',
    is_weekend_or_holiday: false,
    movie: mockMovies[0],
    room: mockRooms[0],
  },
  {
    showtime_id: 2,
    movie_id: 1,
    room_id: 1,
    start_time: '2026-11-11T22:45:00',
    end_time: '2026-11-12T01:30:00',
    format_type: 'IMAX Laser 2D',
    is_weekend_or_holiday: false,
    movie: mockMovies[0],
    room: mockRooms[0],
  },
  {
    showtime_id: 3,
    movie_id: 2,
    room_id: 1,
    start_time: '2026-11-12T18:00:00',
    end_time: '2026-11-12T21:00:00',
    format_type: '2D Phụ đề',
    is_weekend_or_holiday: false,
    movie: mockMovies[1],
    room: mockRooms[0],
  },
  {
    showtime_id: 4,
    movie_id: 3,
    room_id: 1,
    start_time: '2026-11-14T20:00:00',
    end_time: '2026-11-14T22:15:00',
    format_type: '2D Lồng tiếng',
    is_weekend_or_holiday: true,
    movie: mockMovies[2],
    room: mockRooms[0],
  },
];

const mockPricingRules: PricingRule[] = [
  { rule_id: 1, seat_type: 'Standard', is_weekend: false, price: 90000 },
  { rule_id: 2, seat_type: 'Standard', is_weekend: true, price: 110000 },
  { rule_id: 3, seat_type: 'VIP', is_weekend: false, price: 120000 },
  { rule_id: 4, seat_type: 'VIP', is_weekend: true, price: 140000 },
  { rule_id: 5, seat_type: 'Sweetbox', is_weekend: false, price: 220000 },
  { rule_id: 6, seat_type: 'Sweetbox', is_weekend: true, price: 260000 },
];

const mockPromotions: Promotion[] = [
  {
    promo_id: 1,
    code: 'ACB50',
    title: 'Giảm 50% cùng Thẻ ACB',
    description: 'Ưu đãi 50% tối đa 100.000 VNĐ dành riêng cho chủ thẻ Ngân hàng ACB (Credit / QR)',
    discount_type: 'Percentage',
    discount_value: 50,
    max_discount_amount: 100000,
    bank_code: 'ACB',
    min_order_value: 150000,
    start_date: '2026-01-01T00:00:00',
    end_date: '2026-12-31T23:59:59',
    usage_limit: 500,
    used_count: 12,
  },
  {
    promo_id: 2,
    code: 'VCB30K',
    title: 'Giảm 30K Vietcombank',
    description: 'Giảm trực tiếp 30.000 VNĐ cho đơn từ 180.000 VNĐ khi thanh toán qua Vietcombank',
    discount_type: 'FixedAmount',
    discount_value: 30000,
    max_discount_amount: 30000,
    bank_code: 'VCB',
    min_order_value: 180000,
    start_date: '2026-01-01T00:00:00',
    end_date: '2026-12-31T23:59:59',
    usage_limit: 1000,
    used_count: 45,
  },
  {
    promo_id: 3,
    code: 'CINEMA20',
    title: 'Khách hàng thân thiết',
    description: 'Giảm 20% tối đa 50.000 VNĐ cho tất cả phương thức thanh toán',
    discount_type: 'Percentage',
    discount_value: 20,
    max_discount_amount: 50000,
    bank_code: null,
    min_order_value: 100000,
    start_date: '2026-01-01T00:00:00',
    end_date: '2026-12-31T23:59:59',
    usage_limit: 2000,
    used_count: 150,
  },
];

// Danh sách vé đã thanh toán
const mockBookings: Map<string, Booking> = new Map();
// Ghế đã bán theo showtime: showtimeId -> Set of seatIds
const mockBookedSeats: Map<number, Set<string>> = new Map([
  [1, new Set(['R1-E05', 'R1-E06'])], // Mẫu: 2 ghế E5, E6 đã bán cho suất chiếu 1
]);

// ==========================================
// DATABASE ACCESS SERVICE LAYER
// ==========================================

export const db = {
  // Lấy danh sách phim
  async getMovies(): Promise<Movie[]> {
    const p = getDbPool();
    if (p) {
      try {
        const [rows] = await p.query('SELECT * FROM movies ORDER BY movie_id ASC');
        return rows as Movie[];
      } catch (e) {
        console.warn('[DB] Fallback getMovies sang memory', e);
      }
    }
    return mockMovies;
  },

  // Lấy danh sách suất chiếu
  async getShowtimes(movieId?: number): Promise<Showtime[]> {
    const p = getDbPool();
    if (p) {
      try {
        let query = `
          SELECT s.*, 
                 m.title as movie_title, m.poster_url, m.duration_minutes,
                 r.room_name, r.screen_width, r.screen_height, r.distance_to_row_a
          FROM showtimes s
          JOIN movies m ON s.movie_id = m.movie_id
          JOIN rooms r ON s.room_id = r.room_id
        `;
        const params: any[] = [];
        if (movieId) {
          query += ' WHERE s.movie_id = ?';
          params.push(movieId);
        }
        query += ' ORDER BY s.start_time ASC';
        const [rows]: any = await p.query(query, params);
        return rows.map((r: any) => ({
          showtime_id: r.showtime_id,
          movie_id: r.movie_id,
          room_id: r.room_id,
          start_time: r.start_time,
          end_time: r.end_time,
          format_type: r.format_type,
          is_weekend_or_holiday: Boolean(r.is_weekend_or_holiday),
          movie: {
            movie_id: r.movie_id,
            title: r.movie_title,
            duration_minutes: r.duration_minutes,
            poster_url: r.poster_url,
            status: 'NowShowing',
          },
          room: {
            room_id: r.room_id,
            room_name: r.room_name,
            total_rows: 8,
            seats_per_row: 12,
            screen_width: Number(r.screen_width),
            screen_height: Number(r.screen_height),
            distance_to_row_a: Number(r.distance_to_row_a),
          },
        }));
      } catch (e) {
        console.warn('[DB] Fallback getShowtimes sang memory', e);
      }
    }

    if (movieId) {
      return mockShowtimes.filter((s) => s.movie_id === movieId);
    }
    return mockShowtimes;
  },

  // Lấy chi tiết suất chiếu
  async getShowtimeById(showtimeId: number): Promise<Showtime | null> {
    const p = getDbPool();
    if (p) {
      try {
        const [rows]: any = await p.query(
          `SELECT s.*, 
                  m.title as movie_title, m.poster_url, m.duration_minutes,
                  r.room_name, r.screen_width, r.screen_height, r.distance_to_row_a
           FROM showtimes s
           JOIN movies m ON s.movie_id = m.movie_id
           JOIN rooms r ON s.room_id = r.room_id
           WHERE s.showtime_id = ?`,
          [showtimeId]
        );
        if (rows.length > 0) {
          const r = rows[0];
          return {
            showtime_id: r.showtime_id,
            movie_id: r.movie_id,
            room_id: r.room_id,
            start_time: r.start_time,
            end_time: r.end_time,
            format_type: r.format_type,
            is_weekend_or_holiday: Boolean(r.is_weekend_or_holiday),
            movie: {
              movie_id: r.movie_id,
              title: r.movie_title,
              duration_minutes: r.duration_minutes,
              poster_url: r.poster_url,
              status: 'NowShowing',
            },
            room: {
              room_id: r.room_id,
              room_name: r.room_name,
              total_rows: 8,
              seats_per_row: 12,
              screen_width: Number(r.screen_width),
              screen_height: Number(r.screen_height),
              distance_to_row_a: Number(r.distance_to_row_a),
            },
          };
        }
      } catch (e) {
        console.warn('[DB] Fallback getShowtimeById sang memory', e);
      }
    }

    return mockShowtimes.find((s) => s.showtime_id === showtimeId) || null;
  },

  // Lấy danh sách ghế của phòng
  async getSeatsByRoom(roomId: number): Promise<Seat[]> {
    const p = getDbPool();
    if (p) {
      try {
        const [rows]: any = await p.query(
          'SELECT * FROM seats WHERE room_id = ? ORDER BY row_name ASC, seat_number ASC',
          [roomId]
        );
        return rows.map((s: any) => ({
          seat_id: s.seat_id,
          room_id: s.room_id,
          row_name: s.row_name,
          seat_number: s.seat_number,
          seat_type: s.seat_type,
          coord_x: Number(s.coord_x),
          coord_y: Number(s.coord_y),
          coord_z: Number(s.coord_z),
        }));
      } catch (e) {
        console.warn('[DB] Fallback getSeatsByRoom sang memory', e);
      }
    }
    return mockSeats.filter((s) => s.room_id === roomId);
  },

  // Lấy danh sách ID các ghế đã đặt
  async getBookedSeatIds(showtimeId: number): Promise<string[]> {
    const p = getDbPool();
    if (p) {
      try {
        const [rows]: any = await p.query(
          `SELECT bs.seat_id 
           FROM booking_seats bs
           JOIN bookings b ON bs.booking_id = b.booking_id
           WHERE b.showtime_id = ? AND b.payment_status = 'Paid'`,
          [showtimeId]
        );
        return rows.map((r: any) => r.seat_id);
      } catch (e) {
        console.warn('[DB] Fallback getBookedSeatIds sang memory', e);
      }
    }
    const booked = mockBookedSeats.get(showtimeId);
    return booked ? Array.from(booked) : [];
  },

  // Lấy bảng giá
  async getPricingRules(): Promise<PricingRule[]> {
    const p = getDbPool();
    if (p) {
      try {
        const [rows] = await p.query('SELECT * FROM pricing_rules');
        return rows as PricingRule[];
      } catch (e) {
        console.warn('[DB] Fallback getPricingRules sang memory', e);
      }
    }
    return mockPricingRules;
  },

  // Lấy mã khuyến mãi
  async getPromotionByCode(code: string): Promise<Promotion | null> {
    const p = getDbPool();
    if (p) {
      try {
        const [rows]: any = await p.query('SELECT * FROM promotions WHERE code = ?', [code.toUpperCase()]);
        if (rows.length > 0) return rows[0] as Promotion;
      } catch (e) {
        console.warn('[DB] Fallback getPromotionByCode sang memory', e);
      }
    }
    return (
      mockPromotions.find((p) => p.code.toUpperCase() === code.trim().toUpperCase()) || null
    );
  },

  // Lưu đặt vé thành công (MySQL Transaction hoặc Memory Transaction)
  async createBooking(booking: Booking, seatDetails: { seat_id: string; price: number }[]): Promise<Booking> {
    const p = getDbPool();
    if (p) {
      const conn = await p.getConnection();
      try {
        await conn.beginTransaction();

        // 1. Kiểm tra double-booking trong DB
        const [existing]: any = await conn.query(
          `SELECT bs.seat_id FROM booking_seats bs 
           JOIN bookings b ON bs.booking_id = b.booking_id 
           WHERE b.showtime_id = ? AND b.payment_status = 'Paid' AND bs.seat_id IN (?)`,
          [booking.showtime_id, seatDetails.map((s) => s.seat_id)]
        );

        if (existing.length > 0) {
          throw new Error(`Ghế ${existing.map((e: any) => e.seat_id).join(', ')} đã có người đặt trước!`);
        }

        // 2. Insert booking
        await conn.query(
          `INSERT INTO bookings 
           (booking_id, user_id, customer_name, customer_email, customer_phone, showtime_id, total_amount, discount_amount, final_amount, promo_id, payment_method, payment_status, qr_code)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            booking.booking_id,
            booking.user_id,
            booking.customer_name,
            booking.customer_email,
            booking.customer_phone,
            booking.showtime_id,
            booking.total_amount,
            booking.discount_amount,
            booking.final_amount,
            booking.promo_id || null,
            booking.payment_method,
            booking.payment_status,
            booking.qr_code,
          ]
        );

        // 3. Insert booking_seats
        for (const seat of seatDetails) {
          await conn.query(
            `INSERT INTO booking_seats (booking_id, seat_id, price_applied) VALUES (?, ?, ?)`,
            [booking.booking_id, seat.seat_id, seat.price]
          );
        }

        // 4. Cập nhật lượt dùng khuyến mãi nếu có
        if (booking.promo_id) {
          await conn.query(`UPDATE promotions SET used_count = used_count + 1 WHERE promo_id = ?`, [
            booking.promo_id,
          ]);
        }

        await conn.commit();
        return booking;
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally {
        conn.release();
      }
    }

    // In-Memory Transaction
    let booked = mockBookedSeats.get(booking.showtime_id);
    if (!booked) {
      booked = new Set();
      mockBookedSeats.set(booking.showtime_id, booked);
    }

    for (const seat of seatDetails) {
      if (booked.has(seat.seat_id)) {
        throw new Error(`Ghế ${seat.seat_id} đã có người đặt trước!`);
      }
    }

    // Đánh dấu đã bán
    for (const seat of seatDetails) {
      booked.add(seat.seat_id);
    }

    mockBookings.set(booking.booking_id, booking);

    if (booking.promo_id) {
      const p = mockPromotions.find((pr) => pr.promo_id === booking.promo_id);
      if (p) p.used_count += 1;
    }

    return booking;
  },

  // Tra cứu vé đã đặt
  async getBookingById(bookingId: string): Promise<Booking | null> {
    const p = getDbPool();
    if (p) {
      try {
        const [rows]: any = await p.query(
          `SELECT b.*, m.title as movie_title, r.room_name, s.start_time
           FROM bookings b
           JOIN showtimes s ON b.showtime_id = s.showtime_id
           JOIN movies m ON s.movie_id = m.movie_id
           JOIN rooms r ON s.room_id = r.room_id
           WHERE b.booking_id = ?`,
          [bookingId]
        );
        if (rows.length > 0) {
          const b = rows[0];
          const [seatRows]: any = await p.query(
            `SELECT bs.seat_id, bs.price_applied, st.row_name, st.seat_number, st.seat_type
             FROM booking_seats bs
             JOIN seats st ON bs.seat_id = st.seat_id
             WHERE bs.booking_id = ?`,
            [bookingId]
          );
          return {
            ...b,
            seats: seatRows,
          };
        }
      } catch (e) {
        console.warn('[DB] Fallback getBookingById sang memory', e);
      }
    }
    return mockBookings.get(bookingId) || null;
  },
};
