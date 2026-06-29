'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { registerMemberAction } from './actions';

export default function RegisterPage() {
  const router = useRouter();
  const [activeQuestion, setActiveQuestion] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    email: '',
    province: 'Thái Nguyên',
    district: '',
    facebook_link: '',
    zalo_link: '',
    website: '',
    primary_job: '',
    secondary_jobs: '',
    skills: '',
    services: '',
    products: '',
    bio: '',
    needs: '',
    cooperation_opportunities: '',
  });

  // Tự động focus vào input mỗi khi chuyển câu hỏi
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeQuestion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Validate từng câu hỏi trước khi cho qua câu tiếp theo
  const validateQuestion = (qIndex: number) => {
    setErrorMsg(null);
    if (qIndex === 1 && !formData.fullname.trim()) {
      setErrorMsg('Vui lòng điền Họ và tên của bạn.');
      return false;
    }
    if (qIndex === 2 && !formData.phone.trim()) {
      setErrorMsg('Vui lòng điền Số điện thoại liên hệ.');
      return false;
    }
    if (qIndex === 4 && !formData.province.trim()) {
      setErrorMsg('Vui lòng điền Tỉnh / Thành phố nơi bạn hoạt động.');
      return false;
    }
    if (qIndex === 5 && !formData.primary_job.trim()) {
      setErrorMsg('Vui lòng điền Nghề nghiệp chính của bạn.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateQuestion(activeQuestion)) {
      if (activeQuestion < 8) {
        setActiveQuestion((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    if (activeQuestion > 1) {
      setActiveQuestion((prev) => prev - 1);
    }
  };

  // Hỗ trợ nhấn Enter để đi tiếp
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // Nếu đang ở câu hỏi cuối hoặc textarea thì không tự động Next khi nhấn Enter
      if (activeQuestion === 8 || inputRef.current?.tagName === 'TEXTAREA') {
        return;
      }
      e.preventDefault();
      handleNext();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateQuestion(8)) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        data.append(key, val);
      });
      
      if (avatarFile) {
        data.append('avatar_file', avatarFile);
      }

      const result = await registerMemberAction(data);
      if (result.success) {
        if (result.redirect) {
          router.push(result.redirect);
        }
      } else {
        setErrorMsg(result.error || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
        setLoading(false);
      }
    } catch (err) {
      setErrorMsg('Lỗi mạng hoặc hệ thống. Vui lòng kiểm tra kết nối.');
      setLoading(false);
    }
  };

  // Tổng số câu hỏi của Typeform
  const TOTAL_QUESTIONS = 8;
  const progressPercent = Math.round(((activeQuestion - 1) / (TOTAL_QUESTIONS - 1)) * 100);

  return (
    <div className="relative isolate overflow-hidden bg-neutral-950 py-12 sm:py-24 flex-grow flex flex-col justify-between min-h-[80vh]">
      {/* Background decoration */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-amber-500 to-yellow-600 opacity-15 sm:left-[calc(50%-30rem)] sm:w-[72rem]" />
      </div>

      {/* Progress Bar ở trên cùng màn hình */}
      <div className="w-full max-w-2xl mx-auto px-6">
        <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">
          <span>Hồ sơ Kim Kê Connect</span>
          <span className="text-amber-400">Hoàn thành {progressPercent}%</span>
        </div>
        <div className="w-full bg-neutral-900 rounded-full h-1 border border-neutral-850">
          <div 
            className="bg-gradient-to-r from-amber-400 to-yellow-500 h-1 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent === 0 ? 5 : progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Container của Typeform */}
      <div className="mx-auto max-w-2xl px-6 w-full flex-grow flex items-center justify-center py-8">
        <div className="w-full min-h-[300px] flex flex-col justify-center relative">
          
          {errorMsg && (
            <div className="absolute -top-12 left-0 right-0 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 animate-pulse">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Câu hỏi 1: Họ tên */}
          {activeQuestion === 1 && (
            <div className="space-y-6 animate-fade-in text-left">
              <span className="text-amber-400 text-sm font-bold font-mono">01 →</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-100">
                Họ và tên đầy đủ của bạn là gì? *
              </h2>
              <input
                ref={inputRef as any}
                type="text"
                name="fullname"
                required
                value={formData.fullname}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Nhập tên của bạn..."
                className="w-full border-b-2 border-neutral-800 bg-transparent py-3 text-xl sm:text-2xl text-neutral-100 placeholder-neutral-700 focus:border-amber-500 focus:outline-none transition-colors"
              />
              <p className="text-xs text-neutral-500">Ấn <span className="font-mono text-neutral-400 bg-neutral-900 px-1 py-0.5 rounded">Enter ↵</span> để tiếp tục</p>
            </div>
          )}

          {/* Câu hỏi 2: Số điện thoại */}
          {activeQuestion === 2 && (
            <div className="space-y-6 animate-fade-in text-left">
              <span className="text-amber-400 text-sm font-bold font-mono">02 →</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-100">
                Số điện thoại Zalo để đồng đội liên lạc? *
              </h2>
              <input
                ref={inputRef as any}
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Nhập số điện thoại..."
                className="w-full border-b-2 border-neutral-800 bg-transparent py-3 text-xl sm:text-2xl text-neutral-100 placeholder-neutral-700 focus:border-amber-500 focus:outline-none transition-colors"
              />
              <p className="text-xs text-neutral-500">Ấn <span className="font-mono text-neutral-400 bg-neutral-900 px-1 py-0.5 rounded">Enter ↵</span> để tiếp tục</p>
            </div>
          )}

          {/* Câu hỏi 3: Upload Avatar */}
          {activeQuestion === 3 && (
            <div className="space-y-6 animate-fade-in text-left">
              <span className="text-amber-400 text-sm font-bold font-mono">03 →</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-100">
                Tải lên ảnh đại diện (Avatar) của bạn
              </h2>
              <p className="text-sm text-neutral-400">
                Một bức ảnh khuôn mặt rõ nét giúp tăng 90% sự tin cậy từ đồng đội khi kết nối.
              </p>
              <div className="flex items-center gap-6 pt-2">
                <div className="h-20 w-20 rounded-full bg-neutral-900 border-2 border-neutral-850 flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl">📸</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20 file:cursor-pointer"
                />
              </div>
              <p className="text-xs text-neutral-500">Ấn nút <span className="text-amber-400 font-bold">Tiếp tục</span> ở bên dưới để qua bước tiếp theo</p>
            </div>
          )}

          {/* Câu hỏi 4: Khu vực hoạt động */}
          {activeQuestion === 4 && (
            <div className="space-y-6 animate-fade-in text-left">
              <span className="text-amber-400 text-sm font-bold font-mono">04 →</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-100">
                Khu vực bạn sinh sống và làm việc? *
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-neutral-500 uppercase tracking-wider mb-2 font-bold">Tỉnh / Thành phố *</label>
                  <input
                    ref={inputRef as any}
                    type="text"
                    name="province"
                    required
                    value={formData.province}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ví dụ: Thái Nguyên"
                    className="w-full border-b-2 border-neutral-800 bg-transparent py-2 text-lg text-neutral-100 placeholder-neutral-700 focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 uppercase tracking-wider mb-2 font-bold">Quận / Huyện (Tùy chọn)</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ví dụ: TP. Thái Nguyên"
                    className="w-full border-b-2 border-neutral-800 bg-transparent py-2 text-lg text-neutral-100 placeholder-neutral-700 focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <p className="text-xs text-neutral-500">Ấn <span className="font-mono text-neutral-400 bg-neutral-900 px-1 py-0.5 rounded">Enter ↵</span> để tiếp tục</p>
            </div>
          )}

          {/* Câu hỏi 5: Nghề nghiệp chính */}
          {activeQuestion === 5 && (
            <div className="space-y-6 animate-fade-in text-left">
              <span className="text-amber-400 text-sm font-bold font-mono">05 →</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-100">
                Nghề nghiệp kinh doanh chính của bạn là gì? *
              </h2>
              <input
                ref={inputRef as any}
                type="text"
                name="primary_job"
                required
                value={formData.primary_job}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Ví dụ: Y học cổ truyền, Sửa khóa, Cơ điện..."
                className="w-full border-b-2 border-neutral-800 bg-transparent py-3 text-xl sm:text-2xl text-neutral-100 placeholder-neutral-700 focus:border-amber-500 focus:outline-none transition-colors"
              />
              <p className="text-xs text-neutral-500">Ấn <span className="font-mono text-neutral-400 bg-neutral-900 px-1 py-0.5 rounded">Enter ↵</span> để tiếp tục</p>
            </div>
          )}

          {/* Câu hỏi 6: Sản phẩm & Dịch vụ */}
          {activeQuestion === 6 && (
            <div className="space-y-6 animate-fade-in text-left">
              <span className="text-amber-400 text-sm font-bold font-mono">06 →</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-100">
                Các sản phẩm & dịch vụ bạn cung cấp?
              </h2>
              <p className="text-sm text-neutral-400">Tách biệt bằng dấu phẩy để AI ghi nhận chính xác.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-neutral-500 uppercase tracking-wider mb-2 font-bold">Dịch vụ cung cấp</label>
                  <input
                    ref={inputRef as any}
                    type="text"
                    name="services"
                    value={formData.services}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Châm cứu, Sửa khóa tại nhà..."
                    className="w-full border-b-2 border-neutral-800 bg-transparent py-2 text-lg text-neutral-100 placeholder-neutral-700 focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 uppercase tracking-wider mb-2 font-bold">Sản phẩm chủ lực</label>
                  <input
                    type="text"
                    name="products"
                    value={formData.products}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Trà thảo dược, Phôi chìa khóa..."
                    className="w-full border-b-2 border-neutral-800 bg-transparent py-2 text-lg text-neutral-100 placeholder-neutral-700 focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <p className="text-xs text-neutral-500">Ấn <span className="font-mono text-neutral-400 bg-neutral-900 px-1 py-0.5 rounded">Enter ↵</span> để tiếp tục</p>
            </div>
          )}

          {/* Câu hỏi 7: Nhu cầu kết nối (AI Matching) */}
          {activeQuestion === 7 && (
            <div className="space-y-6 animate-fade-in text-left">
              <span className="text-amber-400 text-sm font-bold font-mono">07 →</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-100">
                Bạn đang cần tìm kiếm gì và mong muốn cơ hội hợp tác nào?
              </h2>
              <p className="text-sm text-neutral-400">Trí tuệ Nhân tạo sẽ sử dụng thông tin này để tự động ghép nối giao thương cho bạn.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] text-neutral-500 uppercase tracking-wider mb-2 font-bold">Nhu cầu đang cần tìm</label>
                  <input
                    ref={inputRef as any}
                    type="text"
                    name="needs"
                    value={formData.needs}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ví dụ: Tìm sỉ phôi chìa khóa, Tìm đại lý sỉ miền Nam..."
                    className="w-full border-b-2 border-neutral-800 bg-transparent py-2 text-lg text-neutral-100 placeholder-neutral-700 focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 uppercase tracking-wider mb-2 font-bold">Cơ hội hợp tác mong muốn</label>
                  <input
                    type="text"
                    name="cooperation_opportunities"
                    value={formData.cooperation_opportunities}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhận đại lý ký gửi, Nhận gia công..."
                    className="w-full border-b-2 border-neutral-800 bg-transparent py-2 text-lg text-neutral-100 placeholder-neutral-700 focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <p className="text-xs text-neutral-500">Ấn <span className="font-mono text-neutral-400 bg-neutral-900 px-1 py-0.5 rounded">Enter ↵</span> để tiếp tục</p>
            </div>
          )}

          {/* Câu hỏi 8: Giới thiệu bản thân & Submit */}
          {activeQuestion === 8 && (
            <div className="space-y-6 animate-fade-in text-left">
              <span className="text-amber-400 text-sm font-bold font-mono">08 →</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-100">
                Hãy giới thiệu ngắn gọn về thế mạnh của bạn?
              </h2>
              <textarea
                ref={inputRef as any}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Kinh nghiệm công tác, cửa hàng hoặc các điểm nổi bật của bạn để thu hút đồng đội..."
                className="w-full border border-neutral-800 bg-neutral-950/60 rounded-2xl p-4 text-sm text-neutral-100 placeholder-neutral-700 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors resize-none"
              />
              <p className="text-[10px] text-neutral-500 leading-normal">
                🔒 Bằng việc gửi đăng ký, bạn xác nhận thông tin cung cấp là chính xác và đồng ý gia nhập mạng lưới kết nối Kim Kê AI Network dành cho Tân Dậu 1981.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Điều hướng Footer (Next / Back) chuẩn Typeform */}
      <div className="w-full max-w-2xl mx-auto px-6 flex justify-between items-center">
        <div>
          {activeQuestion > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="rounded-full border border-neutral-850 px-5 py-2 text-xs font-semibold text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              ← Quay lại
            </button>
          )}
        </div>

        <div>
          {activeQuestion < TOTAL_QUESTIONS ? (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-full bg-amber-500 px-6 py-2.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/10"
            >
              Tiếp tục <span className="text-[10px] opacity-70">(Enter)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-8 py-3 text-xs font-bold text-neutral-950 hover:from-amber-400 hover:to-yellow-400 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-neutral-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang xử lý hồ sơ...
                </>
              ) : (
                'Gửi hồ sơ đăng ký 🚀'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
