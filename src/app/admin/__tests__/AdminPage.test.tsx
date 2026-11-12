import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import AdminDashboard from '../page';

describe('AdminDashboard Route Component (/admin)', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('Yêu cầu đăng nhập khi chưa có session xác thực', () => {
    render(<AdminDashboard />);

    expect(screen.getByText('CINETICKET ADMIN PORTAL')).toBeDefined();
    expect(screen.getByText('Cổng Quản Trị Hệ Thống Đặt Vé Phim & Sơ Đồ Concert')).toBeDefined();
    expect(screen.getByText('Đăng Nhập Quản Trị Hệ Thống »')).toBeDefined();
  });

  it('Đăng nhập thành công hiển thị bố cục Header, Menu bên trái và Content ở giữa', () => {
    render(<AdminDashboard />);

    // Click nút đăng nhập
    const submitBtn = screen.getByText('Đăng Nhập Quản Trị Hệ Thống »');
    fireEvent.click(submitBtn);

    // Header chứa logo và user name
    expect(screen.getByText('Quản trị viên Hệ thống')).toBeDefined();
    expect(screen.getByText('admin@cineticket.vn')).toBeDefined();
    expect(screen.getByText('Đăng xuất')).toBeDefined();

    // Menu bên trái có phân cấp A. Đại Nhạc Hội và B. Rạp Chiếu Phim
    expect(screen.getByText('Menu Điều Hành')).toBeDefined();
    expect(screen.getByText('A. Đại Nhạc Hội')).toBeDefined();
    expect(screen.getByText('B. Rạp Chiếu Phim')).toBeDefined();
    expect(screen.getByText('Tổng Quan Hệ Thống')).toBeDefined();
    expect(screen.getByText('Thiết Kế Sơ Đồ & Hạng Vé')).toBeDefined();
    expect(screen.getByText('Giám Sát Khóa Ghế Redis')).toBeDefined();

    // Content ở giữa
    expect(screen.getByText('Tổng Doanh Thu')).toBeDefined();
    expect(screen.getByText('Giao Dịch Đặt Vé Gần Đây')).toBeDefined();
  });

  it('Chuyển sang tab Thiết Kế Sơ Đồ hiển thị 2 mục con (Concert và Rạp phim)', () => {
    render(<AdminDashboard />);

    // Đăng nhập
    const submitBtn = screen.getByText('Đăng Nhập Quản Trị Hệ Thống »');
    fireEvent.click(submitBtn);

    // Click menu Thiết Kế Sơ Đồ
    const designerMenu = screen.getByText('Thiết Kế Sơ Đồ & Hạng Vé');
    fireEvent.click(designerMenu);

    // Kiểm tra 2 mục con theo Requirement 8
    expect(
      screen.getByText('MỤC 1: SƠ ĐỒ CONCERT, FAN MEETING & NHÀ THI ĐẤU')
    ).toBeDefined();
    expect(
      screen.getByText('MỤC 2: SƠ ĐỒ PHÒNG CHIẾU PHIM (CỤM RẠP CGV, LOTTE, BHD)')
    ).toBeDefined();
  });

  it('Kiểm tra nhóm chức năng A: Đại Nhạc Hội (Danh mục, Sự kiện, Trong/ngoài trời, Sơ đồ Konva)', () => {
    render(<AdminDashboard />);

    const submitBtn = screen.getByText('Đăng Nhập Quản Trị Hệ Thống »');
    fireEvent.click(submitBtn);

    // A.1: Danh mục sự kiện
    fireEvent.click(screen.getByText('1. Danh Mục Sự Kiện'));
    expect(screen.getByText('A.1 ĐẠI NHẠC HỘI')).toBeDefined();
    expect(screen.getByText('Live Concert & Tour Âm Nhạc')).toBeDefined();

    // A.2: Quản lý sự kiện
    fireEvent.click(screen.getByText('2. Quản Lý Sự Kiện'));
    expect(screen.getByText('A.2 ĐẠI NHẠC HỘI')).toBeDefined();
    expect(screen.getByText(/Tinh Hoa "Say Hi" Concert - Đêm 4/)).toBeDefined();

    // A.3: Ngoài trời hoặc trong nhà
    fireEvent.click(screen.getByText('3. Trong Nhà & Ngoài Trời'));
    expect(screen.getByText('A.3 ĐẠI NHẠC HỘI')).toBeDefined();
    expect(screen.getAllByText(/TRONG NHÀ \(INDOOR\)/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/NGOÀI TRỜI \(OUTDOOR\)/).length).toBeGreaterThan(0);

    // A.4: Thiết kế sơ đồ sân khấu (Konva Canvas)
    fireEvent.click(screen.getByText('4. Thiết Kế Sơ Đồ (Konva)'));
    expect(screen.getByText('A.4 THIẾT KẾ SƠ ĐỒ SÂN KHẤU (CANVAS ĐA TẦNG KONVA.JS)')).toBeDefined();
    expect(screen.getByText('Sơ Đồ Canvas Konva Tương Tác')).toBeDefined();
  });

  it('Kiểm tra nhóm chức năng B: Rạp Chiếu Phim (Chuỗi rạp, Chi nhánh, Địa chỉ, Phòng rạp, Thiết kế ghế, Seat View 360°, Phim)', () => {
    render(<AdminDashboard />);

    const submitBtn = screen.getByText('Đăng Nhập Quản Trị Hệ Thống »');
    fireEvent.click(submitBtn);

    // B.1: Chuỗi rạp
    fireEvent.click(screen.getByText('1. Chuỗi Rạp Chiếu'));
    expect(screen.getByText('B.1 RẠP CHIẾU PHIM')).toBeDefined();
    expect(screen.getByText('CGV Cinemas Việt Nam')).toBeDefined();
    expect(screen.getByText('Lotte Cinema Việt Nam')).toBeDefined();

    // B.2: Chi nhánh rạp
    fireEvent.click(screen.getByText('2. Chi Nhánh Rạp'));
    expect(screen.getByText('B.2 RẠP CHIẾU PHIM')).toBeDefined();
    expect(screen.getByText('CGV Vincom Landmark 81')).toBeDefined();

    // B.3: Địa chỉ rạp
    fireEvent.click(screen.getByText('3. Địa Chỉ Rạp'));
    expect(screen.getByText('B.3 RẠP CHIẾU PHIM')).toBeDefined();
    expect(screen.getByText('Tầng B1, TTTM Vincom Center Landmark 81, 720A Điện Biên Phủ, Phường 22')).toBeDefined();

    // B.4: Quản lý phòng rạp
    fireEvent.click(screen.getByText('4. Quản Lý Phòng Rạp'));
    expect(screen.getByText('B.4 RẠP CHIẾU PHIM')).toBeDefined();
    expect(screen.getByText('Phòng 01 - Laser IMAX Starlight')).toBeDefined();

    // B.5: Thiết kế sơ đồ ghế phòng
    fireEvent.click(screen.getByText('5. Thiết Kế Ghế Phòng'));
    expect(screen.getByText('B.5 RẠP CHIẾU PHIM')).toBeDefined();
    expect(screen.getByText('Màn Hình Phòng Chiếu Laser')).toBeDefined();

    // B.6: Góc Seat View 360° xoay chuột
    fireEvent.click(screen.getByText('6. Góc Seat View 360°'));
    expect(screen.getByText('B.6 GÓC SEAT VIEW KHI CHỌN GHẾ (THAO TÁC CHUỘT NHÌN XUNG QUANH 360°)')).toBeDefined();
    expect(screen.getByText('Mô Phỏng Trực Quan Góc Nhìn Thực Tế Từ Vị Trí Ghế Ngồi')).toBeDefined();
    expect(screen.getByText('Khoảng Cách Màn Hình')).toBeDefined();

    // B.7: Quản lý phim
    fireEvent.click(screen.getByText('7. Quản Lý Phim'));
    expect(screen.getByText('B.7 RẠP CHIẾU PHIM')).toBeDefined();
    expect(screen.getByText('Dune: Hành Tinh Cát - Phần Hai')).toBeDefined();
    expect(screen.getByText('Oppenheimer')).toBeDefined();
  });
});
