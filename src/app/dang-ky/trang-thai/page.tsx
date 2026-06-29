'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface ProfileInfo {
  id: string;
  fullname: string;
  phone: string;
  province: string;
  district?: string;
  status: string;
  is_verified: boolean;
  slug: string;
}

function StatusPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const phone = searchParams.get('phone');
  
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Fetch dữ liệu profile ban đầu
  useEffect(() => {
    if (!phone) {
      setErrorMsg('Thiếu thông tin số điện thoại trong đường dẫn.');
      setLoading(false);
      return;
    }

    async function fetchStatus() {
      try {
        const { data, error } = await supabase
          .from('member_profiles')
          .select('id, fullname, phone, province, district, status, is_verified, slug')
          .eq('phone', phone)
          .single();

        if (error || !data) {
          setErrorMsg('Không tìm thấy thông tin đăng ký cho số điện thoại này.');
        } else {
          setProfile(data);
        }
      } catch (err) {
        setErrorMsg('Lỗi kết nối cơ sở dữ liệu.');
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
  }, [phone]);

  // 2. Thiết lập Supabase Realtime để lắng nghe cập nhật trạng thái duyệt từ Admin (Telegram)
  useEffect(() => {
    if (!phone || !profile) return;

    // Lắng nghe sự kiện UPDATE trên bảng member_profiles cho số điện thoại này
    const channel = supabase
      .channel(`profile-status-${phone}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'member_profiles',
          filter: `phone=eq.${phone}`,
        },
        (payload: any) => {
          console.log('Phát hiện cập nhật trạng thái realtime:', payload.new);
          if (payload.new) {
            setProfile((prev) => 
              prev ? { 
                ...prev, 
                status: payload.new.status,
                is_verified: payload.new.is_verified 
              } : null
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [phone, profile]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-neutral-950 text-neutral-400">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-amber-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm font-medium">Đang tải trạng thái hồ sơ...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !profile) {
    return (
      <div className="flex-grow flex items-center justify-center bg-neutral-950 text-neutral-400 px-4">
        <div className="max-w-md w-full text-center bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl backdrop-blur-md">
          <span className="text-4xl">⚠️</span>
          <h1 className="text-xl font-bold text-neutral-100 mt-4">Có lỗi xảy ra</h1>
          <p className="text-sm text-neutral-500 mt-2">{errorMsg}</p>
          <button
            onClick={() => router.push('/dang-ky')}
            className="mt-6 inline-block rounded-full bg-amber-500 px-6 py-2 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors"
          >
            Quay lại trang Đăng ký
          </button>
        </div>
      </div>
    );
  }

  const isPending = profile.status === 'pending';
  const isActive = profile.status === 'active';

  return (
    <div className="relative isolate overflow-hidden bg-neutral-950 py-16 sm:py-24 flex-grow flex items-center justify-center">
      {/* Background gradients */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-amber-500 to-yellow-600 opacity-15 sm:left-[calc(50%-30rem)] sm:w-[72rem]" />
      </div>

      <div className="mx-auto max-w-xl px-4 sm:px-6 w-full">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-8 shadow-2xl backdrop-blur-md text-center">
          
          {/* 🟡 TRẠNG THÁI CHỜ DUYỆT */}
          {isPending && (
            <div>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 ring-1 ring-amber-500/30">
                <span className="text-2xl animate-pulse">⏳</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-100 mt-6">
                Hồ Sơ Đang Chờ Duyệt
              </h1>
              <p className="mt-4 text-sm leading-6 text-neutral-400">
                Chào anh/chị <span className="font-semibold text-amber-400">{profile.fullname}</span>. 
                Hồ sơ của bạn đã được gửi thành công đến hệ thống và đang chờ Ban quản trị xét duyệt.
              </p>
              
              <div className="mt-8 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-left space-y-2 text-xs text-neutral-500">
                <div className="flex justify-between"><span className="font-medium text-neutral-400">Số điện thoại:</span> <span>{profile.phone}</span></div>
                <div className="flex justify-between"><span className="font-medium text-neutral-400">Khu vực:</span> <span>{profile.province}{profile.district ? ` - ${profile.district}` : ''}</span></div>
                <div className="flex justify-between"><span className="font-medium text-neutral-400">Trạng thái:</span> <span className="text-amber-400 font-bold">Đang chờ duyệt</span></div>
              </div>

              <div className="mt-8 border-t border-neutral-800 pt-6">
                <p className="text-xs text-neutral-500">
                  💡 *Mẹo*: Vui lòng không đóng trang này. Khi Ban quản trị phê duyệt hồ sơ, trang web sẽ tự động cập nhật trạng thái ngay lập tức!
                </p>
              </div>
            </div>
          )}

          {/* 🟢 TRẠNG THÁI ĐÃ PHÊ DUYỆT */}
          {isActive && (
            <div className="animate-fade-in">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 ring-1 ring-green-500/30">
                <span className="text-2xl">🎉</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-100 mt-6">
                Duyệt Hồ Sơ Thành Công!
              </h1>
              <p className="mt-4 text-sm leading-6 text-neutral-400">
                Chúc mừng anh/chị <span className="font-semibold text-green-400">{profile.fullname}</span> đã được xác thực gia nhập mạng lưới **Kim Kê Connect**.
              </p>

              <div className="mt-6 inline-flex rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400 ring-1 ring-inset ring-green-500/20">
                Trạng thái: Đang hoạt động
              </div>

              {/* Hướng dẫn tiếp theo */}
              <div className="mt-8 space-y-4">
                <a
                  href={`https://m.me/2571120902929642?ref=link_phone_${profile.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-full bg-amber-500 py-3 text-sm font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-md text-center"
                >
                  Kích hoạt & Trải nghiệm trên Messenger 💬
                </a>
                <a
                  href={`/member/${profile.slug}`}
                  className="block w-full rounded-full border border-neutral-800 py-3 text-sm font-semibold text-neutral-300 hover:bg-neutral-800 transition-colors"
                >
                  Xem Trang Hồ Sơ Cá Nhân (SEO)
                </a>
              </div>

              <div className="mt-8 border-t border-neutral-800 pt-6">
                <p className="text-xs text-neutral-500">
                  Mã giới thiệu của bạn: <span className="font-mono font-bold text-neutral-300">TD1981-{profile.id.slice(0, 8).toUpperCase()}</span>.
                  Hãy gửi mã này cho các đồng đội Tân Dậu khác khi đăng ký để tăng điểm Uy tín (Reputation) cho tài khoản của bạn!
                </p>
              </div>
            </div>
          )}

          {/* 🔴 CÁC TRẠNG THÁI KHÁC (Tạm khóa) */}
          {!isPending && !isActive && (
            <div>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/30">
                <span className="text-2xl">🔒</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-100 mt-6">
                Hồ Sơ Đang Tạm Khóa
              </h1>
              <p className="mt-4 text-sm leading-6 text-neutral-400">
                Hồ sơ của số điện thoại này đang ở trạng thái: <span className="font-semibold text-red-400">{profile.status}</span>.
                Vui lòng liên hệ với Ban quản trị để biết thêm chi tiết.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense fallback={
      <div className="flex-grow flex items-center justify-center bg-neutral-950 text-neutral-400 min-h-[50vh]">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-amber-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-xs text-neutral-500">Đang tải thông tin trạng thái...</p>
        </div>
      </div>
    }>
      <StatusPageContent />
    </Suspense>
  );
}
