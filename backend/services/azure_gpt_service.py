import os
from openai import OpenAI

class AzureGPTService:
    def __init__(self):
        # Azure OpenAI Configuration - using standard OpenAI client with base_url
        api_key = os.getenv('AZURE_OPENAI_KEY')
        base_url = os.getenv('AZURE_OPENAI_BASE_URL')

        if not api_key or not base_url:
            raise ValueError("AZURE_OPENAI_KEY and AZURE_OPENAI_BASE_URL must be set")

        self.client = OpenAI(
            api_key=api_key,
            base_url=base_url
        )
        self.model = os.getenv('AZURE_OPENAI_DEPLOYMENT', 'gpt-4.1')
        print(f"[INFO] Azure OpenAI initialized: model={self.model}, base_url={base_url}")

    def get_chat_response_stream(self, conversation_history):
        """
        Get streaming chat response from Azure OpenAI
        conversation_history: list of {role, content} dicts
        Yields: content chunks from AI response
        """
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=conversation_history,
                temperature=0.7,
                max_tokens=1000,
                stream=True
            )

            for chunk in response:
                if chunk.choices and len(chunk.choices) > 0:
                    delta = chunk.choices[0].delta
                    if hasattr(delta, 'content') and delta.content:
                        # Debug: print chunk content
                        print(f"[DEBUG] Chunk: {repr(delta.content)}")
                        yield delta.content

        except Exception as e:
            print(f"[ERROR] Azure OpenAI stream failed: {str(e)}")
            yield f"Xin lỗi, đã có lỗi xảy ra: {str(e)}"

    def build_interview_system_prompt(self, position, industry, style, language):
        """Build system prompt based on interview configuration"""

        style_instructions = {
            'Nghiêm túc': 'Bạn là một interviewer nghiêm túc và chuyên nghiệp. Bạn đặt câu hỏi sâu sắc và đánh giá kỹ năng một cách chính xác.',
            'Thân thiện': 'Bạn là một interviewer thân thiện và khuyến khích. Bạn tạo không khí thoải mái nhưng vẫn đánh giá đầy đủ kỹ năng.',
            'Khó tính': 'Bạn là một interviewer khó tính và yêu cầu cao. Bạn đặt câu hỏi thách thức và phản biện các câu trả lời.'
        }

        lang_instruction = ''
        if language == 'vi':
            lang_instruction = 'Bạn PHẢI trả lời HOÀN TOÀN bằng tiếng Việt.'
        else:
            lang_instruction = 'You MUST respond ENTIRELY in English.'

        system_prompt = f"""
{style_instructions.get(style, style_instructions['Nghiêm túc'])}

Bạn tên là TrueMirror, là một AI Interviewer, giới tính nữ. Bạn
đang phỏng vấn ứng viên cho vị trí {position} trong ngành {industry}.

{lang_instruction}

FLOW PHỎNG VẤN LINH HOẠT:
Bạn được cung cấp một bộ câu hỏi có cấu trúc bên dưới. Hãy tuân thủ flow sau:

1. BẮT ĐẦU: Chào hỏi ngắn gọn, giới thiệu bản thân là "TrueMirror" (KHÔNG dùng [Tên] hay tên giả định khác) và hỏi câu hỏi đầu tiên từ Section 1.

2. TRONG QUÁ TRÌNH:
   - Lắng nghe câu trả lời của ứng viên
   - Đưa ra feedback ngắn gọn và real-time (1-2 câu) về câu trả lời:
     * Nếu tốt: Khen ngợi điểm mạnh cụ thể
     * Nếu thiếu: Gợi ý nhẹ nhàng điểm cần bổ sung
   - Đánh giá nội bộ (không nói ra) dựa trên guidelines (must_have/should_avoid)
   - Nếu câu trả lời chưa đủ chi tiết: Hỏi POP-UP question để đào sâu
   - Nếu câu trả lời đã đủ: Chuyển sang câu hỏi tiếp theo

3. TÍNH LINH HOẠT:
   - Nếu ứng viên hỏi lại hoặc cần làm rõ: Trả lời tự nhiên, hữu ích
   - Nếu ứng viên đi chệch topic: Nhẹ nhàng dẫn về câu hỏi chính
   - Nếu ứng viên stress: Điều chỉnh tone thân thiện hơn
   - Chấp nhận câu trả lời ngắn nếu ứng viên không có kinh nghiệm (Intern/Junior)

4. THỨ TỰ CÂU HỎI:
   - Đi theo thứ tự Section → Question trong bộ câu hỏi
   - Đảm bảo hỏi đủ câu hỏi quan trọng nhất từ mỗi section
   - Có thể skip câu hỏi nếu ứng viên đã trả lời tự nhiên trong câu trước

5. KẾT THÚC:
   - Sau khi hỏi xong các câu hỏi chính: Hỏi xem ứng viên có câu hỏi nào không
   - Cảm ơn và kết thúc

FORMAT PHẢN HỒI:
- Feedback ngắn (1-2 câu)
- Câu hỏi tiếp theo (nếu có)
- Tổng không quá 3-4 câu mỗi lượt

Ví dụ:
"Tốt lắm! Em đã nêu được quy trình 3 bước rất rõ ràng. Bây giờ hãy chuyển sang câu hỏi tiếp theo: [Câu hỏi từ database]"

Quy tắc:
- Mỗi lần chỉ đặt 1 câu hỏi
- Câu hỏi ngắn gọn, rõ ràng (không quá 2-3 câu)
- Phản hồi ngắn gọn (2-4 câu) trước khi đặt câu tiếp theo
- Không lặp lại câu hỏi đã hỏi
- Thích nghi với trình độ ứng viên
"""

        return system_prompt

    def generate_evaluation(self, conversation_history):
        """Generate final evaluation based on interview conversation"""
        try:
            evaluation_prompt = """
Dựa trên cuộc phỏng vấn vừa rồi, hãy đưa ra đánh giá tổng kết chi tiết:

## 1. ĐIỂM MẠNH (Strengths):
- Liệt kê 3-5 điểm mạnh nổi bật của ứng viên

## 2. ĐIỂM CẦN CẢI THIỆN (Areas for Improvement):
- Liệt kê 2-4 điểm cần cải thiện

## 3. ĐÁNH GIÁ TỔNG QUAN:
- Nhận xét chung về performance
- Gợi ý cho lần phỏng vấn tiếp theo

Hãy viết đánh giá bằng markdown format, ngắn gọn nhưng cụ thể.
"""

            messages = conversation_history + [{
                'role': 'user',
                'content': evaluation_prompt
            }]

            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=800
            )

            return response.choices[0].message.content

        except Exception as e:
            print(f"[ERROR] Generate evaluation failed: {str(e)}")
            return f"Xin lỗi, không thể tạo đánh giá: {str(e)}"


# Singleton instance
gpt_service = AzureGPTService()

def generate_final_evaluation(session_id, conversation_history):
    """Generate final evaluation for interview session"""
    return gpt_service.generate_evaluation(conversation_history)