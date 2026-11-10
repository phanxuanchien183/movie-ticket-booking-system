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
  // CGV Cinemas Branches
  {
    venue_id: 1,
    venue_name: 'CGV Vincom Landmark 81',
    venue_type: 'cinema_chain',
    brand_name: 'CGV Cinemas',
    city: 'TP. Hồ Chí Minh',
    address: 'Tầng B1, TTTM Vincom Landmark 81, 720A Điện Biên Phủ, Q. Bình Thạnh',
  },
  {
    venue_id: 6,
    venue_name: 'CGV Hùng Vương Plaza',
    venue_type: 'cinema_chain',
    brand_name: 'CGV Cinemas',
    city: 'TP. Hồ Chí Minh',
    address: 'Tầng 7, Hùng Vương Plaza, 126 Hồng Bàng, Quận 5',
  },
  {
    venue_id: 7,
    venue_name: 'CGV Vincom Center Bà Triệu',
    venue_type: 'cinema_chain',
    brand_name: 'CGV Cinemas',
    city: 'Hà Nội',
    address: 'Tầng 6, Vincom Center, 191 Bà Triệu, Q. Hai Bà Trưng',
  },
  // Lotte Cinema Branches
  {
    venue_id: 5,
    venue_name: 'Lotte Cinema Nowzone',
    venue_type: 'cinema_chain',
    brand_name: 'Lotte Cinema',
    city: 'TP. Hồ Chí Minh',
    address: 'Tầng 5, TTTM Nowzone, 235 Nguyễn Văn Cừ, Quận 1',
  },
  {
    venue_id: 8,
    venue_name: 'Lotte Cinema Gò Vấp',
    venue_type: 'cinema_chain',
    brand_name: 'Lotte Cinema',
    city: 'TP. Hồ Chí Minh',
    address: 'Tầng 3, Lotte Mart, 242 Nguyễn Văn Lượng, Q. Gò Vấp',
  },
  {
    venue_id: 9,
    venue_name: 'Lotte Cinema Keangnam Landmark',
    venue_type: 'cinema_chain',
    brand_name: 'Lotte Cinema',
    city: 'Hà Nội',
    address: 'Tầng 5, Keangnam Landmark Tower, Phạm Hùng, Q. Nam Từ Liêm',
  },
  // BHD Star Cineplex Branches
  {
    venue_id: 10,
    venue_name: 'BHD Star Bitexco',
    venue_type: 'cinema_chain',
    brand_name: 'BHD Star',
    city: 'TP. Hồ Chí Minh',
    address: 'Tầng 3 & 4, Bitexco Financial Tower, 2 Hải Triều, Quận 1',
  },
  {
    venue_id: 11,
    venue_name: 'BHD Star Vincom Thảo Điền',
    venue_type: 'cinema_chain',
    brand_name: 'BHD Star',
    city: 'TP. Hồ Chí Minh',
    address: 'Tầng 5, Vincom Mega Mall Thảo Điền, 159 Xa Lộ Hà Nội, TP. Thủ Đức',
  },
  // Arenas & Concert Halls
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
];

export const mockRooms: Room[] = [
  // CGV Vincom Landmark 81
  {
    room_id: 1,
    room_name: 'Phòng Chiếu IMAX Laser 01',
    total_rows: 8,
    seats_per_row: 12,
    screen_width: 14.0,
    screen_height: 7.5,
    distance_to_row_a: 4.5,
    venue: mockVenues.find((v) => v.venue_id === 1),
    is_concert_stage: false,
  },
  // CGV Hùng Vương Plaza
  {
    room_id: 5,
    room_name: 'Phòng Chiếu Cinema 03',
    total_rows: 8,
    seats_per_row: 12,
    screen_width: 13.0,
    screen_height: 6.8,
    distance_to_row_a: 4.2,
    venue: mockVenues.find((v) => v.venue_id === 6),
    is_concert_stage: false,
  },
  // CGV Vincom Bà Triệu
  {
    room_id: 6,
    room_name: 'Phòng Chiếu Gold Class VIP 01',
    total_rows: 8,
    seats_per_row: 12,
    screen_width: 12.5,
    screen_height: 6.5,
    distance_to_row_a: 4.0,
    venue: mockVenues.find((v) => v.venue_id === 7),
    is_concert_stage: false,
  },
  // Lotte Cinema Nowzone
  {
    room_id: 7,
    room_name: 'Phòng Chiếu SuperFlex 01',
    total_rows: 8,
    seats_per_row: 12,
    screen_width: 13.5,
    screen_height: 7.0,
    distance_to_row_a: 4.3,
    venue: mockVenues.find((v) => v.venue_id === 5),
    is_concert_stage: false,
  },
  // Lotte Cinema Gò Vấp
  {
    room_id: 8,
    room_name: 'Phòng Chiếu Cinema 02',
    total_rows: 8,
    seats_per_row: 12,
    screen_width: 13.0,
    screen_height: 6.8,
    distance_to_row_a: 4.2,
    venue: mockVenues.find((v) => v.venue_id === 8),
    is_concert_stage: false,
  },
  // Lotte Cinema Keangnam
  {
    room_id: 9,
    room_name: 'Phòng Chiếu Prestige 01',
    total_rows: 8,
    seats_per_row: 12,
    screen_width: 13.0,
    screen_height: 6.8,
    distance_to_row_a: 4.2,
    venue: mockVenues.find((v) => v.venue_id === 9),
    is_concert_stage: false,
  },
  // BHD Star Bitexco
  {
    room_id: 10,
    room_name: 'Phòng Chiếu First Class Atmos 01',
    total_rows: 8,
    seats_per_row: 12,
    screen_width: 13.0,
    screen_height: 6.8,
    distance_to_row_a: 4.2,
    venue: mockVenues.find((v) => v.venue_id === 10),
    is_concert_stage: false,
  },
  // BHD Star Vincom Thảo Điền
  {
    room_id: 11,
    room_name: 'Phòng Chiếu Cinema 03',
    total_rows: 8,
    seats_per_row: 12,
    screen_width: 12.8,
    screen_height: 6.6,
    distance_to_row_a: 4.1,
    venue: mockVenues.find((v) => v.venue_id === 11),
    is_concert_stage: false,
  },
  // Nhà Thi Đấu Phú Thọ
  {
    room_id: 2,
    room_name: 'Sân Khấu Chính - Nhà Thi Đấu Phú Thọ',
    total_rows: 8,
    seats_per_row: 12,
    screen_width: 16.0,
    screen_height: 8.0,
    distance_to_row_a: 5.0,
    venue: mockVenues.find((v) => v.venue_id === 2),
    is_concert_stage: true,
  },
  // Nhà Thi Đấu Quân Khu 7
  {
    room_id: 3,
    room_name: 'Khán Đài Trung Tâm - QK7 Arena',
    total_rows: 8,
    seats_per_row: 12,
    screen_width: 15.0,
    screen_height: 7.5,
    distance_to_row_a: 4.8,
    venue: mockVenues.find((v) => v.venue_id === 3),
    is_concert_stage: true,
  },
  // Trung Tâm Hội Nghị Quốc Gia
  {
    room_id: 4,
    room_name: 'Đại Sảnh Hội Nghị Hòa Bình - NCC',
    total_rows: 8,
    seats_per_row: 12,
    screen_width: 14.0,
    screen_height: 6.5,
    distance_to_row_a: 4.5,
    venue: mockVenues.find((v) => v.venue_id === 4),
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
  [5, generateSeatsForRoom(5, false)],
  [6, generateSeatsForRoom(6, false)],
  [7, generateSeatsForRoom(7, false)],
  [8, generateSeatsForRoom(8, false)],
  [9, generateSeatsForRoom(9, false)],
  [10, generateSeatsForRoom(10, false)],
  [11, generateSeatsForRoom(11, false)],
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
    rating_score: '4.9/5',
    director: 'Đạo diễn Sân Khấu: Việt Tú • Giám Đốc Âm Nhạc: JustaTee',
    trailer_youtube_id: 'sayhi2026',
    rules_notice: 'Mang theo CCCD/VNeID để đối soát vé. Không mang theo nước uống và vật sắc nhọn vào nhà thi đấu.',
    ticket_tiers: [
      { name: 'SKY LOUNGE', price: 10000000, color: '#38bdf8', type: 'seated', perks: 'Ghế sofa VIP, Tiệc nhẹ, Quà lưu niệm độc quyền' },
      { name: 'SVIP A / B', price: 5000000, color: '#06b6d4', type: 'seated', perks: 'Vé Soundcheck, Lối vào ưu tiên' },
      { name: 'VIP A / B', price: 4000000, color: '#0891b2', type: 'seated', perks: 'Lightstick chính hãng phát sáng' },
      { name: 'FANZONE A / B', price: 2500000, color: '#6366f1', type: 'standing', perks: 'Sát sàn diễn chính chữ T, không gian cuồng nhiệt' },
      { name: 'CAT 1A / 1B', price: 2500000, color: '#a855f7', type: 'seated', perks: 'Khán đài trung tâm góc nhìn toàn cảnh' },
      { name: 'CAT 2A / 2B', price: 1800000, color: '#581c87', type: 'seated' },
      { name: 'GA 1A / 2A', price: 800000, color: '#64748b', type: 'standing' },
    ],
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
    rating_score: '5.0/5',
    director: 'M-TP Entertainment',
    rules_notice: 'Mỗi tài khoản được mua tối đa 4 vé. Trẻ em dưới 12 tuổi phải có người giám hộ đi kèm.',
    ticket_tiers: [
      { name: 'VVIP SÂN KHẤU', price: 3500000, color: '#f43f5e', type: 'seated', perks: 'Áo thun Sky Tour, Thẻ đeo lưu niệm' },
      { name: 'FANZONE TRUNG TÂM', price: 2000000, color: '#6366f1', type: 'standing', perks: 'Khu vực đứng sát thần tượng' },
      { name: 'KHÁN ĐÀI CAT 1', price: 1200000, color: '#a855f7', type: 'seated' },
      { name: 'KHÁN ĐÀI CAT 2', price: 800000, color: '#64748b', type: 'seated' },
    ],
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
    rating_score: '4.8/5',
    director: 'Warner Music Vietnam',
    ticket_tiers: [
      { name: 'HẠNG VÉ VIP', price: 1800000, color: '#06b6d4', type: 'seated', perks: 'CD Album có chữ ký của Vũ.' },
      { name: 'HẠNG VÉ CAT 1', price: 1100000, color: '#8b5cf6', type: 'seated' },
      { name: 'HẠNG VÉ CAT 2', price: 650000, color: '#64748b', type: 'seated' },
    ],
  },

  // 2. PHIM CHIẾU RẠP (CỤM RẠP CGV, LOTTE, BHD)
  {
    event_id: 1,
    movie_id: 1,
    title: 'Dune: Hành Tinh Cát - Phần Hai',
    category: 'movie',
    category_label: 'Phim Chiếu Rạp',
    artists: 'Timothée Chalamet, Zendaya, Rebecca Ferguson, Javier Bardem',
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
    rating_score: '4.9/5 Khán Giả',
    rating_imdb: '8.6/10 IMDb',
    director: 'Denis Villeneuve',
    trailer_youtube_id: 'Way9Dexny3w',
  },
  {
    event_id: 2,
    movie_id: 2,
    title: 'Oppenheimer',
    category: 'movie',
    category_label: 'Phim Chiếu Rạp',
    artists: 'Cillian Murphy, Emily Blunt, Robert Downey Jr., Matt Damon',
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
    rating_score: '4.9/5 Khán Giả',
    rating_imdb: '8.9/10 IMDb',
    director: 'Christopher Nolan',
    trailer_youtube_id: 'uYPbbksJxIg',
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
    rating_score: '4.7/5 Khán Giả',
    rating_imdb: '7.8/10 IMDb',
    director: 'Trấn Thành',
    trailer_youtube_id: 'mai2024',
  },

  // 3. FAN MEETING & HỘI NGHỊ QUỐC TẾ
  {
    event_id: 104,
    movie_id: 104,
    title: 'K-Pop Star Asia Fan Meeting & Showcase',
    category: 'meeting',
    category_label: 'Fan Meeting',
    artists: 'Kim Seon Ho & Dàn Khách Mời Đặc Biệt',
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
    rating_score: '4.9/5',
    ticket_tiers: [
      { name: 'VVIP HI-TOUCH', price: 3200000, color: '#f43f5e', type: 'seated', perks: 'Hi-Touch trực tiếp, Photo 1:1, Poster ký tên' },
      { name: 'VIP ZONE', price: 2100000, color: '#06b6d4', type: 'seated', perks: 'Hi-Touch nhóm, Photocard độc quyền' },
      { name: 'ZONE CAT 1', price: 1200000, color: '#8b5cf6', type: 'seated' },
      { name: 'ZONE CAT 2', price: 950000, color: '#64748b', type: 'seated' },
    ],
  },
];

export const mockShowtimes: Showtime[] = [
  // ==========================================
  // 1. DUNE: HÀNH TINH CÁT 2 (movie_id: 1)
  // ==========================================
  // Chi nhánh CGV Vincom Landmark 81 (room 1)
  {
    showtime_id: 1,
    movie_id: 1,
    room_id: 1,
    start_time: '2026-11-11T19:30:00',
    end_time: '2026-11-11T22:15:00',
    format_type: 'CGV IMAX Laser 2D',
    is_weekend_or_holiday: false,
    movie: mockEvents.find((e) => e.movie_id === 1),
    room: mockRooms.find((r) => r.room_id === 1),
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
    room: mockRooms.find((r) => r.room_id === 1),
  },
  // Chi nhánh CGV Hùng Vương Plaza (room 5)
  {
    showtime_id: 11,
    movie_id: 1,
    room_id: 5,
    start_time: '2026-11-11T18:15:00',
    end_time: '2026-11-11T21:00:00',
    format_type: '2D Phụ đề',
    is_weekend_or_holiday: false,
    movie: mockEvents.find((e) => e.movie_id === 1),
    room: mockRooms.find((r) => r.room_id === 5),
  },
  {
    showtime_id: 12,
    movie_id: 1,
    room_id: 5,
    start_time: '2026-11-11T20:45:00',
    end_time: '2026-11-11T23:30:00',
    format_type: '2D Lồng tiếng',
    is_weekend_or_holiday: false,
    movie: mockEvents.find((e) => e.movie_id === 1),
    room: mockRooms.find((r) => r.room_id === 5),
  },
  // Chi nhánh CGV Vincom Bà Triệu (room 6)
  {
    showtime_id: 13,
    movie_id: 1,
    room_id: 6,
    start_time: '2026-11-11T19:00:00',
    end_time: '2026-11-11T21:45:00',
    format_type: 'CGV Gold Class VIP',
    is_weekend_or_holiday: false,
    movie: mockEvents.find((e) => e.movie_id === 1),
    room: mockRooms.find((r) => r.room_id === 6),
  },
  // Chi nhánh Lotte Cinema Nowzone (room 7)
  {
    showtime_id: 14,
    movie_id: 1,
    room_id: 7,
    start_time: '2026-11-11T18:30:00',
    end_time: '2026-11-11T21:15:00',
    format_type: 'Lotte SuperFlex 2D',
    is_weekend_or_holiday: false,
    movie: mockEvents.find((e) => e.movie_id === 1),
    room: mockRooms.find((r) => r.room_id === 7),
  },
  {
    showtime_id: 15,
    movie_id: 1,
    room_id: 7,
    start_time: '2026-11-11T21:30:00',
    end_time: '2026-11-12T00:15:00',
    format_type: 'Lotte 2D Cinema',
    is_weekend_or_holiday: false,
    movie: mockEvents.find((e) => e.movie_id === 1),
    room: mockRooms.find((r) => r.room_id === 7),
  },
  // Chi nhánh Lotte Cinema Gò Vấp (room 8)
  {
    showtime_id: 16,
    movie_id: 1,
    room_id: 8,
    start_time: '2026-11-11T17:45:00',
    end_time: '2026-11-11T20:30:00',
    format_type: 'Lotte 2D Cinema',
    is_weekend_or_holiday: false,
    movie: mockEvents.find((e) => e.movie_id === 1),
    room: mockRooms.find((r) => r.room_id === 8),
  },
  // Chi nhánh BHD Star Bitexco (room 10)
  {
    showtime_id: 17,
    movie_id: 1,
    room_id: 10,
    start_time: '2026-11-11T18:45:00',
    end_time: '2026-11-11T21:30:00',
    format_type: 'BHD Dolby Atmos 2D',
    is_weekend_or_holiday: false,
    movie: mockEvents.find((e) => e.movie_id === 1),
    room: mockRooms.find((r) => r.room_id === 10),
  },
  {
    showtime_id: 18,
    movie_id: 1,
    room_id: 10,
    start_time: '2026-11-11T21:15:00',
    end_time: '2026-11-12T00:00:00',
    format_type: 'BHD 2D Phụ đề',
    is_weekend_or_holiday: false,
    movie: mockEvents.find((e) => e.movie_id === 1),
    room: mockRooms.find((r) => r.room_id === 10),
  },
  // Chi nhánh BHD Star Thảo Điền (room 11)
  {
    showtime_id: 19,
    movie_id: 1,
    room_id: 11,
    start_time: '2026-11-11T19:15:00',
    end_time: '2026-11-11T22:00:00',
    format_type: 'BHD 2D Digital',
    is_weekend_or_holiday: false,
    movie: mockEvents.find((e) => e.movie_id === 1),
    room: mockRooms.find((r) => r.room_id === 11),
  },

  // ==========================================
  // 2. OPPENHEIMER (movie_id: 2)
  // ==========================================
  {
    showtime_id: 3,
    movie_id: 2,
    room_id: 1,
    start_time: '2026-11-12T18:00:00',
    end_time: '2026-11-12T21:00:00',
    format_type: 'CGV IMAX Laser 2D',
    is_weekend_or_holiday: false,
    movie: mockEvents.find((e) => e.movie_id === 2),
    room: mockRooms.find((r) => r.room_id === 1),
  },
  {
    showtime_id: 20,
    movie_id: 2,
    room_id: 5,
    start_time: '2026-11-12T19:30:00',
    end_time: '2026-11-12T22:30:00',
    format_type: '2D Phụ đề',
    is_weekend_or_holiday: false,
    movie: mockEvents.find((e) => e.movie_id === 2),
    room: mockRooms.find((r) => r.room_id === 5),
  },
  {
    showtime_id: 21,
    movie_id: 2,
    room_id: 7,
    start_time: '2026-11-12T20:15:00',
    end_time: '2026-11-12T23:15:00',
    format_type: 'Lotte SuperFlex 2D',
    is_weekend_or_holiday: false,
    movie: mockEvents.find((e) => e.movie_id === 2),
    room: mockRooms.find((r) => r.room_id === 7),
  },
  {
    showtime_id: 22,
    movie_id: 2,
    room_id: 10,
    start_time: '2026-11-12T19:00:00',
    end_time: '2026-11-12T22:00:00',
    format_type: 'BHD Dolby Atmos 2D',
    is_weekend_or_holiday: false,
    movie: mockEvents.find((e) => e.movie_id === 2),
    room: mockRooms.find((r) => r.room_id === 10),
  },

  // ==========================================
  // 3. MAI (movie_id: 3)
  // ==========================================
  {
    showtime_id: 4,
    movie_id: 3,
    room_id: 7,
    start_time: '2026-11-14T20:00:00',
    end_time: '2026-11-14T22:15:00',
    format_type: 'Lotte 2D Cinema',
    is_weekend_or_holiday: true,
    movie: mockEvents.find((e) => e.movie_id === 3),
    room: mockRooms.find((r) => r.room_id === 7),
  },
  {
    showtime_id: 23,
    movie_id: 3,
    room_id: 1,
    start_time: '2026-11-14T18:30:00',
    end_time: '2026-11-14T20:45:00',
    format_type: 'CGV 2D Digital',
    is_weekend_or_holiday: true,
    movie: mockEvents.find((e) => e.movie_id === 3),
    room: mockRooms.find((r) => r.room_id === 1),
  },
  {
    showtime_id: 24,
    movie_id: 3,
    room_id: 5,
    start_time: '2026-11-14T21:00:00',
    end_time: '2026-11-14T23:15:00',
    format_type: '2D Tiêu chuẩn',
    is_weekend_or_holiday: true,
    movie: mockEvents.find((e) => e.movie_id === 3),
    room: mockRooms.find((r) => r.room_id === 5),
  },
  {
    showtime_id: 25,
    movie_id: 3,
    room_id: 11,
    start_time: '2026-11-14T19:45:00',
    end_time: '2026-11-14T22:00:00',
    format_type: 'BHD 2D Digital',
    is_weekend_or_holiday: true,
    movie: mockEvents.find((e) => e.movie_id === 3),
    room: mockRooms.find((r) => r.room_id === 11),
  },

  // ==========================================
  // CONCERTS & FAN MEETINGS
  // ==========================================
  {
    showtime_id: 101,
    movie_id: 101,
    room_id: 3,
    start_time: '2026-11-15T19:30:00',
    end_time: '2026-11-15T23:00:00',
    format_type: 'Live Arena Show 360°',
    is_weekend_or_holiday: true,
    movie: mockEvents.find((e) => e.movie_id === 101),
    room: mockRooms.find((r) => r.room_id === 3),
  },
  {
    showtime_id: 102,
    movie_id: 102,
    room_id: 2,
    start_time: '2026-11-22T20:00:00',
    end_time: '2026-11-22T23:00:00',
    format_type: 'Super Stage VIP',
    is_weekend_or_holiday: true,
    movie: mockEvents.find((e) => e.movie_id === 102),
    room: mockRooms.find((r) => r.room_id === 2),
  },
  {
    showtime_id: 103,
    movie_id: 103,
    room_id: 4,
    start_time: '2026-11-28T20:00:00',
    end_time: '2026-11-28T22:30:00',
    format_type: 'Grand Hall Concert',
    is_weekend_or_holiday: true,
    movie: mockEvents.find((e) => e.movie_id === 103),
    room: mockRooms.find((r) => r.room_id === 4),
  },
  {
    showtime_id: 104,
    movie_id: 104,
    room_id: 2,
    start_time: '2026-12-05T18:00:00',
    end_time: '2026-12-05T20:00:00',
    format_type: 'Fan Meet & Greet',
    is_weekend_or_holiday: true,
    movie: mockEvents.find((e) => e.movie_id === 104),
    room: mockRooms.find((r) => r.room_id === 2),
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

  async getShowtimes(movieId?: number, venueId?: number): Promise<Showtime[]> {
    let list = mockShowtimes;
    if (movieId) {
      list = list.filter((s) => s.movie_id === movieId);
    }
    if (venueId) {
      list = list.filter((s) => s.room?.venue?.venue_id === venueId);
    }
    return list;
  },

  async getShowtimeById(showtimeId: number): Promise<Showtime | null> {
    return mockShowtimes.find((s) => s.showtime_id === showtimeId) || null;
  },

  async getSeatsByRoom(roomId: number): Promise<Seat[]> {
    const list = mockSeats.get(roomId);
    if (list) return list;
    const room = mockRooms.find((r) => r.room_id === roomId);
    const isConcert = room ? !!room.is_concert_stage : false;
    const generated = generateSeatsForRoom(roomId, isConcert);
    mockSeats.set(roomId, generated);
    return generated;
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
