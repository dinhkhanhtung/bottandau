import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

interface MemberDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Sinh Metadata động cho SEO Google (Hỗ trợ chia sẻ chi tiết sản phẩm)
export async function generateMetadata({ params, searchParams }: MemberDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { product: productId } = await searchParams;
  
  const client = getSupabaseClient();
  if (!client) return { title: 'Hồ sơ thành viên | Kim Kê Connect' };

  // Fetch thông tin profile
  const { data: member } = await client
    .from('member_profiles')
    .select('id, fullname, province, avatar_url, member_businesses(primary_job, bio)')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (!member) {
    return {
      title: 'Không tìm thấy thành viên | Kim Kê Connect',
    };
  }

  const biz = (member as any).member_businesses || {};
  let title = `${member.fullname} - Chuyên ${biz.primary_job} tại ${member.province} | Kim Kê Connect`;
  let description = biz.bio || `Kết nối với ${member.fullname} chuyên ${biz.primary_job} tại ${member.province} trên mạng lưới Kim Kê AI Connect.`;
  let ogImage = member.avatar_url || '/images/kimke_share_banner.png';

  // 🛍️ Nếu chia sẻ link sản phẩm cụ thể (?product=id)
  if (productId && typeof productId === 'string') {
    const { data: product } = await client
      .from('member_products')
      .select('*')
      .eq('id', productId)
      .eq('member_id', member.id)
      .single();

    if (product) {
      const priceText = product.price ? `${Number(product.price).toLocaleString('vi-VN')} đ` : 'Giá: Liên hệ';
      title = `${product.name} [${priceText}] - Cung cấp bởi ${member.fullname}`;
      description = product.description || `Xem chi tiết sản phẩm và đặt mua nhanh qua Zalo từ ${member.fullname} trên Kim Kê Connect.`;
      if (product.image_url) {
        ogImage = product.image_url;
      }
    }
  }

  return {
    metadataBase: new URL("https://bottandau.vercel.app"),
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://bottandau.vercel.app/member/${slug}${productId ? `?product=${productId}` : ''}`,
      images: [
        {
          url: ogImage,
          width: 800,
          height: 600,
          alt: title,
        }
      ]
    },
  };
}

// Hàm render sao uy tín dựa trên điểm reputation_score (Bot cũ)
const renderStars = (score: number = 50) => {
  const starsCount = Math.min(5, Math.max(1, Math.ceil(score / 20)));
  return '⭐'.repeat(starsCount);
};

// Component Trang chi tiết
export default async function MemberDetailPage({ params }: MemberDetailPageProps) {
  const { slug } = await params;
  const client = getSupabaseClient();
  
  if (!client) {
    return notFound();
  }

  // Fetch dữ liệu thành viên từ database (kèm map_embed_url)
  const { data: member, error } = await client
    .from('member_profiles')
    .select(`
      *,
      member_businesses (
        primary_job,
        secondary_jobs,
        skills,
        services,
        products,
        bio,
        ai_tags,
        portfolio_images,
        map_embed_url
      ),
      member_connections (
        needs,
        cooperation_opportunities
      )
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error || !member) {
    return notFound();
  }

  const biz = (member as any).member_businesses || {};
  const conn = (member as any).member_connections?.[0] || {};
  
  // Fetch danh sách sản phẩm Linktree của thành viên này
  const { data: dbProducts } = await client
    .from('member_products')
    .select('*')
    .eq('member_id', member.id)
    .order('created_at', { ascending: true });

  const productsList = dbProducts || [];
  
  // Kiểm tra xem thành viên có donate đóng góp không
  const isDonator = (member.total_donated_amount && Number(member.total_donated_amount) > 0);

  // Format số tiền donate hiển thị
  const formattedDonatedAmount = isDonator 
    ? Number(member.total_donated_amount).toLocaleString('vi-VN') 
    : '0';

  // Format hiển thị số điện thoại (Luôn che 3 số cuối trên web)
  const displayPhone = `${member.phone.slice(0, 4)}.${member.phone.slice(4, 7)}.***`;

  // Tạo JSON-LD Schema.org cho SEO Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    'mainEntity': {
      '@type': 'Person',
      'name': member.fullname,
      'jobTitle': biz.primary_job,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': member.district || '',
        'addressRegion': member.province
      },
      'image': member.avatar_url || '',
      'url': `https://kimke-connect.vercel.app/member/${slug}`,
      'description': biz.bio || ''
    }
  };

  const messengerBotUrl = `https://m.me/2571120902929642?ref=${slug}`;
  const zaloChatUrl = `https://zalo.me/${member.phone}`;

  return (
    <div className="relative isolate overflow-hidden bg-neutral-950 py-12 sm:py-20 flex-grow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Nút quay lại */}
        <div className="mb-6">
          <a href="/" className="text-xs font-semibold text-neutral-500 hover:text-amber-400 transition-colors">
            &larr; Quay lại trang chủ
          </a>
        </div>

        {/* ========================================================
            🔴 PHƯƠNG ÁN 1: GIAO DIỆN LINKTREE (Nếu có Donate) - Đẹp như SHOP MINI
           ======================================================== */}
        {isDonator ? (
          <div className="mx-auto max-w-xl rounded-3xl border border-neutral-850 bg-gradient-to-b from-neutral-900/40 to-neutral-950/60 p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center">
            
            {/* Header Linktree */}
            <div className="flex flex-col items-center">
              {/* Avatar tròn viền hoàng kim và hiệu ứng tỏa sáng */}
              <div className="relative">
                {member.avatar_url ? (
                  <img 
                    src={member.avatar_url} 
                    alt={member.fullname} 
                    className="h-24 w-24 rounded-full object-cover border-2 border-amber-500 ring-4 ring-neutral-950 shadow-amber-500/10 shadow-lg" 
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-neutral-850 border-2 border-amber-500 flex items-center justify-center font-bold text-amber-400 text-3xl ring-4 ring-neutral-950">
                    {member.fullname.charAt(0).toUpperCase()}
                  </div>
                )}
                {member.is_verified && (
                  <span className="absolute bottom-0 right-0 rounded-full bg-amber-500 p-1 text-[10px] text-neutral-950 ring-2 ring-neutral-950 font-bold">
                    ✓
                  </span>
                )}
              </div>

              {/* Tên & Huy hiệu vinh danh */}
              <div className="mt-4">
                <h1 className="text-xl sm:text-2xl font-black text-neutral-50 tracking-tight">{member.fullname}</h1>
                
                {/* 🌟 HỆ THỐNG SAO UY TÍN (Cấu trúc bot cũ) */}
                <div className="mt-1 flex items-center justify-center gap-1.5 text-sm">
                  <span className="text-amber-400 tracking-wide font-serif">{renderStars(member.reputation_score)}</span>
                  <span className="text-[10px] font-bold text-neutral-500">({member.reputation_score} điểm uy tín)</span>
                </div>
              </div>
              
              <p className="text-[10px] text-neutral-500 mt-1.5 uppercase font-extrabold tracking-widest">
                📍 {member.district ? `${member.district}, ` : ''}{member.province}
              </p>
              
              {/* Huy hiệu vinh danh đóng góp */}
              <div className="mt-4 bg-amber-500/5 border border-amber-500/15 p-3 rounded-2xl w-full text-xs text-amber-300/90 flex items-center justify-center gap-2.5 shadow-inner">
                <span className="text-lg">🌟</span>
                <span className="text-left font-medium leading-relaxed">
                  Đồng đội đóng góp tích cực: Đã ủng hộ quỹ **{member.donated_count} lần** ({formattedDonatedAmount}đ) để duy trì server.
                </span>
              </div>

              {/* Nghề chính */}
              <div className="mt-5">
                <span className="inline-flex rounded-full bg-neutral-950 border border-neutral-800 px-3.5 py-1 text-xs font-bold text-neutral-200">
                  💼 {biz.primary_job}
                </span>
              </div>

              {/* Bio giới thiệu */}
              <p className="mt-3.5 text-xs text-neutral-400 leading-relaxed italic max-w-md">
                "{biz.bio || 'Thành viên cộng đồng kết nối kinh doanh Kim Kê Connect.'}"
              </p>
            </div>

            {/* Các nút liên kết Linktree phẳng */}
            <div className="mt-8 space-y-3 w-full">
              <a
                href={zaloChatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-neutral-950 border border-neutral-850 py-3.5 text-xs font-bold text-neutral-200 hover:bg-neutral-900 transition-all hover:scale-102"
              >
                💬 Nhắn tin Zalo trực tiếp
              </a>
              <a
                href={messengerBotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-amber-500 py-3.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-all hover:scale-102 shadow-lg shadow-amber-500/5"
              >
                🐓 Kết nối & Lấy SĐT qua Messenger Bot
              </a>
              {member.facebook_link && (
                <a
                  href={member.facebook_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-neutral-950/60 border border-neutral-850 py-3 text-xs font-medium text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200 transition-colors"
                >
                  🔗 Trang Facebook cá nhân
                </a>
              )}
              {member.website && (
                <a
                  href={member.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-neutral-950/60 border border-neutral-850 py-3 text-xs font-medium text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200 transition-colors"
                >
                  🌐 Website / Doanh nghiệp
                </a>
              )}
            </div>

            {/* ========================================================
                🛍️ SECTION SHOP MINI: Sản phẩm/Dịch vụ thiết kế dạng Card Grid 2 cột
               ======================================================== */}
            <div className="mt-10 border-t border-neutral-850 pt-8 text-left">
              <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-5">
                🛍️ GIAN HÀNG MINI NỔI BẬT
              </h3>
              
              {/* Grid 2 cột song song trên cả di động */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                {productsList.length > 0 ? (
                  // A. Render sản phẩm từ bảng member_products thực tế
                  productsList.map((product) => {
                    const orderZaloUrl = `${zaloChatUrl}?text=${encodeURIComponent(
                      `Chào đồng đội, tôi muốn đặt hàng sản phẩm "${product.name}" đăng trên Kim Kê Connect. Bạn tư vấn cho tôi nhé!`
                    )}`;
                    return (
                      <div key={product.id} className="bg-neutral-950/60 border border-neutral-850/80 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-amber-500/20 transition-colors">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="h-28 sm:h-36 w-full object-cover bg-neutral-900 border-b border-neutral-850" />
                        ) : (
                          <div className="h-28 sm:h-36 w-full bg-neutral-900 flex items-center justify-center text-xl border-b border-neutral-850">📦</div>
                        )}
                        <div className="p-2.5 sm:p-4 flex-grow flex flex-col justify-between gap-2.5">
                          <div>
                            <h4 className="text-[11px] sm:text-sm font-extrabold text-neutral-200 line-clamp-1 leading-snug">{product.name}</h4>
                            <p className="text-[9px] sm:text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">{product.description || 'Sản phẩm/dịch vụ chất lượng cao.'}</p>
                          </div>
                          
                          <div className="flex flex-col gap-2 pt-2 border-t border-neutral-900/60">
                            <span className="text-[10px] sm:text-xs font-black text-amber-400">
                              {product.price ? `${Number(product.price).toLocaleString('vi-VN')} đ` : 'Giá: Liên hệ'}
                            </span>
                            <a 
                              href={orderZaloUrl}
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="w-full text-center rounded-lg bg-amber-500/10 border border-amber-500/25 py-2 text-[9px] sm:text-[10px] font-extrabold text-amber-400 hover:bg-amber-500 hover:text-neutral-950 transition-all block"
                            >
                              Đặt mua Zalo 📲
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  // B. Fallback: Render tự động từ mảng services/products nếu chưa tạo sản phẩm chi tiết
                  [...(biz.services || []), ...(biz.products || [])].slice(0, 4).map((item: string, index: number) => {
                    const orderZaloUrl = `${zaloChatUrl}?text=${encodeURIComponent(
                      `Chào đồng đội, tôi muốn đặt mua dịch vụ/sản phẩm "${item}" đăng trên Kim Kê Connect. Bạn tư vấn cho tôi nhé!`
                    )}`;
                    return (
                      <div key={index} className="bg-neutral-950/60 border border-neutral-850/80 rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between gap-3.5 hover:border-amber-500/20 transition-colors">
                        <div>
                          <div className="h-8 w-8 rounded-full bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-base mb-2">🎁</div>
                          <h4 className="text-[11px] sm:text-sm font-extrabold text-neutral-200 line-clamp-2 leading-snug">{item}</h4>
                          <p className="text-[9px] text-neutral-500 mt-1.5 leading-relaxed">Dịch vụ/Sản phẩm chất lượng cao cung cấp bởi {member.fullname}.</p>
                        </div>
                        <div className="flex flex-col gap-2 border-t border-neutral-900/60 pt-2.5">
                          <span className="text-[10px] sm:text-xs font-black text-amber-400">Giá: Liên hệ</span>
                          <a 
                            href={orderZaloUrl}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-full text-center rounded-lg bg-amber-500/10 border border-amber-500/25 py-2 text-[9px] sm:text-[10px] font-extrabold text-amber-400 hover:bg-amber-500 hover:text-neutral-950 transition-all block"
                          >
                            Đặt mua Zalo 📲
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* ========================================================
                📍 SECTION GOOGLE MAPS EMBED: Nhúng bản đồ
               ======================================================== */}
            {biz.map_embed_url && biz.map_embed_url.startsWith('https') && (
              <div className="mt-10 border-t border-neutral-850 pt-8 text-left">
                <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">
                  📍 VỊ TRÍ CỬA HÀNG / BẢN ĐỒ
                </h3>
                <div className="overflow-hidden rounded-2xl border border-neutral-850 shadow-lg h-56 w-full relative">
                  <iframe 
                    src={biz.map_embed_url} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 bg-neutral-900"
                  />
                </div>
                <p className="text-[9px] text-neutral-500 mt-2 text-center">
                  * Nhấp vào bản đồ để phóng to hoặc tìm đường đi trên ứng dụng Google Maps.
                </p>
              </div>
            )}

            <p className="text-[9px] text-neutral-600 mt-12">
              🐓 Kim Kê AI Network - Mạng lưới giao thương nội bộ Tân Dậu 1981
            </p>

          </div>
        ) : (
          /* ========================================================
             ⚪ PHƯƠNG ÁN 2: GIAO DIỆN HỒ SƠ THƯỜNG (Nếu chưa Donate)
             ======================================================== */
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/30 p-8 shadow-2xl backdrop-blur-md">
            
            {/* Header Card */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-neutral-800 pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Avatar */}
                {member.avatar_url ? (
                  <img 
                    src={member.avatar_url} 
                    alt={member.fullname} 
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-neutral-800 ring-4 ring-neutral-950" 
                  />
                ) : (
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-neutral-850 border border-neutral-700 flex items-center justify-center font-bold text-amber-400 text-2xl ring-4 ring-neutral-950">
                    {member.fullname.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100">{member.fullname}</h1>
                    {member.is_verified && (
                      <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-bold text-green-400 ring-1 ring-inset ring-green-500/20">
                        ✓ Đã xác minh
                      </span>
                    )}
                  </div>
                  {/* Hệ thống sao cho hồ sơ thường */}
                  <div className="mt-1 flex items-center gap-1.5 text-xs">
                    <span className="text-amber-400 font-serif">{renderStars(member.reputation_score)}</span>
                    <span className="text-[10px] text-neutral-500">({member.reputation_score} điểm uy tín)</span>
                  </div>
                  <p className="text-sm text-neutral-400 mt-2">
                    📍 {member.district ? `${member.district}, ` : ''}{member.province}
                  </p>
                </div>
              </div>
              
              {/* Điểm uy tín */}
              <div className="bg-neutral-950 px-4 py-2.5 rounded-2xl border border-neutral-800 text-center min-w-[120px]">
                <span className="block text-xs font-medium text-neutral-500 uppercase">Điểm Uy Tín</span>
                <span className="text-xl font-bold text-amber-400">{member.reputation_score} ⭐</span>
              </div>
            </div>

            {/* Body Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              
              {/* Cột trái: Thông tin kinh doanh */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-2">Giới thiệu</h2>
                  <p className="text-sm leading-6 text-neutral-300 whitespace-pre-line">
                    {biz.bio || "Thành viên cộng đồng kết nối kinh doanh Kim Kê Connect."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-neutral-400 uppercase mb-2">Nghề nghiệp chính</h3>
                    <span className="inline-block rounded-lg bg-neutral-950 px-3 py-1.5 text-sm text-neutral-200 border border-neutral-800">
                      {biz.primary_job}
                    </span>
                  </div>
                  {biz.secondary_jobs && biz.secondary_jobs.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-neutral-400 uppercase mb-2">Nghề nghiệp phụ</h3>
                      <div className="flex flex-wrap gap-2">
                        {biz.secondary_jobs.map((job: string, i: number) => (
                          <span key={i} className="rounded-lg bg-neutral-950 px-3 py-1.5 text-xs text-neutral-300 border border-neutral-800">
                            {job}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dịch vụ & Sản phẩm */}
                <div className="space-y-4">
                  {biz.services && biz.services.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-neutral-400 uppercase mb-2">Dịch vụ cung cấp</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {biz.services.map((svc: string, i: number) => (
                          <span key={i} className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 ring-1 ring-inset ring-amber-500/20">
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {biz.products && biz.products.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-neutral-400 uppercase mb-2">Sản phẩm chủ lực</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {biz.products.map((prd: string, i: number) => (
                          <span key={i} className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-amber-500/20">
                            {prd}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Thống kê đóng góp */}
                <div className="pt-4 border-t border-neutral-800 grid grid-cols-2 gap-4 text-xs text-neutral-500">
                  <div>🤝 Đã hỗ trợ đồng đội: <span className="font-semibold text-neutral-300">{member.supported_count} người</span></div>
                  <div>👥 Đã giới thiệu thành viên: <span className="font-semibold text-neutral-300">{member.referred_count} người</span></div>
                </div>
              </div>

              {/* Cột phải: Thông tin liên hệ dạng PHỄU MESSENGER */}
              <div className="space-y-6 bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800">
                
                {/* Nhu cầu */}
                <div>
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Nhu cầu hiện tại</h3>
                  <p className="text-xs leading-5 text-neutral-300 bg-neutral-950/50 p-3 rounded-lg border border-neutral-800">
                    {conn.needs || "Hiện tại chưa có nhu cầu mua hoặc tuyển đối tác."}
                  </p>
                </div>

                {/* Liên hệ bảo mật */}
                <div className="space-y-4 pt-4 border-t border-neutral-800">
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Thông tin liên hệ</h3>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-neutral-800 pb-1.5">
                      <span className="text-neutral-500">Số điện thoại:</span>
                      <span className="font-mono text-neutral-300">{displayPhone}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-800 pb-1.5">
                      <span className="text-neutral-500">Facebook:</span>
                      <span className="text-neutral-600">Bảo mật (Vào bot để lấy)</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-800 pb-1.5">
                      <span className="text-neutral-500">Zalo:</span>
                      <span className="text-neutral-600">Bảo mật (Vào bot để lấy)</span>
                    </div>
                  </div>

                  {/* Nút bấm Phễu kết nối thẳng sang Messenger Bot */}
                  <a
                    href={messengerBotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center rounded-full bg-amber-500 py-3 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-md hover:scale-103 transform"
                  >
                    Kết nối & Lấy SĐT qua Messenger 💬
                  </a>

                  <p className="text-[10px] text-neutral-500 leading-normal text-center">
                    🔒 Để bảo vệ thông tin cá nhân và tránh spam, bạn vui lòng kết nối qua Chatbot Messenger của cộng đồng để lấy thông tin liên lạc đầy đủ của thành viên này.
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
