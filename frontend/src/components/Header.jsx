import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../pages/InterviewRoom.css' 
import './Header.css' // New search styles

const Header = ({
  interviewMode = false,
  sessionInfo = null,
  isConnected = false,
  translations = null,
  onEvaluate = null,
  onEndSession = null,
  isEvaluating = false,
  hasEvaluated = false,
  readOnlyMode = false
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchText, setSearchText] = useState('')

  // Search functionality
  const handleSearch = (e) => {
    e.preventDefault()
    
    // Clear previous highlights
    const highlights = document.querySelectorAll('mark.search-highlight')
    highlights.forEach(mark => {
      const parent = mark.parentNode
      parent.replaceChild(document.createTextNode(mark.textContent), mark)
      parent.normalize()
    })

    if (!searchText.trim()) return

    try {
      const regex = new RegExp(searchText, 'gi')
      const treeWalker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function(node) {
            // Skip scripts, styles, and inputs
            if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT'].includes(node.parentNode.nodeName)) {
              return NodeFilter.FILTER_REJECT
            }
            if (node.parentNode.isContentEditable) return NodeFilter.FILTER_REJECT
            return NodeFilter.FILTER_ACCEPT
          }
        }
      )

      const nodesToReplace = []
      while (treeWalker.nextNode()) {
        const node = treeWalker.currentNode
        if (node.nodeValue.match(regex)) {
          nodesToReplace.push(node)
        }
      }

      nodesToReplace.forEach(node => {
        const fragment = document.createDocumentFragment()
        let lastIdx = 0
        const text = node.nodeValue
        
        text.replace(regex, (match, idx) => {
          fragment.appendChild(document.createTextNode(text.slice(lastIdx, idx)))
          const mark = document.createElement('mark')
          mark.className = 'search-highlight'
          mark.textContent = match
          fragment.appendChild(mark)
          lastIdx = idx + match.length
          return match
        })
        
        fragment.appendChild(document.createTextNode(text.slice(lastIdx)))
        node.parentNode.replaceChild(fragment, node)
      })
    } catch (err) {
      console.error('Search error:', err)
    }
  }

  // Check if user is in interview setup page (not in interview room yet)
  const isInSetup = location.pathname === '/setup'

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

  // Get translation helper for interview mode
  const t = (key) => {
    if (!translations || !sessionInfo) return key
    const lang = sessionInfo?.language || 'vi'
    return translations[lang]?.[key] || translations.vi?.[key] || key
  }

  // Interview mode layout
  if (interviewMode && sessionInfo) {
    return (
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200 h-16 md:h-20 flex items-center">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-center gap-8">
            {/* Logo - not clickable in interview mode */}
            <div className="flex-shrink-0 flex items-center gap-2 md:gap-3">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img
                  src="/logo.svg"
                  alt="TrueMirror Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span
                className="text-3xl md:text-4xl font-bold whitespace-nowrap"
                style={{
                  background: 'linear-gradient(90deg, #0F2854 0%, #0F2854 15%, #1C4D8D 40%, #4988C4 70%, #7BA8D4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                TRUEMIRROR
              </span>
            </div>

            {/* Interview info - centered */}
            <div className="flex-1 text-center">
              <h1 className="text-lg md:text-xl font-bold text-brand-navy">
                {t('title')} {sessionInfo.position} - {sessionInfo.industry}
              </h1>
              <p className="text-xs md:text-sm text-gray-600 mt-0.5">
                {t('style')} {sessionInfo.language === 'vi' ? sessionInfo.style : translations?.en?.styles?.[sessionInfo.style] || sessionInfo.style} | {t('language')} {sessionInfo.language === 'vi' ? t('vietnamese') : t('english')}
                {' | '}
                <span className={`inline-flex items-center gap-1 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-600' : 'bg-red-600'}`}></span>
                  {isConnected ? t('connected') : t('disconnected')}
                </span>
              </p>
            </div>

            {/* Action buttons - same size as login/register buttons */}
            {readOnlyMode ? (
              <div className="flex gap-4 flex-shrink-0">
                <button
                  onClick={onEndSession}
                  className="btn-primary text-sm font-medium px-4 py-2 h-9"
                >
                  ← Quay lại lịch sử
                </button>
              </div>
            ) : (
              <div className="flex gap-4 flex-shrink-0">
                <button
                  onClick={onEvaluate}
                  disabled={!isConnected || isEvaluating || hasEvaluated}
                  className="evaluate-btn text-sm font-medium px-4 py-2 h-10 leading-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('evaluateInterview')}
                </button>
                <button
                  onClick={onEndSession}
                  disabled={!isConnected}
                  className="end-interview-btn text-sm font-medium px-4 py-2 h-10 leading-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('endInterview')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    )
  }

  // Normal header layout (for all other pages including setup)
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 h-16 md:h-18 lg:h-20 flex items-center">
      <nav className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between lg:justify-start items-center gap-5 lg:gap-4 xl:gap-8">
            <Link to="/" className="flex items-center gap-2 md:gap-3">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img
                  src="/logo.svg"
                  alt="TrueMirror Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span
                className="text-3xl md:text-4xl font-bold whitespace-nowrap"
                style={{
                  background: 'linear-gradient(90deg, #0F2854 0%, #0F2854 15%, #1C4D8D 40%, #4988C4 70%, #7BA8D4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                TRUEMIRROR
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-5 lg:gap-8">
                {/* <Link
                  to="/"
                  className={`text-base font-medium transition ${
                    isActive('/') ? 'text-brand-blue font-bold border-b-2 border-brand-blue' : 'text-gray-700 hover:text-brand-blue'
                  }`}
                >
                  Trang chủ
                </Link> */}
                <Link
                  to="/about"
                  className={`text-lg font-medium transition whitespace-nowrap ${
                    isActive('/about') ? 'text-brand-blue font-bold border-b-2 border-brand-blue' : 'text-gray-700 hover:text-brand-blue'
                  }`}
                >
                  Về TrueMirror
                </Link>
                <Link
                  to="/services"
                  className={`text-lg font-medium transition whitespace-nowrap ${
                    isActive('/services') ? 'text-brand-blue font-bold border-b-2 border-brand-blue' : 'text-gray-700 hover:text-brand-blue'
                  }`}
                >
                  Dịch vụ
                </Link>
                <Link
                  to="/news"
                  className={`text-lg font-medium transition whitespace-nowrap ${
                    isActive('/news') ? 'text-brand-blue font-bold border-b-2 border-brand-blue' : 'text-gray-700 hover:text-brand-blue'
                  }`}
                >
                  Tin tức
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/dashboard"
                    className={`text-lg font-medium transition whitespace-nowrap ${
                      isActive('/dashboard') ? 'text-brand-blue font-bold border-b-2 border-brand-blue' : 'text-gray-700 hover:text-brand-blue'
                    }`}
                  >
                    Phỏng vấn
                  </Link>
                )}
              </div>

            <div className="hidden lg:flex items-center gap-4 lg:gap-6">
                 {/* Search Bar - Always Visible */}
                 <form onSubmit={handleSearch} className="search-bar-container">
                      <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm kiếm..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                      <button type="submit" className="search-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                    </form>

                {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="btn-secondary text-base font-medium px-5 h-10 flex items-center justify-center transition-all hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
              ) : (
                <>
                  <Link to="/login">
                    <button className="btn-secondary text-base font-medium px-5 h-10 flex items-center justify-center transition-all hover:bg-gray-100">
                      Đăng nhập
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="btn-primary text-base font-medium px-5 h-10 flex items-center justify-center transition-all">
                      Đăng ký
                    </button>
                  </Link>
                </>
              )}
              </div>

            <button
              className="lg:hidden"
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
            <div className="lg:hidden fixed top-16 left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto px-4 pb-8 border-t border-gray-100 shadow-xl">
              <div className="flex flex-col space-y-4 pt-6">
                <Link
                  to="/about"
                  className={`font-medium text-lg py-3 border-b border-gray-50 text-center ${
                    isActive('/about') ? 'text-brand-blue font-bold' : 'text-gray-700 hover:text-brand-blue'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Về TrueMirror
                </Link>
                <Link
                  to="/services"
                  className={`font-medium text-lg py-3 border-b border-gray-50 text-center ${
                    isActive('/services') ? 'text-brand-blue font-bold' : 'text-gray-700 hover:text-brand-blue'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dịch vụ
                </Link>
                <Link
                  to="/news"
                  className={`font-medium text-lg py-3 border-b border-gray-50 text-center ${
                    isActive('/news') ? 'text-brand-blue font-bold' : 'text-gray-700 hover:text-brand-blue'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tin tức
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/dashboard"
                    className={`font-medium text-lg py-3 border-b border-gray-50 text-center ${
                      isActive('/dashboard') ? 'text-brand-blue font-bold' : 'text-gray-700 hover:text-brand-blue'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Phỏng vấn
                  </Link>
                )}
                
                <div className="pt-2">
                  <form onSubmit={handleSearch} className="search-bar-container w-full">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Tìm kiếm..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button type="submit" className="search-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </form>
                </div>
                
                <div className="pt-4 flex flex-col gap-3 items-center">
                {isAuthenticated ? (
                    <button onClick={handleLogout} className="btn-secondary w-full max-w-[320px] text-base py-3 rounded-lg">
                      Đăng xuất
                    </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full flex justify-center">
                      <button className="btn-secondary w-full max-w-[320px] text-base py-3 rounded-lg">Đăng nhập</button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full flex justify-center">
                      <button className="btn-primary w-full max-w-[320px] text-base py-3 rounded-lg shadow-md">Đăng ký</button>
                    </Link>
                  </>
                )}
                </div>
              </div>
            </div>
          )}
        </nav>
    </header>
  )
}

export default Header