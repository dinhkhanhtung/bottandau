import Image from 'next/image';

export const revalidate = 3600; // Cache trang chủ tĩnh trong 1 giờ

export default async function HomePage() {
  return (
    <div className="relative isolate overflow-hidden bg-neutral-950 flex-grow">
      {/* Background Gradients */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-amber-500 to-yellow-600 opacity-15 sm:left-[calc(50%-30rem)] sm:w-[72rem]" />
      </div>

      {/* Hero Section (Tối ưu Responsive, Mobile First) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-16 sm:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Cột trái: Nội dung thuyết phục */}
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

          {/* Cột phải: Hình ảnh thương hiệu 3D sang trọng */}
          <div className="lg:col-span-5 flex justify-center mt-6 lg:mt-0 relative">
            {/* Badge trái */}
            <div className="absolute -top-4 -left-4 z-10 bg-neutral-900/95 border border-neutral-800 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-2 max-w-[160px]">
              <span className="text-xl">👥</span>
              <div>
                <p className="text-[8px] text-neutral-500 font-extrabold uppercase tracking-wider">Mạng Lưới</p>
                <p className="text-[10px] font-black text-neutral-200 leading-tight">Kết Nối Đồng Niên</p>
              </div>
            </div>

            {/* Badge phải */}
            <div className="absolute -bottom-4 -right-4 z-10 bg-neutral-900/95 border border-neutral-800 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-2 max-w-[160px]">
              <span className="text-xl">🛍️</span>
              <div>
                <p className="text-[8px] text-neutral-500 font-extrabold uppercase tracking-wider">Sản Phẩm</p>
                <p className="text-[10px] font-black text-neutral-200 leading-tight">Ưu Tiên Tân Dậu</p>
              </div>
            </div>

            <div className="relative rounded-3xl border border-neutral-800 bg-neutral-900/25 p-3 sm:p-4 shadow-2xl backdrop-blur-md overflow-hidden hover:border-amber-500/30 transition-colors duration-500">
              <img
                src="/images/kimke_ai_hero.png"
                alt="Kim Kê AI Connection Logo"
                className="rounded-2xl max-w-full h-auto object-cover max-h-[300px] sm:max-h-[380px] hover:scale-102 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section (Số liệu) */}
      <section className="border-y border-neutral-900 bg-neutral-950/40 py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <span className="block text-2xl sm:text-4xl font-extrabold text-amber-400">1.000+</span>
              <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider mt-1 block">Thành viên Tân Dậu</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-4xl font-extrabold text-amber-400">500+</span>
              <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider mt-1 block">Ngành nghề dịch vụ</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-4xl font-extrabold text-amber-400">0 VNĐ</span>
              <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider mt-1 block">Chi phí kết nối</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-4xl font-extrabold text-amber-400">100%</span>
              <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider mt-1 block">Bảo mật nội bộ</span>
            </div>
          </div>
        </div>
      </section>

      {/* 📌 SECTION MỚI: Tại sao lại là tuổi gà 1981? (Sự đồng cảm & Gắn kết) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100">
              Sức mạnh của sự tin cậy từ những người bạn cùng tuổi 1981
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              Tân Dậu 1981 bước vào tuổi trung niên, đã trải qua nhiều thăng trầm trong sự nghiệp và cuộc sống. Chúng ta thấu hiểu, có chung góc nhìn và dễ dàng tin cậy nhau hơn bất kỳ ai khác.
            </p>
            <ul className="space-y-3 text-sm text-neutral-300">
              <li className="flex items-center gap-2">
                <span className="text-amber-400">✔</span> Ưu tiên sử dụng sản phẩm và dịch vụ của đồng đội.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-400">✔</span> Không lo lắng vấn đề lừa đảo nhờ cơ chế xác minh của Ban quản trị.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-400">✔</span> Hợp tác kinh doanh bền vững dựa trên sự thấu hiểu tử vi, vận mệnh chung.
              </li>
            </ul>
          </div>
          <div className="bg-neutral-900/20 border border-neutral-800 p-8 rounded-3xl backdrop-blur-sm space-y-4">
            <span className="text-3xl">🛡️</span>
            <h3 className="text-lg font-bold text-neutral-100">Cam kết bảo mật dữ liệu tuyệt đối</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Chúng tôi hiểu rằng thông tin cá nhân rất nhạy cảm. Vì thế, Kim Kê Connect thiết kế **cơ chế bảo mật 2 lớp**:
            </p>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Thông tin liên hệ của bạn (SĐT, Facebook) sẽ được che bớt trên trang web để tránh các cuộc gọi rác và các công cụ tự động cào quét dữ liệu. Chỉ có thành viên thật sự kết nối thông qua Messenger Chatbot mới lấy được thông tin của bạn.
            </p>
          </div>
        </div>
      </section>

      {/* Funnel Steps Section (Quy trình) */}
      <section className="bg-neutral-950/50 border-y border-neutral-900 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
            <h2 className="text-base font-semibold leading-7 text-amber-400">Phễu hoạt động</h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100">
              Cách thức kết nối trong 3 bước
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-neutral-900/30 border border-neutral-800 p-6 sm:p-8 rounded-3xl relative overflow-hidden backdrop-blur-sm">
              <div className="text-3xl mb-4">1️⃣</div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-100 mb-2">Đăng ký Hồ sơ</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Bạn điền form giới thiệu dịch vụ cung cấp và nhu cầu cần mua/tìm đối tác. Quá trình chỉ mất 1 phút và không cần mật khẩu.
              </p>
            </div>
            <div className="bg-neutral-900/30 border border-neutral-800 p-6 sm:p-8 rounded-3xl relative overflow-hidden backdrop-blur-sm">
              <div className="text-3xl mb-4">2️⃣</div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-100 mb-2">Ban quản trị duyệt</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Hồ sơ được xác thực đúng tuổi Tân Dậu 1981. AI tự động tối ưu hóa, gắn tag và sinh mã vector để nạp vào hệ thống tìm kiếm thông minh.
              </p>
            </div>
            <div className="bg-neutral-900/30 border border-neutral-800 p-6 sm:p-8 rounded-3xl relative overflow-hidden backdrop-blur-sm">
              <div className="text-3xl mb-4">3️⃣</div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-100 mb-2">Kết nối trên Messenger</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Vào Messenger của Page gõ từ khóa tự nhiên để tìm kiếm đồng đội. AI sẽ tự động ghép nối (Matching) cơ hội hợp tác cho bạn hằng ngày.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 📌 SECTION MỚI: FAQ (Câu hỏi thường gặp) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
          <h2 className="text-base font-semibold leading-7 text-amber-400">Giải đáp thắc mắc</h2>
          <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100">
            Câu hỏi thường gặp
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-neutral-900/30 border border-neutral-800 p-6 rounded-2xl">
            <h3 className="text-sm sm:text-base font-bold text-neutral-200">Q: Làm sao để được gắn nhãn "Đã xác minh" (Verified)?</h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
              A: Sau khi đăng ký và được duyệt hồ sơ cơ bản, bạn có thể thực hiện gia hạn hoặc nâng cấp trạng thái qua Telegram Bot của Ban quản trị. Nhãn Verified giúp hiển thị đầy đủ thông tin liên hệ và hình ảnh sản phẩm của bạn.
            </p>
          </div>
          <div className="bg-neutral-900/30 border border-neutral-800 p-6 rounded-2xl">
            <h3 className="text-sm sm:text-base font-bold text-neutral-200">Q: Mạng lưới này có thu phí hoa hồng giao dịch không?</h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
              A: Hoàn toàn không. Kim Kê Connect hoạt động với sứ mệnh phi lợi nhuận để hỗ trợ cộng đồng Tân Dậu 1981. Hai thành viên tự liên hệ trực tiếp ngoài bot và tự chịu trách nhiệm về giao dịch của mình.
            </p>
          </div>
          <div className="bg-neutral-900/30 border border-neutral-800 p-6 rounded-2xl">
            <h3 className="text-sm sm:text-base font-bold text-neutral-200">Q: Tôi có thể chỉnh sửa thông tin hồ sơ của mình sau khi gửi không?</h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
              A: Có. Bạn có thể gửi lại đăng ký mới với số điện thoại cũ, hệ thống sẽ tự động cập nhật đè thông tin mới và gửi yêu cầu phê duyệt cập nhật đến Ban quản trị.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action bottom */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-24 text-center">
        <div className="rounded-3xl border border-neutral-850 bg-gradient-to-b from-neutral-900 to-neutral-950 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100">
            Sẵn sàng kết nối cùng đồng đội 1981?
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            Hơn 1,000 thành viên Tân Dậu đã đăng ký dịch vụ của họ. Hãy đưa dịch vụ của bạn lên để đồng đội ưu tiên sử dụng.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="/dang-ky"
              className="rounded-full bg-amber-500 px-8 py-3.5 text-sm font-semibold text-neutral-950 shadow-md hover:bg-amber-400 transition-all hover:scale-105"
            >
              Đăng ký thành viên ngay
            </a>
          </div>
        </div>
      </section>

      {/* Decorative Blur Bottom */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 bg-gradient-to-tr from-amber-500 to-yellow-600 opacity-10 sm:left-[calc(50%+36rem)] sm:w-[72rem]" />
      </div>
    </div>
  );
}
