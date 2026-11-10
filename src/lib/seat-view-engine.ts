import { SeatGeometricView } from '@/types';

/**
 * Seat View Engine: Tính toán tọa độ không gian và mô phỏng góc nhìn ghế chiếu
 * 
 * Công thức:
 * - Khoảng cách đến tâm màn hình:
 *     Distance = sqrt((X_seat - screen_width / 2)^2 + Y_seat^2)
 * - Góc lệch phương ngang:
 *     Angle = arctan((X_seat - screen_width / 2) / Y_seat) * (180 / PI)
 */
export function calculateSeatView(
  seatId: string,
  coordX: number,
  coordY: number,
  coordZ: number,
  screenWidth: number = 12.0,
  screenHeight: number = 6.5
): SeatGeometricView {
  const screenCenterX = screenWidth / 2;
  const deltaX = coordX - screenCenterX;
  const deltaY = Math.max(coordY, 1.0); // tránh chia cho 0

  // Khoảng cách theo mặt phẳng sàn
  const distanceHorizontal = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  // Góc lệch phương ngang (độ): âm là bên trái màn hình, dương là bên phải
  const horizontalAngle = (Math.atan(deltaX / deltaY) * 180) / Math.PI;

  // Tính góc nhìn ngước lên màn hình (Screen center elevation ~ 3.5m)
  const screenCenterZ = screenHeight / 2 + 1.2;
  const deltaZ = screenCenterZ - coordZ;
  const verticalAngle = (Math.atan(deltaZ / distanceHorizontal) * 180) / Math.PI;

  // Tỉ lệ biến dạng phối cảnh do góc lệch
  const distortionRatio = Math.cos((horizontalAngle * Math.PI) / 180);

  // Đánh giá định tính chất lượng góc nhìn
  const absAngle = Math.abs(horizontalAngle);
  let score = 5;
  let title = 'Góc nhìn chính diện đỉnh cao';
  let description = 'Tầm nhìn bao quát toàn bộ khung hình, âm thanh vòm cân đối hoàn hảo, trải nghiệm xem phim lý tưởng nhất.';
  let badge_variant: 'success' | 'warning' | 'info' | 'secondary' = 'success';

  if (absAngle <= 8) {
    score = 5;
    title = 'Ghế trung tâm Hoàng Kim';
    description = `Góc lệch chỉ ${absAngle.toFixed(1)}°, hình ảnh vuông vắn, không bị méo góc, mắt nhìn tự nhiên không mỏi.`;
    badge_variant = 'success';
  } else if (absAngle <= 18) {
    score = 4.5;
    title = 'Góc nhìn chuẩn tiêu chuẩn rạp';
    description = `Góc lệch nhẹ ${absAngle.toFixed(1)}° (${horizontalAngle > 0 ? 'lệch phải' : 'lệch trái'}), trải nghiệm thị giác sắc nét và thoải mái.`;
    badge_variant = 'info';
  } else if (absAngle <= 28) {
    score = 3.5;
    title = 'Góc nhìn cánh bên';
    description = `Góc lệch ${absAngle.toFixed(1)}° về phía ${horizontalAngle > 0 ? 'phải' : 'trái'}. Màn hình nhìn hơi nghiêng nhưng vẫn đảm bảo toàn bộ chi tiết.`;
    badge_variant = 'warning';
  } else {
    score = 3.0;
    title = 'Ghế rìa biên rạp';
    description = `Góc nghiêng ${absAngle.toFixed(1)}°. Khuyến nghị cho người xem muốn sự riêng tư hoặc đi nhóm đông.`;
    badge_variant = 'secondary';
  }

  // Cảnh báo nếu quá gần màn hình (Hàng A, Y < 5m)
  if (coordY <= 4.8) {
    description += ' (Lưu ý: Hàng ghế gần màn hình, góc ngước cổ hơi cao)';
  }

  return {
    seat_id: seatId,
    coord_x: coordX,
    coord_y: coordY,
    coord_z: coordZ,
    screen_width: screenWidth,
    distance_to_screen: Math.round(distanceHorizontal * 100) / 100,
    horizontal_angle: Math.round(horizontalAngle * 10) / 10,
    vertical_angle: Math.round(verticalAngle * 10) / 10,
    distortion_ratio: Math.round(distortionRatio * 100) / 100,
    rating: {
      score,
      title,
      description,
      badge_variant,
    },
  };
}
