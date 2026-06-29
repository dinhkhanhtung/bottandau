"use client";

import React, { useState, useEffect } from 'react';

interface ChatScenario {
  query: string;
  response: string;
  cardTitle: string;
  cardSubtitle: string;
  rating: number;
  userAction: string;
}

export default function PhoneMockup() {
  const scenarios: ChatScenario[] = [
    {
      query: "Cần tìm đồng đội làm Đông y châm cứu ở Thái Nguyên.",
      response: "Đã tìm thấy 3 đồng đội Tân Dậu hoạt động trong ngành Đông y tại Thái Nguyên. Đây là phòng khám uy tín nhất:",
      cardTitle: "Lương y Đinh Khánh Tùng",
      cardSubtitle: "Phòng Khám Y Học Cổ Truyền DKT",
      rating: 5.0,
      userAction: "Tuyệt vời! Ưu tiên kết nối hàng đồng niên 👍"
    },
    {
      query: "Tìm người thiết kế website chuyên nghiệp.",
      response: "Có 5 bạn Tân Dậu chuyên thiết kế web và lập trình hệ thống. Đây là đề xuất hàng đầu từ AI:",
      cardTitle: "Bạn Nguyễn Minh Tuấn",
      cardSubtitle: "Công Ty Giải Pháp Công Nghệ Số",
      rating: 4.9,
      userAction: "Kết nối ngay, cảm ơn Bot AI!"
    },
    {
      query: "Cần nguồn cung cấp chè sạch đặc sản Thái Nguyên.",
      response: "Đây là nhà vườn chè hữu cơ xuất khẩu của bạn đồng niên Tân Dậu:",
      cardTitle: "Chị Trần Thanh Mai",
      cardSubtitle: "Hợp Tác Xã Trà Xanh Tân Cương",
      rating: 4.8,
      userAction: "Đặt thử 10kg làm quà biếu đồng đội."
    }
  ];

  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timers: ReturnType<typeof setTimeout>[] = [];

    // Luồng chạy tin nhắn mô phỏng
    timers.push(setTimeout(() => setStep(1), 1000)); // Hiện câu hỏi của user
    timers.push(setTimeout(() => setStep(2), 2200)); // Bot typing...
    timers.push(setTimeout(() => setStep(3), 3800)); // Hiện câu trả lời bot
    timers.push(setTimeout(() => setStep(4), 4800)); // Hiện card sản phẩm
    timers.push(setTimeout(() => setStep(5), 6200)); // Hiện hành động phản hồi của user
    
    // Reset và chuyển kịch bản tiếp theo
    timers.push(setTimeout(() => {
      setStep(0);
      setCurrentScenarioIndex((prev) => (prev + 1) % scenarios.length);
    }, 10000));

    return () => timers.forEach(clearTimeout);
  }, [currentScenarioIndex]);

  const scenario = scenarios[currentScenarioIndex];

  return (
    <div className="relative mx-auto w-[280px] sm:w-[310px] h-[550px] bg-neutral-950 rounded-[38px] shadow-2xl border-[6px] border-neutral-800 overflow-hidden ring-1 ring-neutral-800 backdrop-blur-md transition-all duration-500">
      
      {/* Dynamic Island (Tai thỏ màn hình) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-28 bg-neutral-800 rounded-b-xl z-30"></div>
      
      {/* Khung chứa App chat */}
      <div className="absolute inset-0 w-full h-full bg-neutral-950 flex flex-col justify-between font-sans">
        
        {/* Header App Bar */}
        <div className="h-16 bg-neutral-900 border-b border-neutral-850 flex items-end pb-2.5 px-4 gap-2.5 z-20 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-neutral-950 font-black text-[10px] overflow-hidden shadow-md">
            🐓
          </div>
          <div className="space-y-0.5 mb-0.5">
            <div className="text-[11px] font-black text-neutral-100 tracking-tight">Trợ lý Kim Kê AI Bot</div>
            <div className="text-[8px] text-amber-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
              Đang hoạt động
            </div>
          </div>
        </div>

        {/* Khung chat nội dung (Chat Area) */}
        <div className="flex-1 p-3.5 space-y-3.5 bg-neutral-950 overflow-hidden flex flex-col justify-start">
          
          {/* 1. Tin nhắn của User */}
          {step >= 1 && (
            <div className="self-end max-w-[85%] animate-fade-in-up">
              <div className="bg-amber-500 text-neutral-950 p-2.5 rounded-2xl rounded-tr-none shadow-md text-[10px] sm:text-xs font-bold leading-normal">
                {scenario.query}
              </div>
            </div>
          )}

          {/* 2. Bot đang soạn tin (Typing indicator) */}
          {step === 2 && (
            <div className="self-start flex gap-2 items-end animate-fade-in-up">
              <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-neutral-950 text-[8px] font-black">🐓</div>
              <div className="bg-neutral-900 p-2.5 rounded-2xl rounded-tl-none border border-neutral-850 flex gap-1 items-center">
                <span className="w-1 h-1 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1 h-1 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1 h-1 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}

          {/* 3. Phản hồi văn bản của Bot */}
          {step >= 3 && (
            <div className="self-start flex gap-2 items-end animate-fade-in-up">
              <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-neutral-950 text-[8px] font-black">🐓</div>
              <div className="bg-neutral-900 p-2.5 rounded-2xl rounded-tl-none border border-neutral-850 text-[10px] sm:text-xs text-neutral-300 max-w-[85%] leading-relaxed">
                {scenario.response}
              </div>
            </div>
          )}

          {/* 4. Thẻ Card hồ sơ thành viên do bot gửi */}
          {step >= 4 && (
            <div className="self-start ml-7 animate-fade-in-left">
              <div className="bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden shadow-lg w-40 sm:w-44 hover:border-amber-500/20 transition-all">
                <div className="h-16 bg-gradient-to-br from-amber-500/10 to-amber-600/5 relative flex items-center justify-center border-b border-neutral-850">
                  <span className="text-3xl">🌟</span>
                  <div className="absolute top-2 right-2 bg-amber-500 text-neutral-950 text-[7px] px-1.5 py-0.5 rounded-full font-black uppercase">
                    Verified
                  </div>
                </div>
                <div className="p-2">
                  <h4 className="font-bold text-neutral-200 text-[10px] sm:text-xs truncate">{scenario.cardTitle}</h4>
                  <p className="text-[8px] text-neutral-500 mt-0.5 truncate">{scenario.cardSubtitle}</p>
                  
                  <div className="flex items-center gap-1 mt-1 text-[8px] font-extrabold text-amber-400">
                    <span>{'⭐'.repeat(Math.floor(scenario.rating))}</span>
                    <span className="text-neutral-400">({scenario.rating})</span>
                  </div>
                  
                  <button className="mt-2.5 w-full bg-amber-500 text-neutral-950 text-[9px] font-black py-1.5 rounded-lg hover:bg-amber-400 transition-colors shadow-sm">
                    Kết nối ngay 💬
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. Phản hồi hài lòng của User */}
          {step >= 5 && (
            <div className="self-end max-w-[85%] animate-fade-in-up">
              <div className="bg-amber-500 text-neutral-950 p-2.5 rounded-2xl rounded-tr-none shadow-md text-[10px] sm:text-xs font-bold">
                {scenario.userAction}
              </div>
            </div>
          )}

        </div>

        {/* Khung gõ tin nhắn dưới cùng (Input Area) */}
        <div className="h-14 bg-neutral-900 border-t border-neutral-850 flex items-center px-3 gap-2 z-20">
          <div className="w-6 h-6 rounded-full bg-neutral-950 border border-neutral-800 text-neutral-500 flex items-center justify-center text-xs font-bold">
            +
          </div>
          <div className="flex-1 h-8 bg-neutral-950 border border-neutral-850 rounded-full flex items-center px-3 overflow-hidden">
            <span className="text-[9px] sm:text-[10px] text-neutral-600 truncate">
              Nhập nhu cầu giao thương của bạn...
            </span>
          </div>
          <div className="text-amber-500 text-sm transform rotate-45 mr-1 font-bold">
            ➤
          </div>
        </div>

      </div>
    </div>
  );
}
