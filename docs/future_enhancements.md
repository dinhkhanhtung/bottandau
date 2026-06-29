# 🚀 LỘ TRÌNH PHÁT TRIỂN & CẢI TIẾN HỆ THỐNG (PAST MVP ROADMAP)

Tài liệu này ghi nhận các ý kiến đóng góp chiến lược nhằm nâng cấp hệ thống **Kim Kê Connect (AI Network)** từ phiên bản MVP (Minimum Viable Product) lên một hệ thống vận hành bền vững, bảo mật, có dòng tài chính tự duy trì và mang lại giá trị thực tế cho cộng đồng Tân Dậu 1981 trong vòng 5 năm tới.

---

## 📅 Phân kỳ lộ trình (Development Milestones)

*   **Pha 1 (MVP Hiện tại)**: Đăng ký (Typeform) $\rightarrow$ Duyệt Telegram $\rightarrow$ Hồ sơ tĩnh tối ưu SEO $\rightarrow$ Chatbot AI Semantic Search trên Messenger.
*   **Pha 2 (Tối ưu & Nâng cấp AI)**: Tích hợp Background Job cho Embedding, AI Summary, AI Tags Confidence, Hash Search Cache và Nâng cao SEO.
*   **Pha 3 (AI Matching & Quản trị nâng cao)**: Tích hợp điểm uy tín (Reputation), Giải thích AI Matching, Telegram Stats và tính năng "AI Match Of The Day".
*   **📌 Pha 4 (Mô hình Tài chính Donate & Đặc quyền Linktree cá nhân)**: Triển khai hệ thống Donate tự nguyện, vinh danh đóng góp, trang bán hàng phong cách Linktree và nút đặt hàng gom tin nhắn thông minh.

---

## 🛠️ Chi tiết 10 Điểm Cải Tiến Chiến Lược (Pha 2 & Pha 3)

### 1. Xử lý bất đồng bộ (Background Job) cho Gemini Embedding
*   **Giải pháp**: Đưa tác vụ gọi API Gemini tạo Embedding và AI Tags vào một hàng đợi (Queue) xử lý ngầm (Background Job) sử dụng **Supabase Edge Functions** hoặc **Vercel Background Jobs**. Admin bấm duyệt xong, hồ sơ hoạt động ngay lập tức, việc tạo vector sẽ chạy ngầm và cập nhật sau đó 1-2 giây để tránh timeout.

### 2. Tự động trích xuất Tóm tắt hồ sơ (AI Summary)
*   **Giải pháp**: Khi thành viên viết phần giới thiệu (bio) quá dài, AI sẽ tự động sinh một bản tóm tắt ngắn gọn. Messenger Bot khi phản hồi sẽ đọc bản tóm tắt này thay vì đọc toàn bộ bio dài dòng, giúp chatbot phản hồi nhanh hơn và tiết kiệm token.

### 3. Chỉ số tự tin của từ khóa (AI Tags Confidence)
*   **Giải pháp**: Khi AI quét hồ sơ và gán nhãn `ai_tags`, AI sẽ gán kèm một trọng số tự tin từ `0.0` đến `1.0` (ví dụ: `đông_y: 0.98`, `marketing: 0.41`). Thuật toán so khớp AI Matching sau này sẽ dựa vào trọng số này để ưu tiên giới thiệu những thành viên có độ chuyên môn cao nhất.

### 4. Nâng cấp điểm uy tín thành viên (Reputation Score)
*   **Giải pháp**: Mở rộng bảng `member_profiles` để lưu trữ thêm các trường dữ liệu hành vi: `last_active` (tương tác gần nhất), `response_rate` (tỷ lệ phản hồi), và `verified_at` (thời điểm xác minh) để AI giới thiệu chân thực hơn.

### 5. Mã hóa Hash câu hỏi trong Search Cache
*   **Giải pháp**: Mã hóa câu hỏi tìm kiếm bằng thuật toán `sha256(question)` trước khi lưu vào `search_cache`. Việc so khớp và truy vấn index chuỗi hash sẽ nhanh hơn khi database cache phình to lên hàng vạn câu hỏi.

### 6. Cấu trúc SEO đa tầng (SEO Directory)
*   **Giải pháp**: Bên cạnh Clean URL cá nhân `/member/slug`, hệ thống tự động tạo và index các trang danh bạ theo bộ lọc tĩnh: `/nghe-nghiep/[job]` và `/tinh/[province]` để thâu tóm toàn bộ lưu lượng tìm kiếm tự nhiên của ngành nghề theo địa phương trên Google.

### 7. Minh bạch hóa lý do ghép nối (AI Matching Explanation)
*   **Giải pháp**: Khi chatbot giới thiệu một thành viên cho người hỏi, chatbot sẽ bổ sung thêm dòng giải thích lý do: *"Lý do AI lựa chọn: Anh A cùng ở Thái Nguyên và có 5 năm kinh nghiệm trong ngành dược liệu phù hợp với nhu cầu thuốc nam của bạn"*.

### 8. Bảng điều khiển quản trị bỏ túi trên Telegram (Telegram Commands)
*   **Giải pháp**: Mở rộng các lệnh chat quản trị cho Admin trên Telegram Bot: `/stats` (báo cáo đăng ký/duyệt/tìm kiếm trong ngày), `/hot` (ngành nghề tìm kiếm nhiều nhất) và `/expire` (danh sách sắp hết hạn Verified).

### 9. Kích hoạt giao thương chủ động: "AI Match Of The Day"
*   **Giải pháp**: Mỗi buổi sáng, hệ thống tự động quét nhu cầu mới đăng ký trong bảng `member_connections` và so khớp với năng lực của các thành viên khác. Hệ thống gửi báo cáo về Telegram cho Admin: *"Hôm nay phát hiện 5 cơ hội hợp tác chéo khả thi"*. Admin chỉ cần bấm nút [Gửi giới thiệu], bot Messenger sẽ tự động gửi tin nhắn bắc cầu nối cho hai thành viên.

### 10. Chiến lược phễu Web-to-Messenger (Đã tích hợp ở Pha 1)
*   **Giải pháp**: Website hiển thị đầy đủ hồ sơ tĩnh (tên, giới thiệu, năng lực) để Google index tốt nhất, nhưng che số điện thoại. Người dùng muốn liên hệ bắt buộc phải nhấn nút dẫn sang Messenger Bot để bot tự động trả về thông tin liên hệ đầy đủ.

---

## 💎 5. CHI TIẾT PHA 4: MÔ HÌNH DONATE & ĐẶC QUYỀN LINKTREE CÁ NHÂN (Mới nâng cấp)

Để đảm bảo hệ thống có dòng tài chính tự duy trì mà không tạo rào cản thu phí bắt buộc làm giảm lượng người đăng ký, chúng ta triển khai mô hình **Donate tự nguyện kết hợp Vinh danh & Đặc quyền**:

```
Thành viên đăng ký miễn phí
      ↓
Kết nối thành công qua Bot
      ↓
Bot gợi ý Donate tinh tế (Đúng thời điểm)
      ↓
Thành viên Donate tùy hỷ
      ↓
Kích hoạt vinh danh trên Profile + Mở khóa trang Linktree bán hàng cá nhân
```

### 1. Cơ chế gợi ý Donate "Đúng thời điểm" (Contextual Call-to-Donate)
Hệ thống không kêu gọi donate bừa bãi gây phản cảm, mà chỉ gửi thông điệp khéo léo vào các thời điểm người dùng nhận được giá trị thực tế từ hệ thống:
*   **Thời điểm 1 (Khi kết nối thành công)**: Khi một người dùng click nút "Kết nối & Lấy SĐT" của một thành viên trên web, sau khi Messenger Bot gửi thông tin liên hệ đầy đủ, bot sẽ gửi kèm một lời nhắn nhẹ nhàng ở cuối:
    > 🐓 *Kim Kê Connect hoạt động hoàn toàn phi lợi nhuận và miễn phí. Nếu kết nối này giúp ích cho công việc của bạn, hãy cân nhắc ủng hộ (donate) một chút trà nước để cùng Ban quản trị duy trì và nâng cấp hệ thống nhé! [Xem thông tin ủng hộ]*
*   **Thời điểm 2 (Khi hồ sơ được duyệt)**: Khi hệ thống gửi tin nhắn thông báo duyệt hồ sơ thành công cho thành viên mới, đính kèm link giới thiệu về quỹ duy trì server của cộng đồng tuổi gà 1981.

### 2. Vinh danh đóng góp trên trang cá nhân (Gamification)
*   Cập nhật bảng `member_profiles` thêm 2 trường: `total_donated_amount` (Tổng số tiền đã donate) và `donated_count` (Số lần donate).
*   Trên trang profile tĩnh cá nhân `/member/[slug]`, hiển thị huy hiệu hoặc dòng vinh danh trang trọng:
    > 🌟 **Đồng đội đóng góp tích cực**: Đã ủng hộ quỹ duy trì hệ thống **3 lần** (Tổng số tiền: **500.000 VNĐ**).
*   *Lợi ích*: Đánh vào niềm tự hào đóng góp cho tập thể, kích thích các thành viên khác tự nguyện ủng hộ để được vinh danh trên danh bạ cộng đồng.

### 3. Đặc quyền: Trang bán hàng cá nhân phong cách Linktree
Những thành viên có đóng góp (Donate) sẽ được hệ thống tự động mở khóa tính năng nâng cấp trang profile cá nhân `/member/[slug]` thành một **Mini-Landing Page phong cách Linktree chuyên nghiệp**:
*   **Trưng bày sản phẩm/dịch vụ**: Cho phép upload hình ảnh sản phẩm, mô tả ngắn, giá cả cụ thể (tương tự một gian hàng mini tối giản).
*   **Các nút liên kết đa kênh**: Chứa các liên kết mạng xã hội (Facebook, Zalo cá nhân, Ziktok, Youtube, Website doanh nghiệp).
*   **Nút mua hàng gom tin nhắn thông minh (Message Aggregator Button)**:
    *   Mỗi sản phẩm trên trang Linktree sẽ có một nút bấm **[Nhắn tin mua ngay]**.
    *   Khi khách hàng bấm vào nút này, hệ thống sẽ tự động sinh ra một đường dẫn chat nhanh Zalo (`https://zalo.me/[SĐT_người_bán]`) hoặc Messenger kèm theo nội dung tin nhắn được định dạng sẵn trong khay nhớ tạm (hoặc truyền qua URL):
        > *"Chào đồng đội, mình muốn đặt mua sản phẩm [Tên sản phẩm] giá [Giá tiền] đăng trên Kim Kê Connect. Bạn tư vấn cho mình nhé!"*
    *   Trình duyệt sẽ tự động mở ngay ứng dụng Zalo/Messenger của người bán. Người mua chỉ việc nhấn **Dán (Paste)** và **Gửi**.
    *   *Ưu điểm*: Giao dịch hoàn toàn trực tiếp giữa hai người bạn 1981 thông qua chat tay, không cần hệ thống giỏ hàng, thanh toán trực tuyến phức tạp $\rightarrow$ giữ nguyên triết lý **chi phí vận hành 0đ** và tuyệt đối tin cậy.
