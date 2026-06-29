import PhoneMockup from '@/components/PhoneMockup';
import FaqSection from '@/components/FaqSection';
import StatsSection from '@/components/StatsSection';
import Testimonials from '@/components/Testimonials';

export const revalidate = 3600; // Cache trang chủ tĩnh trong 1 giờ

// Component Background Grid Pattern
const BackgroundGrid = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <div 
      className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-[0.04]" 
      style={{ 
        backgroundImage: 'radial-gradient(#f59e0b 1.5px, transparent 1.5px)', 
        backgroundSize: '30px 30px',
        transform: 'rotate(15deg)'
      }}
    />
  </div>
);

export default async function HomePage() {
  return (
    <div className="relative isolate overflow-hidden bg-neutral-950 flex-grow font-sans">
      
      {/* ========================================================
          1. HERO SECTION (Tối ưu từ bản thiết kế cũ rất đẹp)
         ======================================================== */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
        <BackgroundGrid />
        
        {/* Blob phát sáng nghệ thuật phía sau */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 sm:w-96 sm:h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-10 w-72 h-72 sm:w-96 sm:h-96 bg-yellow-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2000ms' }}></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Cột trái: Tiêu đề & Slogan từ bản cũ */}
            <div className="lg:w-7/12 text-center lg:text-left space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs sm:text-sm font-extrabold shadow-sm animate-pulse">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                🐓 Tân Dậu Việt - Chắp Cánh Tình Đồng niên
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-50 leading-[1.15] tracking-tight">
                Cùng Nhau Kết Nối<br />
                <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                  Cùng Nhau Thịnh Vượng
                </span>
              </h1>
              
              <p className="text-xs sm:text-base lg:text-lg text-neutral-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Nền tảng độc quyền giúp các bạn Tân Dậu 1981 hỗ trợ chéo sản phẩm dịch vụ, xây dựng mạng lưới kinh doanh bền vững dựa trên sự tin cậy, đồng điệu và trợ lực từ Trí Tuệ Nhân Tạo (AI).
              </p>
              
              {/* Hai nút thẳng hàng nhau trên di động */}
              <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-row sm:gap-4 justify-center lg:justify-start max-w-xs sm:max-w-none mx-auto lg:mx-0 pt-2">
                <a 
                  href="/dang-ky" 
                  className="group relative overflow-hidden py-3.5 px-4 sm:px-8 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-2xl font-black text-[10px] sm:text-sm shadow-lg shadow-amber-500/10 transition-all hover:scale-103 text-center whitespace-nowrap"
                >
                  Tham Gia Ngay
                </a>
                <a 
                  href="#about"
                  className="py-3.5 px-4 sm:px-8 bg-neutral-900 text-neutral-200 border border-neutral-800 rounded-2xl font-bold text-[10px] sm:text-sm hover:bg-neutral-800 transition-all text-center whitespace-nowrap"
                >
                  Tìm hiểu thêm
                </a>
              </div>
            </div>

            {/* Cột phải: PhoneMockup Chat động trực quan */}
            <div className="lg:w-5/12 relative flex justify-center w-full">
              {/* Ẩn các badge bay bập bồng trên mobile để tránh lệch layout */}
              <div className="hidden sm:flex absolute top-10 -left-6 z-30 bg-neutral-900 border border-neutral-850 p-3 rounded-2xl shadow-xl items-center gap-2 max-w-[150px]">
                <span className="text-lg">👥</span>
                <div>
                  <p className="text-[7px] text-neutral-500 font-extrabold uppercase">Mạng Lưới</p>
                  <p className="text-[9px] font-black text-neutral-200 leading-tight">Kết Nối Đồng Niên</p>
                </div>
              </div>

              <div className="hidden sm:flex absolute bottom-24 -right-6 z-30 bg-neutral-900 border border-neutral-850 p-3 rounded-2xl shadow-xl items-center gap-2 max-w-[150px]">
                <span className="text-lg">🛍️</span>
                <div>
                  <p className="text-[7px] text-neutral-500 font-extrabold uppercase">Sản Phẩm</p>
                  <p className="text-[9px] font-black text-neutral-200 leading-tight">Ưu Tiên Tân Dậu</p>
                </div>
              </div>

              {/* Render component PhoneMockup */}
              <PhoneMockup />
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          2. VALUE PROPOSITION: ĐẶC QUYỀN VÀ GIÁ TRỊ (Tối ưu từ bản cũ)
         ======================================================== */}
      <section className="py-12 sm:py-16 bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative bg-neutral-900/60 rounded-3xl p-6 sm:p-12 overflow-hidden shadow-2xl border border-neutral-850">
            <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-600/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
              {/* Cột trái: Đóng góp tự nguyện */}
              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="inline-block bg-amber-500/10 text-amber-400 text-[10px] font-extrabold px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-wider">
                  Mô Hình Donate Tùy Hỷ
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-neutral-100">
                  Miễn Phí Tham Gia 100%
                </h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  Không thu phí đăng ký cố định. Cộng đồng duy trì hoạt động máy chủ API AI dựa trên sự đóng góp đóng góp tự nguyện (Donate) tùy tâm của thành viên khi kết nối thành công.
                </p>
              </div>

              {/* Dải phân cách dọc */}
              <div className="hidden md:flex flex-col items-center justify-center opacity-20">
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-neutral-350 to-transparent"></div>
              </div>

              {/* Cột phải: Đặc quyền Mini Shop */}
              <div className="flex-1 text-center md:text-right space-y-2">
                <div className="inline-block bg-amber-500/10 text-amber-400 text-[10px] font-extrabold px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-wider">
                  Đặc Quyền Linktree Shop
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-neutral-100">
                  Đồng Hành & Vinh Danh
                </h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  Thành viên đóng góp hỗ trợ quỹ sẽ được mở khóa **giao diện Linktree cá nhân mạ vàng**, hiển thị Grid 2 cột sản phẩm dạng Mini Shop có nút đặt mua gom tin nhắn Zalo cực chuyên nghiệp.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-neutral-850 text-center">
              <p className="text-neutral-400 text-xs sm:text-sm italic leading-relaxed">
                "Mở rộng mạng lưới, tăng trưởng doanh số và hỗ trợ lẫn nhau chưa bao giờ <span className="text-amber-400 font-semibold not-italic">tin cậy</span> và <span className="text-amber-400 font-semibold not-italic">thực chất</span> đến thế."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. STATS SECTION (Số liệu Counter chạy số - Client Component)
         ======================================================== */}
      <StatsSection />

      {/* ========================================================
          4. FEATURES: TẠI SAO NÊN THAM GIA (Tối ưu từ bản cũ)
         ======================================================== */}
      <section id="features" className="py-16 sm:py-24 bg-neutral-950 relative border-b border-neutral-900">
        <BackgroundGrid />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <span className="text-xs font-extrabold tracking-widest text-amber-400 uppercase">Giá trị thực chất</span>
            <h2 className="text-3xl font-black text-neutral-100 sm:text-4xl">Tại Sao Nên Tham Gia <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">Cộng Đồng?</span></h2>
            <p className="text-sm text-neutral-450 max-w-2xl mx-auto">Vì chúng ta cùng tuổi Tân Dậu 1981, cùng chung thế hệ, chung tiếng nói và cực kỳ tin cậy để trợ lực kinh doanh cho nhau.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1: Chợ Tân Dậu (Bản cũ) */}
            <div className="h-full bg-neutral-900/40 p-6 sm:p-8 rounded-3xl border border-neutral-850 shadow-md hover:border-amber-500/10 transition-all duration-300 group hover:-translate-y-1.5 text-center md:text-left space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform mx-auto md:mx-0 text-xl font-bold">
                🏪
              </div>
              <h3 className="text-lg font-bold text-neutral-200">Chợ Giao Thương Tân Dậu</h3>
              <p className="text-xs sm:text-sm text-neutral-450 leading-relaxed">Niêm yết hồ sơ và gian hàng mini lên hệ thống của cộng đồng. Ưu tiên sử dụng sản phẩm, dịch vụ của đồng niên để cùng nhau thịnh vượng.</p>
            </div>

            {/* Feature 2: AI Semantic Search (Bản mới) */}
            <div className="h-full bg-neutral-900/40 p-6 sm:p-8 rounded-3xl border border-neutral-850 shadow-md hover:border-amber-500/10 transition-all duration-300 group hover:-translate-y-1.5 text-center md:text-left space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform mx-auto md:mx-0 text-xl font-bold">
                🧠
              </div>
              <h3 className="text-lg font-bold text-neutral-200">Tra Cứu Thông Minh Bằng AI</h3>
              <p className="text-xs sm:text-sm text-neutral-450 leading-relaxed">Chỉ cần gõ hoặc nói nhu cầu tự nhiên trên khung chat Messenger: *"Tìm người làm cơ điện ở Thái Nguyên"*, trợ lý AI sẽ tự phân tích và tìm đúng người.</p>
            </div>

            {/* Feature 3: Xác Thực Đồng Niên (Bản cũ) */}
            <div className="h-full bg-neutral-900/40 p-6 sm:p-8 rounded-3xl border border-neutral-850 shadow-md hover:border-amber-500/10 transition-all duration-300 group hover:-translate-y-1.5 text-center md:text-left space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform mx-auto md:mx-0 text-xl font-bold">
                🛡️
              </div>
              <h3 className="text-lg font-bold text-neutral-200">Xác Thực Đồng Niên 100%</h3>
              <p className="text-xs sm:text-sm text-neutral-450 leading-relaxed">Mỗi thành viên tham gia đều được Ban quản trị xác minh năm sinh 1981 và thông tin kinh doanh. Đảm bảo môi trường sạch, tin cậy.</p>
            </div>

            {/* Feature 4: Bảo Mật Thông Tin (Bản mới) */}
            <div className="h-full bg-neutral-900/40 p-6 sm:p-8 rounded-3xl border border-neutral-850 shadow-md hover:border-amber-500/10 transition-all duration-300 group hover:-translate-y-1.5 text-center md:text-left space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform mx-auto md:mx-0 text-xl font-bold">
                🔒
              </div>
              <h3 className="text-lg font-bold text-neutral-200">Bảo Mật Che Số Điện Thoại</h3>
              <p className="text-xs sm:text-sm text-neutral-450 leading-relaxed">Hồ sơ công khai trên web sẽ tự động che SĐT và ẩn các liên kết cá nhân trước robot cào quét rác. Chỉ những thành viên Tân Dậu đã đăng ký mới xem được.</p>
            </div>

            {/* Feature 5: Linktree Shop Mini (Bản mới) */}
            <div className="h-full bg-neutral-900/40 p-6 sm:p-8 rounded-3xl border border-neutral-850 shadow-md hover:border-amber-500/10 transition-all duration-300 group hover:-translate-y-1.5 text-center md:text-left space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform mx-auto md:mx-0 text-xl font-bold">
                🛍️
              </div>
              <h3 className="text-lg font-bold text-neutral-200">Mini Shop Phong Cách Linktree</h3>
              <p className="text-xs sm:text-sm text-neutral-450 leading-relaxed">Trang cá nhân phẳng mạ vàng, hiển thị Grid 2 cột sản phẩm trực quan, tích hợp nút đặt mua nhanh gom tin nhắn Zalo 1-Click tiện lợi.</p>
            </div>

            {/* Feature 6: Auto-post Facebook & Telegram (Bản mới) */}
            <div className="h-full bg-neutral-900/40 p-6 sm:p-8 rounded-3xl border border-neutral-850 shadow-md hover:border-amber-500/10 transition-all duration-300 group hover:-translate-y-1.5 text-center md:text-left space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform mx-auto md:mx-0 text-xl font-bold">
                ⚡
              </div>
              <h3 className="text-lg font-bold text-neutral-200">Duyệt Nhanh & Auto-post FB</h3>
              <p className="text-xs sm:text-sm text-neutral-450 leading-relaxed">Hồ sơ được gửi duyệt thẳng về Telegram admin. Ngay khi duyệt, hệ thống tự động soạn bài giới thiệu và đăng quảng bá lên Fanpage cộng đồng.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          5. HOW IT WORKS: QUY TRÌNH HOẠT ĐỘNG (Tối ưu từ bản cũ)
         ======================================================== */}
      <section className="py-16 sm:py-24 bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <span className="text-xs font-extrabold tracking-widest text-amber-400 uppercase">Quy trình 3 bước</span>
            <h2 className="text-3xl font-black text-neutral-100 sm:text-4xl">Cách Thức Hoạt Động</h2>
            <p className="text-sm text-neutral-450 max-w-2xl mx-auto">Đơn giản, bảo mật và cực kỳ hiệu quả giúp bạn tìm thấy đồng đội trong 3 bước.</p>
          </div>

          <div className="relative">
            {/* Dải line kết nối giữa các bước trên Desktop */}
            <div className="hidden md:block absolute top-12 left-[16%] w-[68%] h-px bg-neutral-800"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Bước 1 */}
              <div className="text-center group space-y-3">
                <div className="relative mb-2 inline-block">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-900 rounded-full flex items-center justify-center text-xl sm:text-2xl font-black border border-neutral-850 shadow-lg relative z-10 group-hover:scale-105 transition-transform duration-300">
                    <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">01</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-neutral-200">Đăng Ký Hồ Sơ</h3>
                <p className="text-xs sm:text-sm text-neutral-450 leading-relaxed max-w-xs mx-auto">Điền đơn đăng ký nhanh trên website để cung cấp ngành nghề kinh doanh và thông tin của bạn.</p>
              </div>
              
              {/* Bước 2 */}
              <div className="text-center group space-y-3">
                <div className="relative mb-2 inline-block">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-900 rounded-full flex items-center justify-center text-xl sm:text-2xl font-black border border-neutral-850 shadow-lg relative z-10 group-hover:scale-105 transition-transform duration-300">
                    <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">02</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-neutral-200">Liên Kết Tài Khoản</h3>
                <p className="text-xs sm:text-sm text-neutral-450 leading-relaxed max-w-xs mx-auto">Sau khi được duyệt, bấm nút trên trang trạng thái để liên kết tài khoản Messenger Bot của bạn.</p>
              </div>
              
              {/* Bước 3 */}
              <div className="text-center group space-y-3">
                <div className="relative mb-2 inline-block">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-900 rounded-full flex items-center justify-center text-xl sm:text-2xl font-black border border-neutral-850 shadow-lg relative z-10 group-hover:scale-105 transition-transform duration-300">
                    <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">03</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-neutral-200">Giao Thương Hợp Tác</h3>
                <p className="text-xs sm:text-sm text-neutral-450 leading-relaxed max-w-xs mx-auto">Tìm kiếm đối tác qua Bot AI, chia sẻ link sản phẩm Linktree mạ vàng và cùng tăng trưởng.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          6. TESTIMONIALS: CÂU CHUYỆN THÀNH CÔNG (Slider - Client Component)
         ======================================================== */}
      <Testimonials />

      {/* ========================================================
          7. DONATE & ĐỒNG HÀNH (Thay thế cho Pricing bảng giá cũ)
         ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-neutral-900">
        <div className="relative rounded-3xl border border-neutral-850 bg-gradient-to-b from-neutral-900/40 to-neutral-950/60 p-6 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            
            {/* Quyền lợi đồng hành */}
            <div className="flex-1 text-left space-y-4">
              <span className="inline-block bg-amber-500/10 text-amber-400 text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-amber-500/20 uppercase tracking-wider">
                Đồng Hành Phát Triển
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-100 tracking-tight">
                Ủng Hộ Duy Trì Ngân Quỹ Cộng Đồng
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Mọi đóng góp (Donate) của anh em đều được sử dụng 100% để duy trì máy chủ, chi trả hóa năng lượng chạy mô hình AI Gemini và nâng cấp các tính năng mới cho website.
              </p>
              
              {/* Danh sách đặc quyền */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">✔</span>
                  <span>Nhãn Verified tích vàng uy tín</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">✔</span>
                  <span>Hồ sơ Linktree mạ vàng cao cấp</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">✔</span>
                  <span>Mini Shop bán hàng 2 cột sản phẩm</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">✔</span>
                  <span>Nhúng bản đồ Google Maps tương tác</span>
                </div>
              </div>
            </div>
            
            {/* Tài khoản ngân quỹ */}
            <div className="lg:w-96 w-full bg-neutral-950 border border-neutral-850 p-6 rounded-2xl flex flex-col justify-center gap-4 text-center">
              <span className="text-3xl">☕</span>
              <div>
                <p className="text-[10px] text-neutral-450 font-bold uppercase tracking-wider">Tài khoản ngân quỹ máy chủ</p>
                <p className="text-sm font-black text-amber-400 mt-1.5">VietinBank: 0982581222</p>
                <p className="text-[10px] text-neutral-400 font-extrabold mt-0.5">Chủ TK: ĐINH KHÁNH TÙNG</p>
                <p className="text-[10px] text-neutral-500 mt-1.5">Nội dung: [Họ Tên] - Ung ho Kim Ke</p>
              </div>
              <p className="text-[9px] text-neutral-500 italic leading-normal">
                * Sau khi ủng hộ quỹ, Admin sẽ ghi nhận đóng góp và kích hoạt các đặc quyền cao cấp ngay trên tài khoản của bạn.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          8. FAQ SECTION: CÂU HỎI THƯỜNG GẶP (Accordion)
         ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 border-t border-neutral-900">
        <div className="text-center mb-12 sm:mb-16 space-y-4">
          <h2 className="text-xs font-extrabold tracking-widest text-amber-400 uppercase">Hỏi đáp nhanh</h2>
          <p className="text-3xl font-black text-neutral-100 sm:text-4xl">Giải đáp thắc mắc</p>
        </div>

        {/* Component Accordion FAQ */}
        <FaqSection />
      </section>

      {/* ========================================================
          9. SECTION OFFICE: VĂN PHÒNG ĐIỀU HÀNH (Học tập từ bản cũ)
         ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 border-t border-neutral-900 text-center">
        <div className="max-w-3xl mx-auto space-y-4 mb-10">
          <span className="inline-block bg-neutral-900 border border-neutral-800 p-3 rounded-full text-amber-400">
            📍
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-100">Văn Phòng Điều Hành</h2>
          <p className="text-xs sm:text-sm text-neutral-450">Tổ 30, Phường Quan Triều, Thành phố Thái Nguyên</p>
        </div>
        
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-neutral-850 h-[320px] sm:h-[400px] relative max-w-5xl mx-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.893111069348!2d105.8130109759247!3d21.62145406471371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135270116631627%3A0x600c6553a835a83a!2zVOG7lSAzMCwgUXVhbiBUcmnhu4F1LCBUaMOgbmggcGjhu5EgVGjDoWkgTmd1ecOqbiwgVGjDoWkgTmd1ecOqbiwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1717145561139!5m2!1svi!2s"
            className="w-full h-full absolute inset-0 bg-neutral-900 border-0"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bản đồ vị trí văn phòng Tân Dậu - Hỗ Trợ Chéo"
          ></iframe>
        </div>
      </section>

      {/* ========================================================
          👣 FOOTER CHI TIẾT & UY TÍN
         ======================================================== */}
      <footer className="border-t border-neutral-900 bg-neutral-950/60 py-16 text-xs text-neutral-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
          
          {/* Cột 1: Giới thiệu */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐓</span>
              <span className="text-sm font-bold text-neutral-200 uppercase tracking-wider">Kim Kê Connect</span>
            </div>
            <p className="text-neutral-500 leading-relaxed">
              Mạng lưới kết nối giao thương và hỗ trợ chéo thông minh dành riêng cho cộng đồng người sinh năm Tân Dậu 1981.
            </p>
            <p className="text-[10px] text-neutral-600">
              &copy; {new Date().getFullYear()} Tân Dậu - Hỗ Trợ Chéo. All rights reserved.
            </p>
          </div>

          {/* Cột 2: Thông tin liên hệ Ban Quản Trị */}
          <div className="space-y-3">
            <h5 className="text-neutral-200 font-bold uppercase tracking-wider text-[10px]">Ban Quản Trị</h5>
            <ul className="space-y-2 text-neutral-500">
              <li>• <span className="font-semibold text-neutral-400">Đại diện:</span> Đinh Khánh Tùng</li>
              <li>• <span className="font-semibold text-neutral-400">Hotline:</span> <a href="tel:0982581222" className="hover:text-amber-400 transition-colors">0982.581.222</a></li>
              <li>• <span className="font-semibold text-neutral-400">Email:</span> dinhkhanhtung@outlook.com</li>
            </ul>
          </div>

          {/* Cột 3: Liên kết nhanh */}
          <div className="space-y-3">
            <h5 className="text-neutral-200 font-bold uppercase tracking-wider text-[10px]">Cộng Đồng</h5>
            <ul className="space-y-2 text-neutral-500">
              <li>
                • <a href="https://m.me/2571120902929642" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                  Messenger AI Chatbot
                </a>
              </li>
              <li>
                • <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                  Facebook Group Kết Nối Tân Dậu Toàn Cầu
                </a>
              </li>
              <li>
                • <a href="https://zalo.me/0982581222" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                  Zalo Hỗ Trợ Trực Tiếp
                </a>
              </li>
            </ul>
          </div>

        </div>
      </footer>
    </div>
  );
}
