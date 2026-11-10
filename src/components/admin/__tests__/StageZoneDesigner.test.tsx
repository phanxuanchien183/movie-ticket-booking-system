import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { StageZoneDesigner } from '../StageZoneDesigner';

describe('StageZoneDesigner Component (Admin Concert & Cinema Layout Designer)', () => {
  it('Render giao diện thiết kế sơ đồ khán đài với mẫu mặc định Say Hi Concert', () => {
    render(<StageZoneDesigner />);

    expect(screen.getByText('Trình Thiết Kế Sơ Đồ Khán Đài & Hạng Vé Sự Kiện')).toBeDefined();
    expect(screen.getAllByText(/Tinh Hoa "Say Hi" Concert - Đêm 4/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('STAGE').length).toBeGreaterThan(0);
    expect(screen.getAllByText('SKY LOUNGE').length).toBeGreaterThan(0);
    expect(screen.getAllByText('FANZONE A').length).toBeGreaterThan(0);
  });

  it('Chuyển đổi sang preset phòng chiếu rạp CGV Laser IMAX', () => {
    render(<StageZoneDesigner />);

    const cinemaPresetBtn = screen.getByText('Phòng Chiếu Rạp CGV Laser IMAX Starlight');
    fireEvent.click(cinemaPresetBtn);

    expect(screen.getAllByText('Màn Hình Cong Laser IMAX').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Ghế Tiêu Chuẩn').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Ghế VIP Trung Tâm').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Ghế Đôi Sweetbox').length).toBeGreaterThan(0);
  });

  it('Chọn một phân khu để chỉnh sửa giá vé và tên hạng vé', () => {
    render(<StageZoneDesigner />);

    // Click vào phân khu FANZONE B trong danh sách bên phải
    const fanzoneBItem = screen.getAllByText('FANZONE B')[0];
    fireEvent.click(fanzoneBItem);

    // Form cấu hình hiển thị tên hạng vé
    const nameInput = screen.getByDisplayValue('FANZONE B');
    expect(nameInput).toBeDefined();

    // Chỉnh sửa giá vé
    const priceInput = screen.getByDisplayValue('2500000');
    fireEvent.change(priceInput, { target: { value: '2800000' } });

    // Giá mới phải hiển thị trong bảng giá
    expect(screen.getAllByText('2.800.000 đ').length).toBeGreaterThan(0);
  });

  it('Thêm phân khu mới và gọi onSaveLayout khi click Lưu Sơ Đồ', () => {
    const handleSave = vi.fn();
    render(<StageZoneDesigner onSaveLayout={handleSave} />);

    // Click Thêm Phân Khu
    const addBtn = screen.getByText('Thêm Phân Khu');
    fireEvent.click(addBtn);

    expect(screen.getAllByText(/Hạng Vé Mới/).length).toBeGreaterThan(0);

    // Click Lưu Sơ Đồ
    const saveBtn = screen.getByText('Lưu Sơ Đồ');
    fireEvent.click(saveBtn);

    expect(handleSave).toHaveBeenCalled();
    expect(screen.getByText(/Đã lưu thiết lập sơ đồ và bảng giá vé/)).toBeDefined();
  });
});
