import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ImageUploader from '../components/ImageUploader'
import { Editor } from '@tinymce/tinymce-react'
import api from '../utils/api'
import './News.css'

const News = () => {
  const [showAddPopup, setShowAddPopup] = useState(false)
  const [newNewsForm, setNewNewsForm] = useState({ title: '', content: '' })
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [filesError, setFilesError] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const isAdmin = user?.email?.toLowerCase() === 'admintruemirror@gmail.com'

  // Mock data for news
  const defaultNewsItems = [
    {
      id: 1,
      title: 'TrueMirror đạt hơn 500 người dùng chỉ sau hơn 2 tuần ra mắt',
      date: '15 tháng 1 2026',
      category: 'Cập nhật',
      image: '/post-1.webp',
      excerpt: 'Chỉ sau hơn hai tuần chính thức ra mắt, nền tảng luyện phỏng vấn thông minh TRUEMIRROR đã ghi nhận cột mốc hơn 500 người dùng.',
    },
    {
      id: 2,
      title: 'TrueMirror ghi nhận hơn 200 phản hồi người dùng và liên tục cải tiến nội dung',
      date: '8 tháng 1 2026',
      category: 'Thành tựu',
      image: '/post-2.webp',
      excerpt: 'Trong quá trình vận hành và phát triển nền tảng, TRUEMIRROR đã tiếp nhận hơn 200 phản hồi từ người dùng.',
    },
    {
      id: 3,
      title: 'TrueMirror bổ sung hơn 500 câu hỏi phỏng vấn mới, mở rộng nhiều ngành nghề và vị trí',
      date: '5 tháng 1 2026',
      category: 'Nội dung',
      image: '/post-3.webp',
      excerpt: 'Mở rộng kho nội dung với hơn 500 câu hỏi phỏng vấn mới, nhằm giúp người dùng tiếp cận đầy đủ hơn với các tình huống tuyển dụng.',
    },
    {
      id: 4,
      title: 'TrueMirror nâng độ chính xác AI lên 95%: Khi luyện phỏng vấn không còn là "cảm giác"',
      date: '28 tháng 12 2025',
      category: 'Công nghệ',
      image: '/post-4.webp',
      excerpt: 'TRUEMIRROR công bố phiên bản nâng cấp mới cho hệ thống trí tuệ nhân tạo, đưa độ chính xác lên mức 95%.',
    },
    {
      id: 5,
      title: 'TrueMirror mở rộng kho câu hỏi phỏng vấn tiếng Anh, bắt nhịp xu hướng nhân sự toàn cầu',
      date: '20 tháng 12 2025',
      category: 'Đối tác',
      image: '/post-5.webp',
      excerpt: 'TRUEMIRROR đã cập nhật và mở rộng kho câu hỏi phỏng vấn tiếng Anh, hướng đến môi trường làm việc đa quốc gia.',
    },
    {
      id: 6,
      title: 'TrueMirror phiên bản mới tối ưu tốc độ và độ ổn định nền tảng, nâng cao trải nghiệm luyện phỏng vấn',
      date: '15 tháng 12 2025',
      category: 'Giải thưởng',
      image: '/post-6.webp',
      excerpt: 'TRUEMIRROR tiến hành nâng cấp hạ tầng kỹ thuật, tối ưu hiệu suất và đảm bảo quá trình luyện phỏng vấn mượt mà hơn.',
    },
  ]

  const getCustomNews = () => JSON.parse(localStorage.getItem('customNews') || '[]')
  const getDeletedIds = () => JSON.parse(localStorage.getItem('deletedNewsIds') || '[]')

  const [newsItems, setNewsItems] = useState([])
  const [journeyItems, setJourneyItems] = useState([])
  const [addType, setAddType] = useState('news') // 'news', 'journey'
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load news from localStorage
  useEffect(() => {
    const deletedIds = getDeletedIds()
    const activeDefaults = defaultNewsItems.filter(item => !deletedIds.includes(item.id))
    const customItems = getCustomNews().filter(item => !deletedIds.includes(item.id))
    setNewsItems([...customItems, ...activeDefaults])
  }, [])

  // Load journey posts from API
  useEffect(() => {
    loadJourneyPosts()
  }, [])

  const loadJourneyPosts = async () => {
    try {
      const response = await api.get('/api/posts')
      if (response.data.success) {
        setJourneyItems(response.data.posts)
      }
    } catch (err) {
      console.error('Failed to load posts:', err)
    }
  }

  const handleDelete = (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Bạn có chắc muốn xóa tin tức này?')) return
    
    const deletedIds = getDeletedIds()
    deletedIds.push(id)
    localStorage.setItem('deletedNewsIds', JSON.stringify(deletedIds))
    
    setNewsItems(prev => prev.filter(item => item.id !== id))
  }

  const handleJourneyDelete = async (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Bạn có chắc muốn xóa bài viết này?')) return
    
    try {
      await api.delete(`/api/posts/${id}`)
      setJourneyItems(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      console.error('Failed to delete post:', err)
      alert('Không thể xóa bài viết. Vui lòng thử lại.')
    }
  }

  // Upload image via backend → Cloudinary (signed, no upload_preset needed)
  const uploadToCloudinary = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/api/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (!response.data.success) throw new Error(response.data.error || 'Upload failed')
    return response.data.url
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    
    // File validation
    if (uploadedFiles.length === 0) {
      setFilesError('Vui lòng upload ít nhất 1 ảnh chủ đề')
      return
    }

    setIsSubmitting(true)

    try {
      // Tính toán ngày hiện tại chuẩn giờ VN (UTC+7)
      const now = new Date()
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000)
      const vnTime = new Date(utcTime + (3600000 * 7))
      const formattedDate = `${vnTime.getDate()} tháng ${vnTime.getMonth() + 1} ${vnTime.getFullYear()}`

      if (addType === 'news') {
        // News: keep localStorage approach
        const fileUrl = URL.createObjectURL(uploadedFiles[0])
        const newId = Date.now()
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = newNewsForm.content
        const plainTextContent = tempDiv.textContent || tempDiv.innerText || ''

        const customArticle = {
          id: newId,
          title: newNewsForm.title,
          date: formattedDate,
          content: newNewsForm.content,
          image: fileUrl,
          category: 'Cập nhật',
          excerpt: plainTextContent.substring(0, 150) + (plainTextContent.length > 150 ? '...' : ''),
          isHtml: true
        }

        const customItems = getCustomNews()
        customItems.unshift(customArticle)
        localStorage.setItem('customNews', JSON.stringify(customItems))
        setNewsItems(prev => [customArticle, ...prev])
      } else {
        // Journey: upload to Cloudinary + save via API
        const imageUrl = await uploadToCloudinary(uploadedFiles[0])

        const response = await api.post('/api/posts', {
          title: newNewsForm.title,
          content: newNewsForm.content,
          image_url: imageUrl,
          date_display: formattedDate
        })

        if (response.data.success) {
          setJourneyItems(prev => [response.data.post, ...prev])
        }
      }

      setShowAddPopup(false)
      setNewNewsForm({ title: '', content: '' })
      setUploadedFiles([])
      setFilesError('')
    } catch (err) {
      console.error('Submit failed:', err)
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Mock data for success stories
  const successStories = [
    {
      name: 'Nguyễn Minh Anh',
      position: 'Software Engineer',
      avatar: '👨‍💻',
      story: 'Sau 2 tuần luyện tập với TrueMirror, mình đã tự tin hơn rất nhiều và vượt qua vòng phỏng vấn khó nhằn. Feedback từ AI giúp mình nhận ra nhiều điểm cần cải thiện, từ cách trình bày ý tưởng, ngôn ngữ cơ thể cho đến kỹ năng giao tiếp.',
      rating: 5,
    },
    {
      name: 'Trần Thị Hương',
      position: 'Marketing Manager',
      avatar: '👩‍💼',
      story: 'TrueMirror là công cụ tuyệt vời! Mình đã luyện tập hơn 30 phiên và cảm thấy phỏng vấn thật sự không còn đáng sợ. Từ một người hay run tay, nói ngọng khi trả lời câu hỏi, giờ mình có thể tự tin thể hiện bản thân trước mọi người. Cảm ơn TrueMirror đã giúp mình có công việc mơ ước!',
      rating: 5,
    },
    {
      name: 'Lê Văn Đức',
      position: 'Data Analyst',
      avatar: '👨‍🔬',
      story: 'Gói Premium rất đáng tiền! Lộ trình cá nhân hóa và feedback chuyên sâu giúp mình tiến bộ từng ngày. AI phân tích chi tiết từ ngữ điệu, cách dùng từ, đến thái độ và biểu cảm khuôn mặt. Mình đã từ người ngại giao tiếp, hay né tránh ánh mắt người đối diện, thành người tự tin trả lời mọi câu hỏi trong phỏng vấn.',
      rating: 5,
    },
  ]

  const handleFreeTrial = () => {
    if (user) {
      navigate('/dashboard')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/login')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleContact = () => {
    window.open('https://www.facebook.com/truemirror.luyenphongvanao/', '_blank')
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="w-full bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl py-16 md:py-24">
          <div 
            className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-16 shadow-xl border border-gray-100 text-center"
            style={{
              backgroundImage: 'url(/news-hero.webp)',
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              backgroundAttachment: 'fixed'
            }}
          >
            
            <div className="flex flex-col items-center justify-center space-y-8">
              <div className="h-6"></div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight">
                Tin tức & Thành tựu
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-brand-blue">
                Cập nhật mới nhất từ TrueMirror
              </p>
              
              <div className="max-w-6xl mx-auto text-gray-700 leading-relaxed text-base md:text-lg lg:text-xl hero-description-padding">
                <p>
                  Khám phá những cập nhật mới nhất về sản phẩm, thành tựu và câu chuyện thành công 
                  từ cộng đồng người dùng TrueMirror.
                </p>
              </div>
              <div className="h-6"></div>
            </div>

          </div>
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10"></div>

      {/* Journey Grid */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-20 md:py-24 lg:py-28">
          <div className="text-center mb-14 md:mb-18 lg:mb-24">
            <h2 className="section-title">Hành trình phỏng vấn toàn diện</h2>
            <p className="section-subtitle">
              Chia sẻ và học hỏi kinh nghiệm từ cộng đồng
            </p>
            {isAdmin && (
              <div className="flex flex-col items-center w-full">
                <button 
                  onClick={() => {
                    setAddType('journey')
                    setShowAddPopup(true)
                  }} 
                  className="btn-primary w-fit px-8 h-12 flex items-center justify-center gap-2 mx-auto rounded-xl text-base md:text-lg font-bold"
                >
                  <span className="text-xl">+</span> Thêm bài viết
                </button>
                <div className="h-6"></div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 auto-rows-fr">
            {journeyItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative"
                onClick={() => window.location.href = `/post/${item.id}`}
              >
                {isAdmin && (
                  <button
                    onClick={(e) => handleJourneyDelete(e, item.id)}
                    className="absolute top-3 right-3 bg-white bg-opacity-90 p-2 rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition shadow-md z-10"
                    title="Xóa bài viết"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
                {/* Fixed height image container - image displays fully */}
                <div className="w-full h-[270px] bg-gradient-to-br from-blue-50 to-white flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image_url || item.image || ''}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content with padding - expands as needed */}
                <div className="news-item-padding flex-grow flex flex-col">
                  <div className="h-1.5"></div>

                  <h3 className="text-lg md:text-xl font-bold text-brand-navy news-title-hover text-left">
                    {item.title}
                  </h3>

                  <div className="h-1.5"></div>

                  <p className="text-sm md:text-base text-gray-600 text-left pb-3">
                    {item.date_display || item.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10"></div>

      {/* News Grid */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-20 md:py-24 lg:py-28">
          <div className="text-center mb-14 md:mb-18 lg:mb-24">
            <h2 className="section-title">Tin tức nổi bật</h2>
            <p className="section-subtitle">
              Những thông tin và cập nhật mới nhất
            </p>
            {isAdmin && (
              <div className="flex flex-col items-center w-full">
                <button 
                  onClick={() => {
                    setAddType('news')
                    setShowAddPopup(true)
                  }} 
                  className="btn-primary w-fit px-8 h-12 flex items-center justify-center gap-2 mx-auto rounded-xl text-base md:text-lg font-bold"
                >
                  <span className="text-xl">+</span> Thêm tin tức
                </button>
                <div className="h-6"></div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 auto-rows-fr">
            {newsItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative"
                onClick={() => window.location.href = `/news/${item.id}`}
              >
                {isAdmin && (
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className="absolute top-3 right-3 bg-white bg-opacity-90 p-2 rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition shadow-md z-10"
                    title="Xóa tin tức"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
                {/* Fixed height image container - image displays fully */}
                <div className="w-full h-[270px] bg-gradient-to-br from-blue-50 to-white flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content with padding - expands as needed */}
                <div className="news-item-padding flex-grow flex flex-col">
                  <div className="h-1.5"></div>

                  {/* Title with hover effect */}
                  <h3 className="text-lg md:text-xl font-bold text-brand-navy news-title-hover text-left">
                    {item.title}
                  </h3>

                  <div className="h-1.5"></div>

                  {/* Date */}
                  <p className="text-sm md:text-base text-gray-600 text-left pb-3">
                    {item.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10"></div>

      {/* Success Stories */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-20 md:py-24 lg:py-28">
          <div className="text-center mb-14 md:mb-18 lg:mb-24">
            <h2 className="section-title">Câu chuyện thành công</h2>
            <p className="section-subtitle">
              Những chia sẻ chân thật từ người dùng TrueMirror
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            {successStories.map((story, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-50 to-white p-10 md:p-12 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col text-center min-h-96"
              >
                <div className="avatar-circle">
                  <span className="text-3xl md:text-4xl">{story.avatar}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-brand-navy mb-2">
                  {story.name}
                </h3>
                <p className="text-sm md:text-base text-brand-blue font-semibold mb-4">
                  {story.position}
                </p>
                <div className="h-3"></div>

                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(story.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-xl">⭐</span>
                  ))}
                </div>
                <div className="h-1"></div>

                <p className="text-base md:text-lg text-gray-700 leading-relaxed italic news-story-padding">
                  "{story.story}"
                </p>
                <div className="h-3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10"></div>

      {/* CTA */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl py-20 md:py-24 lg:py-28">
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-xl p-10 md:p-14 lg:p-16 border border-gray-100">
            <div className="h-3"></div>
            <div className="text-center space-y-8 md:space-y-10">
              <h2 className="section-title">
                Bạn cũng muốn có câu chuyện thành công?
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-700 font-medium">
                Hãy bắt đầu luyện tập với TrueMirror ngay hôm nay!
              </p>
              <div className="h-6"></div>
              <div className="flex justify-center gap-6">
                <button className="btn-primary text-sm md:text-base px-6 py-3" onClick={handleFreeTrial}>
                  Dùng thử miễn phí
                </button>
                <button className="btn-secondary text-sm md:text-base px-6 py-3" onClick={handleContact}>
                  Kết nối với chúng tôi
                </button>
              </div>
              <div className="h-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing */}
      <div className="h-12 md:h-16 lg:h-10"></div>

      {/* Add News Popup */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-8">
          <div className="bg-white rounded-3xl p-6 md:p-10 w-full max-w-6xl shadow-2xl border border-gray-100 flex flex-col items-center max-h-[90vh] overflow-y-auto">
            <div className="h-6 w-full shrink-0 inline-block min-h-[1.5rem]"></div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand-blue text-center w-full px-4">
              {addType === 'news' ? 'Thêm tin tức' : 'Thêm bài viết'}
            </h2>
            <div className="h-6"></div>
            
            <form onSubmit={handleAddSubmit} className="w-full flex flex-col items-center">
              <div className="w-full max-w-2xl">
                <label className="block text-lg font-semibold text-brand-navy mb-3 text-center">
                  Tiêu đề
                </label>
                <textarea
                  required
                  value={newNewsForm.title}
                  onChange={e => setNewNewsForm({...newNewsForm, title: e.target.value})}
                  className="w-full bg-white border-2 border-gray-300 rounded-xl text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all resize-none"
                  style={{
                    padding: '18px 28px',
                    height: '108px',
                    lineHeight: '1.6'
                  }}
                  placeholder={addType === 'news' ? "Nhập tiêu đề tin tức" : "Nhập tiêu đề bài viết"}
                />
              </div>
              <div className="h-3 w-full shrink-0"></div>
              
              <div className="w-full max-w-2xl flex flex-col items-center relative z-0">
                <ImageUploader
                  file={uploadedFiles.length > 0 ? uploadedFiles[0] : null}
                  onChange={(file) => {
                    setUploadedFiles(file ? [file] : [])
                    if(file) setFilesError('')
                  }}
                  maxSizeMB={5}
                />
                {filesError && (
                  <p className="mt-2 text-red-600 text-sm md:text-base text-center">{filesError}</p>
                )}
              </div>
              <div className="h-3 w-full shrink-0"></div>

              <div className="w-full max-w-5xl relative z-10 px-0 md:px-8">
                <label className="block text-lg font-semibold text-brand-navy mb-3 text-center">
                  Nội dung
                </label>
                <div className="bg-white rounded-lg w-full">
                  {/* Using TinyMCE instead of Quill */}
                  <Editor
                    tinymceScriptSrc="/tinymce/tinymce.min.js"
                    licenseKey="gpl"
                    value={newNewsForm.content}
                    onEditorChange={(content, editor) => {
                      setNewNewsForm({...newNewsForm, content})
                    }}
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                      toolbar_mode: 'wrap',
                      // Keep URLs exactly as typed — prevent TinyMCE from converting absolute URLs to relative
                      relative_urls: false,
                      remove_script_host: false,
                      convert_urls: false,
                      automatic_uploads: true,
                      file_picker_types: 'image',
                      images_upload_handler: async (blobInfo, progress) => {
                        const formData = new FormData()
                        formData.append('file', blobInfo.blob(), blobInfo.filename())
                        const response = await api.post('/api/upload/', formData, {
                          headers: { 'Content-Type': 'multipart/form-data' },
                          onUploadProgress: (e) => {
                            if (e.total) progress(Math.round((e.loaded / e.total) * 100))
                          }
                        })
                        if (!response.data.success) throw new Error(response.data.error || 'Upload failed')
                        return response.data.url
                      },
                      image_title: true,
                      image_caption: true,
                      image_class_list: [
                        { title: 'Canh giữa', value: 'img-center' },
                        { title: 'Toàn chiều rộng', value: 'img-responsive' },
                      ],
                      content_style: `
                        body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:16px; min-height: 400px; padding-bottom: 50px; }
                        img { max-width: min(100%, 800px) !important; height: auto !important; }
                        .img-center { display: block; margin-left: auto; margin-right: auto; }
                      `,
                      setup: function (editor) {
                        editor.on('change', function () {
                          editor.save();
                        });
                      }
                    }}
                  />
                </div>
              </div>
              <div className="h-6"></div>
              
              <div className="w-full flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddPopup(false)}
                  className="w-full max-w-[12rem] h-12 btn-secondary text-base md:text-lg px-6 rounded-xl font-bold flex items-center justify-center transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="w-full max-w-[12rem] h-12 btn-primary text-base md:text-lg px-6 rounded-xl font-bold flex items-center justify-center transition"
                >
                  {addType === 'news' ? 'Đăng tin' : 'Thêm bài viết'}
                </button>
              </div>
              <div className="h-6"></div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default News