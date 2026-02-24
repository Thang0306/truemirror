import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Header.css'

const Header = ({ 
  interviewMode = false, 
  sessionInfo = null, 
  onEvaluate = null, 
  onEndSession = null,
  isConnected = false,
  isEvaluating = false,
  hasEvaluated = false,
  readOnlyMode = false,
  translations = null
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchText, setSearchText] = useState('')

  const isAuthenticated = !!user

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const handleLogout = async () => {
    try {
      await logout()
      setIsMenuOpen(false)
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Remove all existing search highlights from the page
  const clearHighlights = () => {
    const marks = document.querySelectorAll('mark[data-search]')
    marks.forEach((mark) => {
      const parent = mark.parentNode
      parent.replaceChild(document.createTextNode(mark.textContent), mark)
      parent.normalize()
    })
  }

  // Highlight all occurrences of a keyword on the current page
  const highlightText = (keyword) => {
    clearHighlights()
    if (!keyword.trim()) return

    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')

    // Walk all text nodes in main content (exclude header/footer)
    const main = document.querySelector('main') || document.body
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const parent = node.parentElement
        // Skip script, style, input, textarea, and already-marked nodes
        if (!parent) return NodeFilter.FILTER_REJECT
        const tag = parent.tagName.toLowerCase()
        if (['script', 'style', 'input', 'textarea', 'mark'].includes(tag)) return NodeFilter.FILTER_REJECT
        if (regex.test(node.nodeValue)) return NodeFilter.FILTER_ACCEPT
        return NodeFilter.FILTER_SKIP
      }
    })

    const nodesToReplace = []
    let node
    while ((node = walker.nextNode())) {
      nodesToReplace.push(node)
    }

    nodesToReplace.forEach((textNode) => {
      const parts = textNode.nodeValue.split(regex)
      if (parts.length <= 1) return
      const fragment = document.createDocumentFragment()
      parts.forEach((part) => {
        if (regex.test(part)) {
          const mark = document.createElement('mark')
          mark.setAttribute('data-search', 'true')
          mark.style.backgroundColor = '#FDE68A'
          mark.style.color = 'inherit'
          mark.style.webkitTextFillColor = 'currentColor'
          mark.style.borderRadius = '2px'
          mark.style.padding = '0 1px'
          mark.textContent = part
          fragment.appendChild(mark)
        } else {
          fragment.appendChild(document.createTextNode(part))
        }
        regex.lastIndex = 0
      })
      textNode.parentNode.replaceChild(fragment, textNode)
    })

    // Scroll to first match
    const firstMark = document.querySelector('mark[data-search]')
    if (firstMark) {
      firstMark.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const query = searchText.trim()
    if (query) {
      highlightText(query)
      setIsMenuOpen(false)
    } else {
      clearHighlights()
    }
  }

  const handleSearchChange = (e) => {
    setSearchText(e.target.value)
    if (!e.target.value.trim()) {
      clearHighlights()
    }
  }

  const t = (key) => {
    if (!translations) return key
    const lang = sessionInfo?.language || 'vi'
    return translations[lang]?.[key] || key
  }

  // Interview mode layout
  if (interviewMode && sessionInfo) {
    return (
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200 h-16 md:h-18 lg:h-20 flex items-center">
        <div className="header-container flex items-center justify-between px-6 md:px-8 lg:px-12 w-full">
          {/* Logo - not clickable in interview mode */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src="/logo.svg"
                alt="TrueMirror Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span
              className="text-2xl md:text-3xl lg:text-4xl font-bold whitespace-nowrap"
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

          {/* Desktop: Interview Info & Actions */}
          <div className="hidden min-[1200px]:flex flex-1 items-center justify-center ml-8">
            {/* Interview Info - Centered */}
            <div className="flex flex-col justify-center items-center text-center flex-1">
              <h1 className="text-2xl font-bold text-brand-navy whitespace-nowrap">
                {t('title')} {sessionInfo.position} - {sessionInfo.industry}
              </h1>
              <div className="flex items-center gap-2 text-base text-gray-600 mt-0.5">
                 <span>{t('style')} {sessionInfo.language === 'vi' ? sessionInfo.style : translations?.en?.styles?.[sessionInfo.style] || sessionInfo.style}</span>
                 <span>|</span>
                 <span>{t('language')} {sessionInfo.language === 'vi' ? t('vietnamese') : t('english')}</span>
                 <span>|</span>
                 <span className={`inline-flex items-center gap-1 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-600' : 'bg-red-600'}`}></span>
                  {isConnected ? t('connected') : t('disconnected')}
                </span>
              </div>
            </div>

            {/* Action Buttons - Right */}
            {readOnlyMode ? (
              <button
                onClick={onEndSession}
                className="btn-primary text-lg font-medium px-6 h-11 flex items-center justify-center transition-all whitespace-nowrap flex-shrink-0"
              >
                ← Quay lại lịch sử
              </button>
            ) : (
              <div className="flex gap-4 flex-shrink-0">
                <button
                  onClick={onEvaluate}
                  disabled={!isConnected || isEvaluating || hasEvaluated}
                  className="evaluate-btn text-lg font-medium px-6 h-11 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {t('evaluateInterview')}
                </button>
                <button
                  onClick={onEndSession}
                  disabled={!isConnected}
                  className="end-interview-btn text-lg font-medium px-6 h-11 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {t('endInterview')}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="min-[1200px]:hidden p-2 -mr-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
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

        {/* Mobile Menu for Interview Mode */}
        {isMenuOpen && (
          <div className="min-[1200px]:hidden fixed top-16 md:top-18 left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto border-t border-gray-100 shadow-xl">
            <div className="flex flex-col space-y-6 pt-6 px-4 pb-8 items-center">
              {/* Session Info in Menu */}
               <div className="text-center space-y-2">
                  <h1 className="text-xl font-bold text-brand-navy">
                    {t('title')} {sessionInfo.position}
                  </h1>
                  <p className="text-lg text-gray-700 font-medium">{sessionInfo.industry}</p>
                  <div className="flex flex-col gap-1 text-base text-gray-600">
                    <p>{t('style')} {sessionInfo.language === 'vi' ? sessionInfo.style : translations?.en?.styles?.[sessionInfo.style] || sessionInfo.style}</p>
                    <p>{t('language')} {sessionInfo.language === 'vi' ? t('vietnamese') : t('english')}</p>
                    <p className={`flex items-center justify-center gap-2 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                      <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-600' : 'bg-red-600'}`}></span>
                      {isConnected ? t('connected') : t('disconnected')}
                    </p>
                  </div>
               </div>

               <div className="w-full h-px bg-gray-100"></div>

              {/* Mobile Actions */}
              {readOnlyMode ? (
                <button
                  onClick={() => {
                      setIsMenuOpen(false)
                      onEndSession()
                  }}
                  className="btn-primary w-full max-w-[320px] text-base py-3 rounded-lg shadow-md"
                >
                  ← Quay lại lịch sử
                </button>
              ) : (
                <div className="flex flex-col gap-3 w-full items-center">
                  <button
                    onClick={() => {
                        setIsMenuOpen(false)
                        onEvaluate()
                    }}
                    disabled={!isConnected || isEvaluating || hasEvaluated}
                    className="evaluate-btn w-full max-w-[320px] text-base py-3 rounded-lg shadow-md disabled:opacity-50"
                  >
                    {t('evaluateInterview')}
                  </button>
                  <button
                    onClick={() => {
                        setIsMenuOpen(false)
                        onEndSession()
                    }}
                    disabled={!isConnected}
                    className="end-interview-btn w-full max-w-[320px] text-base py-3 rounded-lg shadow-md disabled:opacity-50"
                  >
                    {t('endInterview')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    )
  }

  // Standard header layout with symmetrical padding
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="header-container flex items-center justify-between px-6 md:px-8 lg:px-12 h-16 md:h-18 lg:h-20">
        {/* Logo - Always visible, left aligned */}
        <Link to="/" className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src="/logo.svg"
              alt="TrueMirror Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span
            className="text-2xl md:text-3xl lg:text-4xl font-bold whitespace-nowrap"
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

        {/* Desktop Navigation - Centered */}
        <nav className="hidden min-[1200px]:flex items-center gap-6 min-[1200px]:gap-8 flex-1 justify-center">
          <Link
            to="/about"
            className={`text-lg xl:text-xl font-medium transition whitespace-nowrap ${
              isActive('/about') ? 'text-brand-blue font-bold border-b-2 border-brand-blue' : 'text-gray-700 hover:text-brand-blue'
            }`}
          >
            Về TrueMirror
          </Link>
          <Link
            to="/services"
            className={`text-lg lg:text-xl font-medium transition whitespace-nowrap ${
              isActive('/services') ? 'text-brand-blue font-bold border-b-2 border-brand-blue' : 'text-gray-700 hover:text-brand-blue'
            }`}
          >
            Dịch vụ
          </Link>
          <Link
            to="/news"
            className={`text-lg lg:text-xl font-medium transition whitespace-nowrap ${
              isActive('/news') ? 'text-brand-blue font-bold border-b-2 border-brand-blue' : 'text-gray-700 hover:text-brand-blue'
            }`}
          >
            Thông tin
          </Link>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`text-lg xl:text-xl font-medium transition whitespace-nowrap ${
                isActive('/dashboard') ? 'text-brand-blue font-bold border-b-2 border-brand-blue' : 'text-gray-700 hover:text-brand-blue'
              }`}
            >
              Phỏng vấn
            </Link>
          )}
        </nav>

        {/* Desktop Actions - Right aligned */}
        <div className="hidden min-[1200px]:flex items-center gap-3 min-[1200px]:gap-4 flex-shrink-0">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="search-bar-container">
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm..."
              value={searchText}
              onChange={handleSearchChange}
            />
            <button type="submit" className="search-btn">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* Auth Buttons */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="btn-secondary text-lg font-medium px-6 h-11 flex items-center justify-center transition-all hover:bg-gray-100 whitespace-nowrap"
            >
              Đăng xuất
            </button>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-secondary text-lg font-medium px-6 h-11 flex items-center justify-center transition-all hover:bg-gray-100 whitespace-nowrap">
                  Đăng nhập
                </button>
              </Link>
              <Link to="/register">
                <button className="btn-primary text-lg font-medium px-6 h-11 flex items-center justify-center transition-all whitespace-nowrap">
                  Đăng ký
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="min-[1200px]:hidden p-2 -mr-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="min-[1200px]:hidden fixed top-16 md:top-18 left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto border-t border-gray-100 shadow-xl">
          <div className="flex flex-col px-4 py-6 space-y-4">
            {/* Navigation Links */}
            <Link
              to="/about"
              className={`font-medium text-xl py-3 border-b border-gray-50 text-center ${
                isActive('/about') ? 'text-brand-blue font-bold' : 'text-gray-700 hover:text-brand-blue'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Về TrueMirror
            </Link>
            <Link
              to="/services"
              className={`font-medium text-xl py-3 border-b border-gray-50 text-center ${
                isActive('/services') ? 'text-brand-blue font-bold' : 'text-gray-700 hover:text-brand-blue'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dịch vụ
            </Link>
            <Link
              to="/news"
              className={`font-medium text-xl py-3 border-b border-gray-50 text-center ${
                isActive('/news') ? 'text-brand-blue font-bold' : 'text-gray-700 hover:text-brand-blue'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Thông tin
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`font-medium text-xl py-3 border-b border-gray-50 text-center ${
                  isActive('/dashboard') ? 'text-brand-blue font-bold' : 'text-gray-700 hover:text-brand-blue'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Phỏng vấn
              </Link>
            )}
            
            {/* Search Bar */}
            <div className="pt-2 flex justify-center">
              <form onSubmit={handleSearch} className="search-bar-container w-full max-w-[320px]">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Tìm kiếm..."
                  value={searchText}
                  onChange={handleSearchChange}
                />
                <button type="submit" className="search-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
            
            {/* Auth Buttons */}
            <div className="pt-4 flex flex-col gap-3 items-center">
              {isAuthenticated ? (
                <button 
                  onClick={handleLogout} 
                  className="btn-secondary w-full max-w-[320px] text-lg py-3 rounded-lg"
                >
                  Đăng xuất
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full flex justify-center">
                    <button className="btn-secondary w-full max-w-[320px] text-lg py-3 rounded-lg">Đăng nhập</button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full flex justify-center">
                    <button className="btn-primary w-full max-w-[320px] text-lg py-3 rounded-lg shadow-md">Đăng ký</button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header