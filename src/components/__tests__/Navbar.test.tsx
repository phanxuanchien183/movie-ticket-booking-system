import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Navbar } from '../Navbar';

describe('Navbar Component (Commercial Navigation Menu)', () => {
  it('Render logo thương hiệu, hotline và các danh mục menu chính', () => {
    render(<Navbar />);

    expect(screen.getAllByText(/Cine/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Box/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('1900 6408').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Phim Chiếu Rạp').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Live Concert & Nhạc Hội').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Fan Meeting & Sự Kiện').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Cụm Rạp & Địa Điểm').length).toBeGreaterThan(0);
  });

  it('Click vào menu danh mục gọi callback onCategorySelect', () => {
    const handleCategorySelect = vi.fn();
    render(<Navbar onCategorySelect={handleCategorySelect} />);

    const concertMenu = screen.getByText('Live Concert & Nhạc Hội');
    fireEvent.click(concertMenu);

    expect(handleCategorySelect).toHaveBeenCalledWith('concert');
  });

  it('Bấm nút toggle mở mobile menu drawer', () => {
    render(<Navbar />);

    const toggleBtn = screen.getByLabelText('Toggle Navigation Menu');
    expect(toggleBtn).toBeDefined();

    // Mở mobile menu
    fireEvent.click(toggleBtn);
    expect(screen.getByText('Danh Mục Đặt Vé')).toBeDefined();
    expect(screen.getByText('Truy Cập Trang Quản Trị / Thiết Kế Sơ Đồ')).toBeDefined();
  });
});
