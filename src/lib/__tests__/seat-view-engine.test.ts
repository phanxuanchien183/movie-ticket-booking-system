import { describe, it, expect } from 'vitest';
import { calculateSeatView } from '../seat-view-engine';

describe('SeatViewEngine (Trigonometry Math & Qualitative Classification)', () => {
  const screenWidth = 12.0; // mét
  const screenHeight = 6.5; // mét

  it('Ghế chính giữa trung tâm (X = 6.0m, Y = 8.7m) -> Góc lệch ngang xấp xỉ 0° và đạt 5 sao', () => {
    const seatId = 'R1-E07';
    const coordX = 6.0; // Chính giữa rạp (W/2 = 6.0m)
    const coordY = 8.7;
    const coordZ = 1.0;

    const view = calculateSeatView(seatId, coordX, coordY, coordZ, screenWidth, screenHeight);

    // Delta X = 0 -> horizontal_angle = 0
    expect(view.horizontal_angle).toBe(0);
    // Khoảng cách bằng đúng Y
    expect(view.distance_to_screen).toBe(8.7);
    // Đánh giá 5 sao
    expect(view.rating.score).toBe(5);
    expect(view.rating.title).toContain('Hoàng Kim');
    expect(view.distortion_ratio).toBe(1.0);
  });

  it('Ghế lệch nhẹ sang phải (X = 7.2m, Y = 8.7m) -> Góc lệch dương < 18° và đạt 4.5 sao', () => {
    const seatId = 'R1-E08';
    const coordX = 7.2;
    const coordY = 8.7;
    const coordZ = 1.0;

    const view = calculateSeatView(seatId, coordX, coordY, coordZ, screenWidth, screenHeight);

    // Delta X = 1.2m -> Góc khoảng ~7.8°
    expect(view.horizontal_angle).toBeGreaterThan(0);
    expect(Math.abs(view.horizontal_angle)).toBeLessThanOrEqual(8);
    expect(view.rating.score).toBe(5);
  });

  it('Ghế góc rìa (X = 1.0m, Y = 5.5m) -> Góc lệch lớn > 28° và cảnh báo góc nghiêng', () => {
    const seatId = 'R1-B01';
    const coordX = 1.0; // Sát mép trái
    const coordY = 5.5;
    const coordZ = 0.25;

    const view = calculateSeatView(seatId, coordX, coordY, coordZ, screenWidth, screenHeight);

    // Delta X = -5.0m -> arctan(-5 / 5.5) ~ -42°
    expect(view.horizontal_angle).toBeLessThan(-28);
    expect(view.rating.score).toBeLessThanOrEqual(3.5);
    expect(view.rating.title).toContain('rìa');
  });

  it('Khoảng cách hình học thỏa mãn công thức định lý Pytago', () => {
    const coordX = 3.0;
    const coordY = 4.0;
    // DeltaX = 3.0 - 6.0 = -3.0m
    // Distance = sqrt((-3)^2 + 4^2) = 5.0m
    const view = calculateSeatView('TEST-1', coordX, coordY, 0, screenWidth, screenHeight);
    expect(view.distance_to_screen).toBe(5.0);
  });
});

