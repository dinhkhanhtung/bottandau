import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

// Khởi tạo Google Gen AI client chính thức
const getAiClient = () => {
  if (!apiKey) {
    throw new Error('Thiếu cấu hình GEMINI_API_KEY trong file .env.local');
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Tạo Vector Embedding (768 chiều) cho một chuỗi văn bản sử dụng model text-embedding-004
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const genAI = getAiClient();
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    
    if (result.embedding && result.embedding.values) {
      return result.embedding.values;
    }
    throw new Error('Không nhận được giá trị vector từ Gemini API');
  } catch (error) {
    console.error('Lỗi khi tạo Embedding với Gemini:', error);
    throw error;
  }
}

/**
 * Tự động tạo danh sách Tag từ khóa (AI Tags) dựa trên thông tin dịch vụ của thành viên
 */
export async function generateAITags(
  fullname: string,
  primaryJob: string,
  services: string[],
  bio: string
): Promise<string[]> {
  try {
    const genAI = getAiClient();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
      Bạn là trợ lý AI phân tích dữ liệu cho cộng đồng kết nối kinh doanh Tân Dậu 1981.
      Hãy phân tích thông tin của thành viên sau đây và tạo ra từ 5 đến 8 từ khóa (tag) tìm kiếm liên quan nhất.
      
      Thông tin thành viên:
      - Họ tên: ${fullname}
      - Nghề chính: ${primaryJob}
      - Dịch vụ cung cấp: ${services.join(', ')}
      - Giới thiệu bản thân: ${bio}
      
      Yêu cầu về Tags:
      1. Viết thường toàn bộ.
      2. Sử dụng tiếng Việt chuẩn (có thể bao gồm cả tag không dấu nếu thấy cần thiết để tìm kiếm dễ hơn).
      3. Mỗi tag chỉ gồm 1 đến 3 từ (ví dụ: "đông y", "sửa két sắt", "bất động sản", "sơn nhà", "quảng cáo").
      4. Loại bỏ các từ vô nghĩa, tập trung vào nghề nghiệp, sản phẩm, dịch vụ và giải pháp.
      5. Kết quả trả về chỉ gồm mảng JSON dạng string array, không chứa ký tự markdown hay giải thích nào khác. Ví dụ: ["tag1", "tag2", "tag3"]
    `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = result.response.text()?.trim() || '[]';
    const tags = JSON.parse(responseText);
    
    if (Array.isArray(tags)) {
      return tags.map(tag => tag.toLowerCase().trim());
    }
    return [];
  } catch (error) {
    console.error('Lỗi khi sinh AI Tags với Gemini:', error);
    // Trả về mảng rỗng nếu có lỗi để tránh crash luồng duyệt
    return [];
  }
}

/**
 * Tạo tài liệu văn bản tổng hợp từ profile của thành viên để phục vụ embedding.
 */
export function buildProfileDocument(data: {
  fullname: string;
  province: string;
  district?: string;
  primary_job: string;
  secondary_jobs?: string[];
  skills?: string[];
  services?: string[];
  products?: string[];
  can_support?: string;
  needs?: string;
  cooperation_opportunities?: string;
  bio?: string;
}): string {
  const parts: string[] = [];

  parts.push(`Họ và tên: ${data.fullname}`);
  parts.push(`Khu vực hoạt động: ${data.province}${data.district ? ` - ${data.district}` : ''}`);
  parts.push(`Nghề nghiệp chính: ${data.primary_job}`);
  
  if (data.secondary_jobs && data.secondary_jobs.length > 0) {
    parts.push(`Nghề nghiệp phụ: ${data.secondary_jobs.join(', ')}`);
  }
  
  if (data.skills && data.skills.length > 0) {
    parts.push(`Kỹ năng chuyên môn: ${data.skills.join(', ')}`);
  }
  
  if (data.services && data.services.length > 0) {
    parts.push(`Dịch vụ cung cấp: ${data.services.join(', ')}`);
  }
  
  if (data.products && data.products.length > 0) {
    parts.push(`Sản phẩm chủ lực: ${data.products.join(', ')}`);
  }
  
  if (data.can_support) {
    parts.push(`Có thể hỗ trợ cộng đồng: ${data.can_support}`);
  }
  
  if (data.needs) {
    parts.push(`Nhu cầu hiện tại: ${data.needs}`);
  }
  
  if (data.cooperation_opportunities) {
    parts.push(`Mong muốn hợp tác: ${data.cooperation_opportunities}`);
  }
  
  if (data.bio) {
    parts.push(`Giới thiệu bản thân: ${data.bio}`);
  }

  return parts.join('\n');
}
