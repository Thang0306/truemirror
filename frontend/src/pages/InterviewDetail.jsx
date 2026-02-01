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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải chi tiết...</p>
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
