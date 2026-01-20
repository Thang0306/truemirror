import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api'

const InterviewSetup = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
  
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
    { value: 'Fresher', label: 'Fresher' },
    { value: 'Junior', label: 'Junior' },
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
    
    if (!formData.position) newErrors.position = 'Vui lòng chọn vị trí'
    if (!formData.industry) newErrors.industry = 'Vui lòng chọn ngành nghề'
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
      const response = await api.post('/api/interview/setup', formData)
      
      console.log('[INFO] Interview session created:', response.data.session)
      
      // Navigate to interview page (will be created in next days)
      // For now, navigate to dashboard with success message
      navigate('/dashboard')
      
    } catch (error) {
      if (error.response?.data?.error) {
        setServerError(error.response.data.error)
      } else {
        setServerError('Đã xảy ra lỗi. Vui lòng thử lại sau.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      <section className="w-full max-w-4xl px-4 py-16">
        <br />
        <br />
        <br />
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-16 shadow-xl border border-gray-100">
          <div className="text-center mb-10">
            <br />
            <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-4">
              Thiết lập phỏng vấn
            </h1>
            <br />
            <p className="text-lg md:text-xl text-gray-700">
              Cấu hình phiên phỏng vấn của bạn để bắt đầu luyện tập
            </p>
          </div>

          {/* Server Error Message */}
          {serverError && (
            <div className="w-full flex justify-center mb-6">
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl max-w-md text-center">
                <p className="text-base md:text-lg">{serverError}</p>
              </div>
            </div>
          )}
          
          <br />
          
          <form onSubmit={handleSubmit} className="space-y-8 flex flex-col items-center">
            
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

            {/* Style Dropdown */}
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

            {/* Language Radio */}
            <div className="w-full max-w-md">
              <label className="block text-lg font-semibold text-brand-navy mb-3 text-left">
                Ngôn ngữ phỏng vấn
              </label>
              <div className="flex justify-center gap-8 p-4 rounded-lg border-2 border-gray-300">
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

            <br />

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

            <br />
          </form>
        </div>
      </section>
    </div>
  )
}

export default InterviewSetup