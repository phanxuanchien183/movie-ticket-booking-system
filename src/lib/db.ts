import mysql from 'mysql2/promise';
import { EntertainmentEvent, Room, Seat, Showtime, PricingRule, Promotion, Booking, Venue } from '@/types';

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
      console.warn('[DB] Không thể kết nối MySQL Pool, kích hoạt In-Memory Store.', err);
    }
  }
  return null;
}

// ==========================================
// SEED DATA: CỤM RẠP & NHÀ THI ĐẤU CONCERT
// ==========================================

export const mockVenues: Venue[] = [
  {
    venue_id: 1,
    venue_name: 'CGV Vincom Landmark 81',
    venue_type: 'cinema_chain',
    brand_name: 'CGV Cinemas',
    city: 'TP. Hồ Chí Minh',
    address: 'Tầng B1, TTTM Vincom Landmark 81, 720A Điện Biên Phủ, Q. Bình Thạnh',
  },
  {
    venue_id: 2,
    venue_name: 'Nhà Thi Đấu Phú Thọ',
    venue_type: 'arena',
    brand_name: 'Nhà thi đấu Phú Thọ',
    city: 'TP. Hồ Chí Minh',
    address: 'Số 1 Lữ Gia, Phường 15, Quận 11, TP. Hồ Chí Minh',
  },
  {
    venue_id: 3,
    venue_name: 'Nhà Thi Đấu Quân Khu 7',
    venue_type: 'arena',
    brand_name: 'Nhà thi đấu QK7',
    city: 'TP. Hồ Chí Minh',
    address: '202 Hoàng Văn Thụ, Phường 9, Quận Phú Nhuận, TP. Hồ Chí Minh',
  },
  {
    venue_id: 4,
    venue_name: 'Trung Tâm Hội Nghị Quốc Gia (NCC)',
    venue_type: 'convention_center',
    brand_name: 'Trung tâm Hội nghị Quốc gia',
    city: 'Hà Nội',
    address: 'Đại lộ Thăng Long, Mễ Trì, Nam Từ Liêm, Hà Nội',
  },
  {
    venue_id: 5,
    venue_name: 'Lotte Cinema Nowzone',
    venue_type: 'cinema_chain',
    brand_name: 'Lotte Cinema',
    city: 'TP. Hồ Chí Minh',
    address: 'Tầng 5, TTTM Nowzone, 235 Nguyễn Văn Cừ, Quận 1',
  },
];

export const mockRooms: Room[] = [
  {
    room_id: 1,
    room_name: 'Phòng Chiếu IMAX Laser 01',
    total_rows: 8,
    seats_per_row: 12,
    screen_width: 14.0,
    screen_height: 7.5,
    distance_to_row_a: 4.5,
    venue: mockVenues[0],
    is_concert_stage: false,
  },
  {
    room_id: 2,
    room_name: 'Sân Khấu Chính - Nhà Thi Đấu Phú Thọ',
    total_rows: 8,
    seats_per_row: 12,
    screen_width: 16.0,
    screen_height: 8.0,
    distance_to_row_a: 5.0,
    venue: mockVenues[1],
    is_concert_stage: true,
  },
  {
    room_id: 3,
    room_name: 'Khán Đài Trung Tâm - QK7 Arena',
    total_rows: 8,
    seats_per_row: 12,
    screen_width: 15.0,
    screen_height: 7.5,
    distance_to_row_a: 4.8,
    venue: mockVenues[2],
    is_concert_stage: true,
  },
  {
    room_id: 4,
    room_name: 'Đại Sảnh Hội Nghị Hòa Bình - NCC',
    total_rows: 8,
    seats_per_row: 12,
    screen_width: 14.0,
    screen_height: 6.5,
    distance_to_row_a: 4.5,
    venue: mockVenues[3],
    is_concert_stage: true,
  },
];

// Sinh danh sách ghế cho phòng chiếu / sân khấu
function generateSeatsForRoom(roomId: number, isConcert: boolean): Seat[] {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const yDistances = [4.5, 5.5, 6.5, 7.6, 8.7, 9.8, 10.9, 12.0];
  const zElevations = [0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75];

  rows.forEach((row, rIdx) => {
    let seatType: any = 'Standard';
    let zoneName = 'Khu Thường';
    let seatPrice = 90000;

    if (isConcert) {
      if (['A', 'B'].includes(row)) {
        seatType = 'VVIP_Stage';
        zoneName = 'Khu VVIP Sát Sân Khấu';
        seatPrice = 2500000;
      } else if (['C', 'D'].includes(row)) {
        seatType = 'VIP';
        zoneName = 'Khu VIP Khán Đài';
        seatPrice = 1800000;
      } else if (['E', 'F'].includes(row)) {
        seatType = 'CAT1';
        zoneName = 'Khán Đài CAT 1';
        seatPrice = 1200000;
      } else {
        seatType = 'CAT2';
        zoneName = 'Khán Đài CAT 2';
        seatPrice = 800000;
      }
    } else {
      if (row === 'H') {
        seatType = 'Sweetbox';
        zoneName = 'Ghế Đôi Sweetbox';
        seatPrice = 220000;
      } else if (['D', 'E', 'F', 'G'].includes(row)) {
        seatType = 'VIP';
        zoneName = 'Ghế VIP Trung Tâm';
        seatPrice = 120000;
      } else {
        seatType = 'Standard';
        zoneName = 'Ghế Tiêu Chuẩn';
        seatPrice = 90000;
      }
    }

    const seatCount = (!isConcert && row === 'H') ? 6 : 12;

    for (let num = 1; num <= seatCount; num++) {
      const seatId = `R${roomId}-${row}${num < 10 ? '0' + num : num}`;
      let x = (!isConcert && row === 'H')
        ? 1.4 + (num - 1) * 1.8
        : 1.0 + (num - 1) * 0.85;

      seats.push({
        seat_id: seatId,
        room_id: roomId,
        row_name: row,
        seat_number: num,
        seat_type: seatType,
        coord_x: Math.round(x * 100) / 100,
        coord_y: yDistances[rIdx],
        coord_z: zElevations[rIdx],
        price: seatPrice,
        zone_name: zoneName,
      });
    }
  });

  return seats;
}

const mockSeats: Map<number, Seat[]> = new Map([
  [1, generateSeatsForRoom(1, false)],
  [2, generateSeatsForRoom(2, true)],
  [3, generateSeatsForRoom(3, true)],
  [4, generateSeatsForRoom(4, true)],
]);

// Danh sách sự kiện phong phú (Phim rạp + Concert nhà thi đấu + Fan Meeting)
export const mockEvents: (EntertainmentEvent & { movie_id: number })[] = [
  // 1. CONCERT & ĐẠI NHẠC HỘI
  {
    event_id: 101,
    movie_id: 101,
    title: 'Anh Trai "Say Hi" - The Live Concert 2026',
    category: 'concert',
    category_label: 'Live Concert',
    artists: 'HIEUTHUHAI, Anh Tú, Isaac, Quang Hùng MasterD, Rhyder, Negav',
    duration_minutes: 210,
    poster_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
    genre: 'Pop, Hip-hop, EDM Show',
    age_rating: 'P',
    description: 'Đêm đại nhạc hội bùng nổ quy tụ dàn "Anh Trai" hot nhất màn ảnh với hệ thống âm thanh, ánh sáng và sân khấu 360 độ đỉnh cao.',
    status: 'SellingFast',
    venue_name: 'Nhà Thi Đấu Quân Khu 7',
    venue_address: '202 Hoàng Văn Thụ, Q. Phú Nhuận, TP.HCM',
    city: 'TP. Hồ Chí Minh',
    price_from: 800000,
    event_dates: '19:30 • 15/11/2026',
  },
  {
    event_id: 102,
    movie_id: 102,
    title: 'Sơn Tùng M-TP - Sky Tour Special Arena Night',
    category: 'concert',
    category_label: 'Live Concert',
    artists: 'Sơn Tùng M-TP & Special Guests',
    duration_minutes: 180,
    poster_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop',
    genre: 'Pop, V-Pop, R&B',
    age_rating: 'P',
    description: 'Liveshow quy mô 10.000 khán giả của Sơn Tùng M-TP với các bản hit huyền thoại và loạt ca khúc mới được hòa âm phối khí đặc biệt.',
    status: 'SellingFast',
    venue_name: 'Nhà Thi Đấu Phú Thọ',
    venue_address: 'Số 1 Lữ Gia, Phường 15, Quận 11, TP.HCM',
    city: 'TP. Hồ Chí Minh',
    price_from: 800000,
    event_dates: '20:00 • 22/11/2026',
  },
  {
    event_id: 103,
    movie_id: 103,
    title: 'Vũ. - Live Concert "Bảo Tàng Của Nuối Tiếc"',
    category: 'concert',
    category_label: 'Live Concert',
    artists: 'Vũ. & Khách mời đặc biệt',
    duration_minutes: 150,
    poster_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop',
    genre: 'Indie, Acoustic, Pop Ballad',
    age_rating: 'P',
    description: 'Một không gian âm nhạc hoài niệm, sâu lắng với các giai điệu trữ tình làm say đắm hàng triệu trái tim người yêu nhạc.',
    status: 'NowShowing',
    venue_name: 'Trung Tâm Hội Nghị Quốc Gia (NCC)',
    venue_address: 'Đại lộ Thăng Long, Mễ Trì, Hà Nội',
    city: 'Hà Nội',
    price_from: 650000,
    event_dates: '20:00 • 28/11/2026',
  },

  // 2. PHIM CHIẾU RẠP (CỤM RẠP CGV, LOTTE, BHD)
  {
    event_id: 1,
    movie_id: 1,
    title: 'Dune: Hành Tinh Cát - Phần Hai',
    category: 'movie',
    category_label: 'Phim Chiếu Rạp',
    artists: 'Timothée Chalamet, Zendaya, Rebecca Ferguson',
    duration_minutes: 166,
    poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    genre: 'Khoa học viễn tưởng, Hành động',
    age_rating: 'T16',
    description: 'Paul Atreides hợp tác với Chani và người Fremen trong cuộc chiến sinh tử giải cứu gia tộc và vũ trụ.',
    status: 'NowShowing',
    venue_name: 'CGV Vincom Landmark 81',
    venue_address: '720A Điện Biên Phủ, Q. Bình Thạnh, TP.HCM',
    city: 'TP. Hồ Chí Minh',
    price_from: 110000,
    event_dates: 'Hằng ngày • Nhiều suất chiếu',
  },
  {
    event_id: 2,
    movie_id: 2,
    title: 'Oppenheimer',
    category: 'movie',
    category_label: 'Phim Chiếu Rạp',
    artists: 'Cillian Murphy, Emily Blunt, Robert Downey Jr.',
    duration_minutes: 180,
    poster_url: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop',
    genre: 'Tiểu sử, Chính kịch, Lịch sử',
    age_rating: 'T18',
    description: 'Kiệt tác đoạt giải Oscar của đạo diễn Christopher Nolan về nhà vật lý lý thuyết J. Robert Oppenheimer.',
    status: 'NowShowing',
    venue_name: 'CGV Vincom Landmark 81',
    venue_address: '720A Điện Biên Phủ, Q. Bình Thạnh, TP.HCM',
    city: 'TP. Hồ Chí Minh',
    price_from: 110000,
    event_dates: 'Hằng ngày • Nhiều suất chiếu',
  },
  {
    event_id: 3,
    movie_id: 3,
    title: 'Mai - Phim Của Trấn Thành',
    category: 'movie',
    category_label: 'Phim Chiếu Rạp',
    artists: 'Phương Anh Đào, Tuấn Trần, Hồng Đào, Trấn Thành',
    duration_minutes: 131,
    poster_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop',
    genre: 'Tâm lý, Tình cảm',
    age_rating: 'T18',
    description: 'Một câu chuyện tình cảm động và đầy trắc trở giữa Mai và Dương giữa những định kiến xã hội hiện đại.',
    status: 'NowShowing',
    venue_name: 'Lotte Cinema Nowzone',
    venue_address: '235 Nguyễn Văn Cừ, Quận 1, TP.HCM',
    city: 'TP. Hồ Chí Minh',
    price_from: 90000,
    event_dates: 'Hằng ngày • Nhiều suất chiếu',
  },

  // 3. FAN MEETING & HỘI NGHỊ QUỐC TẾ
  {
    event_id: 104,
    movie_id: 104,
    title: 'K-Pop Star Asia Fan Meeting & Showcase',
    category: 'meeting',
    category_label: 'Fan Meeting',
    artists: 'Top K-Pop Artists Lineup',
    duration_minutes: 120,
    poster_url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
    genre: 'Fan Meeting, Giao lưu & Ký tặng',
    age_rating: 'P',
    description: 'Cơ hội độc quyền giao lưu trực tiếp, chụp hình kỷ niệm và nhận quà tặng đặc biệt từ thần tượng K-Pop hàng đầu.',
    status: 'SellingFast',
    venue_name: 'Nhà Thi Đấu Phú Thọ',
    venue_address: 'Số 1 Lữ Gia, Phường 15, Quận 11, TP.HCM',
    city: 'TP. Hồ Chí Minh',
    price_from: 950000,
    event_dates: '18:00 • 05/12/2026',
  },
];

export const mockShowtimes: Showtime[] = [
  // Suất chiếu Dune (CGV IMAX)
  {
    showtime_id: 1,
    movie_id: 1,
    room_id: 1,
    start_time: '2026-11-11T19:30:00',
    end_time: '2026-11-11T22:15:00',
    format_type: 'CGV IMAX Laser 2D',
    is_weekend_or_holiday: false,
    movie: mockEvents.find((e) => e.movie_id === 1),
    room: mockRooms[0],
  },
  {
    showtime_id: 2,
    movie_id: 1,
    room_id: 1,
    start_time: '2026-11-11T22:45:00',
    end_time: '2026-11-12T01:30:00',
    format_type: 'CGV IMAX Laser 2D',
    is_weekend_or_holiday: false,
    movie: mockEvents.find((e) => e.movie_id === 1),
    room: mockRooms[0],
  },
  // Suất chiếu Oppenheimer
  {
    showtime_id: 3,
    movie_id: 2,
    room_id: 1,
    start_time: '2026-11-12T18:00:00',
    end_time: '2026-11-12T21:00:00',
    format_type: '2D Phụ đề',
    is_weekend_or_holiday: false,
    movie: mockEvents.find((e) => e.movie_id === 2),
    room: mockRooms[0],
  },
  // Suất chiếu Mai (Lotte Cinema)
  {
    showtime_id: 4,
    movie_id: 3,
    room_id: 1,
    start_time: '2026-11-14T20:00:00',
    end_time: '2026-11-14T22:15:00',
    format_type: 'Lotte 2D Cinema',
    is_weekend_or_holiday: true,
    movie: mockEvents.find((e) => e.movie_id === 3),
    room: mockRooms[0],
  },

  // Suất diễn Anh Trai Say Hi Live Concert (Nhà thi đấu QK7)
  {
    showtime_id: 101,
    movie_id: 101,
    room_id: 3,
    start_time: '2026-11-15T19:30:00',
    end_time: '2026-11-15T23:00:00',
    format_type: 'Live Arena Show 360°',
    is_weekend_or_holiday: true,
    movie: mockEvents.find((e) => e.movie_id === 101),
    room: mockRooms[2],
  },

  // Suất diễn Sơn Tùng M-TP Sky Tour (Nhà thi đấu Phú Thọ)
  {
    showtime_id: 102,
    movie_id: 102,
    room_id: 2,
    start_time: '2026-11-22T20:00:00',
    end_time: '2026-11-22T23:00:00',
    format_type: 'Super Stage VIP',
    is_weekend_or_holiday: true,
    movie: mockEvents.find((e) => e.movie_id === 102),
    room: mockRooms[1],
  },

  // Suất diễn Vũ. Live Concert (Trung tâm Hội nghị Quốc gia)
  {
    showtime_id: 103,
    movie_id: 103,
    room_id: 4,
    start_time: '2026-11-28T20:00:00',
    end_time: '2026-11-28T22:30:00',
    format_type: 'Grand Hall Concert',
    is_weekend_or_holiday: true,
    movie: mockEvents.find((e) => e.movie_id === 103),
    room: mockRooms[3],
  },

  // Fan Meeting K-Pop (Nhà thi đấu Phú Thọ)
  {
    showtime_id: 104,
    movie_id: 104,
    room_id: 2,
    start_time: '2026-12-05T18:00:00',
    end_time: '2026-12-05T20:00:00',
    format_type: 'Fan Meet & Greet',
    is_weekend_or_holiday: true,
    movie: mockEvents.find((e) => e.movie_id === 104),
    room: mockRooms[1],
  },
];

export const mockPricingRules: PricingRule[] = [
  { rule_id: 1, seat_type: 'Standard', is_weekend: false, price: 90000 },
  { rule_id: 2, seat_type: 'Standard', is_weekend: true, price: 110000 },
  { rule_id: 3, seat_type: 'VIP', is_weekend: false, price: 120000 },
  { rule_id: 4, seat_type: 'VIP', is_weekend: true, price: 140000 },
  { rule_id: 5, seat_type: 'Sweetbox', is_weekend: false, price: 220000 },
  { rule_id: 6, seat_type: 'Sweetbox', is_weekend: true, price: 260000 },
  // Giá vé Concert / Arena
  { rule_id: 7, seat_type: 'VVIP_Stage', is_weekend: false, price: 2500000 },
  { rule_id: 8, seat_type: 'VVIP_Stage', is_weekend: true, price: 2500000 },
  { rule_id: 9, seat_type: 'CAT1', is_weekend: false, price: 1200000 },
  { rule_id: 10, seat_type: 'CAT1', is_weekend: true, price: 1200000 },
  { rule_id: 11, seat_type: 'CAT2', is_weekend: false, price: 800000 },
  { rule_id: 12, seat_type: 'CAT2', is_weekend: true, price: 800000 },
];

export const mockPromotions: Promotion[] = [
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

const mockBookings: Map<string, Booking> = new Map();
const mockBookedSeats: Map<number, Set<string>> = new Map([
  [1, new Set(['R1-E05', 'R1-E06'])],
  [101, new Set(['R3-A05', 'R3-A06', 'R3-B07'])],
]);

export const db = {
  async getMovies(category?: string): Promise<any[]> {
    if (category && category !== 'all') {
      return mockEvents.filter((e) => e.category === category);
    }
    return mockEvents;
  },

  async getShowtimes(movieId?: number): Promise<Showtime[]> {
    if (movieId) {
      return mockShowtimes.filter((s) => s.movie_id === movieId);
    }
    return mockShowtimes;
  },

  async getShowtimeById(showtimeId: number): Promise<Showtime | null> {
    return mockShowtimes.find((s) => s.showtime_id === showtimeId) || null;
  },

  async getSeatsByRoom(roomId: number): Promise<Seat[]> {
    const list = mockSeats.get(roomId);
    if (list) return list;
    return generateSeatsForRoom(roomId, roomId > 1);
  },

  async getBookedSeatIds(showtimeId: number): Promise<string[]> {
    const booked = mockBookedSeats.get(showtimeId);
    return booked ? Array.from(booked) : [];
  },

  async getPricingRules(): Promise<PricingRule[]> {
    return mockPricingRules;
  },

  async getPromotionByCode(code: string): Promise<Promotion | null> {
    return (
      mockPromotions.find((p) => p.code.toUpperCase() === code.trim().toUpperCase()) || null
    );
  },

  async createBooking(booking: Booking, seatDetails: { seat_id: string; price: number }[]): Promise<Booking> {
    let booked = mockBookedSeats.get(booking.showtime_id);
    if (!booked) {
      booked = new Set();
      mockBookedSeats.set(booking.showtime_id, booked);
    }

    for (const seat of seatDetails) {
      if (booked.has(seat.seat_id)) {
        throw new Error(`Ghế/Khu vực ${seat.seat_id} đã có người đặt trước!`);
      }
    }

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

  async getBookingById(bookingId: string): Promise<Booking | null> {
    return mockBookings.get(bookingId) || null;
  },
};
