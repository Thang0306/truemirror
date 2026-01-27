import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import './MessageList.css'

// Extend dayjs with UTC and timezone plugins
dayjs.extend(utc)
dayjs.extend(timezone)

function MessageList({ messages, language = 'vi' }) {
  // Format timestamp to Vietnam timezone (UTC+7)
  // Always interpret timestamp as UTC regardless of whether it has 'Z' suffix or not
  const formatTimestamp = (timestamp) => {
    return dayjs.utc(timestamp)       // force interpret as UTC
      .tz('Asia/Ho_Chi_Minh')         // convert to UTC+7 (Vietnam timezone)
      .format('HH:mm')                // format as HH:mm
  }

  const welcomeTranslations = {
    vi: {
      title: 'Luyện tập phỏng vấn với TrueMirror',
      card1Title: 'Thực hành Chân thực',
      card1Desc: 'Trải nghiệm các tình huống phỏng vấn thực tế',
      card2Title: 'AI Interviewer',
      card2Desc: 'Nhận câu hỏi và phản hồi thông minh',
      card3Title: 'Theo dõi Tiến độ',
      card3Desc: 'Cải thiện với đánh giá chi tiết',
      hint: 'AI Interviewer sẽ chào bạn trong giây lát!'
    },
    en: {
      title: 'TrueMirror Interview Practice',
      card1Title: 'Realistic Practice',
      card1Desc: 'Experience authentic interview scenarios',
      card2Title: 'AI Interviewer',
      card2Desc: 'Get intelligent questions and feedback',
      card3Title: 'Track Progress',
      card3Desc: 'Improve with detailed evaluations',
      hint: 'Your AI Interviewer will greet you shortly!'
    }
  }

  const w = welcomeTranslations[language] || welcomeTranslations.vi

  return (
    <div className="message-list-interview">
      {messages.length === 0 && (
        <div className="welcome-message">
          <h2>{w.title}</h2>
          <div className="welcome-grid">
            <div className="welcome-card">
              <div className="welcome-icon">🎯</div>
              <h3>{w.card1Title}</h3>
              <p>{w.card1Desc}</p>
            </div>
            <div className="welcome-card">
              <div className="welcome-icon">🤖</div>
              <h3>{w.card2Title}</h3>
              <p>{w.card2Desc}</p>
            </div>
            <div className="welcome-card">
              <div className="welcome-icon">📈</div>
              <h3>{w.card3Title}</h3>
              <p>{w.card3Desc}</p>
            </div>
          </div>
          <p className="welcome-hint">{w.hint}</p>
        </div>
      )}
      {messages.map((msg, idx) => (
        <div key={idx} className={`msg-bubble ${msg.role} ${msg.type === 'error' ? 'error-message' : ''}`}>
          <span className="msg-avatar">{msg.role === 'user' ? '👤' : '🤖'}</span>
          <div className="msg-content">
            <span className="msg-username">
              {msg.role === 'user' ? 'You' : 'AI Interviewer'}
              <span className="msg-time">{formatTimestamp(msg.timestamp)}</span>
            </span>
            <div className="msg-text">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            </div>
            {msg.type === 'error' && msg.onRetry && (
              <button className="retry-button" onClick={msg.onRetry}>
                Retry
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MessageList
