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
        self.model = os.getenv('AZURE_OPENAI_DEPLOYMENT', 'gpt-5-mini')
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
                # temperature removed as gpt-5-mini only supports default (1)
                max_completion_tokens=4000,
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

    def build_interview_system_prompt(self, position, industry, style, language, uploaded_files_info=None):
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

        # Add personalized candidate context if available
        candidate_context = ""
        if uploaded_files_info:
            import json
            info = json.loads(uploaded_files_info) if isinstance(uploaded_files_info, str) else uploaded_files_info
            candidate_context = f"""
CANDIDATE CONTEXT (from uploaded documents):
- Skills: {', '.join(info.get('candidate_skills', []))}
- Experience Level: {info.get('experience_level', 'Unknown')}
- Background: {info.get('candidate_background', 'N/A')}
- Key Focus Areas: {', '.join(info.get('key_focus_areas', []))}

Use this context to tailor your questions and feedback to the candidate's specific background.
"""

        system_prompt = f"""
{style_instructions.get(style, style_instructions['Nghiêm túc'])}

Bạn tên là TrueMirror, là một AI Interviewer, giới tính nữ. Bạn
đang phỏng vấn ứng viên cho vị trí {position} trong ngành {industry}.

{candidate_context}

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
                # temperature removed for gpt-5-mini default (1)
                max_completion_tokens=5500
            )

            return response.choices[0].message.content

        except Exception as e:
            print(f"[ERROR] Generate evaluation failed: {str(e)}")
            return f"Xin lỗi, không thể tạo đánh giá: {str(e)}"

    def generate_overall_assessment(self, evaluations_list):
        """Generate overall assessment from multiple interview evaluations"""
        try:
            # Build prompt for overall assessment
            evaluations_text = "\n\n---\n\n".join([
                f"**Phiên phỏng vấn {i+1}:**\n{eval_text}" 
                for i, eval_text in enumerate(evaluations_list) if eval_text
            ])

            assessment_prompt = f"""
Dựa trên các đánh giá phỏng vấn sau đây của cùng một cá nhân, hãy tổng hợp đánh giá tổng quan:

{evaluations_text}

Hãy tạo đánh giá tổng hợp theo định dạng markdown với các phần sau:

## 📊 ĐIỂM MẠNH (Strengths)
Liệt kê 2-4 điểm mạnh chung và nhất quán nhất của cá nhân này qua các lần phỏng vấn. Mỗi điểm bắt đầu bằng "- ".

## 📉 ĐIỂM YẾU (Weaknesses)
Liệt kê 2-4 điểm yếu hoặc điểm cần cải thiện của cá nhân này. Mỗi điểm bắt đầu bằng "- ".

## 🚀 LỘ TRÌNH PHÁT TRIỂN (Development Path)
Đề xuất 2-4 điểm về lộ trình phát triển phù hợp dựa trên điểm mạnh và điểm yếu đã phân tích. Mỗi điểm bắt đầu bằng "- ".

**Lưu ý:** 
- Tập trung vào các xu hướng và pattern chung, không phụ thuộc vào ngành nghề hay vị trí cụ thể
- Viết ngắn gọn, cụ thể, dễ hiểu
- Đảm bảo đúng format markdown
- Các chữ in đậm và biểu tượng cảm xúc phải được giữ nguyên
"""

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{
                    'role': 'user',
                    'content': assessment_prompt
                }],
                # temperature removed for gpt-5-mini default (1)
                max_completion_tokens=5000
            )

            return response.choices[0].message.content

        except Exception as e:
            print(f"[ERROR] Generate overall assessment failed: {str(e)}")
            return f"Xin lỗi, không thể tạo đánh giá tổng hợp: {str(e)}"

    def extract_text_from_vision(self, base64_contents: list, filename: str) -> str:
        """
        Extract text from image/PDF using Azure GPT-4 Vision API.
        Similar to AIChatAssistant's image analysis approach.

        Args:
            base64_contents: List of dicts with base64 image data. For PDFs with multiple pages,
                           this will be a list of images (one per page).
                           Format: [{'type': 'image_url', 'image_url': {'url': 'data:image/...;base64,...'}}, ...]
            filename: Original filename for context

        Returns:
            Extracted text from all images/pages
        """
        try:
            print(f"[INFO] Extracting text from {filename} using Azure Vision API ({len(base64_contents)} page(s))...")

            # Build content array with text prompt + all images
            content = [
                {
                    "type": "text",
                    "text": f"Please extract ALL text from this document ({filename}). It has {len(base64_contents)} page(s). Maintain the structure and format. Extract everything you see from all pages."
                }
            ]

            # Add all images to the content array
            content.extend(base64_contents)

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that extracts ALL text content from images and PDF documents. Extract the text exactly as it appears, maintaining structure and formatting. If it's a CV/resume or job description, extract all information including contact details, skills, experience, education, requirements, etc."
                    },
                    {
                        "role": "user",
                        "content": content
                    }
                ],
                # temperature removed for gpt-5-mini default (1)
                max_completion_tokens=4000  # Increased for multi-page PDFs
            )

            extracted_text = response.choices[0].message.content.strip()
            print(f"[SUCCESS] Extracted {len(extracted_text)} characters from {filename}")
            return extracted_text

        except Exception as e:
            print(f"[ERROR] Vision API extraction failed for {filename}: {str(e)}")
            raise Exception(f"Không thể đọc nội dung từ {filename}: {str(e)}")

    def analyze_files_and_extract_info(self, file_texts: list, language: str = 'vi') -> dict:
        """
        Analyze uploaded files and extract structured information using AI.

        Args:
            file_texts: List of extracted text strings from uploaded files
            language: Interview language ('vi' or 'en')

        Returns:
            Dictionary with extracted information:
            {
                'position': str,
                'industry': str,
                'candidate_skills': list[str],
                'experience_level': str,
                'job_requirements': str,
                'candidate_background': str,
                'key_focus_areas': list[str]
            }
        """
        try:
            # Combine all file texts
            combined_text = "\n\n---\n\n".join([
                f"**Document {i+1}:**\n{text}"
                for i, text in enumerate(file_texts) if text
            ])

            # Build analysis prompt
            analysis_prompt = f"""
Analyze the following documents and extract structured information about the candidate and job position:

{combined_text}

Please analyze the above documents and extract the following information. Return ONLY valid JSON with no additional explanation:

{{
  "position": "detected job title (e.g., Senior Software Engineer, Marketing Manager, HR Specialist)",
  "industry": "one of: IT, Marketing, Sales, Finance, HR, or closest match",
  "candidate_skills": ["skill1", "skill2", "skill3", ...],
  "experience_level": "Intern, Junior, Senior, or Manager based on years of experience",
  "job_requirements": "summary of key job requirements if JD is provided, otherwise N/A",
  "candidate_background": "brief summary of candidate's experience and qualifications",
  "key_focus_areas": ["area1", "area2", "area3", ...]
}}

Guidelines:
- If position is unclear, infer from skills and experience
- Industry must be one of: IT, Marketing, Sales, Finance, HR
- candidate_skills: extract 5-10 most relevant skills
- experience_level: estimate based on years of experience or role level
- key_focus_areas: 3-5 areas to focus on during interview
- If information is missing, use reasonable defaults

Respond ONLY with valid JSON, no markdown formatting, no explanation.
"""

            # Call GPT with temperature=0 for consistency
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{
                    'role': 'user',
                    'content': analysis_prompt
                }],
                # temperature removed for gpt-5-mini default (1)
                max_completion_tokens=5000
            )

            result_text = response.choices[0].message.content.strip()

            # Robust JSON extraction using regex
            import re
            import json
            
            # Try to find JSON object within the text
            json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
            
            if json_match:
                json_str = json_match.group(0)
                try:
                    extracted_info = json.loads(json_str)
                except json.JSONDecodeError:
                    # If regex match fails to parse (e.g. invalid JSON syntax), try cleaning code blocks
                    pass
            
            # Fallback: legacy cleaning if regex didn't work or return valid JSON
            if 'extracted_info' not in locals():
                clean_text = result_text
                if '```' in clean_text:
                    parts = clean_text.split('```')
                    for part in parts:
                        if '{' in part and '}' in part:
                            clean_text = part
                            if clean_text.strip().startswith('json'):
                                clean_text = clean_text.strip()[4:]
                            break
                
                clean_text = clean_text.strip()
                extracted_info = json.loads(clean_text)

            print(f"[SUCCESS] Extracted info: position={extracted_info.get('position')}, industry={extracted_info.get('industry')}")

            return extracted_info

        except (json.JSONDecodeError, Exception) as e:
            print(f"[ERROR] Failed to parse AI response as JSON: {str(e)}")
            print(f"[DEBUG] AI response raw: {result_text}")
            # Try one last fallback: return a basic default structure if parsing fails completely
            # This prevents the "AI không thể phân tích" error from blocking the user flow
            default_info = {
                "position": "Unknown Position",
                "industry": "General",
                "candidate_skills": [],
                "experience_level": "Junior",
                "job_requirements": "N/A",
                "candidate_background": "N/A",
                "key_focus_areas": ["General Fit", "Communication"]
            }
            print("[WARN] Using default fallback info due to parsing error.")
            return default_info
        except Exception as e:
            print(f"[ERROR] File analysis failed: {str(e)}")
            raise Exception(f"Lỗi khi phân tích tài liệu: {str(e)}")

    def generate_personalized_questions(self, extracted_info: dict, style: str, language: str) -> list:
        """
        Generate personalized interview questions based on extracted candidate/job info.

        Args:
            extracted_info: Dictionary with candidate and job information
            style: Interview style
            language: Interview language ('vi' or 'en')

        Returns:
            List of question dictionaries with structure:
            [
                {
                    'section': str,
                    'question_text': str,
                    'question_type': str,
                    'purpose': str,
                    'expected_duration_minutes': int,
                    'guidelines': {'must_have': [...], 'should_avoid': [...]},
                    'popup_questions': [...]
                },
                ...
            ]
        """
        try:
            import json

            lang_instruction = 'in Vietnamese (tiếng Việt)' if language == 'vi' else 'in English'

            # Build question generation prompt
            question_prompt = f"""
You are an expert interview question designer. Based on the candidate and job information below, create 10-15 structured interview questions {lang_instruction}.

Candidate & Job Info:
{json.dumps(extracted_info, indent=2, ensure_ascii=False)}

Interview Style: {style}

Create questions following this structure:
- 3-4 questions for Section 1: Background & Experience
- 3-4 questions for Section 2: Technical/Domain Skills
- 2-3 questions for Section 3: Behavioral & Soft Skills
- 2-3 questions for Section 4: Future Goals & Cultural Fit

Each question must be a JSON object with:
- section: Section name
- question_text: The question content
- question_type: "Behavioral", "Technical", or "Situational"
- purpose: Assessment purpose
- expected_duration_minutes: Duration (int)
- guidelines: {{ "must_have": [], "should_avoid": [] }}
- popup_questions: [ "Follow-up 1", "Follow-up 2" ]

IMPORTANT:
- Return a SINGLE valid JSON object with a key "questions" containing the list.
- Example: {{ "questions": [ {{...}}, {{...}} ] }}
- Do NOT use markdown formatting (no ```json).
- Content must be {lang_instruction}.
"""

            # Call GPT
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{
                    'role': 'user',
                    'content': question_prompt
                }],
                # temperature removed for gpt-5-mini default (1)
                max_completion_tokens=5000
            )

            result_text = response.choices[0].message.content.strip()
            
            # Extract JSON using regex (looking for object with "questions" key or just list)
            import re
            questions = []
            
            # Try to find JSON object structure first
            json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
            if json_match:
                try:
                    data = json.loads(json_match.group(0))
                    if 'questions' in data and isinstance(data['questions'], list):
                        questions = data['questions']
                except:
                    pass
            
            # If that failed, try finding a list structure directly
            if not questions:
                list_match = re.search(r'\[.*\]', result_text, re.DOTALL)
                if list_match:
                    try:
                        questions = json.loads(list_match.group(0))
                    except:
                        pass

            # Fallback cleaning if regex failed
            if not questions:
                if result_text.startswith('```'):
                    result_text = result_text.split('```')[1]
                    if result_text.startswith('json'):
                        result_text = result_text[4:]
                    result_text = result_text.strip()
                try:
                    parsed = json.loads(result_text)
                    if isinstance(parsed, dict) and 'questions' in parsed:
                        questions = parsed['questions']
                    elif isinstance(parsed, list):
                        questions = parsed
                except:
                    pass

            # Validate
            if not isinstance(questions, list) or len(questions) < 3:
                raise Exception("Insufficient valid questions generated")

            print(f"[SUCCESS] Generated {len(questions)} personalized questions")
            return questions

        except Exception as e:
            print(f"[ERROR] Question generation failed: {str(e)}")
            print(f"[DEBUG] AI response raw: {result_text}")
            
            # ROBUST FALLBACK: Return default questions instead of crashing
            print("[WARN] Using fallback questions due to generation error.")
            
            fallback_qs = [
                {
                    "section": "Section 1: Background & Experience",
                    "question_text": "Hãy giới thiệu ngắn gọn về bản thân và những kinh nghiệm làm việc nổi bật nhất của bạn liên quan đến vị trí này." if language == 'vi' else "Please briefly introduce yourself and highlight your most relevant work experience for this position.",
                    "question_type": "Behavioral",
                    "purpose": "Ice breaker and background check",
                    "expected_duration_minutes": 3,
                    "guidelines": {"must_have": ["Overview of experience"], "should_avoid": ["Too detailed personal life"]},
                    "popup_questions": []
                },
                {
                    "section": "Section 2: Technical Skills",
                    "question_text": "Trong dự án gần đây nhất, bạn đã gặp phải thử thách kỹ thuật (hoặc chuyên môn) nào khó khăn nhất và bạn đã giải quyết nó như thế nào?" if language == 'vi' else "In your most recent project, what was the most challenging technical (or professional) problem you faced, and how did you resolve it?",
                    "question_type": "Technical",
                    "purpose": "Problem solving skills",
                    "expected_duration_minutes": 5,
                    "guidelines": {"must_have": ["STAR method", "Specific solution"], "should_avoid": ["Vague description"]},
                    "popup_questions": ["What would you do differently?"]
                },
                 {
                    "section": "Section 3: Soft Skills",
                    "question_text": "Hãy kể về một lần bạn phải thuyết phục người khác chấp nhận ý kiến của mình. Kết quả ra sao?" if language == 'vi' else "Tell me about a time you had to persuade someone to accept your idea. What was the outcome?",
                    "question_type": "Behavioral",
                    "purpose": "Communication and influence",
                    "expected_duration_minutes": 4,
                    "guidelines": {"must_have": ["Context", "Action"], "should_avoid": []},
                    "popup_questions": []
                },
                {
                    "section": "Section 4: Goals",
                    "question_text": "Bạn định hướng phát triển bản thân như thế nào trong 2-3 năm tới?" if language == 'vi' else "How do you see yourself developing in the next 2-3 years?",
                    "question_type": "Situational",
                    "purpose": "Career alignment",
                    "expected_duration_minutes": 3,
                    "guidelines": {"must_have": ["Clear goals"], "should_avoid": []},
                    "popup_questions": []
                }
            ]
            return fallback_qs


# Singleton instance
gpt_service = AzureGPTService()

def generate_final_evaluation(session_id, conversation_history):
    """Generate final evaluation for interview session"""
    return gpt_service.generate_evaluation(conversation_history)