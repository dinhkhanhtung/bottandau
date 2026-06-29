-- ========================================================
-- DATABASE SCHEMA SETUP FOR KIM KE CONNECT (AI NETWORK)
-- Date: 2026-06-29
-- ========================================================

-- Kích hoạt extension hỗ trợ tính toán vector
CREATE EXTENSION IF NOT EXISTS vector;

-- ========================================================
-- 1. BẢNG THÔNG TIN CÁ NHÂN & TRẠNG THÁI (member_profiles)
-- ========================================================
CREATE TABLE IF NOT EXISTS member_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,             -- Đường dẫn Clean URL SEO (/member/fullname-slug)
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    facebook_link TEXT,
    zalo_link TEXT,
    website TEXT,
    avatar_url TEXT,                               -- Ảnh đại diện thành viên
    
    -- Trạng thái & Thu phí
    status VARCHAR(20) DEFAULT 'pending',          -- pending (chờ duyệt), active (đang hoạt động), suspended (tạm khóa)
    is_verified BOOLEAN DEFAULT FALSE,             -- Đã xác minh (Thay cho Premium)
    expired_at TIMESTAMP WITH TIME ZONE,           -- Hạn hiển thị Verified
    
    -- Uy tín & Đóng góp (Reputation)
    reputation_score INTEGER DEFAULT 0,            -- Điểm uy tín tổng hợp
    supported_count INTEGER DEFAULT 0,             -- Số người trong cộng đồng đã hỗ trợ
    referred_count INTEGER DEFAULT 0,
    donated_count INTEGER DEFAULT 0,               -- Số lần donate ủng hộ quỹ
    total_donated_amount NUMERIC DEFAULT 0,        -- Tổng số tiền đã donate              -- Số thành viên mới đã giới thiệu
    messenger_id VARCHAR(255),                     -- ID Messenger của thành viên dùng để đối chiếu quyền hạn
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- 2. BẢNG THÔNG TIN KINH DOANH & NĂNG LỰC (member_businesses)
-- ========================================================
CREATE TABLE IF NOT EXISTS member_businesses (
    id UUID PRIMARY KEY REFERENCES member_profiles(id) ON DELETE CASCADE,
    primary_job VARCHAR(255) NOT NULL,
    secondary_jobs TEXT[] DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    services TEXT[] DEFAULT '{}',
    products TEXT[] DEFAULT '{}',
    bio TEXT,
    ai_tags TEXT[] DEFAULT '{}',                   -- Tags tự động sinh bởi Gemini
    portfolio_images TEXT[] DEFAULT '{}',          -- Chỉ hiển thị đầy đủ nếu is_verified = TRUE
    
    -- AI Semantic Data
    profile_document TEXT,                         -- Văn bản tổng hợp dùng để embedding
    profile_embedding vector(768),                 -- Vector 768 chiều (Gemini text-embedding-004)
    map_embed_url TEXT,                            -- Link nhúng Google Maps địa chỉ cửa hàng
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- 3. BẢNG NHU CẦU & KẾT NỐI (member_connections)
-- ========================================================
CREATE TABLE IF NOT EXISTS member_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES member_profiles(id) ON DELETE CASCADE,
    needs TEXT,                                    -- Đang cần gì
    cooperation_opportunities TEXT,                -- Cơ hội hợp tác muốn tìm kiếm
    needs_embedding vector(768),                   -- Vector embedding của nhu cầu (phục vụ matching)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- 4. BẢNG BỘ NHỚ ĐỆM TÌM KIẾM (search_cache)
-- ========================================================
CREATE TABLE IF NOT EXISTS search_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT UNIQUE NOT NULL,                 -- Câu hỏi đã chuẩn hóa (lowercase, trim)
    question_embedding vector(768) NOT NULL,       -- Vector của câu hỏi để tái sử dụng
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- INDEXES TỐI ƯU TRUY VẤN
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_member_profiles_status ON member_profiles(status, expired_at);
CREATE INDEX IF NOT EXISTS idx_member_profiles_slug ON member_profiles(slug);

-- Index HNSW tối ưu tìm kiếm khoảng cách cosine cho vector (pgvector)
CREATE INDEX IF NOT EXISTS idx_member_businesses_embedding 
ON member_businesses 
USING hnsw (profile_embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_member_connections_embedding 
ON member_connections 
USING hnsw (needs_embedding vector_cosine_ops);

-- ========================================================
-- AUTOMATIC UPDATE UPDATED_AT TIMESTAMP TRIGGER
-- ========================================================
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_member_profiles_modtime
    BEFORE UPDATE ON member_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_member_connections_modtime
    BEFORE UPDATE ON member_connections
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- ========================================================
-- RPC FUNCTION: TÌM KIẾM SEMANTIC SEARCH (match_member_profiles)
-- ========================================================
CREATE OR REPLACE FUNCTION match_member_profiles (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  fullname VARCHAR(255),
  slug VARCHAR(255),
  phone VARCHAR(20),
  province VARCHAR(100),
  district VARCHAR(100),
  primary_job VARCHAR(255),
  bio TEXT,
  ai_tags TEXT[],
  is_verified BOOLEAN,
  reputation_score INTEGER,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.fullname,
    p.slug,
    p.phone,
    p.province,
    p.district,
    b.primary_job,
    b.bio,
    b.ai_tags,
    p.is_verified,
    p.reputation_score,
    1 - (b.profile_embedding <=> query_embedding) AS similarity
  FROM member_profiles p
  JOIN member_businesses b ON p.id = b.id
  WHERE p.status = 'active'
    AND (p.is_verified = FALSE OR p.expired_at > NOW()) -- Kiểm tra hạn Verified nếu có
    AND 1 - (b.profile_embedding <=> query_embedding) > match_threshold
  ORDER BY 
    p.is_verified DESC,                       -- Ưu tiên Verified lên trước
    similarity DESC,                          -- Sắp xếp theo độ trùng khớp nghĩa
    p.reputation_score DESC                   -- Ưu tiên điểm uy tín tiếp theo
  LIMIT match_count;
END;
$$;

-- ========================================================
-- KÍCH HOẠT TÍNH NĂNG REALTIME CHO BẢNG member_profiles
-- (Để trang web tự động nhận biết khi Admin duyệt hồ sơ)
-- ========================================================
begin;
  -- Xóa bảng khỏi publication nếu đã tồn tại để tránh lỗi trùng lặp
  alter publication supabase_realtime drop table if exists member_profiles;
  -- Thêm bảng vào publication realtime
  alter publication supabase_realtime add table member_profiles;
commit;

-- ========================================================
-- BẢNG LƯU TRỮ PHÂN BIỆT CHAT THƯỜNG VÀ CHAT BOT (MUTE BOT)
-- (Tạm dừng tự động trả lời khi khách yêu cầu gặp Admin)
-- ========================================================
CREATE TABLE IF NOT EXISTS messenger_mute_sessions (
    sender_id VARCHAR(255) PRIMARY KEY,
    mute_until TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ========================================================
-- CHÍNH SÁCH BẢO MẬT DỮ LIỆU CẤP CỘT (COLUMN-LEVEL SECURITY)
-- (Chặn hacker cào Số điện thoại/Zalo qua Supabase Anon Key)
-- ========================================================
-- Kích hoạt Row Level Security cho bảng thông tin cá nhân
ALTER TABLE member_profiles ENABLE ROW LEVEL SECURITY;

-- Thu hồi quyền select mặc định đối với tài khoản Anon (khách vãng lai trên web)
REVOKE SELECT ON member_profiles FROM anon;

-- Chỉ cho phép Anon Key truy cập các cột thông tin công khai không nhạy cảm
GRANT SELECT (
  id, fullname, slug, province, district, avatar_url, 
  status, is_verified, reputation_score, supported_count, 
  referred_count, expired_at, created_at, donated_count, total_donated_amount
) ON member_profiles TO anon;

-- Cho phép tài khoản Authenticated (nếu có) và Service Role (Next.js Server Admin) truy cập đầy đủ các cột
GRANT SELECT, INSERT, UPDATE, DELETE ON member_profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON member_profiles TO postgres;

-- Tạo Policy cơ bản cho phép Anon Key chỉ được đọc các hồ sơ ở trạng thái active
CREATE POLICY select_active_profiles ON member_profiles
    FOR SELECT
    TO anon
    USING (status = 'active');


-- ========================================================
-- BẢNG SẢN PHẨM / DỊCH VỤ TRƯNG BÀY (member_products)
-- (Đặc quyền dành cho thành viên có đóng góp)
-- ========================================================
CREATE TABLE IF NOT EXISTS member_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES member_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price NUMERIC,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kích hoạt Row Level Security cho bảng sản phẩm
ALTER TABLE member_products ENABLE ROW LEVEL SECURITY;

-- Cấp quyền truy cập cho Anon Key và Admin Key
GRANT SELECT ON member_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON member_products TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON member_products TO postgres;

-- Tạo Policy cho phép Anon Key đọc sản phẩm của các thành viên đang hoạt động (active)
CREATE POLICY select_active_products ON member_products
    FOR SELECT
    TO anon
    USING (
        EXISTS (
            SELECT 1 FROM member_profiles 
            WHERE member_profiles.id = member_products.member_id 
            AND member_profiles.status = 'active'
        )
    );


