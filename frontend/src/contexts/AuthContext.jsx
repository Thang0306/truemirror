import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('truemirror_token')
    const storedUser = localStorage.getItem('truemirror_user')
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    
    setLoading(false)
  }, [])

  const login = (userData, accessToken) => {
    // Save user and token to state and localStorage
    setUser(userData)
    setToken(accessToken)
    localStorage.setItem('truemirror_token', accessToken)
    localStorage.setItem('truemirror_user', JSON.stringify(userData))
  }

  const logout = () => {
    // Clear user and token from state and localStorage
    setUser(null)
    setToken(null)
    localStorage.removeItem('truemirror_token')
    localStorage.removeItem('truemirror_user')
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}