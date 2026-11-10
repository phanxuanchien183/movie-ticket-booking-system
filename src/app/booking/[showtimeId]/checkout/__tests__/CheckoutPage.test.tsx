import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import CheckoutPage from '../page';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useParams: () => ({ showtimeId: '101' }),
  useSearchParams: () => ({
    get: (key: string) => {
      if (key === 'zone') return 'CAT_2B';
      if (key === 'qty') return '1';
      return null;
    },
  }),
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
  }),
}));

describe('CheckoutPage Component (Hình 5 - Ticketbox Bảng Câu Hỏi & Thanh Toán)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock global fetch for showtime 101
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/showtimes/101')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              success: true,
              data: {
                showtime_id: 101,
                movie_id: 101,
                room_id: 12,
                start_time: '2026-11-15T19:00:00',
                end_time: '2026-11-15T23:00:00',
                format_type: 'Mega Arena VEC',
                movie: {
                  event_id: 101,
                  title: 'Tinh Hà "Say Hi" Concert - Đêm 4',
                  category: 'concert',
                  category_label: 'Live Concert',
                  venue_name: 'Trung tâm triển lãm Việt Nam (VEC)',
                  venue_address: 'Cổ Loa, Đông Anh, Hà Nội',
                  event_dates: '19:00 - 23:00, 15 Tháng 11, 2026',
                },
              },
            }),
        });
      }
      return Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      });
    });
  });

  it('Render BẢNG CÂU HỎI, đồng hồ đếm ngược 14:50 và tóm tắt thông tin đặt vé', async () => {
    render(<CheckoutPage />);

    // Wait for showtime data to load
    await waitFor(() => {
      expect(screen.getByText('BẢNG CÂU HỎI')).toBeDefined();
    });

    // Check header information
    expect(screen.getAllByText('Tinh Hà "Say Hi" Concert - Đêm 4').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Trung tâm triển lãm Việt Nam \(VEC\)/i).length).toBeGreaterThan(0);

    // Check timer card
    expect(screen.getByText('Hoàn tất đặt vé trong')).toBeDefined();

    // Check mandatory questionnaire questions
    expect(
      screen.getByText(/Bạn đã đọc và hoàn toàn đồng ý "Điều khoản và điều kiện"/i)
    ).toBeDefined();
    expect(
      screen.getByText(/Cho phép Ticketbox, Vie Channel, VieSHOP, VieON sử dụng thông tin/i)
    ).toBeDefined();
    expect(screen.getByText(/Chính sách xuất hóa đơn VAT của Ban Tổ Chức/i)).toBeDefined();

    // Check right sidebar ticket summary (Hình 5)
    expect(screen.getByText('Thông tin đặt vé')).toBeDefined();
    expect(screen.getByText('Chọn lại vé')).toBeDefined();
    expect(screen.getByText('Loại vé')).toBeDefined();
    expect(screen.getByText('Số lượng')).toBeDefined();
    expect(screen.getAllByText('CAT 2B').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1.800.000 đ').length).toBeGreaterThan(0);

    // Check submit CTA button
    const submitBtn = screen.getByText('Tiếp tục »');
    expect(submitBtn).toBeDefined();
  });

  it('Áp dụng mã giảm giá ACB50 thành công', async () => {
    render(<CheckoutPage />);

    await waitFor(() => {
      expect(screen.getByText('BẢNG CÂU HỎI')).toBeDefined();
    });

    const promoInput = screen.getByPlaceholderText('Mã ưu đãi (ACB50)');
    fireEvent.change(promoInput, { target: { value: 'ACB50' } });

    const applyBtn = screen.getByText('Áp dụng');
    fireEvent.click(applyBtn);

    expect(screen.getByText(/Áp dụng thành công ưu đãi Thẻ ACB/i)).toBeDefined();
    expect(screen.getByText('Ưu đãi Thẻ ACB:')).toBeDefined();
  });
});
