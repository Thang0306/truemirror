import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api'
import MessageList from '../components/MessageList'
import Header from '../components/Header'

const InterviewDetail = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()

  const [sessionInfo, setSessionInfo] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load session detail on mount
  useEffect(() => {
    loadSessionDetail()
  }, [sessionId])

  const loadSessionDetail = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/interview/history/${sessionId}`)
      const session = response.data.session
      
      setSessionInfo(session)
      
      // Filter out system messages for display
      const displayMessages = (session.conversation || []).filter(
        msg => msg.role !== 'system'
      )
      setMessages(displayMessages)
      
      setError('')
    } catch (error) {
      console.error('[ERROR] Load session detail failed:', error)
      setError('Không thể tải chi tiết phỏng vấn')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/interview-history')
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 md:w-24 md:h-24 mb-4">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-brand-blue rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl md:text-3xl">🤖</span>
            </div>
          </div>
          <p className="text-gray-600 font-medium text-lg">Đang tải chi tiết...</p>
        </div>
      </div>
    )
  }

  if (error || !sessionInfo) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Không tìm thấy phiên phỏng vấn'}</p>
          <button onClick={handleBack} className="btn-primary">
            ← Quay lại
          </button>
        </div>
      </div>
    )
  }

  // Create a mock translations object for Header (read-only mode)
  const translations = {
    vi: {
      title: 'Phỏng vấn',
      style: 'Phong cách:',
      language: 'Ngôn ngữ:',
      connected: 'Đã kết nối',
      disconnected: 'Mất kết nối',
      vietnamese: 'Tiếng Việt',
      english: 'English',
      styles: {
        'Nghiêm túc': 'Nghiêm túc',
        'Thân thiện': 'Thân thiện',
        'Khó tính': 'Khó tính'
      }
    },
    en: {
      title: 'Interview',
      style: 'Style:',
      language: 'Language:',
      connected: 'Connected',
      disconnected: 'Disconnected',
      vietnamese: 'Vietnamese',
      english: 'English',
      styles: {
        'Nghiêm túc': 'Serious',
        'Thân thiện': 'Friendly',
        'Khó tính': 'Demanding'
      }
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with session info - read-only mode */}
      <Header
        interviewMode={true}
        sessionInfo={sessionInfo}
        isConnected={false}
        translations={translations}
        readOnlyMode={true}
        onEndSession={handleBack}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6" style={{maxWidth: '1000px'}}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <MessageList messages={messages} language={sessionInfo?.language} />
        </div>
      </div>
    </div>
  )
}

export default InterviewDetail
