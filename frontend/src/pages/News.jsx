import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './News.css'

const News = () => {
  // Mock data for news
  const newsItems = [
    {
      id: 1,
      title: 'TrueMirror đạt hơn 500 người dùng chỉ sau hơn 2 tuần ra mắt',
      date: '15 tháng 1 2026',
      category: 'Cập nhật',
      image: '/post-1.webp',
      excerpt: 'Chỉ sau hơn hai tuần chính thức ra mắt, nền tảng luyện phỏng vấn thông minh TRUEMIRROR đã ghi nhận cột mốc hơn 500 người dùng.',
    },
    {
      id: 2,
      title: 'TrueMirror ghi nhận hơn 200 phản hồi người dùng và liên tục cải tiến nội dung',
      date: '8 tháng 1 2026',
      category: 'Thành tựu',
      image: '/post-2.webp',
      excerpt: 'Trong quá trình vận hành và phát triển nền tảng, TRUEMIRROR đã tiếp nhận hơn 200 phản hồi từ người dùng.',
    },
    {
      id: 3,
      title: 'TrueMirror bổ sung hơn 500 câu hỏi phỏng vấn mới, mở rộng nhiều ngành nghề và vị trí',
      date: '5 tháng 1 2026',
      category: 'Nội dung',
      image: '/post-3.webp',
      excerpt: 'Mở rộng kho nội dung với hơn 500 câu hỏi phỏng vấn mới, nhằm giúp người dùng tiếp cận đầy đủ hơn với các tình huống tuyển dụng.',
    },
    {
      id: 4,
      title: 'TrueMirror nâng độ chính xác AI lên 95%: Khi luyện phỏng vấn không còn là "cảm giác"',
      date: '28 tháng 12 2025',
      category: 'Công nghệ',
      image: '/post-4.webp',
      excerpt: 'TRUEMIRROR công bố phiên bản nâng cấp mới cho hệ thống trí tuệ nhân tạo, đưa độ chính xác lên mức 95%.',
    },
    {
      id: 5,
      title: 'TrueMirror mở rộng kho câu hỏi phỏng vấn tiếng Anh, bắt nhịp xu hướng nhân sự toàn cầu',
      date: '20 tháng 12 2025',
      category: 'Đối tác',
      image: '/post-5.webp',
      excerpt: 'TRUEMIRROR đã cập nhật và mở rộng kho câu hỏi phỏng vấn tiếng Anh, hướng đến môi trường làm việc đa quốc gia.',
    },
    {
      id: 6,
      title: 'TrueMirror phiên bản mới tối ưu tốc độ và độ ổn định nền tảng, nâng cao trải nghiệm luyện phỏng vấn',
      date: '15 tháng 12 2025',
      category: 'Giải thưởng',
      image: '/post-6.webp',
      excerpt: 'TRUEMIRROR tiến hành nâng cấp hạ tầng kỹ thuật, tối ưu hiệu suất và đảm bảo quá trình luyện phỏng vấn mượt mà hơn.',
    },
  ]

  // Mock data for success stories
  const successStories = [
    {
      name: 'Nguyễn Minh Anh',
      position: 'Software Engineer',
      avatar: '👨‍💻',
      story: 'Sau 2 tuần luyện tập với TrueMirror, mình đã tự tin hơn rất nhiều và vượt qua vòng phỏng vấn khó nhằn. Feedback từ AI giúp mình nhận ra nhiều điểm cần cải thiện, từ cách trình bày ý tưởng, ngôn ngữ cơ thể cho đến kỹ năng giao tiếp.',
      rating: 5,
    },
    {
      name: 'Trần Thị Hương',
      position: 'Marketing Manager',
      avatar: '👩‍💼',
      story: 'TrueMirror là công cụ tuyệt vời! Mình đã luyện tập hơn 30 phiên và cảm thấy phỏng vấn thật sự không còn đáng sợ. Từ một người hay run tay, nói ngọng khi trả lời câu hỏi, giờ mình có thể tự tin thể hiện bản thân trước mọi người. Cảm ơn TrueMirror đã giúp mình có công việc mơ ước!',
      rating: 5,
    },
    {
      name: 'Lê Văn Đức',
      position: 'Data Analyst',
      avatar: '👨‍🔬',
      story: 'Gói Premium rất đáng tiền! Lộ trình cá nhân hóa và feedback chuyên sâu giúp mình tiến bộ từng ngày. AI phân tích chi tiết từ ngữ điệu, cách dùng từ, đến thái độ và biểu cảm khuôn mặt. Mình đã từ người ngại giao tiếp, hay né tránh ánh mắt người đối diện, thành người tự tin trả lời mọi câu hỏi trong phỏng vấn.',
      rating: 5,
    },
  ]

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

  const handleContact = () => {
    window.open('https://www.facebook.com/truemirror.luyenphongvanao/', '_blank')
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="w-full bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl py-16 md:py-24">
          <div 
            className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-16 shadow-xl border border-gray-100 text-center"
            style={{
              backgroundImage: 'url(/news-hero.webp)',
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              backgroundAttachment: 'fixed'
            }}
          >
            
            <div className="flex flex-col items-center justify-center space-y-8">
              <br />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-navy leading-tight">
                Tin tức & Thành tựu
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-brand-blue">
                Cập nhật mới nhất từ TrueMirror
              </p>
              
              <div className="max-w-6xl mx-auto text-gray-700 leading-relaxed text-base md:text-lg lg:text-xl hero-description-padding">
                <p>
                  Khám phá những cập nhật mới nhất về sản phẩm, thành tựu và câu chuyện thành công 
                  từ cộng đồng người dùng TrueMirror.
                </p>
              </div>
              <br />
            </div>

          </div>
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10"></div>

      {/* News Grid */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-20 md:py-24 lg:py-28">
          <div className="text-center mb-14 md:mb-18 lg:mb-24">
            <h2 className="section-title">Tin tức nổi bật</h2>
            <p className="section-subtitle">
              Những thông tin và cập nhật mới nhất
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 auto-rows-fr">
            {newsItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
                onClick={() => window.location.href = `/news/${item.id}`}
              >
                {/* Fixed height image container - image displays fully */}
                <div className="w-full h-[270px] bg-gradient-to-br from-blue-50 to-white flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content with padding - expands as needed */}
                <div className="news-item-padding flex-grow flex flex-col">
                  <div className="h-1.5"></div>

                  {/* Title with hover effect */}
                  <h3 className="text-lg md:text-xl font-bold text-brand-navy news-title-hover text-left">
                    {item.title}
                  </h3>

                  <div className="h-1.5"></div>

                  {/* Date */}
                  <p className="text-sm md:text-base text-gray-600 text-left pb-3">
                    {item.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10"></div>

      {/* Success Stories */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-20 md:py-24 lg:py-28">
          <div className="text-center mb-14 md:mb-18 lg:mb-24">
            <h2 className="section-title">Câu chuyện thành công</h2>
            <p className="section-subtitle">
              Những chia sẻ chân thật từ người dùng TrueMirror
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            {successStories.map((story, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-50 to-white p-10 md:p-12 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col text-center min-h-96"
              >
                <div className="avatar-circle">
                  <span className="text-3xl md:text-4xl">{story.avatar}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-brand-navy mb-2">
                  {story.name}
                </h3>
                <p className="text-sm md:text-base text-brand-blue font-semibold mb-4">
                  {story.position}
                </p>
                <div className="h-3"></div>

                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(story.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-xl">⭐</span>
                  ))}
                </div>
                <div className="h-1"></div>

                <p className="text-base md:text-lg text-gray-700 leading-relaxed italic news-story-padding">
                  "{story.story}"
                </p>
                <div className="h-3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10"></div>

      {/* CTA */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-20 md:py-24 lg:py-28">
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-xl p-10 md:p-14 lg:p-16 border border-gray-100">
            <div className="h-3"></div>
            <div className="text-center space-y-8 md:space-y-10">
              <h2 className="section-title">
                Bạn cũng muốn có câu chuyện thành công?
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-700 font-medium">
                Hãy bắt đầu luyện tập với TrueMirror ngay hôm nay!
              </p>
              <br />
              <div className="flex justify-center gap-6">
                <button className="btn-primary text-sm md:text-base px-6 py-3" onClick={handleFreeTrial}>
                  Dùng thử 3 phiên miễn phí
                </button>
                <button className="btn-secondary text-sm md:text-base px-6 py-3" onClick={handleContact}>
                  Kết nối với chúng tôi
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

export default News