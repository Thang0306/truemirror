import React from 'react'

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
        '✗ Không có AR mode',
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
        '✓ AR mode cơ bản',
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
        '✓ AR mode nâng cao',
        '✓ Hỗ trợ ưu tiên 24/7',
      ],
      cta: 'Chọn gói này',
      recommended: true,
    },
  ]

  return (
    <div className="min-h-screen">
      <section className="w-full bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl py-16 md:py-24">
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-16 shadow-xl border border-gray-100 text-center">
            <br />
            <div className="flex flex-col items-center justify-center space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-navy leading-tight">
                Dịch vụ luyện phỏng vấn
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-brand-blue">
                Chọn gói phù hợp với nhu cầu của bạn
              </p>
              
              <div className="max-w-6xl mx-auto text-gray-700 leading-relaxed text-base md:text-lg lg:text-xl">
                <p>
                  TrueMirror cung cấp 3 gói dịch vụ linh hoạt, từ miễn phí đến chuyên nghiệp, 
                  giúp bạn luyện tập và cải thiện kỹ năng phỏng vấn một cách hiệu quả nhất.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10 bg-white"></div>

      {/* Pricing Cards - FIXED: Căn giữa content trong cards */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${plan.color} p-10 md:p-12 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col text-center ${
                  plan.recommended ? 'ring-4 ring-purple-500 transform scale-105' : ''
                }`}
              >
                {plan.recommended && (
                  <div className="bg-purple-600 text-white text-sm md:text-base font-bold px-4 py-2 rounded-full -mt-16 mb-4 mx-auto">
                    ĐƯỢC ƯA CHUỘNG NHẤT
                  </div>
                )}

                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <span className="text-6xl">{plan.icon}</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-brand-navy mb-4 text-center">
                  {plan.name}
                </h3>

                <div className="mb-8 text-center">
                  <span className="text-4xl md:text-5xl font-bold text-brand-blue">
                    {plan.price}
                  </span>
                  <span className="text-lg md:text-xl text-gray-600">{plan.period}</span>
                </div>

                {/* FIXED: Căn giữa features */}
                <ul className="space-y-4 mb-10 flex-grow text-center">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className={`text-base md:text-lg ${
                        feature.startsWith('✓') ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`${
                    plan.recommended ? 'btn-primary' : 'btn-secondary'
                  } w-full text-sm md:text-base py-3`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10 bg-white"></div>

      {/* Feature Comparison Table */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-20 md:py-24 lg:py-28">
          <div className="text-center mb-14 md:mb-18 lg:mb-24">
            <h2 className="section-title">So sánh chi tiết các gói dịch vụ</h2>
            <p className="section-subtitle">
              Tìm hiểu rõ hơn về các tính năng của từng gói
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
            <div className="space-y-6">
              {/* Header Row */}
              <div className="grid grid-cols-4 gap-4 bg-gradient-to-r from-brand-blue to-brand-light-blue text-white rounded-xl p-6">
                <div className="text-center text-base md:text-lg font-bold border-r-2 border-white/30">Tính năng</div>
                <div className="text-center text-base md:text-lg font-bold">Free Trial</div>
                <div className="text-center text-base md:text-lg font-bold">Basic</div>
                <div className="text-center text-base md:text-lg font-bold">Premium</div>
              </div>

              {/* Data Rows */}
              {[
                ['Số phiên luyện tập', '3 phiên', '20 phiên/tháng', 'Không giới hạn'],
                ['Bộ câu hỏi', 'Cơ bản', 'Đầy đủ', 'Đầy đủ + Độc quyền'],
                ['AI Feedback', 'Tổng quan', 'Chi tiết', 'Chuyên sâu + Video'],
                ['AR Mode', '✗', 'Cơ bản', 'Nâng cao'],
                ['Lưu lịch sử', '✗', '✓', '✓'],
                ['Báo cáo tiến độ', 'Đơn giản', '✓', '✓ + Lộ trình cá nhân'],
                ['Hỗ trợ', 'Email', 'Email + Chat', 'Ưu tiên 24/7'],
              ].map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-4 gap-4 p-6 rounded-xl hover:bg-blue-50 transition border border-gray-100"
                >
                  <div className="text-center text-base md:text-lg text-gray-700 font-medium border-r-2 border-gray-300">
                    {row[0]}
                  </div>
                  <div className="text-center text-base md:text-lg text-gray-600">
                    {row[1]}
                  </div>
                  <div className="text-center text-base md:text-lg text-gray-600">
                    {row[2]}
                  </div>
                  <div className="text-center text-base md:text-lg text-gray-700 font-semibold">
                    {row[3]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10 bg-white"></div>

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
              <br />
              <div className="flex justify-center gap-6">
                <button className="btn-primary text-sm md:text-base px-6 py-3">
                  Dùng thử 3 phiên miễn phí
                </button>
                <button className="btn-secondary text-sm md:text-base px-6 py-3">
                  Liên hệ tư vấn
                </button>
              </div>
              <div className="h-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10 bg-white"></div>
    </div>
  )
}

export default Services