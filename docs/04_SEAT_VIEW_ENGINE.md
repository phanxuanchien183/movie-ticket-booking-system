# 📐 CÔNG THỨC HÌNH HỌC & ĐỘNG CƠ MÔ PHỎNG GÓC NHÌN (SEAT VIEW ENGINE)

## 1. Mục Đích & Bối Cảnh Thực Tế
Trong ngành rạp chiếu phim hiện đại (đặc biệt là IMAX, Dolby Cinema), góc nhìn từ vị trí ghế tới màn ảnh đóng vai trò quyết định đến trải nghiệm xem phim của khách hàng.
* Khi chưa có ảnh chụp 360° thực tế cho từng vị trí ghế, **Seat View Engine** sử dụng các thông số đo đạc hình học vật lý của phòng chiếu để **tính toán lượng giác chính xác** và dựng mô phỏng phối cảnh góc nhìn thời gian thực.

---

## 2. Hệ Tọa Độ Phòng Chiếu (3D Hall Coordinate Space)

```
        Mép Trái (X = 0)                     Màn Chiếu (Screen)                    Mép Phải (X = screen_width)
        ┌───────────────────────────────────────────────▲───────────────────────────────────────────────┐
        │                                        Tâm màn hình (W/2, 0)                                  │
        └───────────────────────────────────────────────┬───────────────────────────────────────────────┘
                                                        │
                   ▲                                    │ Y_seat (Khoảng cách phương dọc)
                   │                                    │
                   │                                    ▼
       Hàng A (Y = 4.5m) ─── [ Ghế A01 ] ───────── [ Ghế A06 ] ────────── [ Ghế A12 ]
                   │
       Hàng E (Y = 8.7m) ─── [ Ghế E01 ] ───────── [ Ghế E07 (VÀNG) ] ──── [ Ghế E12 ]
                   │
       Hàng H (Y = 12.0m) ── [ Sweetbox H01 ] ──── [ Sweetbox H03 ] ───── [ Sweetbox H06 ]
```

* **Trục $X$:** Phương ngang của phòng chiếu, giá trị từ $0$ đến $screen\_width$ (VD: 12.0 mét). Tâm màn chiếu nằm tại $X_{center} = \frac{screen\_width}{2} = 6.0\text{m}$.
* **Trục $Y$:** Phương dọc chiều sâu rạp, tính từ mặt phẳng màn chiếu ($Y=0$) đến hàng cuối cùng ($Y=12.0\text{m}$).
* **Trục $Z$:** Chiều cao nâng sàn (Elevations) của từng hàng ghế so với sàn sân khấu (từ $0.0\text{m}$ ở hàng A đến $1.75\text{m}$ ở hàng H).

---

## 3. Công Thức Lượng Giác Tính Toán (Mathematical Formulation)

### A. Khoảng Cách Đến Tâm Màn Hình (Distance to Screen)
Khoảng cách đường thẳng hình học giữa người ngồi tại ghế $(X_{seat}, Y_{seat})$ đến tâm màn hình:

$$\text{Distance} = \sqrt{\left(X_{seat} - \frac{\text{screen\_width}}{2}\right)^2 + Y_{seat}^2}$$

### B. Góc Lệch Phương Ngang (Horizontal Deviation Angle)
Góc lệch giữa trục mắt nhìn vuông góc với tâm màn chiếu:

$$\text{Angle}_{horizontal} = \arctan\left(\frac{X_{seat} - \frac{\text{screen\_width}}{2}}{Y_{seat}}\right) \times \frac{180}{\pi}$$

* $\text{Angle} = 0^\circ$: Ghế nằm chính diện trung tâm rạp (Góc nhìn hoàn hảo).
* $\text{Angle} < 0$: Ghế lệch về cánh bên trái rạp.
* $\text{Angle} > 0$: Ghế lệch về cánh bên phải rạp.

### C. Góc Ngước Màn Hình (Vertical Elevation Angle)
Góc nâng đầu để quan sát tâm màn hình (tâm màn hình cao khoảng $Z_{screen} \approx 4.45\text{m}$):

$$\text{Angle}_{vertical} = \arctan\left(\frac{Z_{screen} - Z_{seat}}{\text{Distance}}\right) \times \frac{180}{\pi}$$

* Hàng ghế quá gần màn hình ($Y < 5\text{m}$) sẽ có góc ngước lớn hơn $25^\circ$, gây mỏi cổ khi xem phim dài.

### D. Hệ Số Bảo Toàn Tỉ Lệ Hình Ảnh (Aspect Distortion Ratio)
Độ méo hình ảnh do hiện tượng góc nghiêng được mô hình hóa qua định luật cosin:

$$\text{Distortion Ratio} = \cos\left(\text{Angle}_{horizontal} \times \frac{\pi}{180}\right)$$

---

## 4. Bảng Đánh Giá Định Tính Vị Trí Ghế

| Độ lệch góc $|\text{Angle}|$ | Điểm số | Phân loại | Nhận xét định tính từ hệ thống |
| :---: | :---: | :--- | :--- |
| $\le 8^\circ$ | **5.0 / 5** | Ghế trung tâm Hoàng Kim | Góc nhìn vuông vức, không bị méo góc, âm thanh vòm cân bằng tuyệt đối. |
| $8^\circ < |\text{Angle}| \le 18^\circ$ | **4.5 / 5** | Góc nhìn chuẩn rạp chiếu | Độ lệch nhẹ không đáng kể, hình ảnh sắc nét, mắt nhìn tự nhiên thoải mái. |
| $18^\circ < |\text{Angle}| \le 28^\circ$ | **3.5 / 5** | Ghế góc cánh bên | Màn hình nhìn hơi nghiêng về cánh, góc bao quát vẫn đảm bảo đầy đủ. |
| $> 28^\circ$ | **3.0 / 5** | Ghế góc rìa biên rạp | Góc nghiêng tương đối lớn, thích hợp cho người xem muốn không gian riêng tư. |

---

## 5. Dựng Hình Phối Cảnh Trên HTML5 Canvas
Modal `SeatViewModal.tsx` lấy kết quả từ `calculateSeatView(...)` để vẽ:
1. **Vanishing Point (Điểm tụ phối cảnh):** Dịch chuyển theo góc $\text{Angle}_{horizontal}$.
2. **Curved Screen Arc:** Màn hình cong IMAX được vẽ bằng đường cong bậc hai `ctx.quadraticCurveTo(...)`, với độ cong tỷ lệ thuận với khoảng cách nhìn.
3. **Ambient Light Glow:** Đổ bóng gradient phản xạ từ màn chiếu lên không gian tối của phòng chiếu.
