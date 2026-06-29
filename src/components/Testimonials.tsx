"use client";

import React, { useState, useEffect } from 'react';

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  avatar: string;
}

export default function Testimonials() {
  const testimonialsData: Testimonial[] = [
    {
      quote: "Từ khi gia nhập mạng lưới, tôi đã tìm được 3 đối tác kinh doanh đáng tin cậy. Làm việc với các bạn đồng niên 1981 bao giờ cũng dễ nói chuyện, thấu hiểu và hỗ trợ lẫn nhau hết mình.",
      name: "Bạn Trần Văn Mạnh",
      title: "Tư vấn thiết kế & Xây Dựng",
      avatar: "https://ui-avatars.com/api/?name=Tran+Manh&background=f59e0b&color=171717"
    },
    {
      quote: "Tôi rất thích văn hóa hỗ trợ chéo của nhóm. Sản phẩm Gốm sứ Bát Tràng của tôi được các bạn đồng niên ủng hộ nhiệt tình. Cảm giác cộng đồng vô cùng ấm áp và thiết thực.",
      name: "Bạn Lê Thị Hoài An",
      title: "Xưởng Gốm Bát Tràng Xuất Khẩu",
      avatar: "https://ui-avatars.com/api/?name=Hoai+An&background=d97706&color=171717"
    },
    {
      quote: "Tôi cần tìm đơn vị thi công gỗ nội thất và đã kết nối được ngay với một bạn Tân Dậu rất uy tín trong này. Chất lượng thi công tuyệt vời, chuẩn chỉ và giá cả đồng niên.",
      name: "Bạn Phạm Hoàng Long",
      title: "Nội Thất Gỗ Tự Nhiên",
      avatar: "https://ui-avatars.com/api/?name=Hoang+Long&background=fbbf24&color=171717"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex(prev => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex(prev => (prev === 0 ? testimonialsData.length - 1 : prev - 1));

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-neutral-900/40 relative overflow-hidden border-t border-neutral-900">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#f59e0b 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16 space-y-4">
          <span className="text-xs font-extrabold tracking-widest text-amber-400 uppercase">Đồng đội nói về chúng tôi</span>
          <h2 className="text-3xl font-black text-neutral-100 sm:text-4xl">Câu Chuyện Thành Công</h2>
          <p className="text-sm text-neutral-450 max-w-2xl mx-auto">Sự gắn kết của các bạn đồng niên Tân Dậu 1981 tạo nên sức mạnh giao thương vượt trội.</p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-neutral-900/60 backdrop-blur-md border border-neutral-850 rounded-3xl p-6 sm:p-12 text-center relative shadow-xl">
            {/* Icon bong bóng chat */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-neutral-950 shadow-lg text-xl font-bold">
              💬
            </div>
            
            <div className="transition-all duration-500 mt-4">
              {/* Đánh giá 5 sao */}
              <div className="flex justify-center mb-6 text-amber-400 gap-1 text-sm">
                {'★'.repeat(5)}
              </div>
              
              <p className="text-sm sm:text-lg lg:text-xl text-neutral-200 italic mb-8 leading-relaxed font-light px-2 sm:px-8">
                "{testimonialsData[currentIndex].quote}"
              </p>
              
              <div className="flex flex-col items-center gap-3">
                <img 
                  src={testimonialsData[currentIndex].avatar} 
                  alt={testimonialsData[currentIndex].name} 
                  className="w-14 h-14 rounded-full shadow-lg border-2 border-amber-500/30" 
                />
                <div>
                  <p className="font-extrabold text-neutral-100 text-sm sm:text-base">{testimonialsData[currentIndex].name}</p>
                  <p className="text-xs text-amber-400/80 font-semibold">{testimonialsData[currentIndex].title}</p>
                </div>
              </div>
            </div>

            {/* Nút chuyển đổi trái/phải */}
            <button 
              onClick={prevSlide} 
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-950/40 hover:bg-neutral-950/80 border border-neutral-800 text-neutral-300 hover:text-amber-400 transition-all text-sm sm:text-lg"
              aria-label="Previous slide"
            >
              ◀
            </button>
            <button 
              onClick={nextSlide} 
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-950/40 hover:bg-neutral-950/80 border border-neutral-800 text-neutral-300 hover:text-amber-400 transition-all text-sm sm:text-lg"
              aria-label="Next slide"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
