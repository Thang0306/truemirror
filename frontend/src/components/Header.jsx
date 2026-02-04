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
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200 h-24 md:h-28 lg:h-20 flex items-center">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-center gap-8">
            {/* Logo - not clickable in interview mode */}
            <div className="flex-shrink-0 flex items-center gap-3 md:gap-4">
              <div className="w-16 h-16 md:w-18 md:h-18 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img
                  src="/logo.svg"
                  alt="TrueMirror Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span
                className="text-2xl md:text-4xl font-bold"
                style={{
                  background: 'linear-gradient(90deg, #0F2854 0%, #0F2854 15%, #1C4D8D 40%, #4988C4 70%, #7BA8D4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                TRUEMIRRO<span className="inline-block scale-x-[-1]" style={{ 
                  color: '#7BA8D4',
                  WebkitTextFillColor: '#7BA8D4',
                  WebkitBackgroundClip: 'unset',
                  backgroundClip: 'unset'
                }}>R</span>
              </span>
            </div>

            {/* Interview info - centered */}
            <div className="flex-1 text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-brand-navy">
                {t('title')} {sessionInfo.position} - {sessionInfo.industry}
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">
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
                  className="btn-primary text-base md:text-lg px-8 py-3"
                >
                  ← Quay lại lịch sử
                </button>
              </div>
            ) : (
              <div className="flex gap-4 flex-shrink-0">
                <button
                  onClick={onEvaluate}
                  disabled={!isConnected || isEvaluating || hasEvaluated}
                  className="evaluate-btn text-lg lg:text-xl px-4 md:px-5 py-2 h-14 leading-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('evaluateInterview')}
                </button>
                <button
                  onClick={onEndSession}
                  disabled={!isConnected}
                  className="end-interview-btn text-lg lg:text-xl px-4 md:px-5 py-2 h-14 leading-none disabled:opacity-50 disabled:cursor-not-allowed"
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
    <header className="bg-white shadow-md sticky top-0 z-50 h-24 md:h-28 lg:h-20 flex items-center">
      <nav className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 md:gap-4">
              <div className="w-16 h-16 md:w-18 md:h-18 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img
                  src="/logo.svg"
                  alt="TrueMirror Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span
                className="text-2xl md:text-4xl font-bold"
                style={{
                  background: 'linear-gradient(90deg, #0F2854 0%, #0F2854 15%, #1C4D8D 40%, #4988C4 70%, #7BA8D4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                TRUEMIRRO<span className="inline-block scale-x-[-1]" style={{ 
                  color: '#7BA8D4',
                  WebkitTextFillColor: '#7BA8D4',
                  WebkitBackgroundClip: 'unset',
                  backgroundClip: 'unset'
                }}>R</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8 lg:gap-10">
                {/* <Link
                  to="/"
                  className={`text-lg lg:text-xl font-medium transition ${
                    isActive('/') ? 'text-brand-blue font-bold border-b-2 border-brand-blue' : 'text-gray-700 hover:text-brand-blue'
                  }`}
                >
                  Trang chủ
                </Link> */}
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
                    Phỏng vấn
                  </Link>
                )}
              </div>

            <div className="hidden md:flex items-center gap-4 lg:gap-6">
                {isAuthenticated ? (
                  <>
                    {/* Search Bar */}
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
                    <button
                      onClick={handleLogout}
                      className="btn-secondary text-base lg:text-lg px-4 py-2 h-11 leading-none transition-all hover:bg-gray-100"
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
                {/* <Link
                  to="/"
                  className={`font-medium text-base ${
                    isActive('/') ? 'text-brand-blue font-bold' : 'text-gray-700 hover:text-brand-blue'
                  }`}
                >
                  Trang chủ
                </Link> */}
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
                    Phỏng vấn
                  </Link>
                )}
                
                {isAuthenticated ? (
                  <>
                    <div className="pt-2 border-t">
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