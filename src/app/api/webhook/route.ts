import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getEmbedding } from '@/lib/gemini';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Helper gửi API đến Facebook Messenger
async function sendMessengerAPI(payload: any) {
  const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!pageAccessToken) {
    console.error('Thiếu cấu hình FACEBOOK_PAGE_ACCESS_TOKEN');
    return;
  }
  
  const url = `https://graph.facebook.com/v20.0/me/messages?access_token=${pageAccessToken}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error('Lỗi khi gọi Facebook Send API:', await res.text());
    }
  } catch (err) {
    console.error('Không thể kết nối Facebook Send API:', err);
  }
}

// Bật/tắt trạng thái đang soạn tin nhắn (Typing Indicator)
async function sendTypingIndicator(senderId: string, action: 'typing_on' | 'typing_off') {
  await sendMessengerAPI({
    recipient: { id: senderId },
    sender_action: action,
  });
}

// Hàm gửi tin nhắn text đơn giản
async function sendTextMessage(senderId: string, text: string) {
  await sendMessengerAPI({
    recipient: { id: senderId },
    message: { text },
  });
}

// Helper gửi tin nhắn báo về Telegram cho Admin
async function notifyTelegramAdmin(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!botToken || !adminChatId) return;

  try {
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: adminChatId,
        text: message.trim(),
        parse_mode: 'Markdown',
      }),
    });
  } catch (err) {
    console.error('Không thể gửi thông báo lỗi/yêu cầu về Telegram Admin:', err);
  }
}

// Kiểm tra xem người đang chat trên Messenger đã là thành viên được duyệt hay chưa
async function checkIsActiveMember(senderId: string): Promise<boolean> {
  try {
    const adminClient = getSupabaseAdmin();
    const { data } = await adminClient
      .from('member_profiles')
      .select('id')
      .eq('messenger_id', senderId)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();
      
    return !!data;
  } catch (err) {
    console.error('Lỗi kiểm tra thành viên active:', err);
    return false;
  }
}

// Gọi API Gemini 1.5 Flash để sinh câu trả lời đàm thoại tự nhiên cho AI Search
async function generateAiResponse(question: string, matchedMembers: any[], isRequesterActive: boolean): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return '';

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const membersContext = matchedMembers.map((m, i) => {
      // Quyết định che SĐT hay không tùy thuộc vào quyền hạn của người hỏi
      const phoneToShow = isRequesterActive 
        ? m.phone 
        : `${m.phone.slice(0, 4)}.${m.phone.slice(4, 7)}.*** (Yêu cầu đăng ký để mở khóa)`;

      return `
${i + 1}. Họ tên: ${m.fullname}
- Nghề nghiệp: ${m.primary_job}
- Khu vực: ${m.province}${m.district ? ` - ${m.district}` : ''}
- Mô tả bản thân: ${m.bio || 'Chưa cập nhật'}
- Dịch vụ/Sản phẩm: ${m.services ? m.services.join(', ') : 'Chưa cập nhật'}
- Thẻ từ khóa (Tags): ${m.ai_tags ? m.ai_tags.join(', ') : ''}
- Số điện thoại liên hệ: ${phoneToShow}
- Điểm uy tín: ${m.reputation_score} ⭐
- Đã xác minh: ${m.is_verified ? 'Có (Verified)' : 'Không'}
      `;
    }).join('\n');

    const prompt = `
      Bạn là trợ lý ảo "Kim Kê Connect" thông minh và thân thiện của cộng đồng Tân Dậu 1981.
      Nhiệm vụ của bạn là trả lời câu hỏi của người dùng và giới thiệu các đồng đội phù hợp nhất dựa trên kết quả tìm kiếm được cung cấp.
      
      Câu hỏi của người dùng: "${question}"
      
      Danh sách thành viên phù hợp tìm thấy trong database:
      ${matchedMembers.length > 0 ? membersContext : 'Không tìm thấy ai phù hợp.'}
      
      Người đang hỏi đã đăng ký thành viên chưa: ${isRequesterActive ? 'ĐÃ ĐĂNG KÝ (Được quyền xem SĐT)' : 'CHƯA ĐĂNG KÝ (Không được xem SĐT đầy đủ)'}

      Yêu cầu soạn thảo câu trả lời:
      1. Xưng hô thân mật là "Kim Kê Connect" hoặc "mình" và gọi người dùng là "đồng đội", "anh/chị" hoặc "bạn".
      2. Nếu tìm thấy thành viên phù hợp:
         - Hãy viết câu trả lời trôi chảy, tự nhiên.
         - Giải thích ngắn gọn lý do vì sao họ phù hợp với nhu cầu của người hỏi.
         - Hiển thị thông tin liên hệ của họ. Nếu người đang hỏi CHƯA ĐĂNG KÝ (isRequesterActive = false), số điện thoại phải hiển thị dạng bị che (ví dụ: 0912.345.***) và đính kèm lời nhắc nhở họ đăng ký thành viên để mở khóa xem thông tin đầy đủ.
         - Ưu tiên giới thiệu người có nhãn "Đã xác minh (Verified)" và có "Điểm Uy Tín" cao lên trước.
      3. Nếu không tìm thấy ai phù hợp:
         - Trả lời lịch sự rằng hiện tại chưa có thành viên nào cung cấp dịch vụ này hoặc ở khu vực này.
      4. Viết ngắn gọn, rõ ràng, trực diện, không chứa ký tự markdown phức tạp, chỉ xuống dòng và dùng gạch đầu dòng.
    `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });

    return result.response.text()?.trim() || '';
  } catch (error) {
    console.error('Lỗi sinh câu trả lời AI Assistant:', error);
    return '';
  }
}

// ========================================================
// 1. GET REQUEST: XÁC THỰC WEBHOOK VỚI FACEBOOK DEVELOPER
// ========================================================
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');
  
  const verifyToken = process.env.FACEBOOK_VERIFY_TOKEN || 'my_verify_token_123';

  if (mode && token) {
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('Webhook Facebook xác thực thành công!');
      return new Response(challenge, { status: 200 });
    } else {
      return new Response('Forbidden', { status: 403 });
    }
  }
  return new Response('Bad Request', { status: 400 });
}

// ========================================================
// 2. POST REQUEST: TIẾP NHẬN VÀ XỬ LÝ TIN NHẮN CHATBOT
// ========================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const adminClient = getSupabaseAdmin();

    if (body.object === 'page') {
      const entries = body.entry || [];
      
      for (const entry of entries) {
        const webhookEvent = entry.messaging?.[0];
        if (!webhookEvent) continue;

        const senderId = webhookEvent.sender?.id;
        const messageText = webhookEvent.message?.text?.trim();
        
        // Trích xuất mã ref từ sự kiện chuyển hướng m.me?ref=slug
        const referralSlug = webhookEvent.referral?.ref || webhookEvent.postback?.referral?.ref;

        if (!senderId) continue;

        // --- 📌 KIỂM TRA MUTE BOT ---
        const { data: muteSession } = await adminClient
          .from('messenger_mute_sessions')
          .select('mute_until')
          .eq('sender_id', senderId)
          .single();

        if (muteSession && new Date(muteSession.mute_until) > new Date()) {
          console.log(`Mute bot đang hoạt động đối với ${senderId}. Bỏ qua auto-reply.`);
          continue;
        }

        // --- 📌 XỬ LÝ LUỒNG LIÊN KẾT TÀI KHOẢN (Referral link_phone) ---
        if (referralSlug && referralSlug.startsWith('link_phone_')) {
          const phone = referralSlug.replace('link_phone_', '');
          console.log(`Yêu cầu liên kết Messenger ID ${senderId} cho số điện thoại: ${phone}`);
          await sendTypingIndicator(senderId, 'typing_on');

          try {
            const { data: profile, error } = await adminClient
              .from('member_profiles')
              .select('id, fullname, status')
              .eq('phone', phone)
              .single();

            if (error || !profile) {
              await sendTextMessage(senderId, `❌ Không tìm thấy hồ sơ đăng ký cho số điện thoại ${phone} trên hệ thống.`);
            } else if (profile.status !== 'active') {
              await sendTextMessage(senderId, `⏳ Hồ sơ của đồng đội ${profile.fullname} đang chờ duyệt. Sau khi được duyệt, tài khoản sẽ tự động được liên kết.`);
            } else {
              // Cập nhật messenger_id để liên kết
              await adminClient
                .from('member_profiles')
                .update({ messenger_id: senderId })
                .eq('id', profile.id);

              await sendTextMessage(
                senderId,
                `🎉 Chúc mừng đồng đội ${profile.fullname}! Tài khoản Messenger của bạn đã được liên kết thành công với số điện thoại ${phone}.\n\n💎 Từ giờ, bạn đã mở khóa đặc quyền xem số điện thoại đầy đủ của tất cả các thành viên khác trên Kim Kê Connect!`
              );
            }
          } catch (err) {
            console.error('Lỗi xử lý liên kết tài khoản:', err);
          } finally {
            await sendTypingIndicator(senderId, 'typing_off');
          }
          continue;
        }

        // --- XỬ LÝ PHỄU REFERRAL XEM CHI TIẾT (Referral member slug) ---
        if (referralSlug) {
          console.log(`Nhận sự kiện referral từ web profile với slug: "${referralSlug}"`);
          await sendTypingIndicator(senderId, 'typing_on');

          try {
            // Kiểm tra xem người đang hỏi đã là thành viên active chưa
            const isRequesterActive = await checkIsActiveMember(senderId);

            // Truy vấn thông tin thành viên được yêu cầu
            const { data: member, error } = await adminClient
              .from('member_profiles')
              .select(`
                fullname,
                phone,
                province,
                district,
                facebook_link,
                zalo_link,
                website,
                is_verified,
                member_businesses (
                  primary_job,
                  services,
                  products,
                  bio
                )
              `)
              .eq('slug', referralSlug)
              .eq('status', 'active')
              .single();

            if (error || !member) {
              await sendTextMessage(
                senderId,
                'Xin lỗi đồng đội, thông tin hồ sơ này hiện không tồn tại hoặc đã bị khóa.'
              );
            } else {
              const biz = (member as any).member_businesses || {};
              const isVerified = member.is_verified;
              
              // 🔒 Kiểm tra quyền hạn để che SĐT
              let phoneToShow = `${member.phone.slice(0, 4)}.${member.phone.slice(4, 7)}.*** (🔒 Gõ /help để đăng ký mở khóa)`;
              if (isRequesterActive) {
                phoneToShow = member.phone;
              }

              let responseText = `🌟 THÔNG TIN LIÊN HỆ ĐỒNG ĐỘI TÂN DẬU 1981:\n\n`;
              responseText += `👤 Họ tên: ${member.fullname}\n`;
              responseText += `💼 Nghề nghiệp: ${biz.primary_job}\n`;
              responseText += `📍 Khu vực: ${member.province}${member.district ? ` - ${member.district}` : ''}\n`;
              responseText += `📞 Điện thoại: ${phoneToShow}\n`;
              
              if (member.facebook_link && isVerified && isRequesterActive) responseText += `🔗 Facebook: ${member.facebook_link}\n`;
              if (member.zalo_link && isVerified && isRequesterActive) responseText += `💬 Zalo: ${member.zalo_link}\n`;
              if (member.website && isVerified && isRequesterActive) responseText += `🌐 Website: ${member.website}\n`;
              
              responseText += `\n📝 Giới thiệu: ${biz.bio || 'Thành viên cộng đồng Kim Kê Connect.'}\n`;
              responseText += `🛠️ Dịch vụ: ${biz.services ? biz.services.join(', ') : 'Chưa cập nhật'}\n`;
              
              if (!isVerified) {
                responseText += `\n⚠️ Lưu ý: Hồ sơ này chưa được Xác Minh nên SĐT bị che bớt. Hãy giới thiệu họ nâng cấp Verified để hiển thị đầy đủ nhé!`;
              }

              if (!isRequesterActive) {
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kimke-connect.vercel.app';
                responseText += `\n\n🔒 Bạn chưa đăng ký thành viên hoặc chưa liên kết tài khoản nên thông tin liên hệ bị ẩn bớt. Đăng ký gia nhập miễn phí tại: ${appUrl}/dang-ky để mở khóa xem thông tin đầy đủ.`;
              }

              // 🌟 Bổ sung lời kêu gọi Donate tinh tế (Đúng thời điểm)
              responseText += `\n\n---\n🐓 Kim Kê Connect hoạt động phi lợi nhuận và miễn phí. Nếu kết nối này hữu ích, hãy cân nhắc ủng hộ (donate) một chút "trà nước" để cùng Ban quản trị duy trì máy chủ nhé!\n👉 TK Quỹ: 0982581222 - VietinBank (Chủ TK: Đinh Khánh Tùng - Nội dung: [Họ Tên] - Ung ho Kim Ke)`;
              
              await sendTextMessage(senderId, responseText);
            }
          } catch (err) {
            console.error('Lỗi khi fetch profile qua referral slug:', err);
            await sendTextMessage(senderId, 'Đã xảy ra lỗi trong quá trình lấy thông tin liên hệ.');
          } finally {
            await sendTypingIndicator(senderId, 'typing_off');
          }
          continue;
        }

        // --- XỬ LÝ TIN NHẮN TÌM KIẾM BẰNG TEXT THÔNG THƯỜNG ---
        if (messageText) {
          console.log(`Nhận tin nhắn tìm kiếm từ ${senderId}: "${messageText}"`);
          await sendTypingIndicator(senderId, 'typing_on');

          try {
            const query = messageText.toLowerCase().trim();
            const isRequesterActive = await checkIsActiveMember(senderId);
            
            // 📌 1. Kiểm tra các từ khóa yêu cầu gặp ADMIN
            const requestAdminKeywords = ['admin', 'gặp admin', 'gặp người thật', 'nhân viên', 'hỗ trợ trực tiếp', 'nói chuyện với người thật', 'tùng ơi', 'gọi admin'];
            if (requestAdminKeywords.includes(query)) {
              const muteUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
              await adminClient
                .from('messenger_mute_sessions')
                .upsert({ sender_id: senderId, mute_until: muteUntil });

              const responseText = ` Dạ, Kim Kê Connect đã nhận được yêu cầu. Mình đã báo cho Ban quản trị (anh Đinh Khánh Tùng). Anh Tùng sẽ sớm nhắn tin hỗ trợ trực tiếp cho đồng đội ngay nhé!\n\n💡 Để anh Tùng chat tay thoải mái, Bot AI sẽ tạm im lặng không tự trả lời trong vòng 24 giờ tới. Chúc đồng đội một ngày tốt lành!`;
              
              await sendTextMessage(senderId, responseText);
              await sendTypingIndicator(senderId, 'typing_off');

              await notifyTelegramAdmin(`
🔔 *YÊU CẦU CHAT TAY TỪ THÀNH VIÊN*
👤 Khách hàng Messenger ID: \`${senderId}\`
💬 Tin nhắn cuối: "${messageText}"
👉 *Yêu cầu*: Gặp Admin trực tiếp. 
💡 *Hành động*: Bot AI đã được tạm tắt (Mute) trong 24 giờ cho khách hàng này. Anh hãy vào Fanpage Inbox để chat tay hỗ trợ đồng đội nhé!
              `);
              continue;
            }

            // 📌 2. Kiểm tra các từ khóa chào hỏi / trợ giúp để gửi hướng dẫn Onboarding
            const welcomeKeywords = ['chào', 'hello', 'hi', 'bắt đầu', 'start', 'help', 'trợ giúp', 'chào bot', 'chào bạn', 'gà'];
            if (welcomeKeywords.includes(query) || query === '') {
              const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kimke-connect.vercel.app';
              const welcomeMessage = `
🐓 Chào mừng đồng đội Tân Dậu 1981 đến với Kim Kê Connect! 👋

Mình là Trợ lý AI kết nối giao thương nội bộ. Hãy gõ nhu cầu tìm kiếm của bạn theo cách nói tự nhiên:

👉 Ví dụ:
- "Tìm người làm cơ điện ở Hà Nội"
- "Cần tìm nguồn sâm đông y"
- "Dịch vụ kế toán tại TP.HCM"

💡 Để đăng ký đưa dịch vụ của bạn lên danh bạ, vui lòng truy cập đường dẫn: ${appUrl}/dang-ky
              `.trim();
              
              await sendTextMessage(senderId, welcomeMessage);
              await sendTypingIndicator(senderId, 'typing_off');
              continue;
            }

            let queryEmbedding: number[] | null = null;

            // B. Tích hợp Search Cache
            const { data: cachedQuery } = await adminClient
              .from('search_cache')
              .select('question_embedding')
              .eq('question', query)
              .maybeSingle();

            if (cachedQuery && cachedQuery.question_embedding) {
              console.log('💡 Tìm thấy Vector Embedding trong Search Cache!');
              queryEmbedding = typeof cachedQuery.question_embedding === 'string'
                ? JSON.parse(cachedQuery.question_embedding)
                : cachedQuery.question_embedding;
            } else {
              console.log('🧠 Lệch Cache! Đang gọi Gemini API tạo Embedding mới...');
              queryEmbedding = await getEmbedding(query);
              
              const { error: cacheErr } = await adminClient
                .from('search_cache')
                .insert({
                  question: query,
                  question_embedding: queryEmbedding
                });
                
              if (cacheErr) {
                console.error('Lỗi ghi search_cache:', cacheErr);
              }
            }

            // C. So khớp Vector (Semantic Search) trên Supabase pgvector
            let matchedMembers: any[] = [];
            if (queryEmbedding) {
              const { data, error } = await adminClient.rpc('match_member_profiles', {
                query_embedding: queryEmbedding,
                match_threshold: 0.4,
                match_count: 3
              });

              if (error) {
                console.error('Lỗi khi gọi RPC match_member_profiles:', error);
              } else {
                matchedMembers = data || [];
              }
            }

            // D. Sinh phản hồi đàm thoại bằng Gemini 1.5 Flash (Có tích hợp check active member)
            const aiReply = await generateAiResponse(messageText, matchedMembers, isRequesterActive);

            // E. Gửi phản hồi về Messenger
            if (aiReply) {
              await sendTextMessage(senderId, aiReply);
            } else {
              // Fallback
              if (matchedMembers.length > 0) {
                let textResult = 'Kim Kê Connect tìm thấy các đồng đội phù hợp với bạn:\n\n';
                matchedMembers.forEach((m, i) => {
                  const phone = (isRequesterActive) ? m.phone : `${m.phone.slice(0, 4)}.***.***`;
                  textResult += `📍 ${i + 1}. ${m.fullname} (${m.province})\n`;
                  textResult += `- Nghề nghiệp: ${m.primary_job}\n`;
                  textResult += `- Điện thoại: ${phone}\n\n`;
                });
                await sendTextMessage(senderId, textResult.trim());
              } else {
                await sendTextMessage(
                  senderId,
                  'Kim Kê Connect hiện chưa tìm thấy thành viên nào cung cấp dịch vụ hoặc ở khu vực này trong danh bạ. Bạn có thể thử gõ từ khóa khác xem sao nhé!'
                );
              }
            }

          } catch (err: any) {
            console.error('Lỗi trong luồng xử lý tin nhắn:', err);
            await sendTextMessage(senderId, 'Đã xảy ra lỗi khi kết nối với hệ thống trí tuệ nhân tạo. Vui lòng thử lại sau ít phút.');
          } finally {
            await sendTypingIndicator(senderId, 'typing_off');
          }
        }
      }
      return NextResponse.json({ status: 'EVENT_RECEIVED' });
    }
    
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  } catch (err: any) {
    console.error('Lỗi webhook POST Facebook:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
