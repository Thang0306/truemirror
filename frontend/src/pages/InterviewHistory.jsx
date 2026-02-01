import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api'
import ReactMarkdown from 'react-markdown'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/vi'
import './InterviewHistory.css'

// Extend dayjs with UTC and timezone plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('vi')

const InterviewHistory = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [history, setHistory] = useState([])
  const [assessment, setAssessment] = useState('')
  const [loading, setLoading] = useState(true)
  const [generatingAssessment, setGeneratingAssessment] = useState(false)
  const [error, setError] = useState('')

  // Load interview history and assessment on mount
  useEffect(() => {
    loadHistory()
    loadAssessment()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/interview/history')
      setHistory(response.data.history || [])
      setError('')
    } catch (error) {
      console.error('[ERROR] Load history failed:', error)
      setError('Không thể tải lịch sử phỏng vấn')
    } finally {
      setLoading(false)
    }
  }

  const loadAssessment = async () => {
    try {
      const response = await api.get('/api/interview/history/assessment')
      if (response.data.assessment) {
        setAssessment(response.data.assessment.assessment_content)
      }
    } catch (error) {
      console.error('[ERROR] Load assessment failed:', error)
      // Don't show error for missing assessment
    }
  }

  const handleGenerateAssessment = async () => {
    try {
      setGeneratingAssessment(true)
      setError('')
      const response = await api.post('/api/interview/history/generate-assessment')

      // Update with new assessment content
      if (response.data.assessment) {
        setAssessment(response.data.assessment.assessment_content)
      }
    } catch (error) {
      console.error('[ERROR] Generate assessment failed:', error)
      setError('Không thể tạo đánh giá tổng hợp')
    } finally {
      setGeneratingAssessment(false)
    }
  }

  const handleSessionClick = (sessionId) => {
    navigate(`/interview-history/${sessionId}`)
  }

  const formatDate = (dateString) => {
    // Force interpret as UTC and convert to Vietnam timezone (UTC+7)
    return dayjs.utc(dateString)
      .tz('Asia/Ho_Chi_Minh')
      .format('DD MMMM YYYY, HH:mm')
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { text: 'Chờ bắt đầu', color: 'bg-yellow-100 text-yellow-800' },
      'in_progress': { text: 'Đang diễn ra', color: 'bg-blue-100 text-blue-800' },
      'completed': { text: 'Hoàn thành', color: 'bg-green-100 text-green-800' }
    }
    const statusInfo = statusMap[status] || statusMap['pending']
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải lịch sử...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <section className="w-full max-w-6xl px-4 md:px-8 py-12 md:py-16">
        <div className="h-6"></div>

        <button
          onClick={() => navigate('/dashboard')}
          className="text-brand-blue hover:text-brand-navy font-medium mb-8 flex items-center gap-2 transition text-xl md:text-2xl"
        >
          ← Quay lại trang phỏng vấn
        </button>

        <div className="h-3"></div>

        {/* Overall Assessment Section */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200">
          <div className="flex flex-col items-center">
            <div className="h-3"></div>
            <h1 className="text-2xl md:text-4xl font-semibold text-brand-navy text-center">
              📊 Đánh Giá Tổng Hợp
            </h1>
            <div className="h-3"></div>
            <p className="text-base md:text-lg text-gray-700 text-center max-w-xl">
              Tổng hợp điểm mạnh, điểm yếu và lộ trình phát triển từ tất cả các buổi phỏng vấn của bạn
            </p>
            <div className="h-6"></div>

            <button
              onClick={handleGenerateAssessment}
              disabled={generatingAssessment || history.length === 0}
              className="btn-primary text-base md:text-lg px-8 py-3"
            >
              {generatingAssessment ? '⏳ Đang tạo đánh giá...' : '🔄 Cập nhật đánh giá'}
            </button>

            <div className="h-6"></div>

            {/* Assessment Display */}
            {assessment && (
              <div className="w-full max-w-4xl assessment-content">
                <ReactMarkdown>{assessment}</ReactMarkdown>
              </div>
            )}

            {!assessment && !generatingAssessment && history.length > 0 && (
              <p className="text-gray-500 text-center italic">
                Nhấn "Cập nhật đánh giá" để AI tổng hợp kết quả rồi phân tích từ tất cả các buổi phỏng vấn của bạn
              </p>
            )}

            {history.length === 0 && (
              <p className="text-gray-500 italic text-center">
                Bạn chưa có buổi phỏng vấn nào. Hãy bắt đầu luyện phỏng vấn để nhận đánh giá!
              </p>
            )}
            <div className="h-6"></div>
          </div>
        </div>

        <div className="h-6"></div>

        {/* Interview History List */}
        <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200">
          <div className="flex flex-col items-center">
            <div className="h-3"></div>
            <h2 className="text-2xl md:text-4xl font-semibold text-brand-navy text-center">
              📚 Lịch Sử Phỏng Vấn
            </h2>
            <div className="h-6"></div>

            {error && (
              <div className="w-full max-w-4xl mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                {error}
              </div>
            )}

            {history.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-6">Chưa có lịch sử phỏng vấn</p>
                <button
                  onClick={() => navigate('/interview/setup')}
                  className="btn-primary text-base md:text-lg px-8 py-3"
                >
                  Bắt đầu luyện phỏng vấn
                </button>
              </div>
            ) : (
              <div className="w-full max-w-4xl space-y-0">
                {history.map((session, index) => (
                  <React.Fragment key={session.id}>
                    <div className="session-card bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-brand-blue session-card-padding">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg md:text-xl font-semibold text-brand-navy">
                              Phỏng vấn {history.length - index}
                            </h3>
                            {getStatusBadge(session.status)}
                          </div>
                          <div className="h-3"></div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm md:text-base text-gray-700">
                            <div>
                              <span className="font-medium">📅 Ngày:</span> {formatDate(session.created_at)}
                            </div>
                            <div>
                              <span className="font-medium">🌐 Ngôn ngữ:</span> {session.language === 'vi' ? 'Tiếng Việt' : 'English'}
                            </div>
                            <div>
                              <span className="font-medium">🏢 Ngành:</span> {session.industry}
                            </div>
                            <div>
                              <span className="font-medium">🎭 Phong cách:</span> {session.style}
                            </div>
                            <div>
                              <span className="font-medium">💼 Vị trí:</span> {session.position}
                            </div>
                            <div>
                              <span className="font-medium">💬 Tin nhắn:</span> {session.conversation?.length || 0}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => handleSessionClick(session.id)}
                            className="text-brand-blue font-medium text-sm md:text-base hover:underline"
                          >
                            Xem chi tiết →
                          </button>
                        </div>
                      </div>
                    </div>
                    {index < history.length - 1 && <div className="h-3"></div>}
                  </React.Fragment>
                ))}
              </div>
            )}

            <div className="h-6"></div>

            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary text-base md:text-lg px-8 py-3"
            >
              ← Quay lại trang phỏng vấn
            </button>
            <div className="h-6"></div>
          </div>
        </div>
      
        {/* Tạo khoảng trắng giữa các section */}
        <div className="h-12 md:h-16 lg:h-10"></div>
      </section>
    </div>
  )
}

export default InterviewHistory
