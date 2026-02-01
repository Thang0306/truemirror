import React from 'react'
import './News.css'

const News = () => {
  // Mock data for news
  const newsItems = [
    {
      id: 1,
      title: 'TrueMirror ra mắt tính năng AR Mode nâng cao',
      date: '15/01/2026',
      category: 'Cập nhật',
      image: '🚀',
      excerpt: 'Trải nghiệm phỏng vấn chân thực hơn bao giờ hết với công nghệ AR thế hệ mới.',
    },
    {
      id: 2,
      title: 'Đạt mốc 10,000 người dùng thành công',
      date: '10/01/2026',
      category: 'Thành tựu',
      image: '🎉',
      excerpt: 'TrueMirror tự hào đồng hành cùng 10,000+ ứng viên trên hành trình chinh phục nghề nghiệp.',
    },
    {
      id: 3,
      title: 'Bổ sung 500+ câu hỏi phỏng vấn mới',
      date: '05/01/2026',
      category: 'Nội dung',
      image: '💬',
      excerpt: 'Mở rộng bộ câu hỏi với nhiều ngành nghề và vị trí mới nhất.',
    },
    {
      id: 4,
      title: 'TrueMirror AI nâng cấp độ chính xác lên 95%',
      date: '28/12/2025',
      category: 'Công nghệ',
      image: '🤖',
      excerpt: 'Thuật toán AI mới cải thiện khả năng phân tích và đưa ra feedback chính xác hơn.',
    },
    {
      id: 5,
      title: 'Hợp tác với 50+ doanh nghiệp hàng đầu',
      date: '20/12/2025',
      category: 'Đối tác',
      image: '🤝',
      excerpt: 'Mở rộng mạng lưới đối tác để mang đến cơ hội việc làm cho người dùng.',
    },
    {
      id: 6,
      title: 'Giải thưởng "Startup công nghệ xuất sắc 2025"',
      date: '15/12/2025',
      category: 'Giải thưởng',
      image: '🏆',
      excerpt: 'TrueMirror vinh dự nhận giải thưởng từ Hiệp hội Công nghệ Việt Nam.',
    },
  ]

  // Mock data for success stories
  const successStories = [
    {
      name: 'Nguyễn Minh Anh',
      position: 'Software Engineer tại VNG',
      avatar: '👨‍💻',
      story: 'Sau 2 tuần luyện tập với TrueMirror, mình đã tự tin hơn rất nhiều và vượt qua vòng phỏng vấn khó nhằn. Feedback từ AI giúp mình nhận ra nhiều điểm cần cải thiện, từ cách trình bày ý tưởng, ngôn ngữ cơ thể cho đến kỹ năng giao tiếp.',
      rating: 5,
    },
    {
      name: 'Trần Thị Hương',
      position: 'Marketing Manager tại Shopee',
      avatar: '👩‍💼',
      story: 'TrueMirror là công cụ tuyệt vời! Mình đã luyện tập hơn 30 phiên và cảm thấy phỏng vấn thật sự không còn đáng sợ. Từ một người hay run tay, nói ngọng khi trả lời câu hỏi, giờ mình có thể tự tin thể hiện bản thân trước mọi người. Cảm ơn TrueMirror đã giúp mình có công việc mơ ước!',
      rating: 5,
    },
    {
      name: 'Lê Văn Đức',
      position: 'Data Analyst tại FPT',
      avatar: '👨‍🔬',
      story: 'Gói Premium rất đáng tiền! Lộ trình cá nhân hóa và feedback chuyên sâu giúp mình tiến bộ từng ngày. AI phân tích chi tiết từ ngữ điệu, cách dùng từ, đến thái độ và biểu cảm khuôn mặt. Mình đã từ người ngại giao tiếp, hay né tránh ánh mắt người đối diện, thành người tự tin trả lời mọi câu hỏi trong phỏng vấn.',
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="w-full bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl py-16 md:py-24">
          <div 
            className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-16 shadow-xl border border-gray-100 text-center"
            style={{
              backgroundImage: 'url(/news-hero.svg)',
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
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Fixed height image container - image displays fully */}
                <div className="w-full h-[270px] bg-gradient-to-br from-blue-50 to-white flex items-center justify-center overflow-hidden">
                  <img 
                    src="/news-image.svg" 
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
                <button className="btn-primary text-sm md:text-base px-6 py-3">
                  Dùng thử miễn phí
                </button>
                <button className="btn-secondary text-sm md:text-base px-6 py-3">
                  Xem thêm câu chuyện
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