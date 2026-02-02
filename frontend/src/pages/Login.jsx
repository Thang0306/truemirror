import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    setServerError('')
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email'
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    setServerError('')
    
    try {
      const response = await api.post('/api/auth/login', {
        email: formData.email,
        password: formData.password
      })
      
      // Login user with returned token
      login(response.data.user, response.data.access_token)
      
      // Navigate to home
      navigate('/')
      
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
    <div className="min-h-screen flex justify-center bg-white">
      <section className="w-full max-w-4xl px-4 py-16">
        <div className="h-6"></div>
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-16 shadow-xl border border-gray-100">
          <div className="h-3"></div>
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-4">
              Đăng nhập
            </h1>
            <br/>
            <p className="text-lg md:text-xl text-gray-700">
              Chào mừng trở lại với TrueMirror
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
          
         <form onSubmit={handleSubmit} className="space-y-8 flex flex-col items-center">
            
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
                    errors.email ? "border-red-500" : "border-gray-300"
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
                placeholder="Nhập mật khẩu"
              />
              {errors.password && (
                <p className="mt-2 text-red-600 text-sm md:text-base text-center">{errors.password}</p>
              )}
            </div>

            <br/>

            {/* Submit Button */}
            <div className="w-full max-w-[16rem]">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-lg md:text-xl px-8 py-5 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </div>

            <br/>
            {/* Register Link */}
            <p className="text-center text-base md:text-lg text-gray-700 pt-4">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-brand-blue font-semibold hover:underline">
                Đăng ký ngay
              </Link>
            </p>
            <br/>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Login