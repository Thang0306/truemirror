import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-brand-navy text-white border-t border-gray-800">
      <div className="container mx-auto px-6 md:px-8 py-12 md:py-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
          <div className="md:pr-4">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-5">TrueMirror</h3>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              Nền tảng luyện phỏng vấn thông minh với AR và AI, giúp bạn tự tin chinh phục mọi cơ hội nghề nghiệp.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 md:mb-5 text-lg md:text-xl">Liên kết nhanh</h4>
            <ul className="space-y-2 text-base md:text-lg">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition">Về chúng tôi</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white transition">Dịch vụ</Link></li>
              <li><Link to="/news" className="text-gray-300 hover:text-white transition">Tin tức</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 md:mb-5 text-lg md:text-xl">Hỗ trợ</h4>
            <ul className="space-y-2 text-base md:text-lg">
              <li><Link to="/help" className="text-gray-300 hover:text-white transition">Trợ giúp</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white transition">Bảo mật</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 md:mb-5 text-lg md:text-xl">Liên hệ</h4>
            <ul className="space-y-2 text-base md:text-lg">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <span className="text-gray-300 break-all">support@truemirror.ai</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span className="text-gray-300">(+84) 123 456 789</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 md:mt-14 pt-7 md:pt-9 text-center text-base md:text-lg text-gray-400">
          <p>© 2026 TrueMirror. Luyện phỏng vấn thông minh.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer