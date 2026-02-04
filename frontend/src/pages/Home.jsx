import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LazyYouTube from "../components/LazyYouTube"
import './Home.css'

const Home = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleExperience = () => {
    if (user) {
      navigate('/dashboard')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/login')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleLearnMore = () => {
    navigate('/about')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFreeTrial = () => {
    if (user) {
      navigate('/dashboard')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/login')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleViewPricing = () => {
    navigate('/services#pricing')
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-12 md:py-20 lg:py-24">
          <div
            className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl p-8 md:p-12 lg:p-16"
            style={{
              backgroundImage: 'url(/homepage-bg.webp)',
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              backgroundAttachment: 'fixed'
            }}
          >
          <div className="h-3"></div>
          <div className="hero-container">
              {/* Left content */}
              <div className="hero-content space-y-4 md:space-y-6">
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                  style={{
                    background: 'linear-gradient(90deg, #0F2854 0%, #0F2854 15%, #1C4D8D 40%, #4988C4 70%, #7BA8D4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  TRUEMIRRO<span className="inline-block scale-x-[-1]" style={{ 
                    color: '#5A8BC8',
                    WebkitTextFillColor: '#5A8BC8',
                    WebkitBackgroundClip: 'unset',
                    backgroundClip: 'unset'
                  }}>R</span>
                </h1>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-brand-blue">
                  Giải pháp luyện phỏng vấn đột phá kết hợp AI & Virtual Human
                </h2>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  True Mirror kết hợp AI và Virtual Human để mô phỏng phỏng vấn thực tế, giúp người dùng cải thiện khả năng thể hiện và sự tự tin trước nhà tuyển dụng.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4 justify-center lg:justify-start lg:flex-start">
                  <button className="btn-primary text-sm md:text-base" onClick={handleExperience}>
                    ▶▶ TRẢI NGHIỆM NGAY!
                  </button>
                  <button className="btn-secondary text-sm md:text-base" onClick={handleLearnMore}>
                    Tìm hiểu thêm
                  </button>
                </div>
              </div>

              {/* Right video */}
              <div className="hero-video">
                <LazyYouTube videoId="8z-admUM-d8" />
              </div>
            </div>
            <div className="h-3"></div>
          </div>
        </div>
      </section>
      {/* Tạo khoảng trắng giữa các section */}
      <div className="h-12 md:h-16 lg:h-10"></div>
      {/* Problem Statement */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-20 md:py-24 lg:py-28">
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-xl p-10 md:p-14 lg:p-16 border border-gray-100">
            <div className="h-3"></div>
            
            {/* Title - Centered, matching section-title style */}
            <div className="text-center mb-10 md:mb-12 lg:mb-14">
              <h2 className="section-title">
                Bạn có năng lực, nhưng vẫn sợ rớt phỏng vấn?
              </h2>
            </div>
            
            {/* 2-column layout: 40% Image left, 60% Content right */}
            <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 lg:gap-12">
              
              {/* Left Column - Image (40%) - Centered */}
              <div className="flex items-center justify-center">
                <img 
                  src="/problem-statement.webp" 
                  alt="Bạn có năng lực nhưng vẫn sợ rớt phỏng vấn" 
                  className="w-full h-auto max-w-lg"
                />
              </div>

              {/* Right Column - Content (60%) - Centered */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-2xl space-y-0">
                  {/* Description text - centered vertically */}
                  <div className="flex items-center justify-start min-h-[4rem] problem-description-text">
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      Rất nhiều ứng viên trẻ rơi vào tình huống này vì không biết cách thể hiện như thế nào trước nhà tuyển dụng.
                    </p>
                  </div>
                  
                  <div className="h-3"></div>

                  {/* Problem Cards - Centered within 60% area */}
                  <div className="space-y-0">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl problem-card-box">
                      <p className="text-base md:text-lg font-semibold text-gray-800">
                        Chuẩn bị rất kỹ, nhưng vào phỏng vấn lại "đứng hình"?
                      </p>
                    </div>
                    <div className="h-3"></div>
                    
                    <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl problem-card-box">
                      <p className="text-base md:text-lg font-semibold text-gray-800">
                        Không biết mình đang sai ở đâu sau mỗi lần trượt phỏng vấn?
                      </p>
                    </div>
                    <div className="h-3"></div>
                    
                    <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl problem-card-box">
                      <p className="text-base md:text-lg font-semibold text-gray-800">
                        Ánh mắt, giọng nói, biểu cảm... có đang làm mình mất điểm?
                      </p>
                    </div>
                    <div className="h-3"></div>
                    
                    <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl problem-card-box">
                      <p className="text-base md:text-lg font-semibold text-gray-800">
                        Sợ phỏng vấn vì sợ... thất bại thêm lần nữa?
                      </p>
                    </div>
                  </div>

                  <div className="h-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Tạo khoảng trắng giữa các section */}
      <div className="h-12 md:h-16 lg:h-10"></div>

      {/* Value Propositions */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-20 md:py-24 lg:py-28">
          <div className="text-center mb-14 md:mb-18 lg:mb-24">
            <h2 className="section-title">Tại sao chọn TrueMirror?</h2>
            <p className="section-subtitle">
              TrueMirror mang đến giải pháp thực tế, đáng tin cậy giúp giải quyết nỗi lo của bạn.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-14 lg:gap-16">
            <div className="bg-gradient-to-br from-blue-50 to-white p-12 md:p-14 lg:p-16 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center justify-center text-center min-h-96">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-blue rounded-full flex items-center justify-center mb-8 md:mb-10 lg:mb-12 flex-shrink-0">
                <span className="text-3xl md:text-4xl">🎬</span>
              </div>
              <div className="h-3"></div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-brand-navy mb-6 md:mb-7 lg:mb-8 value-proposition-content">
                Trải nghiệm phỏng vấn sát với thực tế
              </h3>
              <div className="h-3"></div>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed value-proposition-content">
                Phỏng vấn với Virtual Human và AI, đưa bạn đối diện interviewer ảo như thật với ánh nhìn, khoảng lặng và nhịp hỏi.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-white md:p-14 lg:p-16 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center justify-center text-center min-h-96">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-pink-400 rounded-full flex items-center justify-center mb-8 md:mb-10 lg:mb-12 flex-shrink-0">
                <span className="text-3xl md:text-4xl">🔍</span>
              </div>
              <div className="h-3"></div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-brand-navy mb-6 md:mb-7 lg:mb-8 value-proposition-content">
                Xác định chính xác những điểm mạnh, điểm yếu
              </h3>
              <div className="h-3"></div>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed value-proposition-content">
                Hệ thống AI phân tích câu trả lời và cách thể hiện trong buổi phỏng vấn để chỉ ra các thiếu sót làm bạn mất điểm.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-12 md:p-14 lg:p-16 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center justify-center text-center min-h-96">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-600 rounded-full flex items-center justify-center mb-8 md:mb-10 lg:mb-12 flex-shrink-0">
                <span className="text-3xl md:text-4xl">📈</span>
              </div>
              <div className="h-3"></div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-brand-navy mb-6 md:mb-7 lg:mb-8 value-proposition-content">
                Luyện tập có định hướng, tạo ra sự tiến bộ
              </h3>
              <div className="h-3"></div>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed value-proposition-content">
                Sau mỗi phiên, TrueMirror tổng hợp đánh giá, gợi ý bài học ngắn và cho bạn thử lại cùng kịch bản cũ.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Tạo khoảng trắng giữa các section */}
      <div className="h-12 md:h-16 lg:h-10"></div>
      {/* How It Works - FIXED: Thêm vùng bao, giảm size số */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl">
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-xl p-10 md:p-14 border border-gray-100">
          <div className="h-3"></div>
            <div className="text-center mb-14 md:mb-16">
              <h2 className="section-title">Cách hoạt động</h2>
              <p className="section-subtitle">
                4 bước đơn giản để bắt đầu luyện phỏng vấn
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 md:gap-10 how-it-works-grid">
              {[
                { step: 1, icon: '📝', title: 'Đăng ký', desc: 'Tạo tài khoản miễn phí trong 30 giây' },
                { step: 2, icon: '⚙️', title: 'Setup', desc: 'Chọn vị trí & phong cách phỏng vấn' },
                { step: 3, icon: '🎤', title: 'Luyện tập', desc: 'Phỏng vấn cùng AI Interviewer' },
                { step: 4, icon: '📈', title: 'Cải thiện', desc: 'Nhận feedback và theo dõi tiến bộ' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-brand-blue text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg md:text-xl font-bold shadow-lg">
                    {item.step}
                  </div>
                  <div className="text-5xl md:text-6xl mb-4">{item.icon}</div>
                  <div className="h-3"></div>
                  <h3 className="text-lg md:text-xl font-bold text-brand-navy mb-3">{item.title}</h3>
                  <div className="h-3"></div>
                  <p className="text-base md:text-lg text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="h-6"></div>
          </div>
        </div>
      </section>
      {/* Tạo khoảng trắng giữa các section */}
      <div className="h-12 md:h-16 lg:h-10"></div>

      {/* Benefits Section - Bạn sẽ nhận lại */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-20 md:py-24 lg:py-28">
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-xl p-10 md:p-14 lg:p-16 border border-gray-100">
            
            <div className="h-3"></div>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="section-title">
                Bạn sẽ nhận lại
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-10 mb-12 benefits-grid">
              {/* Benefit 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-brand-navy mb-2">
                    Tăng kỹ năng xử lý trong mọi tình huống
                  </h3>
                  <p className="text-base md:text-lg text-gray-600">
                    Bạn sẽ không còn phản ứng theo bản năng trước câu hỏi khó nữa — bạn sẽ biết cách sắp xếp suy nghĩ và chọn đáp án phù hợp với từng hoàn cảnh.
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-brand-navy mb-2">
                    Tâm thế chủ động khi phỏng vấn
                  </h3>
                  <p className="text-base md:text-lg text-gray-600">
                    Việc luyện tập phản ứng dưới áp lực sẽ giúp bạn hình thành thói quen kiểm soát cảm xúc và phản hồi có chủ ý.
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-brand-navy mb-2">
                    Sự tự tin và lợi thế cạnh tranh
                  </h3>
                  <p className="text-base md:text-lg text-gray-600">
                    Bạn sẽ thể hiện một trạng thái khác biệt — bình tĩnh và tự tin, thể hiện rõ sự chuẩn bị kỹ càng và khả năng ứng biến tốt.
                  </p>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-brand-navy mb-2">
                    Điều hướng buổi phỏng vấn như một cuộc trao đổi hai chiều
                  </h3>
                  <p className="text-base md:text-lg text-gray-600">
                    Bạn không chỉ trả lời mà còn biết cách làm rõ câu hỏi, đặt ngược lại khi cần để thể hiện năng lực và hiểu rõ yêu cầu công việc.
                  </p>
                </div>
              </div>
            </div>

            {/* Image - Full width within gradient container */}
            <div className="benefits-image-container">
              <img 
                src="/benefits.webp" 
                alt="Sau khi trải nghiệm dịch vụ" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tạo khoảng trắng giữa các section */}
      <div className="h-12 md:h-16 lg:h-10"></div>
      {/* CTA */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-20 md:py-24 lg:py-28">
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-xl p-10 md:p-14 lg:p-16 border border-gray-100">
            
            <div className="h-3"></div>
            <div className="text-center space-y-8 md:space-y-10">
              <h2 className="section-title">
                Sẵn sàng chinh phục mọi cuộc phỏng vấn?
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-700 font-medium" >
                Hàng ngàn ứng viên đã tự tin hơn với TrueMirror!
              </p>
              <br />
              {/* Buttons */}
              <div className="flex justify-center gap-6">
                <button className="btn-primary text-sm md:text-base px-6 py-3" onClick={handleFreeTrial}>
                  Dùng thử miễn phí 3 phiên
                </button>
                <button className="btn-secondary text-sm md:text-base px-6 py-3" onClick={handleViewPricing}>
                  Xem bảng giá
                </button>
              </div>
              <div className="h-3"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Tạo khoảng trắng giữa các section */}
      <div className="h-12 md:h-16 lg:h-10"></div>
    </div>
  )
}

export default Home