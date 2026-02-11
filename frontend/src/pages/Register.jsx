import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api'
import { useGoogleLogin } from '@react-oauth/google'

import './Register.css'

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

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const res = await api.post('/api/auth/google', {
          token: tokenResponse.access_token,
        });
        
        // Login user with returned token (API handles both login and registration)
        login(res.data.user, res.data.access_token)
        
        // Navigate to dashboard
        navigate('/')
      } catch (err) {
        console.error('Google Login Error:', err);
        setServerError(err.response?.data?.error || 'Đăng nhập Google thất bại');
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      setServerError('Đăng nhập Google thất bại');
    }
  });

  return (
    <div className="min-h-screen flex justify-center bg-white">
      <section className="w-full max-w-4xl px-6 md:px-8 py-16">
        <div className="h-6"></div>
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-16 shadow-xl border border-gray-100">
          <div className="h-3"></div>
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand-navy mb-4">
              Đăng ký tài khoản
            </h1>
            <div className="h-3"></div>
            <p className="text-base md:text-lg text-gray-700">
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
            <div className="h-6"></div>
            {/* Submit Button */}
            <div className="w-full max-w-[20rem]">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 btn-primary text-base md:text-lg px-8 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition flex items-center justify-center"
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>
            </div>

            <div className="h-3"></div>

            <div className="relative flex justify-center items-center w-full max-w-[20rem]">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink-0 register-divider-text text-gray-500 text-sm">Hoặc tiếp tục với</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="h-3"></div>

            <div className="w-full max-w-[20rem]">
              <button
                type="button"
                onClick={() => googleLogin()}
                className="w-full h-12 flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl px-6 text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-sm"
              >
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="Google" 
                  className="w-6 h-6 md:w-7 md:h-7"
                />
                <span className="text-base md:text-lg">Đăng nhập với Google</span>
              </button>
            </div>

            <div className="h-6"></div>
            {/* Login Link */}
            <p className="text-center text-base md:text-lg text-gray-700 pt-4 pb-6">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-brand-blue font-semibold hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
            <div className="h-6"></div>
          </form>
        </div>

        {/* Spacing */}
        <div className="h-12 md:h-16 lg:h-10"></div>
      </section>
    </div>
  )
}

export default Register
