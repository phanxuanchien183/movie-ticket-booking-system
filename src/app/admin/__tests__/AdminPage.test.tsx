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

    // Menu bên trái
    expect(screen.getByText('Menu Điều Hành')).toBeDefined();
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
});

