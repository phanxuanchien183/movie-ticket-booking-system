// Types định nghĩa cho toàn bộ hệ thống đặt vé

export type SeatType = 'Standard' | 'VIP' | 'Sweetbox';

export type SeatStatus = 'available' | 'locked' | 'booked';

export interface Room {
  room_id: number;
  room_name: string;
  total_rows: number;
  seats_per_row: number;
  screen_width: number;
  screen_height: number;
  distance_to_row_a: number;
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
}

export interface Movie {
  movie_id: number;
  title: string;
  duration_minutes: number;
  poster_url: string;
  backdrop_url?: string;
  trailer_url?: string;
  genre?: string;
  age_rating?: string;
  description?: string;
  status: 'NowShowing' | 'ComingSoon' | 'Ended';
}

export interface Showtime {
  showtime_id: number;
  movie_id: number;
  room_id: number;
  start_time: string;
  end_time: string;
  format_type: string;
  is_weekend_or_holiday: boolean;
  movie?: Movie;
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
