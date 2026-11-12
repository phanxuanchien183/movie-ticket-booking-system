# 🛠️ CỔNG QUẢN TRỊ HỆ THỐNG (ADMIN PORTAL SPECIFICATION)

## 1. Tổng Quan & Cơ Chế Xác Thực
Cổng Quản Trị Hệ Thống (`/admin`) được thiết kế nhằm đáp ứng quy trình vận hành thương mại kép cho **Đại Nhạc Hội** và **Rạp Chiếu Phim**.

* **Xác Thực Đăng Nhập:** Bắt buộc đăng nhập quản trị viên trước khi vào màn hình điều khiển.
  * Tài khoản mặc định: `admin`
  * Mật khẩu mặc định: `admin123`
  * Session lưu trữ an toàn trong `sessionStorage` (`cineticket_admin_auth = 'true'`).
* **Bố Cục 3 Phần Chuẩn Admin:**
  1. **Header:** Logo thương hiệu CineTicket Admin, hiển thị tình trạng kết nối Redis 6379 & MySQL 8.0, avatar và tên quản trị viên (`admin@cineticket.vn`), nút Đăng xuất.
  2. **Cột Trái (Sidebar Navigation):** Phân chia rõ ràng thành 3 phân nhóm chức năng chính (A. Đại Nhạc Hội, B. Rạp Chiếu Phim, C. Vận Hành Hệ Thống).
  3. **Vùng Giữa (Content Workspace):** Khu vực tương tác động theo từng module được chọn.

---

## 2. Phân Hệ A: ĐẠI NHẠC HỘI (Concerts & Live Events)

### A.1 Quản Lý Danh Mục Sự Kiện (`ConcertCategoriesManager`)
* **Chức Năng:** Phân loại các hình thức biểu diễn nghệ thuật.
* **Các Danh Mục Mặc Định:**
  1. *Live Concert & Tour Âm Nhạc* (`/live-concert`)
  2. *Fan Meeting & Giao Lưu Nghệ Sĩ* (`/fan-meeting`)
  3. *Lễ Hội Âm Nhạc & EDM Festival* (`/edm-festival`)
  4. *Nhạc Kịch & Giao Hưởng Thính Phòng* (`/musical-theatre`)
  5. *Hội Thảo & Talkshow Nghệ Thuật* (`/talkshow-conference`)
* **Thao Tác Quản Trị:** Thêm danh mục mới, tự động tạo slug URL, theo dõi số lượng sự kiện thuộc danh mục, xóa danh mục.

### A.2 Quản Lý Sự Kiện (`ConcertEventsManager`)
* **Chức Năng:** Quản lý toàn bộ thông tin các đêm diễn và chương trình âm nhạc lớn.
* **Thông Tin Quản Trị:**
  * Tên sự kiện (VD: *Tinh Hoa "Say Hi" Concert - Đêm 4*, *K-Pop World Tour Arena 2026*...).
  * Dàn nghệ sĩ tham gia.
  * Ngày giờ diễn ra (VD: `15/11/2026`, `19:00 - 23:00`).
  * Trạng thái bán vé (*Đang mở bán*, *Bán nhanh*, *Hết vé*).
  * Đơn giá vé khởi điểm từ.
  * Thước đo tiến độ: Số vé đã bán / Tổng sức chứa khán giả (chỗ).
  * Ảnh banner ngang 16:9 và poster dọc.

### A.3 Phân Loại Địa Điểm Trong Nhà & Ngoài Trời (`ConcertVenuesManager`)
* **Chức Năng:** Quản lý hồ sơ các sân vận động, nhà thi đấu, trung tâm hội nghị.
* **Phân Loại Môi Trường:**
  * **Trong Nhà (Indoor):** Trung tâm Triển lãm Quốc Gia VEC (15.000 chỗ), Nhà thi đấu Phú Thọ (8.000 chỗ), Trung tâm Hội nghị Quốc gia NCC (3.800 chỗ).
  * **Ngoài Trời (Outdoor):** SVĐ Quốc gia Mỹ Đình (45.000 chỗ), SVĐ Quân Khu 7 (25.000 chỗ).
* **Thông Tin Địa Điểm:** Tên địa điểm, địa chỉ chi tiết theo Tỉnh/TP, Quận/Huyện, sức chứa tối đa, định dạng sân khấu khả dụng (T-Stage, Arena 360°, End-Stage).

### A.4 Thiết Kế Sơ Đồ Sân Khấu Konva.js Canvas (`KonvaCanvasStageDesigner`)
* **Kiến Trúc Đa Tầng Canvas (`konvajs-content`):**
  * **Layer 1 (Background Canvas):** Vẽ sàn nhà thi đấu tối màu, lưới tọa độ $25\text{px} \times 25\text{px}$, đường viền khán phòng và nhãn định hướng North Stage.
  * **Layer 2 (Stage & Zones Canvas):** Vẽ kết cấu Sân khấu chính (Stage), T-Stage Runway, Catwalk, và các khối phân khu vé (Sky Lounge, SVIP A/B, VIP A/B, Fanzone A/B, CAT 1/2/3, GA 1/2, FOH).
  * **Layer 3 (Interactive Events Canvas):** Bắt các sự kiện chuột `onMouseDown`, `onMouseMove`, `onMouseUp` để kéo thả trực tiếp phân khu trên sàn diễn, hiển thị 4 điểm neo điều khiển và tooltip kích thước/tọa độ.
* **Bảng Thuộc Tính Phân Khu:**
  * Tên phân khu, giá vé (VNĐ), sức chứa khán giả.
  * Phân loại vé: **Ghế Ngồi (Seated)** hoặc **Vé Đứng (Standing / Fanzone)**.
  * Bảng màu trực quan (Palette 15 mã màu).
  * Quà tặng & đặc quyền đính kèm (Soundcheck, Photocard, Lối vào ưu tiên).

---

## 3. Phân Hệ B: RẠP CHIẾU PHIM (Cinemas & Movie Theaters)

### B.1 Quản Lý Chuỗi Chiếu Phim (`CinemaChainsManager`)
* Quản trị các thương hiệu cụm rạp đối tác: CGV Cinemas, Lotte Cinema, BHD Star Cineplex, Galaxy Cinema, Beta Cinemas.
* Quản lý mã chuỗi (CGV, LOTTE...), logo, hotline hỗ trợ, liên kết website chính thức, số lượng chi nhánh trên toàn quốc.

### B.2 Quản Lý Chi Nhánh Rạp (`CinemaBranchesManager`)
* Quản trị chi nhánh cụ thể theo chuỗi: CGV Vincom Landmark 81, CGV Vạn Hạnh Mall, Lotte Nowzone, BHD Bitexco, Galaxy Nguyễn Du.
* Quản lý khu vực Tỉnh/Thành phố, số lượng phòng chiếu của chi nhánh, trạng thái hoạt động.

### B.3 Quản Lý Địa Chỉ Rạp (`CinemaAddressesManager`)
* Cấu hình chi tiết vị trí địa lý: Tỉnh/Thành phố, Quận/Huyện, địa chỉ số nhà và tên đường.
* Tích hợp liên kết mở bản đồ vệ tinh Google Maps và hotline từng rạp.

### B.4 Quản Lý Phòng Rạp (`CinemaRoomsManager`)
* Định dạng phòng chiếu: **Laser IMAX**, **Gold Class VIP**, **4DX Motion**, **ScreenX 270°**.
* Thông số kỹ thuật phòng: Kích thước màn hình rộng $\times$ cao ($22\text{m} \times 16\text{m}$ cho IMAX), khoảng cách từ hàng A đến màn chiếu ($4.5\text{m} - 5.0\text{m}$), hệ thống âm thanh (Dolby Atmos 64 kênh độc lập).

### B.5 Thiết Kế Sơ Đồ Ghế Phòng Rạp (`CinemaSeatDesigner`)
* Cấu hình ma trận hàng ghế A..H.
* Phân bổ loại ghế: Ghế Tiêu Chuẩn (Standard), Ghế VIP trung tâm, Ghế Đôi Sweetbox (hàng sau cùng).
* Thiết lập số lượng ghế mỗi hàng, lối đi (Aisle) và bảng giá vé theo từng hàng.

### B.6 Góc Seat View Khi Chọn Ghế 360° (`CinemaSeatViewSimulator`)
* **Camera Look-Around 360° Tương Tác Chuột:**
  * Admin nhấp chọn ghế bất kỳ trên sơ đồ phòng rạp (ví dụ: `R1-E07 VIP`, `R1-H01 Sweetbox`).
  * Nhấn giữ chuột và kéo rê trực tiếp trên khung chiếu để xoay 360°:
    * Góc ngang (Yaw): Xoay trái/phải nhìn màn hình cong Laser IMAX, cửa thoát hiểm EXIT và vách tiêu âm.
    * Góc dọc (Pitch): Ngước nhìn trần nhà và hệ thống loa vòm Dolby Atmos, hoặc nhìn xuống sàn rạp và các hàng ghế phía trước.
  * Các nút quay nhanh: *Chính diện 0°*, *Khán giả trái -45°*, *Khán giả phải +45°*, *Loa trần Dolby +28°*.
  * **Chỉ số quang học chuẩn SMPTE/THX:** Khoảng cách tới màn hình (m), góc ngẩng cổ, góc lệch tâm ngang và đánh giá trải nghiệm thị giác.

### B.7 Quản Lý Phim (`MoviesManager`)
* Quản lý danh sách phim đang chiếu và sắp chiếu (*Dune: Phần Hai*, *Oppenheimer*, *Mai*...).
* Quản lý banner ngang 16:9, poster dọc, liên kết trailer YouTube, mô tả tóm tắt, đánh giá khán giả/IMDb, đạo diễn, diễn viên, thời lượng, nhãn giới hạn độ tuổi (P, T16, T18).

---

## 4. Phân Hệ C: VẬN HÀNH HỆ THỐNG

1. **Tổng Quan Hệ Thống:** Bảng điều khiển KPI doanh thu, số vé đã xuất, số lượng khóa ghế đang active, tỷ lệ lấp đầy ghế.
2. **Giám Sát Khóa Ghế Redis:** Theo dõi các khóa ghế thời gian thực kèm đồng hồ đếm ngược TTL 300s, hỗ trợ nút Cưỡng chế mở khóa ghế.
3. **Chính Sách Khuyến Mãi:** Quản lý danh sách mã giảm giá, kiểm tra ràng buộc mã ngân hàng tài trợ (`bank_code`), theo dõi hạn mức sử dụng.
4. **Toàn Bộ Lịch Sử Đặt Vé:** Bảng danh sách các đơn đặt vé thành công, mã đơn hàng `BK-XXXXXX`, phương thức thanh toán, vị trí ghế và tổng tiền.
