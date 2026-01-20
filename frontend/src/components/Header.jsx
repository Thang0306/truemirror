import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => {
    if (path === '/dashboard') {
      // Dashboard is active for /dashboard and all its sub-routes like /interview/*
      return location.pathname === '/dashboard' || location.pathname.startsWith('/interview')
    }
    return location.pathname === path
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 h-24 md:h-28 lg:h-20 flex items-center">
      <nav className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-brand-blue to-brand-light-blue rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg md:text-xl">TM</span>
              </div>
              <span className="text-2xl md:text-4xl font-bold text-brand-navy">TRUEMIRROR</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 lg:gap-10">
              <Link
                to="/"
                className={`text-lg lg:text-xl font-medium transition ${
                  isActive('/') ? 'text-brand-blue font-bold border-b-2 border-brand-blue' : 'text-gray-700 hover:text-brand-blue'
                }`}
              >
                Trang chủ
              </Link>
              <Link
                to="/about"
                className={`text-lg lg:text-xl font-medium transition ${
                  isActive('/about') ? 'text-brand-blue font-bold border-b-2 border-brand-blue' : 'text-gray-700 hover:text-brand-blue'
                }`}
              >
                Về TrueMirror
              </Link>
              <Link
                to="/services"
                className={`text-lg lg:text-xl font-medium transition ${
                  isActive('/services') ? 'text-brand-blue font-bold border-b-2 border-brand-blue' : 'text-gray-700 hover:text-brand-blue'
                }`}
              >
                Dịch vụ
              </Link>
              <Link
                to="/news"
                className={`text-lg lg:text-xl font-medium transition ${
                  isActive('/news') ? 'text-brand-blue font-bold border-b-2 border-brand-blue' : 'text-gray-700 hover:text-brand-blue'
                }`}
              >
                Tin tức
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className={`text-lg lg:text-xl font-medium transition ${
                    isActive('/dashboard') ? 'text-brand-blue font-bold border-b-2 border-brand-blue' : 'text-gray-700 hover:text-brand-blue'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>

            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              {isAuthenticated ? (
                <>
                  <span className="text-lg text-gray-700">
                    Xin chào, <strong>{user?.full_name}</strong>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary text-lg lg:text-xl px-4 md:px-5 py-2 h-14 leading-none"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button className="btn-secondary text-lg lg:text-xl px-4 md:px-5 py-2 h-14 leading-none">
                      Đăng nhập
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="btn-primary text-lg lg:text-xl px-4 md:px-5 py-2 h-14 leading-none">
                      Dùng thử miễn phí
                    </button>
                  </Link>
                </>
              )}
             
            <div className="h-3"></div>
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/"
                  className={`font-medium text-base ${
                    isActive('/') ? 'text-brand-blue font-bold' : 'text-gray-700 hover:text-brand-blue'
                  }`}
                >
                  Trang chủ
                </Link>
                <Link
                  to="/about"
                  className={`font-medium text-base ${
                    isActive('/about') ? 'text-brand-blue font-bold' : 'text-gray-700 hover:text-brand-blue'
                  }`}
                >
                  Về TrueMirror
                </Link>
                <Link
                  to="/services"
                  className={`font-medium text-base ${
                    isActive('/services') ? 'text-brand-blue font-bold' : 'text-gray-700 hover:text-brand-blue'
                  }`}
                >
                  Dịch vụ
                </Link>
                <Link
                  to="/news"
                  className={`font-medium text-base ${
                    isActive('/news') ? 'text-brand-blue font-bold' : 'text-gray-700 hover:text-brand-blue'
                  }`}
                >
                  Tin tức
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/dashboard"
                    className={`font-medium text-base ${
                      isActive('/dashboard') ? 'text-brand-blue font-bold' : 'text-gray-700 hover:text-brand-blue'
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
                
                {isAuthenticated ? (
                  <>
                    <div className="text-gray-700 text-base pt-2 border-t">
                      Xin chào, <strong>{user?.full_name}</strong>
                    </div>
                    <button onClick={handleLogout} className="btn-secondary w-full text-base">
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <button className="btn-secondary w-full text-base">Đăng nhập</button>
                    </Link>
                    <Link to="/register">
                      <button className="btn-primary w-full text-base">Dùng thử miễn phí</button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
    </header>
  )
}

export default Header