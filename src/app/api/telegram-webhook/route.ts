import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getEmbedding, generateAITags, buildProfileDocument } from '@/lib/gemini';

// Helper gửi API phản hồi về Telegram
async function sendTelegramRequest(method: string, payload: any) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return;
  
  const url = `https://api.telegram.org/bot${botToken}/${method}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error(`Telegram API error (${method}):`, await res.text());
    }
  } catch (err) {
    console.error(`Lỗi kết nối Telegram API (${method}):`, err);
  }
}

// Helper tự động đăng bài chào mừng lên Fanpage Facebook qua Graph API
async function autoPostToFacebook(fullname: string, province: string, district: string | null, job: string, services: string[], needs: string | null) {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  
  if (!pageId || !accessToken) {
    console.warn('Thiếu cấu hình FACEBOOK_PAGE_ID hoặc ACCESS_TOKEN. Bỏ qua tự động đăng bài Facebook.');
    return;
  }

  const location = province + (district ? ` - ${district}` : '');
  const message = `
🎉 CHÀO MỪNG THÀNH VIÊN MỚI GIA NHẬP KIM KÊ CONNECT! 🐓✨

Chào cả nhà Tân Dậu, mạng lưới kết nối kinh doanh vừa chào đón một đồng đội mới:

👤 Thành viên: ${fullname}
📍 Vị trí: ${location}
💼 Chuyên ngành chính: ${job}
🛠️ Dịch vụ cung cấp: ${services.length > 0 ? services.join(', ') : 'Chưa cập nhật'}
💡 Nhu cầu kết nối hiện tại: ${needs ? needs : 'Giao lưu cộng đồng'}

Anh chị em Tân Dậu có nhu cầu hợp tác hoặc sử dụng dịch vụ của đồng đội, vui lòng truy cập Messenger của Fanpage để tìm kiếm và lấy thông tin liên hệ trực tiếp nhé!

#KimKeConnect #TanDau1981 #HoTroCheo #KetNoiKinhDoanh
  `.trim();

  const url = `https://graph.facebook.com/v20.0/${pageId}/feed`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        access_token: accessToken
      }),
    });
    if (!res.ok) {
      console.error('Lỗi tự động đăng bài Facebook:', await res.text());
    } else {
      console.log('Đã tự động đăng bài chào mừng thành công lên Facebook Feed!');
    }
  } catch (err) {
    console.error('Không thể kết nối API đăng bài Facebook:', err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Kiểm tra xác thực Admin
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    
    // 2. Xử lý Callback Query (Bấm nút Duyệt/Từ chối trên Telegram)
    if (body.callback_query) {
      const callbackQuery = body.callback_query;
      const chatId = callbackQuery.message.chat.id;
      const messageId = callbackQuery.message.message_id;
      const dataStr = callbackQuery.data; // Định dạng "action:id"
      
      // Bảo mật: Chỉ cho phép Chat ID của Admin thực hiện
      if (adminChatId && String(chatId) !== String(adminChatId)) {
        await sendTelegramRequest('answerCallbackQuery', {
          callback_query_id: callbackQuery.id,
          text: '❌ Bạn không có quyền quản trị!',
          show_alert: true
        });
        return NextResponse.json({ success: true });
      }

      const [action, memberId] = dataStr.split(':');
      const adminClient = getSupabaseAdmin();

      if (action === 'approve') {
        // --- LUỒNG PHÊ DUYỆT THÀNH VIÊN ---
        
        // Trả lời Telegram ngay để tránh nút bấm bị treo loading
        await sendTelegramRequest('answerCallbackQuery', {
          callback_query_id: callbackQuery.id,
          text: '⏳ Đang phê duyệt và sinh dữ liệu AI...'
        });

        // A. Cập nhật trạng thái profile sang active và gia hạn 30 ngày
        const expiredAt = new Date();
        expiredAt.setDate(expiredAt.getDate() + 30);

        const { data: profile, error: profileErr } = await adminClient
          .from('member_profiles')
          .update({ 
            status: 'active', 
            is_verified: true, // Mặc định duyệt sẽ cho trạng thái Verified dùng thử
            expired_at: expiredAt.toISOString()
          })
          .eq('id', memberId)
          .select('fullname, province, district, phone')
          .single();

        if (profileErr || !profile) {
          await sendTelegramRequest('sendMessage', {
            chat_id: chatId,
            text: `❌ Lỗi database khi duyệt thành viên: ${profileErr?.message || 'Không tìm thấy profile'}`
          });
          return NextResponse.json({ success: true });
        }

        // B. Lấy thông tin kinh doanh để sinh AI Tags & Embedding
        const { data: business } = await adminClient
          .from('member_businesses')
          .select('*')
          .eq('id', memberId)
          .single();

        const { data: connection } = await adminClient
          .from('member_connections')
          .select('needs, cooperation_opportunities')
          .eq('member_id', memberId)
          .maybeSingle();

        const biz = business || { primary_job: '', services: [], bio: '' };
        const conn = connection || { needs: '', cooperation_opportunities: '' };

        // C. Gọi Gemini API để sinh AI Tags tự động
        const aiTags = await generateAITags(
          profile.fullname,
          biz.primary_job,
          biz.services || [],
          biz.bio || ''
        );

        // D. Tạo văn bản tổng hợp và gọi Gemini API sinh Vector Embedding 768 chiều
        const profileDocText = buildProfileDocument({
          fullname: profile.fullname,
          province: profile.province,
          district: profile.district || undefined,
          primary_job: biz.primary_job,
          secondary_jobs: biz.secondary_jobs || [],
          skills: biz.skills || [],
          services: biz.services || [],
          products: biz.products || [],
          can_support: biz.can_support || undefined,
          needs: conn.needs || undefined,
          cooperation_opportunities: conn.cooperation_opportunities || undefined,
          bio: biz.bio || undefined,
        });

        const embeddingVector = await getEmbedding(profileDocText);

        // E. Cập nhật AI Tags, Profile Document, và Profile Embedding vào bảng member_businesses
        const { error: updateBizErr } = await adminClient
          .from('member_businesses')
          .update({
            ai_tags: aiTags,
            profile_document: profileDocText,
            profile_embedding: embeddingVector
          })
          .eq('id', memberId);

        if (updateBizErr) {
          console.error('Lỗi lưu AI data:', updateBizErr);
        }

        // F. Gọi Facebook Graph API tự động đăng bài lên Fanpage
        await autoPostToFacebook(
          profile.fullname,
          profile.province,
          profile.district,
          biz.primary_job,
          biz.services || [],
          conn.needs || null
        );

        // G. Cập nhật lại tin nhắn Telegram cũ thành công
        const successMessage = `
✅ *ĐÃ DUYỆT THÀNH CÔNG THÀNH VIÊN*

👤 *Thành viên*: ${profile.fullname}
📞 *Số điện thoại*: \`${profile.phone}\`
📍 *Khu vực*: ${profile.province}
💼 *Nghề chính*: ${biz.primary_job}

✨ *Dữ liệu AI đã sinh thành công:*
- AI Tags: ${aiTags.map((t: string) => `#${t}`).join(', ') || 'Không có'}
- Vector Embedding: Đã tạo (768 chiều)
- Đăng bài Fanpage: Đã đăng tự động chào mừng.
        `;

        await sendTelegramRequest('editMessageText', {
          chat_id: chatId,
          message_id: messageId,
          text: successMessage.trim(),
          parse_mode: 'Markdown'
        });

      } else if (action === 'reject') {
        // --- LUỒNG TỪ CHỐI THÀNH VIÊN ---
        const { data: profile } = await adminClient
          .from('member_profiles')
          .update({ status: 'suspended' })
          .eq('id', memberId)
          .select('fullname')
          .single();

        await sendTelegramRequest('answerCallbackQuery', {
          callback_query_id: callbackQuery.id,
          text: '❌ Đã từ chối hồ sơ.'
        });

        await sendTelegramRequest('editMessageText', {
          chat_id: chatId,
          message_id: messageId,
          text: `❌ *Hồ sơ của thành viên ${profile?.fullname || 'này'} đã bị từ chối duyệt.*`,
          parse_mode: 'Markdown'
        });
      }

      return NextResponse.json({ success: true });
    }

    // 3. Xử lý các lệnh chat văn bản từ Admin (Telegram Chat Commands)
    if (body.message) {
      const message = body.message;
      const chatId = message.chat.id;
      const text = message.text || '';
      
      // Bảo mật: Chỉ cho phép Chat ID của Admin điều khiển
      if (adminChatId && String(chatId) !== String(adminChatId)) {
        return NextResponse.json({ success: true });
      }

      const adminClient = getSupabaseAdmin();

      // --- LỆNH /giahan <sdt> <so_ngay> ---
      if (text.startsWith('/giahan')) {
        const parts = text.split(' ').filter(Boolean);
        if (parts.length < 2) {
          await sendTelegramRequest('sendMessage', {
            chat_id: chatId,
            text: '⚠️ Cú pháp sai. Vui lòng gõ: `/giahan <sdt> [so_ngay_mac_dinh_30]`',
            parse_mode: 'Markdown'
          });
          return NextResponse.json({ success: true });
        }

        const phone = parts[1];
        const days = parts[2] ? parseInt(parts[2]) : 30;

        // Fetch profile hiện tại
        const { data: profile } = await adminClient
          .from('member_profiles')
          .select('id, fullname, expired_at')
          .eq('phone', phone)
          .single();

        if (!profile) {
          await sendTelegramRequest('sendMessage', {
            chat_id: chatId,
            text: `❌ Không tìm thấy thành viên có số điện thoại: \`${phone}\``,
            parse_mode: 'Markdown'
          });
          return NextResponse.json({ success: true });
        }

        // Tính toán hạn mới
        const currentExpired = profile.expired_at ? new Date(profile.expired_at) : new Date();
        const baseDate = currentExpired > new Date() ? currentExpired : new Date();
        baseDate.setDate(baseDate.getDate() + days);

        const { error: updateErr } = await adminClient
          .from('member_profiles')
          .update({
            is_verified: true,
            expired_at: baseDate.toISOString()
          })
          .eq('id', profile.id);

        if (updateErr) {
          await sendTelegramRequest('sendMessage', {
            chat_id: chatId,
            text: `❌ Lỗi khi cập nhật hạn trên Database: ${updateErr.message}`
          });
        } else {
          await sendTelegramRequest('sendMessage', {
            chat_id: chatId,
            text: `🟢 Gia hạn thành công cho *${profile.fullname}*!\nHạn Verified mới: \`${baseDate.toLocaleDateString('vi-VN')}\` (Thêm ${days} ngày).`,
            parse_mode: 'Markdown'
          });
        }
      }

      // --- LỆNH /suspend <sdt> ---
      else if (text.startsWith('/suspend')) {
        const parts = text.split(' ').filter(Boolean);
        const phone = parts[1];

        if (!phone) {
          await sendTelegramRequest('sendMessage', {
            chat_id: chatId,
            text: '⚠️ Vui lòng gõ: `/suspend <sdt>`'
          });
          return NextResponse.json({ success: true });
        }

        const { data: profile, error } = await adminClient
          .from('member_profiles')
          .update({ status: 'suspended' })
          .eq('phone', phone)
          .select('fullname')
          .single();

        if (error || !profile) {
          await sendTelegramRequest('sendMessage', {
            chat_id: chatId,
            text: `❌ Lỗi hoặc không tìm thấy SĐT \`${phone}\` để tạm khóa.`
          });
        } else {
          await sendTelegramRequest('sendMessage', {
            chat_id: chatId,
            text: `🔒 Đã tạm khóa tài khoản của *${profile.fullname}* (SĐT: \`${phone}\`).`
          });
        }
      }

      // --- LỆNH /delete <sdt> ---
      else if (text.startsWith('/delete')) {
        const parts = text.split(' ').filter(Boolean);
        const phone = parts[1];

        if (!phone) {
          await sendTelegramRequest('sendMessage', {
            chat_id: chatId,
            text: '⚠️ Vui lòng gõ: `/delete <sdt>`'
          });
          return NextResponse.json({ success: true });
        }

        const { data: profile, error } = await adminClient
          .from('member_profiles')
          .delete()
          .eq('phone', phone)
          .select('fullname')
          .single();

        if (error || !profile) {
          await sendTelegramRequest('sendMessage', {
            chat_id: chatId,
            text: `❌ Lỗi hoặc không tìm thấy SĐT \`${phone}\` để xóa.`
          });
        } else {
          await sendTelegramRequest('sendMessage', {
            chat_id: chatId,
            text: `🗑️ Đã xóa vĩnh viễn thành viên *${profile.fullname}* khỏi hệ thống.`
          });
        }
      }

      // --- LỆNH /donate <sdt> <so_tien> ---
      else if (text.startsWith('/donate')) {
        const parts = text.split(' ').filter(Boolean);
        if (parts.length < 3) {
          await sendTelegramRequest('sendMessage', {
            chat_id: chatId,
            text: '⚠️ Cú pháp sai. Vui lòng gõ: `/donate <sdt> <so_tien>`',
            parse_mode: 'Markdown'
          });
          return NextResponse.json({ success: true });
        }

        const phone = parts[1];
        const amount = parseFloat(parts[2]);

        if (isNaN(amount) || amount <= 0) {
          await sendTelegramRequest('sendMessage', {
            chat_id: chatId,
            text: '⚠️ Số tiền donate phải là số dương hợp lệ.'
          });
          return NextResponse.json({ success: true });
        }

        // Fetch profile hiện tại
        const { data: profile } = await adminClient
          .from('member_profiles')
          .select('id, fullname, donated_count, total_donated_amount')
          .eq('phone', phone)
          .single();

        if (!profile) {
          await sendTelegramRequest('sendMessage', {
            chat_id: chatId,
            text: `❌ Không tìm thấy thành viên có số điện thoại: \`${phone}\``,
            parse_mode: 'Markdown'
          });
          return NextResponse.json({ success: true });
        }

        // Tính toán dồn số lần và số tiền
        const newCount = (profile.donated_count || 0) + 1;
        const newAmount = Number(profile.total_donated_amount || 0) + amount;

        const { error: updateErr } = await adminClient
          .from('member_profiles')
          .update({
            donated_count: newCount,
            total_donated_amount: newAmount,
            is_verified: true // Tự động kích hoạt Verified khi có donate ủng hộ
          })
          .eq('id', profile.id);

        if (updateErr) {
          await sendTelegramRequest('sendMessage', {
            chat_id: chatId,
            text: `❌ Lỗi khi cập nhật dữ liệu donate trên Database: ${updateErr.message}`
          });
        } else {
          await sendTelegramRequest('sendMessage', {
            chat_id: chatId,
            text: `🟢 Ghi nhận thành công đóng góp từ *${profile.fullname}*!\n💰 Số tiền ủng hộ mới: \`${amount.toLocaleString('vi-VN')} VNĐ\`\n🌟 Tổng số lần ủng hộ: \`${newCount} lần\`\n💎 Tổng số tiền tích lũy: \`${newAmount.toLocaleString('vi-VN')} VNĐ\`\n✨ Hệ thống đã mở khóa vinh danh và kích hoạt trang Linktree cá nhân cho đồng đội!`,
            parse_mode: 'Markdown'
          });
        }
      }

      // --- TRỢ GIÚP /help ---
      else if (text === '/start' || text === '/help') {
        const helpMsg = `
🤖 *TRỢ LÝ QUẢN TRỊ KIM KÊ CONNECT*

Anh Tùng có thể nhắn các lệnh quản trị nhanh sau đây:
1. Gia hạn tài khoản Verified:
   \`/giahan <sdt> <so_ngay>\` (ví dụ: \`/giahan 0912345678 30\`)
2. Ghi nhận đóng góp ủng hộ (Donate):
   \`/donate <sdt> <so_tien>\` (ví dụ: \`/donate 0912345678 200000\`)
3. Tạm khóa thành viên:
   \`/suspend <sdt>\` (ví dụ: \`/suspend 0912345678\`)
4. Xóa vĩnh viễn thành viên:
   \`/delete <sdt>\` (ví dụ: \`/delete 0912345678\`)
        `;
        await sendTelegramRequest('sendMessage', {
          chat_id: chatId,
          text: helpMsg.trim(),
          parse_mode: 'Markdown'
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Lỗi webhook Telegram:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
