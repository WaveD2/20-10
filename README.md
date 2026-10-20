# Một bó hoa dành tặng bạn · 20/10

Trang tặng hoa, album ảnh người nhận và thiệp chúc mừng ngày Phụ nữ Việt Nam 20/10, dùng HTML, CSS và JavaScript thuần. Hoạt động offline, không cần cài thư viện hoặc build.

## Chạy

Mở `index.html` trực tiếp trong trình duyệt, hoặc chạy từ thư mục này:

```bash
python3 -m http.server 8080
```

Truy cập http://localhost:8080.

## Trang vườn hoa mới

Mở `garden.html` trực tiếp trong trình duyệt, chọn **Ngắm vườn hoa** ở góc trên bên phải trang `index.html`, hoặc truy cập http://localhost:8080/garden.html khi chạy server ở trên. Trang hoạt động offline; khi sao chép sang nơi khác, chép kèm `garden-botany.js`, `garden-card.js` và thư mục `assets`.

- Ban đầu chỉ có một bông hoa giữa màn hình. Bấm vào hoa (hoặc dùng Tab rồi Enter/Space) để cả vườn hoa dần nở từ giữa ra hai bên.
- Sau khoảng 7 giây, thiệp chúc 20/10 tự hiện. Chọn **Ngắm vườn hoa**, nút × hoặc Escape để đóng thiệp.
- Chọn **Đọc lại thiệp** để mở lại, hoặc **Cho hoa nở lại** để trở về bông hoa đầu tiên.
- Chọn **Viết lời chúc riêng** trong thiệp để sửa người nhận, tiêu đề, lời chúc và chữ ký. **Lưu lời chúc** cập nhật thiệp và lưu trên trình duyệt hiện tại; **Hủy** bỏ sửa đổi chưa lưu. Lời chúc của vườn hoa được lưu riêng với thiệp ở `index.html`.
- Trang tự điều chỉnh theo màn hình và bỏ qua hoạt ảnh nở khi người xem bật chế độ giảm chuyển động.
- Hoa hồng dùng cùng cách dựng cánh với `index.html`: nhiều vòng cánh cong, tâm xoắn, bóng giữa các cánh, viền bắt sáng và giọt sương. Các hàm vẽ được lấy từ `script.js` sang `garden-botany.js` cho vườn hoa. Lá có gân, thân lay theo gió, hoa nghiêng nhẹ khi rê chuột gần và có cánh hoa bay; chuyển động tạm dừng khi tab bị ẩn.
- Hoa hồng, kem được xen với hoa xanh lá nhạt, xanh dương và trắng. Nền trời xanh có mây mỏng trôi chậm; gió làm thân, lá và đầu hoa lắc lư cùng nhau.
- Có thêm 20 nụ hoa nhiều màu xen qua các lớp của khu vườn, cánh còn khép và đài xanh ôm quanh gốc nụ. Nụ xuất hiện cùng đợt hoa và giữ dáng khép khi vườn đã nở.
- Trang dùng Noto Serif (chữ đứng và nghiêng) cho tiêu đề, lời gửi và chữ ký; Noto Sans cho nội dung. Font có đầy đủ dấu tiếng Việt, được lưu tại `assets/fonts` kèm giấy phép để dùng offline. Khi sao chép trang sang nơi khác, chép kèm thư mục này.

## Trải nghiệm

- Bó hoa nở trước, sau đó xuất hiện phong bì để người xem tự mở thiệp.
- Chạm từng bông hoa để nhận một lời chúc nhỏ. Khi dùng bàn phím, Tab đến bó hoa rồi nhấn Enter, Space hoặc các phím mũi tên.
- Chọn **Mở thiệp** để đọc lời chúc; đóng bằng nút ×, phím Escape hoặc **Gấp thiệp** trên phong bì.
- Hoa và tiêu đề được căn giữa khi vào trang. Khi mở thiệp, cả cụm hoa và thiệp được cân giữa; trang tự chia cột trên màn hình rộng và xếp thiệp xuống dưới trên màn hình hẹp. Thiệp nằm trong luồng trang, nên tiêu đề, ảnh, hoa và lời chúc không bị che; có thể tiếp tục tương tác với hoa khi thiệp mở.
- Chọn **Viết lời chúc riêng** để sửa người nhận, nội dung và chữ ký. **Lưu lời chúc** cập nhật thiệp và lưu trên trình duyệt hiện tại; **Hủy** bỏ các sửa đổi chưa lưu. Nội dung không tự gửi sang thiết bị hay trình duyệt khác.
- Chọn **Cho hoa nở lại** để xem lại hiệu ứng.
- Thiệp dài tự tăng chiều cao và cuộn cùng trang. Trang tôn trọng thiết lập giảm chuyển động và tạm dừng hoạt ảnh khi tab bị ẩn.

## Album kỷ niệm và thay ảnh

- Album xuất hiện sau lần đầu mở thiệp, hiện dần khi cuộn tới phần ảnh.
- Chọn **Xem album kỷ niệm** trong thiệp để chuyển đến album.
- Ban đầu ảnh xếp chồng như ảnh giấy. **Xòe album** trải ba ảnh ra ngang trên máy tính, dọc trên điện thoại; **Gấp album** xếp lại.
- Album vẫn giữ lại khi đóng thiệp, để người xem có thể ngắm ảnh tiếp.
- Chọn **Thay ảnh** để xòe album và hiện nút **Đổi ảnh** cho từng khung. Chọn ảnh trên thiết bị (tối đa 20 MB); ảnh được thu nhỏ và lưu trên trình duyệt hiện tại. Chọn **Ảnh ban đầu** để khôi phục từng khung, hoặc **Xong** để ẩn các nút chỉnh sửa.
- Ảnh đã chọn chỉ có trên trình duyệt này, không tự chia sẻ sang thiết bị khác hoặc thay đổi tệp ảnh trong mã nguồn.


Album gồm ba ô ảnh, mặc định dùng cùng một ảnh mẫu. Ngoài cách thay trực tiếp trên trang, có thể sửa ảnh mặc định trong mã nguồn để người khác mở trang cũng thấy ảnh của bạn:

1. Chép ảnh của bạn vào thư mục `assets`, ví dụ `assets/me.jpg`.
2. Trong phần `memoryAlbum` ở `index.html`, đổi `src="./assets/portrait-placeholder.webp"` của từng ô ảnh thành đường dẫn tương ứng, ví dụ `src="./assets/me.jpg"`.
3. Sửa `alt` và hai dòng chữ trong `figcaption` nếu muốn cá nhân hóa phần ảnh.

Khung ảnh dùng tỉ lệ 3:4 và tự cắt ảnh vừa khung. Có thể chỉnh `object-position` trong `.portrait-photo img` ở `style.css` để giữ khuôn mặt đúng vị trí.

Ảnh mẫu `assets/portrait-placeholder.webp` (768 × 1024) được tạo bằng công cụ imagegen tích hợp; prompt cuối nằm trong `assets/portrait-prompt.txt`.

## Các tệp

- `index.html`: bố cục, Canvas, thiệp và form cá nhân hóa.
- `style.css`: nền hồng, phong bì, giấy gấp, bố cục responsive và chuyển động.
- `script.js`: vẽ bó hoa, hiệu ứng nở hoa, parallax, cánh hoa bay và tương tác từng bông.
- `card.js`: mở/đóng thiệp, chuyển bố cục, lời chúc và lưu nội dung cá nhân hóa.
- `album.js`: thay, thu nhỏ, lưu ảnh album trên trình duyệt và khôi phục ảnh ban đầu.
- `assets/portrait-placeholder.webp`: ảnh mẫu có thể thay thế.
- `tests/layout.cjs`: kiểm tra hồi quy bố cục trên 11 kích thước màn hình, hoa căn giữa, album ẩn/hiện và xòe/gấp, thiệp dài và các tương tác. Chạy `node tests/layout.cjs` trong môi trường có Playwright (hoặc đặt `NODE_PATH` đến thư mục chứa Playwright đã cài).
- `tests/album.cjs`: kiểm tra chọn ảnh, thu nhỏ, lưu và khôi phục riêng từng ảnh, tải lại trang, tệp không hợp lệ, bộ nhớ không khả dụng và bố cục chỉnh ảnh trên điện thoại. Chạy `node tests/album.cjs` với Playwright.

Đổi nội dung thiệp mặc định tại `defaultGreeting` trong `card.js`; đổi các lời chúc theo bông hoa tại `WHISPER_NOTES` trong `script.js`. Nội dung được render dưới dạng văn bản thuần.

## Cá nhân hóa người nhận theo mã bí mật 8 ký tự (recipients.json)

Trang hỗ trợ hiển thị riêng biệt **Tên + Ảnh chân dung trong thiệp + Lời chúc** cho từng người nhận thông qua mã 8 ký tự bảo mật.

### Cơ chế chống đoán mò & chống lộ nhầm:
- **Nếu gõ sai mã, sửa đổi URL hoặc không có mã:** Trang sẽ lập tức hiển thị avatar hoạt hình mặc định `assets/imgs/cancan.png` và lời chúc "Gửi bạn". Hoàn toàn không bao giờ để lộ ảnh hay thông tin của người khác.
- **Chỉ khi nhập đúng 100% mã bí mật 8 ký tự:** Thiệp mới mở đúng người nhận.

### Danh sách mã bí mật 8 ký tự có sẵn:
- **Chi**: Mã `1e6086b7` (hoặc mã ý nghĩa `chi2010v`)
  - Link Zalo/FB: `1e6086b7.html`
  - Link trực tiếp: `index.html?u=1e6086b7`
- **Thanh**: Mã `8478e2bd` (hoặc mã ý nghĩa `thanh20k`)
  - Link Zalo/FB: `8478e2bd.html`
  - Link trực tiếp: `index.html?u=8478e2bd`
- **Trinh**: Mã `28415172` (hoặc mã ý nghĩa `trinh20d`)
  - Link Zalo/FB: `28415172.html`
  - Link trực tiếp: `index.html?u=28415172`
- **Tú**: Mã `b6b4ce6d` (hoặc mã ý nghĩa `tu2010vn`)
  - Link Zalo/FB: `b6b4ce6d.html`
  - Link trực tiếp: `index.html?u=b6b4ce6d`

### Bảng quản lý & sao chép link:
Mở [generator.html](file:///home/waved/Downloads/20-10/generator.html) trực tiếp trong trình duyệt để sao chép link gửi Zalo/Facebook và xem thử thiệp.

### Cách thêm hoặc chỉnh sửa người nhận:
1. Mở file [recipients.json](file:///home/waved/Downloads/20-10/recipients.json) để đổi tên, đổi mã 8 ký tự tùy ý.
2. Chạy lệnh:
   ```bash
   node generate-share.js
   ```

# flowers-20-10
