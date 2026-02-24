import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Services.css'

const Services = () => {
  const plans = [
    {
      name: 'Free Trial',
      price: '0₫',
      period: '/3 phiên',
      color: 'from-blue-50 to-white',
      icon: '🎁',
      features: [
        '✓ 3 phiên luyện tập miễn phí',
        '✓ Bộ câu hỏi cơ bản',
        '✓ AI feedback tổng quan',
        '✓ Báo cáo đơn giản',
        '✗ Không lưu lịch sử chi tiết',
        '✗ Không có Virtual Human mode',
      ],
      cta: 'Dùng thử ngay',
      recommended: false,
    },
    {
      name: 'Basic',
      price: '299.000₫',
      period: '/tháng',
      color: 'from-green-50 to-white',
      icon: '⭐',
      features: [
        '✓ 20 phiên luyện tập/tháng',
        '✓ Toàn bộ bộ câu hỏi',
        '✓ AI feedback chi tiết',
        '✓ Báo cáo tiến độ',
        '✓ Lưu lịch sử vĩnh viễn',
        '✓ Virtual Human mode cơ bản',
      ],
      cta: 'Chọn gói này',
      recommended: false,
    },
    {
      name: 'Premium',
      price: '599.000₫',
      period: '/tháng',
      color: 'from-purple-50 to-white',
      icon: '👑',
      features: [
        '✓ Không giới hạn phiên luyện tập',
        '✓ Toàn bộ bộ câu hỏi + câu hỏi độc quyền',
        '✓ AI feedback chuyên sâu + video analysis',
        '✓ Báo cáo tiến độ + lộ trình cá nhân',
        '✓ Virtual Human mode nâng cao',
        '✓ Hỗ trợ ưu tiên 24/7',
      ],
      cta: 'Chọn gói này',
      recommended: true,
    },
  ]

  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  // Handle hash navigation for pricing section
  useEffect(() => {
    if (location.hash === '#pricing') {
      const element = document.getElementById('pricing')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [location])

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
            <div className="h-6"></div>
            <div className="flex flex-col items-center justify-center space-y-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight">
                Dịch vụ phỏng vấn
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-brand-blue">
                Chọn gói phù hợp với nhu cầu của bạn
              </p>
              
              <div className="max-w-6xl mx-auto text-gray-700 leading-relaxed text-base md:text-lg lg:text-xl hero-description-padding">
                <p>
                  TrueMirror cung cấp 4 gói dịch vụ linh hoạt, 
                  giúp bạn luyện tập và cải thiện kỹ năng phỏng vấn một cách hiệu quả nhất.
                </p>
              </div>
            </div>
            <div className="h-6"></div>

          </div>
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10"></div>

      {/* Package Showcase */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl">
          
          {/* Package Free - 6:4 layout, text on left */}
          <div 
            className="relative w-full rounded-2xl overflow-hidden shadow-xl"
            style={{
              backgroundImage: 'url(/package-free.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '400px'
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-10 h-full">
              {/* Text area - 100% on mobile, 60% on desktop */}
              <div className="col-span-1 md:col-span-6 package-text-content">
                <div className="flex items-center gap-4">
                  <span className="text-4xl md:text-5xl">▶▶▶</span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                    DÙNG THỬ MIỄN PHÍ
                  </h2>
                </div>
                
                <div className="h-3"></div>
                
                <ul className="space-y-2 text-white text-base md:text-lg lg:text-xl package-bullet-text">
                  <li className="flex items-start gap-3">
                    <span className="text-xl">•</span>
                    <span>Trải nghiệm nhanh cảm giác phỏng vấn dưới áp lực thực tế <strong>trong 5 phút</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl">•</span>
                    <span>Nhận phản hồi tổng quan về cách trả lời và thái độ phỏng vấn</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl">•</span>
                    <span>Khởi động tự tin với tình huống mẫu phù hợp mục tiêu nghề nghiệp</span>
                  </li>
                </ul>
                
                <div className="h-3"></div>
                
                <button className="btn-primary-white text-sm md:text-base" onClick={handleFreeTrial}>
                  ▶▶ TRẢI NGHIỆM NGAY!
                </button>
              </div>
              {/* Empty space - 40% for background visibility - hidden on mobile */}
              <div className="hidden md:block col-span-4"></div>
            </div>
          </div>
          
          <div className="h-3"></div>
          
          {/* Package Basic - 4:6 layout, text on right */}
          <div 
            className="relative w-full rounded-2xl overflow-hidden shadow-xl"
            style={{
              backgroundImage: 'url(/package-basic.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '400px'
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-10 h-full">
              {/* Empty space - 40% for background visibility - hidden on mobile */}
              <div className="hidden md:block col-span-4"></div>
              {/* Text area - 100% on mobile, 60% on desktop */}
              <div className="col-span-1 md:col-span-6 package-text-content">
                <div className="flex items-center gap-4">
                  <span className="text-4xl md:text-5xl text-brand-blue">▶▶▶</span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand-blue">
                    GÓI CƠ BẢN
                  </h2>
                </div>
                
                <div className="h-3"></div>
                
                <ul className="space-y-2 text-gray-800 text-base md:text-lg package-bullet-text">
                  <li className="flex items-start gap-3">
                    <span className="text-xl text-brand-blue">•</span>
                    <span>Luyện tập các câu hỏi phỏng vấn phổ biến theo vị trí ứng tuyển</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl text-brand-blue">•</span>
                    <span>Cải thiện cấu trúc trả lời và khả năng diễn đạt và bộc lộ năng lực</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl text-brand-blue">•</span>
                    <span>Đề xuất lộ trình phát triển cơ bản</span>
                  </li>
                </ul>
                
                <div className="h-3"></div>
                
                <button className="btn-primary text-sm md:text-base" onClick={handleFreeTrial}>
                  ▶▶ ĐĂNG KÝ NGAY!
                </button>
              </div>
            </div>
          </div>
          
          <div className="h-3"></div>
          
          {/* Package Premium - 6:4 layout, text on left */}
          <div 
            className="relative w-full rounded-2xl overflow-hidden shadow-xl"
            style={{
              backgroundImage: 'url(/package-premium.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '400px'
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-10 h-full">
              {/* Text area - 100% on mobile, 60% on desktop */}
              <div className="col-span-1 md:col-span-6 package-text-content">
                <div className="flex items-center gap-4">
                  <span className="text-4xl md:text-5xl">▶▶▶</span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                    GÓI PREMIUM
                  </h2>
                </div>
                
                <div className="h-3"></div>
                
                <ul className="space-y-2 text-white text-base md:text-lg lg:text-xl package-bullet-text">
                  <li className="flex items-start gap-3">
                    <span className="text-xl">•</span>
                    <span>Không giới hạn với 5 kỹ năng quan trọng</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl">•</span>
                    <span>Mô phỏng phỏng vấn chuyên sâu với nhiều tình huống khó và phản biện</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl">•</span>
                    <span>Phân tích chi tiết hành vi, giọng nói và phản xạ để tối ưu hiệu suất và đề xuất lộ trình cải thiện</span>
                  </li>
                </ul>
                
                <div className="h-3"></div>
                
                <button className="btn-primary-white text-sm md:text-base" onClick={handleFreeTrial}>
                  ▶▶ TRẢI NGHIỆM NGAY!
                </button>
              </div>
              {/* Empty space - 40% for background visibility - hidden on mobile */}
              <div className="hidden md:block col-span-4"></div>
            </div>
          </div>
          
          <div className="h-3"></div>
          
          {/* Package Enterprise - 4:6 layout, text on right */}
          <div 
            className="relative w-full rounded-2xl overflow-hidden shadow-xl"
            style={{
              backgroundImage: 'url(/package-enterprise.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '400px'
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-10 h-full">
              {/* Empty space - 40% for background visibility - hidden on mobile */}
              <div className="hidden md:block col-span-4"></div>
              {/* Text area - 100% on mobile, 60% on desktop */}
              <div className="col-span-1 md:col-span-6 package-text-content">
                <div className="flex items-center gap-4">
                  <span className="text-4xl md:text-5xl text-brand-blue">▶▶▶</span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand-blue">
                    GÓI DOANH NGHIỆP
                  </h2>
                </div>
                
                <div className="h-3"></div>
                
                <ul className="space-y-2 text-gray-800 text-base md:text-lg package-bullet-text">
                  <li className="flex items-start gap-3">
                    <span className="text-xl text-brand-blue">•</span>
                    <span>Mô phỏng phỏng vấn chuẩn doanh nghiệp giúp sinh viên sẵn sàng đi làm</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl text-brand-blue">•</span>
                    <span>Hỗ trợ các trường đại học theo dõi tiến độ, năng lực và mức độ sẵn sàng nghề nghiệp của sinh viên</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl text-brand-blue">•</span>
                    <span>Cung cấp báo cáo tổng quan về năng lực nhóm ứng viên theo kỹ năng mục tiêu</span>
                  </li>

                </ul>
                
                <div className="h-3"></div>
                
                <button className="btn-primary text-sm md:text-base" onClick={handleFreeTrial}>
                  ▶▶ ĐĂNG KÝ NGAY!
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10"></div>

      {/* Feature Comparison Table */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-20 md:py-24 lg:py-28">
          <div className="text-center mb-14 md:mb-18 lg:mb-24" id="pricing">
            <h2 className="section-title">So sánh chi tiết các gói dịch vụ</h2>
            <p className="section-subtitle">
              Tìm hiểu rõ hơn về các tính năng của từng gói
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="comparison-table">
                <thead>
                  <tr className="bg-gradient-to-r from-brand-blue to-brand-light-blue text-white">
                    <th className="border-r-2 border-white/30 p-8">
                      <div className="text-lg md:text-xl font-bold">Gói dịch vụ</div>
                    </th>
                    <th className="p-8">
                      <div className="text-lg md:text-xl font-bold">Dùng thử miễn phí</div>
                    </th>
                    <th className="p-8">
                      <div className="text-lg md:text-xl font-bold">Cơ bản</div>
                    </th>
                    <th className="p-8">
                      <div className="text-lg md:text-xl font-bold">Premium</div>
                    </th>
                    <th className="p-8">
                      <div className="text-lg md:text-xl font-bold">Doanh nghiệp</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Price Row */}
                  <tr className="border-b border-gray-200 hover:bg-blue-50/30 transition">
                    <td className="border-r-2 border-gray-300 p-8">
                      <div className="text-base md:text-lg font-bold text-gray-700">Giá</div>
                    </td>
                    <td className="p-8">
                      <div className="text-lg md:text-xl font-semibold text-gray-700">0đ</div>
                    </td>
                    <td className="p-8">
                      <div className="text-lg md:text-xl font-semibold text-gray-700">299,000₫/tháng</div>
                    </td>
                    <td className="p-8">
                      <div className="text-lg md:text-xl font-semibold text-gray-700">699,000₫/tháng</div>
                    </td>
                    <td className="p-8">
                      <div className="text-lg md:text-xl font-semibold text-gray-700">Liên hệ</div>
                    </td>
                  </tr>

                  {/* Feature Rows */}
                  <tr className="border-b border-gray-200 hover:bg-blue-50/30 transition">
                    <td className="border-r-2 border-gray-300 p-8">
                      <div className="text-base md:text-lg font-medium text-gray-700">Số phiên luyện tập</div>
                    </td>
                    <td className="p-8 text-base md:text-lg text-gray-700">3 phiên</td>
                    <td className="p-8 text-base md:text-lg text-gray-700">20 phiên/tháng</td>
                    <td className="p-8 text-base md:text-lg text-gray-700">Không giới hạn</td>
                    <td className="p-8 text-base md:text-lg text-gray-700">Không giới hạn cho tổ chức</td>
                  </tr>

                  <tr className="border-b border-gray-200 hover:bg-blue-50/30 transition">
                    <td className="border-r-2 border-gray-300 p-8">
                      <div className="text-base md:text-lg font-medium text-gray-700">Số kỹ năng</div>
                    </td>
                    <td className="p-8 text-base md:text-lg text-gray-700">1-2 kỹ năng</td>
                    <td className="p-8 text-base md:text-lg text-gray-700">3 kỹ năng</td>
                    <td className="p-8 text-base md:text-lg text-gray-700">5 kỹ năng</td>
                    <td className="p-8 text-base md:text-lg text-gray-700">Tùy chỉnh theo yêu cầu</td>
                  </tr>

                  <tr className="border-b border-gray-200 hover:bg-blue-50/30 transition">
                    <td className="border-r-2 border-gray-300 p-8">
                      <div className="text-base md:text-lg font-medium text-gray-700">Bộ câu hỏi</div>
                    </td>
                    <td className="p-8 text-base md:text-lg text-gray-700">Cơ bản</td>
                    <td className="p-8 text-base md:text-lg text-gray-700">Đầy đủ</td>
                    <td className="p-8 text-base md:text-lg text-gray-700">Đầy đủ + Độc quyền</td>
                    <td className="p-8 text-base md:text-lg text-gray-700">Tùy chỉnh theo ngành</td>
                  </tr>

                  <tr className="border-b border-gray-200 hover:bg-blue-50/30 transition">
                    <td className="border-r-2 border-gray-300 p-8">
                      <div className="text-base md:text-lg font-medium text-gray-700">AI Feedback</div>
                    </td>
                    <td className="p-8 text-base md:text-lg text-gray-700">Tổng quan</td>
                    <td className="p-8 text-base md:text-lg text-gray-700">Chi tiết</td>
                    <td className="p-8 text-base md:text-lg text-gray-700">Chuyên sâu + Video</td>
                    <td className="p-8 text-base md:text-lg text-gray-700">Chuyên sâu + Báo cáo tổ chức</td>
                  </tr>

                  <tr className="border-b border-gray-200 hover:bg-blue-50/30 transition">
                    <td className="border-r-2 border-gray-300 p-8">
                      <div className="text-base md:text-lg font-medium text-gray-700">Virtual Human Mode</div>
                    </td>
                    <td className="p-8">
                      <span className="compare-x">✗</span>
                    </td>
                    <td className="p-8">
                      <span className="compare-check">✓</span>
                    </td>
                    <td className="p-8">
                      <span className="compare-check">✓</span>
                    </td>
                    <td className="p-8">
                      <span className="compare-check">✓</span>
                    </td>
                  </tr>

                  <tr className="border-b border-gray-200 hover:bg-blue-50/30 transition">
                    <td className="border-r-2 border-gray-300 p-8">
                      <div className="text-base md:text-lg font-medium text-gray-700">Lưu lịch sử</div>
                    </td>
                    <td className="p-8">
                      <span className="compare-x">✗</span>
                    </td>
                    <td className="p-8">
                      <span className="compare-check">✓</span>
                    </td>
                    <td className="p-8">
                      <span className="compare-check">✓</span>
                    </td>
                    <td className="p-8">
                      <span className="compare-check">✓</span>
                    </td>
                  </tr>

                  <tr className="border-b border-gray-200 hover:bg-blue-50/30 transition">
                    <td className="border-r-2 border-gray-300 p-8">
                      <div className="text-base md:text-lg font-medium text-gray-700">Báo cáo tiến độ</div>
                    </td>
                    <td className="p-8 text-base md:text-lg text-gray-700">Đơn giản</td>
                    <td className="p-8">
                      <span className="compare-check">✓</span>
                    </td>
                    <td className="p-8 text-base md:text-lg text-gray-700">Lộ trình cá nhân</td>
                    <td className="p-8 text-base md:text-lg text-gray-700">Báo cáo tập thể</td>
                  </tr>

                  <tr className="border-b border-gray-200 hover:bg-blue-50/30 transition">
                    <td className="border-r-2 border-gray-300 p-8">
                      <div className="text-base md:text-lg font-medium text-gray-700">Quản lý nhóm ứng viên</div>
                    </td>
                    <td className="p-8">
                      <span className="compare-x">✗</span>
                    </td>
                    <td className="p-8">
                      <span className="compare-x">✗</span>
                    </td>
                    <td className="p-8">
                      <span className="compare-x">✗</span>
                    </td>
                    <td className="p-8">
                      <span className="compare-check">✓</span>
                    </td>
                  </tr>

                  <tr className="border-b border-gray-200 hover:bg-blue-50/30 transition">
                    <td className="border-r-2 border-gray-300 p-8">
                      <div className="text-base md:text-lg font-medium text-gray-700">Dashboard tổ chức</div>
                    </td>
                    <td className="p-8">
                      <span className="compare-x">✗</span>
                    </td>
                    <td className="p-8">
                      <span className="compare-x">✗</span>
                    </td>
                    <td className="p-8">
                      <span className="compare-x">✗</span>
                    </td>
                    <td className="p-8">
                      <span className="compare-check">✓</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-blue-50/30 transition">
                    <td className="border-r-2 border-gray-300 p-8">
                      <div className="text-base md:text-lg font-medium text-gray-700">Hỗ trợ</div>
                    </td>
                    <td className="p-8 text-base md:text-lg text-gray-700">Email</td>
                    <td className="p-8 text-base md:text-lg text-gray-700">Email + Chat</td>
                    <td className="p-8 text-base md:text-lg text-gray-700">Ưu tiên 24/7</td>
                    <td className="p-8 text-base md:text-lg text-gray-700">Quản lý tài khoản riêng</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
                Bạn vẫn chưa chắc chắn?
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-700 font-medium">
                Hãy bắt đầu với gói Free Trial để trải nghiệm TrueMirror hoàn toàn miễn phí!
              </p>
              <div className="h-6"></div>
              <div className="flex justify-center gap-6">
                <button className="btn-primary text-sm md:text-base px-6 py-3" onClick={handleFreeTrial}>
                  Dùng thử miễn phí
                </button>
                <button className="btn-secondary text-sm md:text-base px-6 py-3" onClick={handleContact}>
                  Liên hệ tư vấn
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

export default Services