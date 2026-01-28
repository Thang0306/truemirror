import React from 'react'
import LazyYouTube from "../components/LazyYouTube"
import './Home.css'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-12 md:py-20 lg:py-24">
          <div
            className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl p-8 md:p-12 lg:p-16"
            style={{
              backgroundImage: 'url(/homepage-bg.svg)',
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
                  TRUEMIRROR
                </h1>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-brand-blue">
                  Giải pháp luyện phỏng vấn đột phá kết hợp AI & Virtual Human
                </h2>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  True Mirror kết hợp AI và Virtual Human để mô phỏng phỏng vấn thực tế, giúp người dùng cải thiện khả năng thể hiện và sự tự tin trước nhà tuyển dụng.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4 justify-center lg:justify-start lg:flex-start">
                  <button className="btn-primary text-sm md:text-base">
                    ▶▶ TRẢI NGHIỆM NGAY!
                  </button>
                  <button className="btn-secondary text-sm md:text-base">
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
      <div className="h-12 md:h-16 lg:h-10 bg-white"></div>
      {/* Problem Statement */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-20 md:py-24 lg:py-28">
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-xl p-10 md:p-14 lg:p-16 border border-gray-100">
          <div className="h-3"></div>
            <div className="text-center mb-10 md:mb-12 lg:mb-14">
              <h2 className="section-title mb-6 md:mb-8">
                💡 Bạn có năng lực, nhưng vẫn sợ rớt phỏng vấn?
              </h2>
              <p  className="section-subtitle">
                Rất nhiều ứng viên trẻ rơi vào tình huống này... không phải vì thiếu năng lực,
                mà vì không biết cách thể hiện như thế nào trước nhà tuyển dụng.
              </p>
              <br />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-20 lg:mb-24">
              <div className="p-5 md:p-6 rounded-xl flex items-center justify-center min-h-32 text-center problem-statement-card">
                <p className="text-base md:text-lg lg:text-xl text-gray-700">✗ Chuẩn bị rất kỹ, nhưng vào phỏng vấn lại "đứng hình"?</p>
              </div>
              <div className="p-5 md:p-6 rounded-xl flex items-center justify-center min-h-32 text-center problem-statement-card">
                <p className="text-base md:text-lg lg:text-xl text-gray-700">✗ Không biết mình đang sai ở đâu sau mỗi lần trượt phỏng vấn?</p>
              </div>
              <div className="p-5 md:p-6 rounded-xl flex items-center justify-center min-h-32 text-center problem-statement-card">
                <p className="text-base md:text-lg lg:text-xl text-gray-700">✗ Ánh mắt, giọng nói, biểu cảm... có đang làm mình mất điểm?</p>
              </div>
              <div className="p-5 md:p-6 rounded-xl flex items-center justify-center min-h-32 text-center problem-statement-card">
                <p className="text-base md:text-lg lg:text-xl text-gray-700">✗ Sợ phỏng vấn vì sợ... thất bại thêm lần nữa?</p>
              </div>
            </div>

            <br />
            <div className="text-center pt-6 md:pt-8">
              <button className="btn-primary text-lg md:text-xl px-8 py-4">
                Giải quyết ngay với TrueMirror →
              </button>
            </div>
            <br />
          </div>
        </div>
      </section>
      {/* Tạo khoảng trắng giữa các section */}
      <div className="h-12 md:h-16 lg:h-10 bg-white"></div>

      {/* Value Propositions */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-20 md:py-24 lg:py-28">
          <div className="text-center mb-14 md:mb-18 lg:mb-24">
            <h2 className="section-title">Tại sao chọn TrueMirror?</h2>
            <p className="section-subtitle">
              TRUEMIRROR mang đến giải pháp thực tế, đáng tin cậy giúp giải quyết nỗi lo của bạn.
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

            <div className="bg-gradient-to-br from-green-50 to-white p-12 md:p-14 lg:p-16 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center justify-center text-center min-h-96">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-600 rounded-full flex items-center justify-center mb-8 md:mb-10 lg:mb-12 flex-shrink-0">
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
      <div className="h-12 md:h-16 lg:h-10 bg-white"></div>
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
      <div className="h-12 md:h-16 lg:h-10 bg-white"></div>
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
                <button className="btn-primary text-sm md:text-base px-6 py-3">
                  Dùng thử miễn phí 3 phiên
                </button>
                <button className="btn-secondary text-sm md:text-base px-6 py-3">
                  Xem bảng giá
                </button>
              </div>
              <div className="h-3"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Tạo khoảng trắng giữa các section */}
      <div className="h-12 md:h-16 lg:h-10 bg-white"></div>
    </div>
  )
}

export default Home