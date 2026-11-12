# 📐 CÔNG THỨC HÌNH HỌC & ĐỘNG CƠ MÔ PHỎNG GÓC NHÌN (SEAT VIEW ENGINE)

## 1. Mục Đích & Bối Cảnh Thực Tế
Trong ngành rạp chiếu phim hiện đại (đặc biệt là IMAX, Dolby Cinema, ScreenX), góc nhìn từ vị trí ghế tới màn ảnh đóng vai trò quyết định đến trải nghiệm xem phim của khách hàng.
* Khi chưa có ảnh chụp 360° thực tế cho từng vị trí ghế, **Seat View Engine** sử dụng các thông số đo đạc hình học vật lý của phòng chiếu để **tính toán lượng giác chính xác** và dựng mô phỏng phối cảnh góc nhìn thời gian thực.
* Hệ thống hỗ trợ **Camera Look-Around 360° tương tác chuột (Pan-Tilt)**: người dùng có thể nhấp chuột và kéo rê trực tiếp trên màn chiếu để xoay góc nhìn toàn cảnh khán phòng.

---

## 2. Hệ Tọa Độ Phòng Chiếu (3D Hall Coordinate Space)

```text
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

* **Trục $X$:** Phương ngang của phòng chiếu, giá trị từ $0$ đến $screenWidth$ (VD: 22.0 mét cho Laser IMAX). Tâm màn chiếu nằm tại $X_{\text{center}} = \frac{screenWidth}{2}$.
* **Trục $Y$:** Phương dọc chiều sâu rạp, tính từ mặt phẳng màn chiếu ($Y=0$) đến hàng cuối cùng ($Y=12.0\text{m}$).
* **Trục $Z$:** Chiều cao nâng sàn (Elevations) của từng hàng ghế so với sàn sân khấu (từ $0.0\text{m}$ ở hàng A đến $1.75\text{m}$ ở hàng H).

---

## 3. Công Thức Lượng Giác Tính Toán (Mathematical Formulation)

### A. Khoảng Cách Đến Tâm Màn Hình (Distance to Screen)
Khoảng cách đường thẳng hình học giữa người ngồi tại ghế $(X_{\text{seat}}, Y_{\text{seat}})$ đến tâm màn hình:

$$\text{Distance} = \sqrt{\left(X_{\text{seat}} - \frac{\text{screenWidth}}{2}\right)^2 + Y_{\text{seat}}^2}$$

### B. Góc Lệch Phương Ngang (Horizontal Deviation Angle)
Góc lệch giữa trục mắt nhìn vuông góc với tâm màn chiếu:

$$\text{Angle}_{\text{horizontal}} = \arctan\left(\frac{X_{\text{seat}} - \frac{\text{screenWidth}}{2}}{Y_{\text{seat}}}\right) \times \frac{180}{\pi}$$

* $\text{Angle} = 0^\circ$: Ghế nằm chính diện trung tâm rạp (Góc nhìn hoàn hảo).
* $\text{Angle} < 0$: Ghế lệch về cánh bên trái rạp.
* $\text{Angle} > 0$: Ghế lệch về cánh bên phải rạp.

### C. Góc Ngẩng Cổ Quan Sát (Vertical Neck Elevation Angle)
Góc nâng đầu để quan sát tâm màn hình (tâm màn hình cao khoảng $Z_{\text{screen}} \approx 4.5\text{m}$):

$$\text{Angle}_{\text{vertical}} = \arctan\left(\frac{Z_{\text{screen}} - Z_{\text{seat}}}{\text{Distance}}\right) \times \frac{180}{\pi}$$

* **Khuyến nghị SMPTE & THX:** Góc ngẩng cổ $\text{Angle}_{\text{vertical}} \le 35^\circ$ để tránh mỏi cơ cổ khi xem phim có thời lượng từ 120 đến 180 phút.

---

## 4. Cơ Chế Camera Pan-Tilt Look-Around 360°

Trong component `CinemaSeatViewSimulator.tsx`, hệ thống hiện thực hóa tương tác kéo thả chuột 360°:

1. **Góc Xoay Ngang (Yaw):** Khoảng từ $-180^\circ$ (quay ra sau lưng cánh trái) đến $+180^\circ$ (quay ra sau lưng cánh phải).
   - $0^\circ$: Nhìn thẳng màn hình cong IMAX.
   - $-45^\circ$: Nhìn sang khán giả và vách tiêu âm bên trái.
   - $+45^\circ$: Nhìn sang lối đi và cửa thoát hiểm EXIT bên phải.
2. **Góc Xoay Dọc (Pitch):** Khoảng từ $-40^\circ$ (nhìn sàn và dãy ghế phía trước) đến $+40^\circ$ (ngước lên trần và cụm loa vòm Dolby Atmos).
3. **Mô Phỏng Không Gian Đa Chiều:**
   - **Màn hình cong IMAX:** Render với bán kính cong tỷ lệ nghịch với khoảng cách nhìn $Y_{\text{seat}}$.
   - **Đổ bóng ánh sáng sàn:** Gradient phản chiếu màu ánh sáng từ khung phim xuống thảm nhung của khán phòng.
   - **Hàng ghế phía trước:** Vẽ silhouette bóng lưng tựa đầu của các hàng ghế trước mặt người xem theo chiều cao $Z$.
   - **Đèn trần & loa vòm Dolby:** Di chuyển theo tọa độ biến đổi phối cảnh tương ứng với góc xoay chuột.

---

## 5. Bảng Tiêu Chuẩn Đánh Giá Trải Nghiệm Thị Giác

| Tiêu chí | Ngưỡng đo lường | Phân loại | Nhận xét chuyên môn |
| :---: | :---: | :--- | :--- |
| **Golden Seat** | $|\text{Angle}| \le 8^\circ$ & Hàng D..F | **5.0 / 5** (Xuất sắc) | Vị trí hoàng kim trung tâm rạp, góc nhìn trực diện không méo hình, âm thanh Dolby Atmos cân bằng 2 tai. |
| **Chuẩn THX** | $8^\circ < |\text{Angle}| \le 18^\circ$ | **4.5 / 5** (Tốt) | Tầm nhìn bao quát sắc nét, mắt quan sát thư thái tự nhiên. |
| **Góc Cánh** | $18^\circ < |\text{Angle}| \le 28^\circ$ | **3.8 / 5** (Khá) | Màn hình nhìn hơi chếch, không bị che khuất tầm nhìn. |
| **Cận Màn Hình** | Hàng A / B ($Y < 5\text{m}$) | **3.2 / 5** (Hơi gần) | Góc ngẩng cổ lớn ($> 28^\circ$), khuyến nghị chỉ xem suất chiếu ngắn hoặc 2D. |
| **Ghế Sweetbox** | Hàng H sau cùng | **4.7 / 5** (Riêng tư) | Tầm nhìn bao quát toàn bộ rạp chiếu, vách ngăn đôi riêng tư cao cấp. |
