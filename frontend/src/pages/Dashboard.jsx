import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <section className="w-full max-w-4xl px-4 md:px-8 py-12 md:py-16">
        <br />
        <br />
        <br />
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200">
          <div className="flex flex-col items-center space-y-6">
            <br />
            <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-blue rounded-full flex items-center justify-center">
              <span className="text-2xl md:text-3xl">👋</span>
            </div>
            <br />
            
            <h1 className="text-2xl md:text-4xl font-semibold text-brand-navy">
              Xin chào, {user?.full_name}!
            </h1>
            <br />
            
            <p className="text-base md:text-lg text-gray-700 text-center max-w-2xl">
              Chào mừng bạn đến với bảng điều khiển TrueMirror.
            </p>
            <br />
            
            <div className="mt-8"></div>
            
            <div className="flex flex-col space-y-3 w-full max-w-md p-6">
              <div className="flex justify-between items-center px-3 py-2 rounded-lg hover:bg-gray-50">
                <span className="text-base font-medium text-gray-700">Họ tên</span>
                <span className="text-base md:text-lg text-gray-900">{user?.full_name}</span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 rounded-lg hover:bg-gray-50">
                <span className="text-base font-medium text-gray-700">Email</span>
                <span className="text-base md:text-lg text-gray-900">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 rounded-lg hover:bg-gray-50">
                <span className="text-base font-medium text-gray-700">Trạng thái</span>
                <span className="text-base md:text-lg font-semibold text-green-600">
                  {user?.is_active ? '✓ Đang hoạt động' : '✗ Không hoạt động'}
                </span>
              </div>
            </div>
            
            <br />
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => navigate('/interview/setup')}
                className="btn-primary text-base md:text-lg px-8 py-3"
              >
                Bắt đầu luyện phỏng vấn
              </button>
              <button className="btn-secondary text-base md:text-lg px-8 py-3">
                Xem lịch sử
              </button>
            </div>
            <br />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard