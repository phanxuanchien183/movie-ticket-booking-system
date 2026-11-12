// Types định nghĩa cho Hệ thống Thương mại Đặt vé Toàn diện (Cụm rạp & Concert Nhà thi đấu)

export type EventCategory = 'all' | 'movie' | 'concert' | 'meeting' | 'sport';

export type VenueType = 'cinema_chain' | 'arena' | 'stadium' | 'convention_center';

export type SeatType = 'Standard' | 'VIP' | 'Sweetbox' | 'VVIP_Stage' | 'GA_Fanzone' | 'CAT1' | 'CAT2';

export type SeatStatus = 'available' | 'locked' | 'booked';

export interface Venue {
  venue_id: number;
  venue_name: string;
  venue_type: VenueType;
  brand_name: string; // "CGV Cinemas", "Lotte Cinema", "BHD Star", "Nhà thi đấu Phú Thọ", "SVĐ Mỹ Đình"
  city: string; // "TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng"
  address: string;
}

export interface Room {
  room_id: number;
  room_name: string;
  total_rows: number;
  seats_per_row: number;
  screen_width: number;
  screen_height: number;
  distance_to_row_a: number;
  venue?: Venue;
  is_concert_stage?: boolean;
}

export interface Seat {
  seat_id: string;
  room_id: number;
  row_name: string;
  seat_number: number;
  seat_type: SeatType;
  coord_x: number;
  coord_y: number;
  coord_z: number;
  status?: SeatStatus;
  locked_by_user?: string | null;
  lock_expires_in?: number | null; // seconds
  price?: number;
  zone_name?: string; // "Khu VVIP", "Khán đài A", "Sân Fanzone"
}

export interface EntertainmentEvent {
  event_id: number;
  movie_id?: number;
  title: string;
  category: 'movie' | 'concert' | 'meeting' | 'sport';
  category_label: string; // "Phim Chiếu Rạp", "Live Concert", "Fan Meeting"
  artists?: string; // "Sơn Tùng M-TP", "Anh Trai Say Hi", dàn diễn viên
  duration_minutes: number;
  poster_url: string;
  backdrop_url?: string;
  trailer_url?: string;
  genre?: string;
  age_rating?: string;
  description?: string;
  status: 'NowShowing' | 'SellingFast' | 'ComingSoon' | 'SoldOut';
  venue_name: string;
  venue_address: string;
  city: string;
  price_from: number;
  event_dates: string;
  rating_score?: string;
  rating_imdb?: string;
  director?: string;
  trailer_youtube_id?: string;
  rules_notice?: string;
  ticket_tiers?: {
    name: string;
    price: number;
    color: string;
    capacity?: number;
    perks?: string;
    type?: 'seated' | 'standing';
    is_sold_out?: boolean;
  }[];
}

// Giữ tương thích ngược với Movie
export type Movie = EntertainmentEvent & {
  movie_id?: number;
};

export interface Showtime {
  showtime_id: number;
  movie_id: number;
  room_id: number;
  start_time: string;
  end_time: string;
  format_type: string;
  is_weekend_or_holiday: boolean;
  movie?: EntertainmentEvent;
  room?: Room;
}

export interface PricingRule {
  rule_id: number;
  seat_type: SeatType;
  is_weekend: boolean;
  price: number;
}

export interface Promotion {
  promo_id: number;
  code: string;
  title: string;
  description?: string;
  discount_type: 'Percentage' | 'FixedAmount';
  discount_value: number;
  max_discount_amount?: number | null;
  bank_code?: string | null;
  min_order_value: number;
  start_date: string;
  end_date: string;
  usage_limit: number;
  used_count: number;
}

export interface BookingSeatDetail {
  seat_id: string;
  row_name: string;
  seat_number: number;
  seat_type: SeatType;
  price_applied: number;
  zone_name?: string;
}

export interface Booking {
  booking_id: string;
  user_id: string | number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  showtime_id: number;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  promo_id?: number | null;
  promo_code?: string | null;
  payment_method: string;
  payment_status: 'Pending' | 'Paid' | 'Cancelled' | 'Failed';
  qr_code?: string;
  created_at: string;
  seats?: BookingSeatDetail[];
  movie_title?: string;
  room_name?: string;
  start_time?: string;
  venue_name?: string;
}

// Seat View Engine Types
export interface SeatGeometricView {
  seat_id: string;
  coord_x: number;
  coord_y: number;
  coord_z: number;
  screen_width: number;
  distance_to_screen: number; // meters
  horizontal_angle: number;   // degrees (- to left, + to right)
  vertical_angle: number;     // degrees
  distortion_ratio: number;
  rating: {
    score: number;            // 1 to 5
    title: string;
    description: string;
    badge_variant: 'success' | 'warning' | 'info' | 'secondary';
  };
}

// ==========================================
// ADMIN PORTAL TYPES (ĐẠI NHẠC HỘI & RẠP CHIẾU PHIM)
// ==========================================

export interface AdminConcertCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  eventsCount: number;
  iconName?: string;
  status: 'active' | 'inactive';
}

export interface AdminConcertEvent {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  artists: string;
  venueId: string;
  venueName: string;
  isIndoor: boolean;
  eventDates: string;
  timeSlot: string;
  priceFrom: number;
  totalCapacity: number;
  ticketsSold: number;
  status: 'NowShowing' | 'SellingFast' | 'ComingSoon' | 'SoldOut';
  bannerUrl: string;
  posterUrl: string;
}

export interface AdminConcertVenue {
  id: string;
  name: string;
  environment: 'indoor' | 'outdoor';
  address: string;
  district: string;
  city: string;
  capacity: number;
  description: string;
  stageFormat: string;
}

export interface AdminCinemaChain {
  id: string;
  code: string;
  name: string;
  logo: string;
  hotline: string;
  website: string;
  branchesCount: number;
  description: string;
}

export interface AdminCinemaBranch {
  id: string;
  chainId: string;
  chainName: string;
  branchName: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  roomsCount: number;
  status: 'active' | 'renovating';
}

export interface AdminCinemaAddress {
  id: string;
  branchId: string;
  branchName: string;
  chainName: string;
  city: string;
  district: string;
  fullAddress: string;
  hotline: string;
  googleMapQuery: string;
}

export interface AdminCinemaRoom {
  id: string;
  branchId: string;
  branchName: string;
  roomName: string;
  roomType: 'Laser IMAX' | 'Standard 2D' | 'Gold Class VIP' | '4DX Motion' | 'ScreenX 270';
  screenWidth: number;   // meters, e.g. 22m for IMAX
  screenHeight: number;  // meters, e.g. 16m for IMAX
  distanceToRowA: number;// meters, e.g. 5m
  totalRows: number;
  seatsPerRow: number;
  totalSeats: number;
  soundSystem: string;   // e.g. 'Dolby Atmos 64 kênh'
}

export interface AdminCinemaSeatConfig {
  rowName: string;
  seatCount: number;
  seatType: 'standard' | 'vip' | 'sweetbox' | 'disabled';
  price: number;
  hasAisleAfter?: number[]; // e.g. [4, 10]
}

export interface AdminMovieMgmt {
  id: number;
  title: string;
  bannerUrl: string;
  posterUrl: string;
  trailerYoutubeId: string;
  trailerUrl?: string;
  description: string;
  ratingScore: string;
  ratingImdb: string;
  ageRating: string;
  durationMinutes: number;
  director: string;
  cast: string;
  genre: string;
  releaseDate: string;
  status: 'NowShowing' | 'ComingSoon';
}

