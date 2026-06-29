import PhoneMockup from '@/components/PhoneMockup';
import FaqSection from '@/components/FaqSection';

export const revalidate = 3600; // Cache trang chủ tĩnh trong 1 giờ

export default async function HomePage() {
  return (
    <div className="relative isolate overflow-hidden bg-neutral-950 flex-grow">
      {/* Background Gradients */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-amber-500 to-yellow-600 opacity-15 sm:left-[calc(50%-30rem)] sm:w-[72rem]" />
      </div>

      {/* ========================================================
          1. HERO SECTION (Tối ưu Responsive, Mobile First)
         ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Cột trái: Tiêu đề & Nội dung thuyết phục */}
          <div className="lg:col-span-7 text-left space-y-4 sm:space-y-6">
            <div className="inline-flex rounded-full bg-amber-500/10 px-4 py-2 text-xs font-extrabold text-amber-400 ring-1 ring-inset ring-amber-500/20 uppercase tracking-widest">
              🐓 Tân Dậu Việt - Chắp Cánh Tình Đồng niên
            </div>
            
            <h1 className="text-4xl font-black tracking-tight text-neutral-50 sm:text-6xl leading-none">
              Cùng Nhau Kết Nối<br />
              <span className="bg-gradient-to-r from-amber-400 via-yellow-250 to-amber-500 bg-clip-text text-transparent">
                Cùng Nhau Thịnh Vượng
              </span>
            </h1>
            
            <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-neutral-350 font-medium">
              Nền tảng độc quyền giúp các bạn Tân Dậu 1981 hỗ trợ chéo sản phẩm dịch vụ, xây dựng mạng lưới kinh doanh bền vững dựa trên sự tin cậy, đồng điệu và trợ lực từ Trí Tuệ Nhân Tạo (AI).
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="/dang-ky"
                className="rounded-full bg-amber-500 px-6 py-3.5 text-center text-sm sm:text-base font-bold text-neutral-950 shadow-md hover:bg-amber-400 transition-all hover:scale-105"
              >
                Đăng ký gia nhập ngay
              </a>
              <a
                href="https://m.me/2571120902929642"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-neutral-800 bg-neutral-900/40 px-6 py-3.5 text-center text-sm sm:text-base font-semibold text-neutral-200 hover:bg-neutral-800 transition-colors backdrop-blur-sm"
              >
                Chat trực tiếp với AI Bot
              </a>
            </div>
          </div>

          {/* Cột phải: Điện thoại PhoneMockup Chat động trực quan */}
          <div className="lg:col-span-5 flex justify-center mt-6 lg:mt-0 relative">
            {/* Badge trái */}
            <div className="absolute top-10 -left-6 z-10 bg-neutral-900/90 border border-neutral-800/80 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-2 max-w-[150px] animate-bounce" style={{ animationDuration: '4s' }}>
              <span className="text-lg">👥</span>
              <div>
                <p className="text-[7px] text-neutral-500 font-extrabold uppercase tracking-wider">Mạng Lưới</p>
                <p className="text-[9px] font-black text-neutral-200 leading-tight">Kết Nối Đồng Niên</p>
              </div>
            </div>

            {/* Badge phải */}
            <div className="absolute bottom-16 -right-6 z-10 bg-neutral-900/90 border border-neutral-800/80 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-2 max-w-[150px] animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1s' }}>
              <span className="text-lg">🛍️</span>
              <div>
                <p className="text-[7px] text-neutral-500 font-extrabold uppercase tracking-wider">Sản Phẩm</p>
                <p className="text-[9px] font-black text-neutral-200 leading-tight">Ưu Tiên Tân Dậu</p>
              </div>
            </div>

            {/* PhoneMockup */}
            <PhoneMockup />
          </div>
          
        </div>
      </section>

      {/* ========================================================
          2. STATS SECTION (Số liệu thống kê)
         ======================================================== */}
      <section className="border-y border-neutral-900 bg-neutral-950/40 py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <span className="block text-2xl sm:text-4xl font-extrabold text-amber-400">1.000+</span>
              <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider mt-1 block font-bold">Thành viên Tân Dậu</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-4xl font-extrabold text-amber-400">500+</span>
              <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider mt-1 block font-bold">Ngành nghề giao thương</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-4xl font-extrabold text-amber-400">0 VNĐ</span>
              <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider mt-1 block font-bold">Chi phí kết nối</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-4xl font-extrabold text-amber-400">100%</span>
              <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider mt-1 block font-bold">Bảo mật thông tin</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. BENTO GRID FEATURES: TÍNH NĂNG ƯU VIỆT
         ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-extrabold tracking-widest text-amber-400 uppercase">Hệ thống công nghệ tối tân</h2>
          <p className="text-3xl font-black text-neutral-100 sm:text-4xl">Những Đặc Quyền Vượt Trội Của Thành Viên</p>
          <p className="text-sm text-neutral-450 leading-relaxed">Được xây dựng trên triết lý chắt lọc tinh hoa từ phiên bản cũ, Kim Kê Connect mang lại giải pháp giao thương thực chất, bảo mật và thông minh hơn bao giờ hết.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Box 1: AI Semantic Search */}
          <div className="md:col-span-2 rounded-3xl border border-neutral-850 bg-neutral-900/20 p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/10 transition-colors">
            <span className="text-3xl">🧠</span>
            <div className="mt-6">
              <h3 className="text-lg font-bold text-neutral-100">Tra cứu thông minh bằng AI (Semantic Search)</h3>
              <p className="text-xs sm:text-sm text-neutral-450 mt-2 leading-relaxed">
                Không cần tra bảng biểu hay ghi nhớ tên. Thành viên chỉ cần gõ nhu cầu bằng giọng nói hoặc câu hỏi tự nhiên trên khung chat Messenger: *"Tìm người làm cơ điện ở Thái Nguyên"*, trợ lý AI sẽ tự phân tích và đề xuất đúng người phù hợp nhất.
              </p>
            </div>
          </div>

          {/* Box 2: Phễu bảo mật */}
          <div className="rounded-3xl border border-neutral-850 bg-neutral-900/20 p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/10 transition-colors">
            <span className="text-3xl">🔒</span>
            <div className="mt-6">
              <h3 className="text-lg font-bold text-neutral-100">Bảo mật thông tin & Chống spam</h3>
              <p className="text-xs sm:text-sm text-neutral-450 mt-2 leading-relaxed">
                Thông tin nhạy cảm (SĐT, liên kết cá nhân) trên web sẽ bị che và ẩn hoàn toàn trước các công cụ cào quét rác. Chỉ những đồng đội Tân Dậu đã được phê duyệt và kích hoạt tài khoản mới có thể mở khóa để xem đầy đủ.
              </p>
            </div>
          </div>

          {/* Box 3: Đặc quyền Linktree */}
          <div className="rounded-3xl border border-neutral-850 bg-neutral-900/20 p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/10 transition-colors">
            <span className="text-3xl">🛍️</span>
            <div className="mt-6">
              <h3 className="text-lg font-bold text-neutral-100">Mini Shop cá nhân phong cách Linktree</h3>
              <p className="text-xs sm:text-sm text-neutral-450 mt-2 leading-relaxed">
                Tặng riêng một trang Linktree bán hàng cá nhân bóng bẩy, tích hợp nút đặt mua hàng gom tin nhắn Zalo 1-Click. Khách hàng chỉ việc chọn sản phẩm, nhấn nút và dán tin nhắn chat trực tiếp với bạn.
              </p>
            </div>
          </div>

          {/* Box 4: Telegram & Facebook automation */}
          <div className="md:col-span-2 rounded-3xl border border-neutral-850 bg-neutral-900/20 p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/10 transition-colors">
            <span className="text-3xl">⚡</span>
            <div className="mt-6">
              <h3 className="text-lg font-bold text-neutral-100">Duyệt tự động Telegram & Quảng bá Facebook</h3>
              <p className="text-xs sm:text-sm text-neutral-450 mt-2 leading-relaxed">
                Hồ sơ đăng ký được gửi thẳng về Telegram cho Ban quản trị duyệt tức thời bằng nút bấm. Ngay khi được duyệt, hệ thống tự động soạn bài giới thiệu và đăng bài chào mừng, quảng bá thương hiệu của bạn lên Fanpage cộng đồng Kim Kê Connect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. DONATE MISSION: SỨ MỆNH ĐỒNG HÀNH & DUY TRÌ
         ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-neutral-900">
        <div className="relative rounded-3xl border border-neutral-850 bg-gradient-to-b from-neutral-900/40 to-neutral-950/60 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <div className="flex-1 text-left space-y-4">
              <span className="inline-block bg-amber-500/10 text-amber-400 text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-amber-500/20 uppercase tracking-wider">
                Mô hình phi lợi nhuận
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-100 tracking-tight">
                Hỗ Trợ Chéo Vì Một Cộng Đồng Vững Mạnh
              </h2>
              <p className="text-xs sm:text-sm text-neutral-450 leading-relaxed">
                Kim Kê Connect hoạt động hoàn toàn miễn phí và không thu bất kỳ khoản phí đăng ký hay phí thành viên nào. Chúng tôi duy trì máy chủ, chi phí vận hành API Gemini AI và nâng cấp hệ thống dựa trên sự đóng góp tự nguyện (Donate) tùy tâm của các thành viên.
              </p>
              <p className="text-xs sm:text-sm text-neutral-500">
                Mọi sự đóng góp của đồng đội đều được ghi nhận trang trọng trên trang hồ sơ cá nhân và được tặng đặc quyền nâng cấp trang bán hàng Linktree mạ vàng cao cấp.
              </p>
            </div>
            
            {/* STK được sửa thành STK VietinBank thật của anh Đinh Khánh Tùng */}
            <div className="lg:w-1/3 w-full bg-neutral-950 border border-neutral-850 p-6 rounded-2xl flex flex-col justify-center gap-4 text-center">
              <span className="text-4xl">☕</span>
              <div>
                <p className="text-[10px] text-neutral-450 font-bold uppercase tracking-wider">Tài khoản ngân quỹ máy chủ</p>
                <p className="text-sm font-black text-amber-400 mt-1.5">VietinBank: 0982581222</p>
                <p className="text-[9px] text-neutral-400 font-extrabold mt-0.5">Chủ TK: ĐINH KHÁNH TÙNG</p>
                <p className="text-[9px] text-neutral-500 mt-1.5">Nội dung: [Họ Tên] - Ung ho Kim Ke</p>
              </div>
              <p className="text-[10px] text-neutral-500 italic">
                * Mọi khoản đóng góp đều được chuyển 100% vào chi phí duy trì máy chủ và phát triển tính năng mới.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. FAQ SECTION: CÂU HỎI THƯỜNG GẶP (Học tập bản cũ - FaqSection Accordion)
         ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-neutral-900">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-xs font-extrabold tracking-widest text-amber-400 uppercase">Hỏi đáp nhanh</h2>
          <p className="text-3xl font-black text-neutral-100 sm:text-4xl">Giải đáp thắc mắc</p>
        </div>

        {/* FaqSection Client Accordion Component */}
        <FaqSection />
      </section>

      {/* ========================================================
          📍 SECTION OFFICE: VĂN PHÒNG ĐIỀU HÀNH
         ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-neutral-900 text-center">
        <div className="max-w-3xl mx-auto space-y-4 mb-12">
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
                {/* 🌟 Đã sửa thành "Kết Nối Tân Dậu Toàn Cầu" theo đúng yêu cầu */}
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
