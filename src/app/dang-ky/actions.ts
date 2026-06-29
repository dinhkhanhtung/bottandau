'use server';

import { getSupabaseAdmin } from '@/lib/supabase';
import slugify from 'slugify';

export async function registerMemberAction(formData: FormData) {
  try {
    // 1. Trích xuất dữ liệu từ FormData
    const fullname = formData.get('fullname') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const province = formData.get('province') as string;
    const district = formData.get('district') as string;
    const facebook_link = formData.get('facebook_link') as string;
    const zalo_link = formData.get('zalo_link') as string;
    const website = formData.get('website') as string;
    
    const primary_job = formData.get('primary_job') as string;
    const secondary_jobs = formData.get('secondary_jobs') as string;
    const skills = formData.get('skills') as string;
    const services = formData.get('services') as string;
    const products = formData.get('products') as string;
    const bio = formData.get('bio') as string;
    
    const needs = formData.get('needs') as string;
    const cooperation_opportunities = formData.get('cooperation_opportunities') as string;
    const avatarFile = formData.get('avatar_file') as File | null;

    // Validate dữ liệu cơ bản
    if (!fullname || !phone || !province || !primary_job) {
      return { success: false, error: 'Vui lòng điền đầy đủ các thông tin bắt buộc (*)' };
    }

    const adminClient = getSupabaseAdmin();

    // Kiểm tra xem số điện thoại đã tồn tại chưa
    const { data: existingProfile } = await adminClient
      .from('member_profiles')
      .select('id, status')
      .eq('phone', phone)
      .single();

    if (existingProfile) {
      if (existingProfile.status === 'active') {
        return { success: false, error: 'Số điện thoại này đã được đăng ký và phê duyệt trên hệ thống.' };
      }
      return { 
        success: true, 
        redirect: `/dang-ky/trang-thai?phone=${phone}`, 
        info: 'Số điện thoại đang có hồ sơ chờ duyệt.' 
      };
    }

    // 2. Tạo slug SEO-friendly từ tên và 4 số cuối SĐT
    const cleanFullname = slugify(fullname, { lower: true, locale: 'vi', trim: true });
    const lastFourDigits = phone.slice(-4);
    const slug = `${cleanFullname}-${lastFourDigits}`;

    // 3. Tách chuỗi thành mảng các tag
    const parseTags = (str?: string) => {
      if (!str) return [];
      return str.split(',').map(s => s.trim()).filter(Boolean);
    };

    // 4. Lưu vào Supabase bằng client admin
    // Bước A: Insert vào member_profiles
    const { data: profile, error: profileError } = await adminClient
      .from('member_profiles')
      .insert({
        fullname,
        slug,
        phone,
        email: email || null,
        province,
        district: district || null,
        facebook_link: facebook_link || null,
        zalo_link: zalo_link || null,
        website: website || null,
        status: 'pending', // Chờ duyệt
      })
      .select('id')
      .single();

    if (profileError || !profile) {
      console.error('Lỗi insert member_profiles:', profileError);
      return { success: false, error: 'Lỗi hệ thống khi lưu thông tin cá nhân. Vui lòng thử lại.' };
    }

    const memberId = profile.id;

    // Bước B: Xử lý upload ảnh đại diện lên Supabase Storage (nếu có file)
    let avatarUrl: string | null = null;
    if (avatarFile && avatarFile.size > 0) {
      try {
        const fileExt = avatarFile.name.split('.').pop() || 'jpg';
        const fileName = `${memberId}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        
        // Chuyển đổi File sang Buffer/ArrayBuffer để upload từ NodeJS environment
        const bytes = await avatarFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const { error: uploadError } = await adminClient.storage
          .from('avatars')
          .upload(fileName, buffer, {
            contentType: avatarFile.type,
            cacheControl: '3600',
            upsert: true
          });
          
        if (!uploadError) {
          const { data: publicUrlData } = adminClient.storage
            .from('avatars')
            .getPublicUrl(fileName);
            
          avatarUrl = publicUrlData?.publicUrl || null;
          
          // Cập nhật lại cột avatar_url trong bảng member_profiles
          await adminClient
            .from('member_profiles')
            .update({ avatar_url: avatarUrl })
            .eq('id', memberId);
        } else {
          console.error('Lỗi khi upload ảnh lên Supabase Storage:', uploadError);
        }
      } catch (uploadErr) {
        console.error('Lỗi trong quá trình xử lý upload file:', uploadErr);
      }
    }

    // Bước C: Insert vào member_businesses
    const { error: businessError } = await adminClient
      .from('member_businesses')
      .insert({
        id: memberId,
        primary_job,
        secondary_jobs: parseTags(secondary_jobs),
        skills: parseTags(skills),
        services: parseTags(services),
        products: parseTags(products),
        bio: bio || null,
      });

    if (businessError) {
      console.error('Lỗi insert member_businesses:', businessError);
      // Rollback profile
      await adminClient.from('member_profiles').delete().eq('id', memberId);
      return { success: false, error: 'Lỗi hệ thống khi lưu thông tin chuyên môn.' };
    }

    // Bước D: Insert vào member_connections (nếu có điền nhu cầu)
    if (needs || cooperation_opportunities) {
      const { error: connectionError } = await adminClient
        .from('member_connections')
        .insert({
          member_id: memberId,
          needs: needs || null,
          cooperation_opportunities: cooperation_opportunities || null,
        });

      if (connectionError) {
        console.error('Lỗi insert member_connections:', connectionError);
      }
    }

    // 5. Gửi thông báo phê duyệt đến Telegram Admin Bot
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (botToken && adminChatId) {
      try {
        const telegramMessage = `
🆕 *HỒ SƠ ĐĂNG KÝ MỚI CHỜ DUYỆT* 

👤 *Thành viên*: ${fullname}
📞 *Số điện thoại*: \`${phone}\`
📍 *Khu vực*: ${province}${district ? ` - ${district}` : ''}

💼 *Nghề chính*: ${primary_job}
🛠️ *Dịch vụ*: ${services || 'Không ghi'}
🔑 *Nhu cầu đang cần*: ${needs || 'Không có'}
📸 *Ảnh đại diện*: ${avatarUrl ? `[Xem ảnh](${avatarUrl})` : 'Không tải lên'}

Vui lòng bấm nút dưới đây để duyệt hồ sơ này:
        `;

        const keyboardPayload = {
          chat_id: adminChatId,
          text: telegramMessage.trim(),
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: 'Duyệt ✅', callback_data: `approve:${memberId}` },
                { text: 'Từ chối ❌', callback_data: `reject:${memberId}` }
              ]
            ]
          }
        };

        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const res = await fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(keyboardPayload),
        });
        
        if (!res.ok) {
          console.error('Lỗi gửi Telegram:', await res.text());
        }
      } catch (tgError) {
        console.error('Không thể gửi tin nhắn Telegram:', tgError);
      }
    }

    return { 
      success: true, 
      redirect: `/dang-ky/trang-thai?phone=${phone}` 
    };

  } catch (err: any) {
    console.error('Lỗi Server Action register:', err);
    return { success: false, error: 'Đã xảy ra lỗi hệ thống nghiêm trọng.' };
  }
}
