import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api'
import FileUploader from '../components/FileUploader'
import './InterviewSetup.css'

const InterviewSetup = () => {
  const navigate = useNavigate()
  const { token } = useAuth()

  const [mode, setMode] = useState('standard') // 'standard' or 'personalized'
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [aiProcessing, setAiProcessing] = useState(false)
  const [processingStage, setProcessingStage] = useState('')

  const [formData, setFormData] = useState({
    position: '',
    industry: '',
    style: '',
    language: 'vi'
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  // Dropdown options
  const positions = [
    { value: 'Intern', label: 'Intern' },
    { value: 'Junior', label: 'Junior' },
    { value: 'Senior', label: 'Senior' },
    { value: 'Manager', label: 'Manager' }
  ]

  const industries = [
    { value: 'IT', label: 'IT' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Finance', label: 'Finance' },
    { value: 'HR', label: 'HR' }
  ]

  const styles = [
    { value: 'Nghiêm túc', label: 'Nghiêm túc' },
    { value: 'Thân thiện', label: 'Thân thiện' },
    { value: 'Khó tính', label: 'Khó tính' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    setServerError('')
  }

  const validateForm = () => {
    const newErrors = {}

    if (mode === 'standard') {
      // Standard mode: require position and industry
      if (!formData.position) newErrors.position = 'Vui lòng chọn vị trí'
      if (!formData.industry) newErrors.industry = 'Vui lòng chọn ngành nghề'
    } else {
      // Personalized mode: require file upload
      if (uploadedFiles.length === 0) {
        newErrors.files = 'Vui lòng upload ít nhất 1 file'
      }
    }

    // Both modes require style and language
    if (!formData.style) newErrors.style = 'Vui lòng chọn phong cách'
    if (!formData.language) newErrors.language = 'Vui lòng chọn ngôn ngữ'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setServerError('')

    try {
      let response

      if (mode === 'standard') {
        // Standard mode: POST JSON
        response = await api.post('/api/interview/setup', formData)
        console.log('[INFO] Interview session created:', response.data.session)
      } else {
        // Personalized mode: POST multipart/form-data
        setAiProcessing(true)
        setProcessingStage('Đang tải lên và phân tích files...')

        const formDataMultipart = new FormData()

        // Add files
        uploadedFiles.forEach(file => {
          formDataMultipart.append('files[]', file)
        })

        // Add form fields
        formDataMultipart.append('style', formData.style)
        formDataMultipart.append('language', formData.language)

        try {
          response = await api.post('/api/interview/setup/personalized', formDataMultipart, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })

          console.log('[INFO] Personalized interview session created:', response.data.session)
        } finally {
          setAiProcessing(false)
        }
      }

      // Navigate to interview room with session ID
      navigate(`/interview/${response.data.session.id}`)

    } catch (error) {
      setAiProcessing(false)
      if (error.response?.data?.error) {
        setServerError(error.response.data.error)
      } else {
        setServerError('Đã xảy ra lỗi. Vui lòng thử lại sau.')
      }
    } finally {
      setLoading(false)
    }
  }

  const [isMobile, setIsMobile] = useState(false)

  React.useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera
      
      // Check for mobile/tablet user agents
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      
      // Check for iPadOS 13+ (which reports as MacIntel but has touch points)
      const isIPad = navigator.maxTouchPoints > 1 && /MacIntel/.test(navigator.platform)
      
      // Check screen width
      const isSmallScreen = window.innerWidth < 1024

      setIsMobile(isMobileDevice || isIPad || isSmallScreen)
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  if (isMobile) {
    return (
      <div className="min-h-screen flex justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md py-16">
          <div className="h-6"></div>
          <div className="bg-white rounded-2xl p-8 w-full shadow-xl text-center border border-gray-100 flex flex-col items-center">
          <div className="h-6"></div>
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">💻</span>
          </div>
          <h2 className="text-2xl font-bold text-brand-navy mb-3 px-4">
            Trải nghiệm tốt nhất trên máy tính
          </h2>
          <div className="h-3"></div>
          <p className="text-gray-600 mb-8 leading-relaxed max-w-xs mx-auto">
            Ứng dụng phỏng vấn của TrueMirror hiện tại chỉ hỗ trợ trên máy tính để đảm bảo chất lượng video và âm thanh tốt nhất.
          </p>
          <div className="h-3"></div>
          <div className="w-full max-w-[16rem]">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary w-full py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Quay về bảng điều khiển
            </button>
          </div>
          <div className="h-6"></div>
        </div>
      </div>
    </div>
    )
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      <section className="w-full max-w-4xl px-6 md:px-8 py-16">
        <div className="h-6"></div>
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-16 shadow-xl border border-gray-100">
          <div className="text-center mb-10">
            <div className="h-6"></div>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-4">
              Thiết lập phỏng vấn
            </h1>
            <div className="h-3"></div>
            <p className="text-lg md:text-xl text-gray-700">
              Cấu hình phiên phỏng vấn của bạn để bắt đầu luyện tập
            </p>
          </div>

          <div className="h-3"></div>

          {/* Mode Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              type="button"
              onClick={() => {
                setMode('standard')
                setServerError('')
                setErrors({})
              }}
              className={mode === 'standard' ? 'btn-primary text-lg md:text-xl px-8 py-4' : 'btn-secondary text-lg md:text-xl px-8 py-4'}
            >
              📋 Phỏng vấn chuẩn
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('personalized')
                setServerError('')
                setErrors({})
              }}
              className={mode === 'personalized' ? 'btn-primary text-lg md:text-xl px-8 py-4' : 'btn-secondary text-lg md:text-xl px-8 py-4'}
            >
              🎯 Cá nhân hóa
            </button>
          </div>

          <div className="h-3"></div>

          {/* Mode Description */}
          <div className="flex justify-center mb-8">
            <div className="text-center max-w-2xl">
              {mode === 'standard' ? (
                <p className="text-sm md:text-base text-gray-600 italic">
                  Chọn vị trí và ngành nghề để luyện phỏng vấn với bộ câu hỏi chuẩn
                </p>
              ) : (
                <p className="text-sm md:text-base text-gray-600 italic">
                  Upload CV và Job Description để nhận câu hỏi phỏng vấn được cá nhân hóa bởi AI
                </p>
              )}
            </div>
          </div>

          {/* Server Error Message */}
          {serverError && (
            <div className="w-full flex justify-center mb-6">
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl max-w-md text-center">
                <p className="text-base md:text-lg">{serverError}</p>
              </div>
            </div>
          )}

          <div className="h-6"></div>

          <form onSubmit={handleSubmit} className="space-y-8 flex flex-col items-center">

            {/* Conditional Fields based on Mode */}
            {mode === 'standard' ? (
              <>
                {/* Position Dropdown */}
                <div className="w-full max-w-md">
              <label className="block text-lg font-semibold text-brand-navy mb-3 text-left">
                Vị trí ứng tuyển
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className={`w-full h-12 px-6 text-base md:text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue transition ${
                  errors.position ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">-- Chọn vị trí --</option>
                {positions.map(pos => (
                  <option key={pos.value} value={pos.value}>{pos.label}</option>
                ))}
              </select>
              {errors.position && (
                <p className="mt-2 text-red-600 text-sm md:text-base text-center">{errors.position}</p>
              )}
            </div>
              <div className="h-3"></div>
                {/* Industry Dropdown */}
                <div className="w-full max-w-md">
                  <label className="block text-lg font-semibold text-brand-navy mb-3 text-left">
                    Ngành nghề
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className={`w-full h-12 px-6 text-base md:text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue transition ${
                      errors.industry ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">-- Chọn ngành nghề --</option>
                    {industries.map(ind => (
                      <option key={ind.value} value={ind.value}>{ind.label}</option>
                    ))}
                  </select>
                  {errors.industry && (
                    <p className="mt-2 text-red-600 text-sm md:text-base text-center">{errors.industry}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* File Uploader for Personalized Mode */}
                <FileUploader
                  files={uploadedFiles}
                  onChange={setUploadedFiles}
                  maxFiles={4}
                  maxSizeMB={1}
                />
                {errors.files && (
                  <p className="text-red-600 text-sm md:text-base text-center">{errors.files}</p>
                )}
              </>
            )}
            <div className="h-3"></div>
            {/* Style Dropdown - Common for both modes */}
            <div className="w-full max-w-md">
              <label className="block text-lg font-semibold text-brand-navy mb-3 text-left">
                Phong cách phỏng vấn
              </label>
              <select
                name="style"
                value={formData.style}
                onChange={handleChange}
                className={`w-full h-12 px-6 text-base md:text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue transition ${
                  errors.style ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">-- Chọn phong cách --</option>
                {styles.map(sty => (
                  <option key={sty.value} value={sty.value}>{sty.label}</option>
                ))}
              </select>
              {errors.style && (
                <p className="mt-2 text-red-600 text-sm md:text-base text-center">{errors.style}</p>
              )}
            </div>
            <div className="h-3"></div>
            {/* Language Radio - Common for both modes */}
            <div className="w-full max-w-md">
              <label className="block text-lg font-semibold text-brand-navy mb-3 text-left">
                Ngôn ngữ phỏng vấn
              </label>
              <div className="flex justify-center gap-8 h-12 rounded-lg border-2 border-gray-300">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="language"
                    value="vi"
                    checked={formData.language === 'vi'}
                    onChange={handleChange}
                    className="w-5 h-5 text-brand-blue focus:ring-2 focus:ring-brand-blue cursor-pointer"
                  />
                  <span className="text-base md:text-lg text-gray-700 font-medium">Tiếng Việt</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="language"
                    value="en"
                    checked={formData.language === 'en'}
                    onChange={handleChange}
                    className="w-5 h-5 text-brand-blue focus:ring-2 focus:ring-brand-blue cursor-pointer"
                  />
                  <span className="text-base md:text-lg text-gray-700 font-medium">Tiếng Anh</span>
                </label>
              </div>
              {errors.language && (
                <p className="mt-2 text-red-600 text-sm md:text-base text-center">{errors.language}</p>
              )}
            </div>

            <div className="h-6"></div>

            {/* Submit Button */}
            <div className="w-full max-w-[16rem]">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-lg md:text-xl px-8 py-5 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
              >
                {loading ? 'Đang thiết lập...' : 'Bắt đầu phỏng vấn'}
              </button>
            </div>
            <div className="h-6"></div>
          </form>
        </div>

        {/* Spacing */}
        <div className="h-12 md:h-16 lg:h-10"></div>
      </section>

      {/* AI Processing Modal */}
      {aiProcessing && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-6 md:p-10 text-center max-w-lg w-full shadow-2xl border border-gray-100">

            <div className="h-6"></div>

            {/* Spinner */}
            <div className="flex justify-center">
              <div className="relative w-20 h-20 md:w-24 md:h-24">
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-brand-blue rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl md:text-3xl">🤖</span>
                </div>
              </div>
            </div>

            <div className="h-6"></div>

            {/* Title */}
            <h2 className="text-xl md:text-2xl font-bold text-brand-navy">
              {processingStage}
            </h2>

            <div className="h-2"></div>

            <p className="text-sm md:text-base text-gray-600">
              Vui lòng chờ trong giây lát...
            </p>

            <div className="h-8"></div>

            {/* Progress steps - static list without status indicators */}
            <div className="flex justify-center">
              <div className="bg-white rounded-xl p-4 md:p-6 space-y-4 shadow-sm interview-progress-box">
                <div className="interview-progress-content space-y-4">
                  <div className="flex items-start gap-3 md:gap-4">
                    <span className="flex-shrink-0 text-brand-blue font-bold text-sm md:text-base">1.</span>
                    <span className="text-sm md:text-base text-gray-700 text-left flex-1">
                      Đọc và trích xuất nội dung
                    </span>
                  </div>

                  <div className="flex items-start gap-3 md:gap-4">
                    <span className="flex-shrink-0 text-brand-blue font-bold text-sm md:text-base">2.</span>
                    <span className="text-sm md:text-base text-gray-700 text-left flex-1">
                      Phân tích thông tin với AI
                    </span>
                  </div>

                  <div className="flex items-start gap-3 md:gap-4">
                    <span className="flex-shrink-0 text-brand-blue font-bold text-sm md:text-base">3.</span>
                    <span className="text-sm md:text-base text-gray-700 text-left flex-1">
                      Tạo câu hỏi phỏng vấn
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-6"></div>

            <p className="text-xs md:text-sm text-gray-500 italic">
              Quá trình này có thể mất tối đa 1 phút
            </p>

            <div className="h-6"></div>

            {/* Cancel button */}
            <button
              onClick={() => {
                setAiProcessing(false)
                setLoading(false)
              }}
              className="text-sm md:text-base text-gray-600 hover:text-brand-navy font-medium underline transition"
            >
              Quay lại
            </button>

            <div className="h-6"></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InterviewSetup