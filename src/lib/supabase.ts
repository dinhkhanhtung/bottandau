import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Kiểm tra tính hợp lệ của URL
const isValidUrl = supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://');

// Client thông thường dùng cho các query công khai (chỉ khởi tạo nếu URL hợp lệ để tránh crash khi build Next.js)
export const supabase = isValidUrl 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : (null as any);

// Client đặc quyền cao dùng ở backend (Server Actions / API Routes) để bypass RLS, cập nhật vector
export const getSupabaseAdmin = () => {
  if (!isValidUrl || !supabaseServiceKey) {
    // Trả về client rỗng để tránh crash lúc build, chỉ báo lỗi khi chạy runtime thực tế
    return null as any;
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
