import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './About.css'

const About = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

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
      {/* Hero Section - Brand Story */}
      <section className="w-full bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl py-16 md:py-24">
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-16 shadow-xl border border-gray-100 about-hero-container">
            
            {/* Background SVG Image - Bottom Right Corner */}
            <img 
              src="/about-hero.webp" 
              alt="About Hero Background" 
              className="about-hero-svg"
            />
            
            {/* Text Content Overlay */}
            <div className="about-hero-content">
              
              {/* Main Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-navy leading-tight text-center">
                Về TrueMirror
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-brand-blue text-center">
                Câu chuyện thương hiệu
              </p>
              
              <div className="h-3"></div>
              
              {/* First Paragraph - Centered */}
                <p className="text-lg md:text-xl lg:text-2xl text-gray-800 text-center">
                  ra đời từ những <strong>trải nghiệm thực tế</strong> mà <strong>HÀNG TRIỆU BẠN TRẺ</strong> đối mặt:
                </p>
              
              <div className="h-3"></div>
              
              {/* Quote Box - Centered */}
              <div className="flex justify-center">
                <div className="about-quote-box bg-brand-blue text-white p-6 md:p-8 rounded-2xl shadow-lg italic text-lg md:text-xl lg:text-2xl font-medium text-center">
                  "Dù có năng lực và kiến thức chuyên môn vững vàng, nhiều người vẫn <br/> cảm thấy lo lắng và thiếu tự tin khi bước vào các buổi phỏng vấn"
                </div>
              </div>
              
              <div className="h-3"></div>
              
              {/* Reason Paragraph - Left Aligned with spacing like Home hero-content */}
              <p className="text-base md:text-lg lg:text-xl text-gray-800 about-reason-text">
                <strong>NGUYÊN NHÂN</strong> không chỉ nằm ở nội dung câu trả lời, mà còn đến từ những hành vi vô thức như ánh mắt né tránh, khoảng im lặng kéo dài hay biểu cảm căng thẳng,.... Đó là <strong>những yếu tố dễ khiến ứng viên MẤT ĐIỂM</strong> mà chính họ không nhận ra.
              </p>
              
              <div className="h-3"></div>
            </div>

          </div>
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10"></div>

      {/* Vision & Mission */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-20 md:py-24 lg:py-28">
          
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 lg:gap-16">
            {/* Vision */}
            <div className="flex flex-col">
              {/* Title with decorative underline */}
              <div className="flex items-center justify-center mb-8 md:mb-10">
                <div className="flex-1 h-0.5 bg-brand-blue"></div>
                <div className="flex items-center px-4">
                  <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand-blue about-title-spacing">
                  Tầm nhìn
                </h3>
                <div className="flex items-center px-4">
                  <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
                </div>
                <div className="flex-1 h-0.5 bg-brand-blue"></div>
              </div>
              {/* Content Box */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 md:p-10 lg:p-12 rounded-3xl shadow-lg flex-1">
                <div className="h-3"></div>
                <p className="text-lg md:text-xl lg:text-xl text-gray-800 leading-relaxed about-content-padding">
                  <strong>TrueMirror</strong> hướng tới việc <strong>trở thành nền tảng luyện phỏng vấn</strong> và <strong>phát triển kỹ năng thể hiện bản thân đáng tin cậy cho thế hệ trẻ</strong> trong bối cảnh tuyển dụng ngày càng số hóa. <br/> Chúng tôi mong muốn góp phần tạo ra một môi trường nơi phỏng vấn <strong>không còn là trải nghiệm mang tính may rủi</strong>, mà là một <strong>kỹ năng có thể luyện tập, quan sát và cải thiện rõ ràng theo thời gian</strong>. <br/> Mục tiêu cuối cùng là xây dựng một tương lai nơi <strong>sự tự tin</strong> và <strong>kỹ năng giao tiếp</strong> trở thành <strong>chìa khóa vạn năng</strong> cho chinh phục sự nghiệp.
                </p>
                <div className="h-3"></div>
              </div>
            </div>

            {/* Mission */}
            <div className="flex flex-col">
              {/* Title with decorative underline */}
              <div className="flex items-center justify-center mb-8 md:mb-10">
                <div className="flex-1 h-0.5 bg-brand-blue"></div>
                <div className="flex items-center px-4">
                  <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand-blue about-title-spacing">
                  Sứ mệnh
                </h3>
                <div className="flex items-center px-4">
                  <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
                </div>
                <div className="flex-1 h-0.5 bg-brand-blue"></div>
              </div>
              
              {/* Content Box */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 md:p-10 lg:p-12 rounded-3xl shadow-lg flex-1">
                <div className="h-3"></div>
                <p className="text-lg md:text-xl lg:text-xl text-gray-800 leading-relaxed about-content-padding">
                  TrueMirror mong muốn giúp các bạn trẻ, đặc biệt là sinh viên và những người đang bắt đầu sự nghiệp <strong>tự tin hơn khi bước vào phỏng vấn xin việc</strong>. <br/> Thông qua <strong>không gian luyện tập mô phỏng gần với phỏng vấn thực tế bằng công nghệ Virtual Human và AI</strong>, người dùng có thể <strong>thực hành thoải mái</strong> và <strong>nhận phản hồi rõ ràng về cách trả lời cũng như ngôn ngữ cơ thể</strong>. <br/> Từ đó, giảm bớt căng thẳng, <strong>thể hiện bản thân tốt hơn</strong> và <strong>nắm bắt cơ hội việc làm một cách chủ động</strong>.
                </p>
                <div className="h-3"></div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10"></div>

      {/* Core Values */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-20 md:py-24 lg:py-28">
          <div className="text-center mb-14 md:mb-18 lg:mb-24">
            <h2 className="section-title">Giá trị cốt lõi</h2>
            <p className="section-subtitle">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
            {/* Value 1 - Trung thực */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-10 md:p-12 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center text-center min-h-80">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-blue rounded-full flex items-center justify-center mb-6 md:mb-8">
                <span className="text-4xl md:text-5xl">✨</span>
              </div>
              <div className="h-3"></div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-navy mb-4 md:mb-5">
                Trung thực
              </h3>
              <div className="h-3"></div>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed about-content-padding text-left">
                TrueMirror tái hiện áp lực phỏng vấn gần với trải nghiệm thật và phản ánh chính xác cách người dùng thể hiện. Mọi phản hồi đều nhằm giúp người dùng nhìn nhận đúng năng lực hiện tại của mình.
              </p>
            </div>

            {/* Value 2 - Tập trung vào tiến bộ */}
            <div className="bg-gradient-to-br from-green-50 to-white p-10 md:p-12 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center text-center min-h-80">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-600 rounded-full flex items-center justify-center mb-6 md:mb-8">
                <span className="text-4xl md:text-5xl">📈</span>
              </div>
              <div className="h-3"></div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-navy mb-4 md:mb-5">
                Tập trung vào tiến bộ
              </h3>
              <div className="h-3"></div>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed about-content-padding text-left">
                TrueMirror ưu tiên quá trình cải thiện lâu dài thay vì kết quả tức thời. Hệ thống phản hồi được xây dựng để hỗ trợ người dùng điều chỉnh và nâng cao khả năng thể hiện qua từng lần luyện tập.
              </p>
            </div>

            {/* Value 3 - An toàn và bảo vệ người dùng */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-10 md:p-12 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center text-center min-h-80">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-600 rounded-full flex items-center justify-center mb-6 md:mb-8">
                <span className="text-4xl md:text-5xl">🛡️</span>
              </div>
              <div className="h-3"></div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-navy mb-4 md:mb-5">
                An toàn và bảo vệ người dùng
              </h3>
              <div className="h-3"></div>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed about-content-padding text-left">
                TrueMirror đảm bảo quyền riêng tư và bảo mật dữ liệu cá nhân, đồng thời tạo ra môi trường luyện tập tôn trọng, nơi người dùng có thể thử nghiệm và cải thiện mà không chịu rủi ro ngoài ý muốn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10"></div>

      {/* CTA Section */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-20 md:py-24 lg:py-28">
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-xl p-10 md:p-14 lg:p-16 border border-gray-100">
            <div className="text-center space-y-8 md:space-y-10">
              <div className="h-3"></div>
              <h2 className="section-title">
                Sẵn sàng bắt đầu hành trình với TrueMirror?
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-700 font-medium">
                Hãy để chúng tôi đồng hành cùng bạn trên con đường phát triển sự nghiệp!
              </p>
              <br />
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

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10"></div>
    </div>
  )
}

export default About