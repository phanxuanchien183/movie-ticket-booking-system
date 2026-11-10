# 💳 LOGIC KHUYẾN MÃI & RÀNG BUỘC THANH TOÁN NGÂN HÀNG (BANK BINDING RULES)

## 1. Giới Thiệu Tính Năng
Trong các chiến dịch hợp tác thương mại giữa hệ thống rạp chiếu và các tổ chức tài chính/ngân hàng (VD: Ngân hàng ACB, Vietcombank...), ngân hàng tài trợ ngân sách giảm giá với điều kiện tiên quyết: **Khách hàng bắt buộc phải dùng thẻ hoặc cổng thanh toán của chính ngân hàng đó để thanh toán.**

Hệ thống **CineTicket Pro** thực thi chính sách **Ràng Buộc Ngân Hàng Tuyệt Đối (Strict Bank Binding)** nhằm ngăn chặn triệt để hành vi gian lận voucher.

---

## 2. Quy Trình Kiểm Duyệt Mã Ưu Đãi (Promotion Validation Flow)

```mermaid
flowchart TD
    A[User nhập mã giảm giá & chọn phương thức thanh toán] --> B{Mã tồn tại trong DB?}
    B -- Không --> E1[Lỗi: PROMO_NOT_FOUND]
    B -- Có --> C{Trong thời gian hiệu lực & còn lượt dùng?}
    C -- Không --> E2[Lỗi: PROMO_EXPIRED / USAGE_LIMIT_EXCEEDED]
    C -- Có --> D{Tổng tiền >= min_order_value?}
    D -- Không --> E3[Lỗi: MIN_ORDER_NOT_MET]
    D -- Có --> F{promotions.bank_code có giá trị?}
    
    F -- Không (Mã đại trà) --> G[Tính toán số tiền giảm]
    F -- Có (Mã ngân hàng) --> H{payment_method chứa bank_code?}
    
    H -- Không trùng khớp --> E4[TỪ CHỐI NGAY LẬP TỨC: INVALID_BANK_PAYMENT_METHOD]
    H -- Trùng khớp --> G
    
    G --> I{discount_type?}
    I -- Percentage --> J[discount = total * value%]
    J --> K{discount > max_discount_amount?}
    K -- Có --> L[Chặn trần: discount = max_discount_amount]
    K -- Không --> M[Áp dụng discount]
    I -- FixedAmount --> N[discount = min(discount_value, total)]
    
    L --> O[final_amount = total - discount]
    M --> O
    N --> O
    O --> P[Thành công: Trả về kết quả xác thực]
```

---

## 3. Mã Lỗi Chuẩn & Xử Lý Chi Tiết

| Mã lỗi (`errorCode`) | Điều kiện kích hoạt | Thông báo hiển thị cho người dùng |
| :--- | :--- | :--- |
| `PROMO_NOT_FOUND` | Mã không tìm thấy trong database | *Mã giảm giá "XYZ" không tồn tại trong hệ thống.* |
| `PROMO_NOT_STARTED` | `now() < start_date` | *Chương trình khuyến mãi chưa bắt đầu.* |
| `PROMO_EXPIRED` | `now() > end_date` | *Mã giảm giá đã hết hạn sử dụng.* |
| `USAGE_LIMIT_EXCEEDED`| `used_count >= usage_limit` | *Mã giảm giá đã hết số lượt sử dụng tối đa.* |
| `MIN_ORDER_NOT_MET` | `total_amount < min_order_value` | *Đơn hàng tối thiểu để áp dụng mã là 150.000 VNĐ.* |
| `INVALID_BANK_PAYMENT_METHOD` | Phương thức thanh toán không chứa mã ngân hàng yêu cầu | *Mã "ACB50" chỉ áp dụng cho hình thức thanh toán qua ngân hàng ACB (VD: ACB_CREDIT, ACB_QR). Phương thức hiện tại không hợp lệ.* |

---

## 4. Dữ Liệu Khuyến Mãi Mẫu Điển Hình
1. **Mã `ACB50`:**
   * Giảm giá: **50%**
   * Giảm tối đa: **100.000 VNĐ**
   * Ràng buộc: `bank_code = 'ACB'`
   * Chấp nhận các phương thức thanh toán: `ACB_CREDIT`, `ACB_QR`.
   * Từ chối mọi phương thức khác: `MOMO_WALLET`, `VCB_DIGIBANK`, `VNPAY_QR`.

2. **Mã `VCB30K`:**
   * Giảm giá: Cố định **30.000 VNĐ** cho đơn từ 180.000 VNĐ.
   * Ràng buộc: `bank_code = 'VCB'`
   * Chấp nhận: `VCB_DIGIBANK`.

3. **Mã `CINEMA20`:**
   * Giảm giá: **20%** tối đa 50.000 VNĐ cho đơn từ 100.000 VNĐ.
   * Ràng buộc: `bank_code = NULL` (Áp dụng cho tất cả ngân hàng và ví điện tử).

