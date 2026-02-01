import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-brand-navy text-white border-t border-gray-800">
      <div className="container mx-auto px-6 md:px-8 py-12 md:py-16 max-w-6xl">
        <div className="h-3"></div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-10">
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
              <div className="h-1"></div>
              <li><Link to="/services" className="text-gray-300 hover:text-white transition">Dịch vụ</Link></li>
              <div className="h-1"></div>
              <li><Link to="/news" className="text-gray-300 hover:text-white transition">Tin tức</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 md:mb-5 text-lg md:text-xl">Hỗ trợ</h4>
            <ul className="space-y-2 text-base md:text-lg">
              <li><Link to="/help" className="text-gray-300 hover:text-white transition">Trợ giúp</Link></li>
              <div className="h-1"></div>
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
              <div className="h-1"></div>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span className="text-gray-300">(+84) 123 456 789</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 md:mb-5 text-lg md:text-xl">Kết nối với chúng tôi</h4>
            <ul className="space-y-3">
              {/* TikTok */}
              <li>
                <a 
                  href="https://www.tiktok.com/@truemirror.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition group"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  <span className="text-base md:text-lg">TikTok</span>
                </a>
              </li>

              <div className="h-1"></div>

              {/* Facebook */}
              <li>
                <a 
                  href="https://www.facebook.com/truemirror.luyenphongvanao/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition group"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-base md:text-lg">Facebook</span>
                </a>
              </li>
              <div className="h-1"></div>

              {/* Threads */}
              <li>
                <a 
                  href="https://www.threads.com/@truemirror.luyenphongvanao" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition group"
                >
                  <svg
                    aria-label="Threads"
                    viewBox="0 0 192 192"
                    className="w-6 h-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"/>
                  </svg>
                  <span className="text-base md:text-lg">Threads</span>
                </a>
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