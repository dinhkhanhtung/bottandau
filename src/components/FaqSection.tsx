"use client";

import React, { useState } from 'react';

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Mặc định mở sẵn câu 1 (index 0)

  const faqs: FaqItem[] = [
    { 
      q: "1. Tôi sinh năm khác 1981 có tham gia được không?", 
      a: "Rất tiếc, hiện tại cộng đồng này chỉ dành riêng cho tuổi Tân Dậu 1981 nhằm đảm bảo sự đồng điệu, uy tín tuyệt đối và chắp cánh tình đồng niên tương trợ lẫn nhau." 
    },
    { 
      q: "2. Làm thế nào để mở khóa xem số điện thoại đầy đủ?", 
      a: "Bạn chỉ cần điền đơn đăng ký thành viên trên trang web này. Sau khi Ban quản trị duyệt hồ sơ thành công, trên trang web sẽ có nút bấm để bạn liên kết tài khoản Messenger trong 1 giây. Từ đó về sau, bạn sẽ xem được đầy đủ số điện thoại của tất cả các đồng đội khác khi tra cứu trên Bot." 
    },
    { 
      q: "3. Làm thế nào để tôi biết đối tác kinh doanh là uy tín?", 
      a: "Chúng tôi có hệ thống đánh giá sao (⭐⭐⭐⭐⭐) dựa trên tích điểm hoạt động thực tế. Dấu tích vàng Verified khẳng định thành viên đã được Ban quản trị xác minh danh tính và đóng góp cho quỹ hoạt động của cộng đồng." 
    },
    { 
      q: "4. Giao dịch mua bán trên này có an toàn không?", 
      a: "Kim Kê Connect đóng vai trò là mạng lưới kết nối giúp đồng đội tìm thấy nhau. Mọi giao dịch, thanh toán sẽ do hai bên tự liên hệ trao đổi trực tiếp qua Zalo/Messenger cá nhân. Hãy ưu tiên giao dịch với các thành viên có nhãn Verified và điểm uy tín cao." 
    },
    { 
      q: "5. Thông tin cá nhân của tôi được bảo vệ như thế nào?", 
      a: "Website của chúng tôi được thiết kế với cơ chế bảo mật phân quyền cấp cột cao cấp. Hacker hay các robot cào quét số điện thoại công khai trên mạng sẽ bị chặn hoàn toàn. Số điện thoại của bạn chỉ được mã hóa và hiển thị đối với những đồng đội Tân Dậu 1981 thực thụ đã được xác minh danh tính." 
    }
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={index} 
            className="rounded-2xl border border-neutral-850 bg-neutral-900/10 overflow-hidden hover:border-amber-500/10 transition-colors shadow-sm"
          >
            {/* Nút bấm câu hỏi */}
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex justify-between items-center p-5 text-left bg-neutral-900/5 hover:bg-neutral-900/20 transition-colors"
            >
              <span className="font-bold text-xs sm:text-sm text-neutral-100 pr-4">{faq.q}</span>
              <span className={`text-neutral-500 text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            {/* Nội dung câu trả lời (Accordion Collapse) */}
            <div 
              className={`transition-all duration-300 ease-in-out bg-neutral-950/20 overflow-hidden ${
                isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-5 text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-neutral-850">
                {faq.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
