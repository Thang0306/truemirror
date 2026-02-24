import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import InterviewSetup from './pages/InterviewSetup'
import InterviewRoom from './pages/InterviewRoom'
import InterviewHistory from './pages/InterviewHistory'
import InterviewDetail from './pages/InterviewDetail'

function AppContent() {
  const location = useLocation()
  // Hide default header for interview room and interview detail (both render their own header)
  const showDefaultHeader = !location.pathname.match(/^\/interview\/\d+$/) && !location.pathname.match(/^\/interview-history\/\d+$/)
  // Hide footer for interview room and interview detail, show white spacer instead
  const showFooter = !location.pathname.match(/^\/interview\/\d+$/) && !location.pathname.match(/^\/interview-history\/\d+$/)

  return (
    <div className="flex flex-col min-h-screen">
      {showDefaultHeader && <Header />}
      <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/post/:id" element={<NewsDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/interview/setup"
                element={
                  <ProtectedRoute>
                    <InterviewSetup />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/:sessionId"
                element={
                  <ProtectedRoute>
                    <InterviewRoom />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview-history"
                element={
                  <ProtectedRoute>
                    <InterviewHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview-history/:sessionId"
                element={
                  <ProtectedRoute>
                    <InterviewDetail />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          {showFooter ? <Footer /> : <div className="bg-white" style={{ height: '160px' }}></div>}
        </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App