import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { io } from 'socket.io-client'
import api from '../utils/api'
import MessageList from '../components/MessageList'
import Header from '../components/Header'
import './InterviewRoom.css'

const InterviewRoom = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()

  // Translations
  const translations = {
    vi: {
      title: 'Phỏng vấn',
      style: 'Phong cách:',
      language: 'Ngôn ngữ:',
      connected: 'Đã kết nối',
      disconnected: 'Mất kết nối',
      inputPlaceholder: 'Nhập câu trả lời của bạn...',
      aiTyping: 'AI đang trả lời...',
      send: 'Gửi',
      sending: 'Đang gửi...',
      endInterview: 'Kết thúc phỏng vấn',
      evaluateInterview: 'Tổng kết phỏng vấn',
      confirmEnd: 'Bạn có chắc muốn kết thúc và rời khỏi phiên phỏng vấn?',
      evaluating: '⏳ **Đang tổng kết buổi phỏng vấn...**\n\nVui lòng đợi trong giây lát, AI đang đánh giá và tổng hợp kết quả của bạn.',
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
      inputPlaceholder: 'Type your answer...',
      aiTyping: 'AI is typing...',
      send: 'Send',
      sending: 'Sending...',
      endInterview: 'End Interview',
      evaluateInterview: 'Evaluate Interview',
      confirmEnd: 'Are you sure you want to end and leave this interview session?',
      evaluating: '⏳ **Evaluating your interview...**\n\nPlease wait, AI is analyzing and summarizing your performance.',
      vietnamese: 'Vietnamese',
      english: 'English',
      styles: {
        'Nghiêm túc': 'Serious',
        'Thân thiện': 'Friendly',
        'Khó tính': 'Demanding'
      }
    }
  }

  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [hasEvaluated, setHasEvaluated] = useState(false)
  const [error, setError] = useState('')
  const [sessionInfo, setSessionInfo] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [showInterviewerVideo, setShowInterviewerVideo] = useState(false)

  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)
  const currentAIMessageRef = useRef('')  // Track current AI message being streamed
  const textareaRef = useRef(null)

  // Get translation text based on session language
  const t = (key) => {
    const lang = sessionInfo?.language || 'vi'
    return translations[lang]?.[key] || translations.vi[key]
  }

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
    setInputValue(e.target.value)
    adjustTextareaHeight()
  }

  // Scroll to bottom manually (not automatic)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Removed auto-scroll - user has full control over scrolling
  // useEffect(() => {
  //   if (!isLoading) {
  //     scrollToBottom()
  //   }
  // }, [messages, isLoading])

  // Initialize WebSocket connection
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

    // Create socket connection
    const socket = io(API_URL, {
      transports: ['websocket', 'polling'],
      auth: { token }
    })

    socketRef.current = socket

    // Connection handlers
    socket.on('connect', () => {
      console.log('[WebSocket] Connected')
      setIsConnected(true)
      // Join session room
      socket.emit('join_session', {
        session_id: parseInt(sessionId),
        token: token
      })
    })

    socket.on('disconnect', () => {
      console.log('[WebSocket] Disconnected')
      setIsConnected(false)
    })

    // Session joined
    socket.on('joined_session', (data) => {
      console.log('[WebSocket] Joined session:', data.session_id)

      // Load conversation history
      if (data.conversation_history && data.conversation_history.length > 0) {
        const formattedMessages = data.conversation_history
          .filter(msg => msg.role !== 'system')
          .map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp
          }))
        setMessages(formattedMessages)
      } else {
        // Delay 5s to let user see welcome cards before starting interview
        setTimeout(() => {
          socket.emit('send_message', {
            session_id: parseInt(sessionId),
            message: 'Xin chào!',
            token: token
          })
        }, 5000)
      }
    })

    // User message confirmed
    socket.on('user_message', (data) => {
      // Already added to UI, no need to add again
      console.log('[WebSocket] User message sent:', data)
    })

    // AI typing indicator
    socket.on('ai_typing', (data) => {
      if (data.typing) {
        setIsLoading(true)
        // Reset current AI message content when starting new message
        currentAIMessageRef.current = ''
      }
    })

    // AI streaming chunks
    socket.on('ai_chunk', (data) => {
      // Append chunk to ref
      currentAIMessageRef.current += data.chunk

      setMessages(prev => {
        const updated = [...prev]
        const lastMsg = updated[updated.length - 1]

        if (lastMsg && lastMsg.role === 'assistant') {
          // Update with full content from ref, not appending
          lastMsg.content = currentAIMessageRef.current
        } else {
          // Create new AI message if doesn't exist
          updated.push({
            role: 'assistant',
            content: currentAIMessageRef.current,
            timestamp: new Date().toISOString()
          })
        }

        return updated
      })
    })

    // AI message complete
    socket.on('ai_complete', (data) => {
      console.log('[WebSocket] AI message complete')
      setIsLoading(false)
      // Reset ref after completion
      currentAIMessageRef.current = ''

      // Update timestamp
      setMessages(prev => {
        const updated = [...prev]
        const lastMsg = updated[updated.length - 1]
        if (lastMsg && lastMsg.role === 'assistant') {
          lastMsg.timestamp = data.timestamp
        }
        return updated
      })
    })

    // Session ended - for end button (navigate away)
    socket.on('session_ended', (data) => {
      console.log('[WebSocket] Session ended')
      navigate('/dashboard')
    })

    // Session evaluated - for evaluate button (show results)
    socket.on('session_evaluated', (data) => {
      console.log('[WebSocket] Session evaluated')
      setIsEvaluating(false)
      setHasEvaluated(true)

      // Add evaluation message
      if (data.evaluation) {
        const evaluationContent = `## 📊 ĐÁNH GIÁ TỔNG KẾT\n\n${data.evaluation}\n\n---\n\n✅ **Cảm ơn bạn đã tham gia buổi phỏng vấn!**`

        // Log markdown to terminal for debugging
        console.log('[EVALUATION MARKDOWN]')
        console.log('='.repeat(80))
        console.log(evaluationContent)
        console.log('='.repeat(80))
        console.log('[RAW MARKDOWN - Copy this to check structure]')
        console.log(JSON.stringify(evaluationContent))

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: evaluationContent,
          timestamp: new Date().toISOString()
        }])
      }
    })

    // Error handling
    socket.on('error', (data) => {
      console.error('[WebSocket] Error:', data.message)
      setError(data.message)
      setIsLoading(false)
    })

    // Cleanup on unmount
    return () => {
      socket.disconnect()
    }
  }, [sessionId, token, navigate])

  // Load session info on mount
  useEffect(() => {
    const loadSessionInfo = async () => {
      try {
        const response = await api.get(`/api/interview/session/${sessionId}`)
        setSessionInfo(response.data.session)
        setShowInterviewerVideo(true)  // Show video immediately when session info is loaded
      } catch (error) {
        console.error('[ERROR] Load session info failed:', error)
        setError('Không thể tải thông tin phiên phỏng vấn')
      }
    }

    loadSessionInfo()
  }, [sessionId])

  // Handle send message via WebSocket
  const handleSendMessage = (messageText = null) => {
    const userMessage = messageText || inputValue.trim()

    if (!userMessage || isLoading || !socketRef.current) return

    setInputValue('')
    setError('')

    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit'
    }

    // Add user message to UI
    const userMessageObj = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessageObj])

    // Create placeholder for AI response
    const aiMessageObj = {
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, aiMessageObj])

    // Send via WebSocket
    socketRef.current.emit('send_message', {
      session_id: parseInt(sessionId),
      message: userMessage,
      token: token
    })
  }

  // Handle end session (exit to dashboard)
  const handleEndSession = () => {
    if (!confirm(t('confirmEnd'))) return

    if (!socketRef.current) {
      setError('Không có kết nối WebSocket')
      return
    }

    // Send end session event via WebSocket (will navigate away)
    socketRef.current.emit('end_session', {
      session_id: parseInt(sessionId),
      token: token
    })
  }

  // Handle evaluate interview (show evaluation)
  const handleEvaluate = () => {
    if (!socketRef.current) {
      setError('Không có kết nối WebSocket')
      return
    }

    // Show evaluation loading message
    setIsEvaluating(true)
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: t('evaluating'),
      timestamp: new Date().toISOString()
    }])

    // Send evaluate event via WebSocket
    socketRef.current.emit('evaluate_session', {
      session_id: parseInt(sessionId),
      token: token
    })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Use Header component with interview mode */}
      <Header
        interviewMode={true}
        sessionInfo={sessionInfo}
        isConnected={isConnected}
        translations={translations}
        onEvaluate={handleEvaluate}
        onEndSession={handleEndSession}
        isEvaluating={isEvaluating}
        hasEvaluated={hasEvaluated}
      />

      {/* Interviewer Video - Top Right Corner */}
      {showInterviewerVideo && sessionInfo && (
        <div 
          className="fixed z-40"
          style={{
            top: 'calc(5rem + 1rem)',  // Below header (h-20) + 1rem gap
            right: '1rem',
            width: '240px',
            height: '135px',  // 16:9 aspect ratio
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover rounded-lg"
            style={{
              border: '1px solid #3B82F6',  // Blue color matching evaluate button
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            <source 
              src={
                sessionInfo.style === 'Thân thiện' 
                  ? '/friendly-style.mp4' 
                  : sessionInfo.style === 'Nghiêm túc'
                  ? '/serious-style.mp4'
                  : '/picky-style.mp4'
              } 
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6" style={{maxWidth: '900px'}}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <MessageList messages={messages} language={sessionInfo?.language} />
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="input-bar-container">
        <form className="input-bar-form" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleTextareaChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={isLoading ? t('aiTyping') : t('inputPlaceholder')}
            disabled={isLoading || isEvaluating || hasEvaluated}
            autoFocus
            rows={1}
            style={{
              resize: 'none',
              overflow: 'hidden', // Hide scrollbar initially, let auto-resize handle height
              minHeight: '54px',
              maxHeight: 'calc(54px + 1.6em * 3)'
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim() || !isConnected || isEvaluating || hasEvaluated}
            className="send-btn"
          >
            {isLoading ? `⏳ ${t('sending')}` : `📤 ${t('send')}`}
          </button>
        </form>
      </div>
    </div>
  )
}

export default InterviewRoom
