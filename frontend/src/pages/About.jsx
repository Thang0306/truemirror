import React from 'react'

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Brand Story */}
      <section className="w-full bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl py-16 md:py-24">
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-16 shadow-xl border border-gray-100 text-center">
            
            <div className="flex flex-col items-center justify-center space-y-8">
              <br />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-navy leading-tight mt-8">
                Về TrueMirror
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-brand-blue">
                Câu chuyện thương hiệu
              </p>
              
              <div className="max-w-7xl mx-auto space-y-6 text-gray-700 leading-relaxed text-base md:text-lg lg:text-xl">
                <p>
                  TrueMirror ra đời từ một nhận thức đơn giản nhưng sâu sắc: <strong>Nhiều ứng viên tài năng 
                  thất bại trong phỏng vấn không phải vì thiếu năng lực</strong>, mà vì họ không biết cách 
                  thể hiện bản thân một cách tự tin và chuyên nghiệp trước nhà tuyển dụng.
                </p>
                <p>
                  Chúng tôi tin rằng mỗi người đều xứng đáng có cơ hội để <strong>luyện tập, cải thiện 
                  và tỏa sáng</strong> trong những cuộc phỏng vấn quan trọng. Với sự kết hợp giữa 
                  <strong> công nghệ AR hiện đại</strong> và <strong>trí tuệ nhân tạo AI tiên tiến</strong>, 
                  TrueMirror tạo ra một môi trường luyện tập an toàn, chân thực và hiệu quả.
                </p>
                <p>
                  Từ năm 2024, chúng tôi đã đồng hành cùng <strong>hàng nghìn ứng viên</strong> trên 
                  hành trình chinh phục những vị trí mơ ước, giúp họ tự tin hơn, chuẩn bị tốt hơn 
                  và thành công hơn trong mỗi cuộc phỏng vấn.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10 bg-white"></div>

      {/* Vision & Mission */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-20 md:py-24 lg:py-28">
          <div className="text-center mb-14 md:mb-18 lg:mb-24">
            <h2 className="section-title">Tầm nhìn & Sứ mệnh</h2>
            <p className="section-subtitle">
              Định hướng phát triển của TrueMirror
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 md:gap-14 lg:gap-16">
            {/* Vision Card */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-12 md:p-14 lg:p-16 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center text-center min-h-96">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-blue rounded-full flex items-center justify-center mb-8 md:mb-10 lg:mb-12">
                <span className="text-3xl md:text-4xl">🎯</span>
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-brand-navy mb-6 md:mb-7 lg:mb-8">
                Tầm nhìn
              </h3>
              <br />
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                Trở thành nền tảng luyện phỏng vấn số 1 Việt Nam, giúp mọi ứng viên tự tin 
                thể hiện bản thân và chinh phục mọi cơ hội nghề nghiệp.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-12 md:p-14 lg:p-16 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center text-center min-h-96">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-600 rounded-full flex items-center justify-center mb-8 md:mb-10 lg:mb-12">
                <span className="text-3xl md:text-4xl">🚀</span>
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-brand-navy mb-6 md:mb-7 lg:mb-8">
                Sứ mệnh
              </h3>
              <br />
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                Cung cấp công nghệ AR & AI tiên tiến để mô phỏng môi trường phỏng vấn chân thực, 
                giúp ứng viên luyện tập hiệu quả và nhận phản hồi chi tiết để cải thiện kỹ năng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10 bg-white"></div>

      {/* Core Values */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-20 md:py-24 lg:py-28">
          <div className="text-center mb-14 md:mb-18 lg:mb-24">
            <h2 className="section-title">Giá trị cốt lõi</h2>
            <p className="section-subtitle">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
            {/* Value 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-10 md:p-12 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center text-center min-h-80">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-blue rounded-full flex items-center justify-center mb-6 md:mb-8">
                <span className="text-4xl md:text-5xl">💡</span>
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-navy mb-4 md:mb-5">
                Đổi mới
              </h3>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                Không ngừng nghiên cứu và ứng dụng công nghệ tiên tiến nhất.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-gradient-to-br from-green-50 to-white p-10 md:p-12 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center text-center min-h-80">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-600 rounded-full flex items-center justify-center mb-6 md:mb-8">
                <span className="text-4xl md:text-5xl">🤝</span>
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-navy mb-4 md:mb-5">
                Tận tâm
              </h3>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                Đặt sự thành công của người dùng lên hàng đầu trong mọi quyết định.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-10 md:p-12 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center text-center min-h-80">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-600 rounded-full flex items-center justify-center mb-6 md:mb-8">
                <span className="text-4xl md:text-5xl">⚡</span>
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-navy mb-4 md:mb-5">
                Hiệu quả
              </h3>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                Tối ưu hóa thời gian và kết quả luyện tập cho từng cá nhân.
              </p>
            </div>

            {/* Value 4 */}
            <div className="bg-gradient-to-br from-orange-50 to-white p-10 md:p-12 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center text-center min-h-80">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-600 rounded-full flex items-center justify-center mb-6 md:mb-8">
                <span className="text-4xl md:text-5xl">🌟</span>
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-navy mb-4 md:mb-5">
                Chất lượng
              </h3>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                Cam kết cung cấp trải nghiệm và nội dung chuyên nghiệp nhất.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10 bg-white"></div>

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
                <button className="btn-primary text-sm md:text-base px-6 py-3">
                  Dùng thử miễn phí
                </button>
                <button className="btn-secondary text-sm md:text-base px-6 py-3">
                  Xem dịch vụ
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

export default About