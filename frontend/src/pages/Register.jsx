import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api'

const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

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
    if (!formData.full_name.trim()) newErrors.full_name = 'Vui lòng nhập họ tên'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email'
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Email không hợp lệ'
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu'
    else if (formData.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await api.post('/api/auth/register', {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password
      })
      login(response.data.user, response.data.access_token)
      navigate('/')
    } catch (error) {
      setServerError(error.response?.data?.error || 'Đã xảy ra lỗi. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center bg-white">
      <section className="w-full max-w-4xl px-4 py-16">
        <div className="h-6"></div>
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-16 shadow-xl border border-gray-100">
          <div className="h-3"></div>
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-4">
              Đăng ký tài khoản
            </h1>
            <div className="h-3"></div>
            <p className="text-lg md:text-xl text-gray-700">
              Bắt đầu hành trình luyện phỏng vấn với TrueMirror
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
          <div className="h-3"></div>
          <form onSubmit={handleSubmit} className="space-y-8 flex flex-col items-center">
            
            {/* Full Name Input */}
            <div className="w-full max-w-md">
              <label className="block text-lg font-semibold text-brand-navy mb-3 text-left">
                Họ và tên
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className={`w-full bg-white border-2 rounded-xl text-base md:text-lg
                  focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all
                  text-brand-navy font-normal ${
                    errors.full_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                style={{
                  padding: '18px 28px',
                  height: '54px',
                  lineHeight: '1.6'
                }}
                placeholder="Nguyễn Văn An"
              />
              {errors.full_name && (
                <p className="mt-2 text-red-600 text-sm md:text-base text-center">{errors.full_name}</p>
              )}
            </div>
            
            {/* Email Input */}
            <div className="w-full max-w-md">
              <label className="block text-lg font-semibold text-brand-navy mb-3 text-left">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-white border-2 rounded-xl text-base md:text-lg
                  focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all
                  text-brand-navy font-normal ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                style={{
                  padding: '18px 28px',
                  height: '54px',
                  lineHeight: '1.6'
                }}
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-red-600 text-sm md:text-base text-center">{errors.email}</p>
              )}
            </div>
            
            {/* Password Input */}
            <div className="w-full max-w-md">
              <label className="block text-lg font-semibold text-brand-navy mb-3 text-left">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full bg-white border-2 rounded-xl text-base md:text-lg
                  focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all
                  text-brand-navy font-normal ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                style={{
                  padding: '18px 28px',
                  height: '54px',
                  lineHeight: '1.6'
                }}
                placeholder="Ít nhất 6 ký tự"
              />
              {errors.password && (
                <p className="mt-2 text-red-600 text-sm md:text-base text-center">{errors.password}</p>
              )}
            </div>
            
            {/* Confirm Password Input */}
            <div className="w-full max-w-md">
              <label className="block text-lg font-semibold text-brand-navy mb-3 text-left">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full bg-white border-2 rounded-xl text-base md:text-lg
                  focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all
                  text-brand-navy font-normal ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                style={{
                  padding: '18px 28px',
                  height: '54px',
                  lineHeight: '1.6'
                }}
                placeholder="Nhập lại mật khẩu"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-red-600 text-sm md:text-base text-center">{errors.confirmPassword}</p>
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
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>
            </div>
            <br />
            {/* Login Link */}
            <p className="text-center text-base md:text-lg text-gray-700 pt-4 pb-6">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-brand-blue font-semibold hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
            <br />
          </form>
        </div>
      </section>
    </div>
  )
}

export default Register
