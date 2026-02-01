import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { newsData } from '../data/newsData'
import api from '../utils/api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/vi'
import './NewsDetail.css'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('vi')

const NewsDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const article = newsData[id]

  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const textareaRef = useRef(null)

  // Auto-resize textarea function
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  // Adjust height on mount
  useLayoutEffect(adjustTextareaHeight, [])

  // Handle textarea input change
  const handleTextareaChange = (e) => {
    setNewComment(e.target.value)
    adjustTextareaHeight()
  }

  useEffect(() => {
    if (article) {
      loadComments()
    }
  }, [id])

  const loadComments = async () => {
    try {
      const response = await api.get(`/api/news/${id}/comments`)
      setComments(response.data.comments || [])
    } catch (err) {
      console.error('Load comments error:', err)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)
    setError('')

    try {
      await api.post(`/api/news/${id}/comments`, {
        content: newComment
      })
      setNewComment('')

      // Reset textarea height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'inherit'
      }

      loadComments()
    } catch (err) {
      setError('Không thể gửi bình luận. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return

    try {
      await api.delete(`/api/news/${id}/comments/${commentId}`)
      loadComments()
    } catch (err) {
      setError('Không thể xóa bình luận. Vui lòng thử lại.')
    }
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-brand-navy mb-4">Không tìm thấy bài viết</h1>
          <button
            onClick={() => navigate('/news')}
            className="btn-primary text-base px-6 py-3"
          >
            Quay lại trang tin tức
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Article Section */}
      <section className="w-full bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl py-16 md:py-24">

          <div className="h-3"></div>

          <button
            onClick={() => navigate('/news')}
            className="text-brand-blue hover:text-brand-navy font-medium mb-8 flex items-center gap-2 transition text-xl md:text-2xl"
          >
            ← Quay lại trang tin tức
          </button>

          <div className="h-3"></div>

          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">

            <div className="h-3"></div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight text-center news-detail-content-padding">
              {article.title}
            </h1>

            <div className="h-6"></div>

            {/* Date */}
            <p className="text-base md:text-lg text-gray-600 text-center">
              📅 {article.date}
            </p>

            <div className="h-6"></div>

            {/* Cover Image */}
            <div className="news-detail-image-container bg-gradient-to-br from-blue-50 to-white rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="h-6"></div>

            {/* Content */}
            <div className="news-detail-content-padding">
              {article.content.split('\n\n').map((paragraph, index) => (
                <div key={index}>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed text-left">
                    {paragraph}
                  </p>
                  <div className="h-6"></div>
                </div>
              ))}
            </div>

            <div className="h-3"></div>
          </div>

          <div className="h-12 md:h-16 lg:h-10"></div>

          {/* Comments Section */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200">
            <div className="flex flex-col items-center">
              <div className="h-3"></div>

              <h2 className="text-2xl md:text-4xl font-semibold text-brand-navy text-center">
                💬 Bình luận ({comments.length})
              </h2>

              <div className="h-6"></div>

              {/* Comment Form - Moved below list, styled like InterviewRoom input */}
              {user ? (
                <div className="w-full max-w-4xl news-comments-padding">
                  <div className="comment-input-bar-container">
                    <form className="comment-input-bar-form" onSubmit={(e) => { e.preventDefault(); handleSubmitComment(e); }}>
                      <textarea
                        ref={textareaRef}
                        value={newComment}
                        onChange={handleTextareaChange}
                        placeholder="Viết bình luận của bạn..."
                        disabled={loading}
                        rows={1}
                        style={{
                          resize: 'none',
                          overflow: 'auto',
                          minHeight: '54px',
                          maxHeight: 'calc(54px + 1.6em * 7)'
                        }}
                      />
                      <button
                        type="submit"
                        disabled={loading || !newComment.trim()}
                        className="comment-send-btn"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </form>
                  </div>
                  {error && (
                    <div className="mt-3">
                      <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full max-w-4xl news-comments-padding">
                  <div className="text-center">
                    <p className="text-gray-600 text-base md:text-lg">Vui lòng đăng nhập để bình luận</p>

                    <div className="h-3"></div>

                    <button
                      onClick={() => navigate('/login')}
                      className="btn-primary px-6 py-3"
                    >
                      Đăng nhập
                    </button>
                  </div>
                </div>
              )}

              <div className="h-6"></div>

              {/* Comments List - Moved above form */}
              {comments.length === 0 ? (
                <div className="w-full max-w-4xl news-comments-padding">
                  <p className="text-gray-500 text-center italic">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                </div>
              ) : (
                <div className="w-full max-w-4xl news-comments-padding space-y-0">
                  {comments.map((comment, index) => (
                    <React.Fragment key={comment.id}>
                      <div style={{backgroundColor: '#f5f6f7'}} className="rounded-3xl shadow-md border border-gray-200 comment-card-padding-reduced">
                        <div className="flex items-start gap-4 md:gap-6">
                          {/* Avatar - smaller gradient blue */}
                          <div className="flex-shrink-0">
                            <div className="comment-avatar-circle">
                              <span className="text-2xl md:text-3xl">👤</span>
                            </div>
                          </div>

                          {/* Comment Content */}
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-grow">
                                <p className="font-semibold text-brand-navy text-base md:text-lg">{comment.user_name}</p>
                                <p className="text-sm md:text-base text-gray-500">
                                  {dayjs.utc(comment.created_at).tz('Asia/Ho_Chi_Minh').fromNow()}
                                </p>
                              </div>
                              {user && user.id === comment.user_id && (
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
                                  title="Xóa bình luận"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              )}
                            </div>

                            <div className="h-3"></div>

                            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Spacing between comments */}
                      {index < comments.length - 1 && <div className="h-3"></div>}
                    </React.Fragment>
                  ))}
                </div>
              )}
              

              <div className="h-6"></div>

              <button
                onClick={() => navigate('/news')}
                className="btn-primary text-base md:text-lg px-8 py-3"
              >
                ← Quay lại trang tin tức
              </button>
              <div className="h-6"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10"></div>
    </div>
  )
}

export default NewsDetail
