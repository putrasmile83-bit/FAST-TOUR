import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import '../styles/protected-route.css'

function ProtectedRoute({ children }) {
  const navigate = useNavigate()
  const [pin, setPin] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showPinInput, setShowPinInput] = useState(true)

  const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || 'FT001'

  const handlePinSubmit = (e) => {
    e.preventDefault()
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true)
      setShowPinInput(false)
      toast.success('Access granted!')
    } else {
      toast.error('Invalid PIN')
      setPin('')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPin('')
    setShowPinInput(true)
    navigate('/dashboard')
  }

  if (!isAuthenticated) {
    return (
      <div className="protected-route">
        <div className="pin-container">
          <div className="pin-card card">
            <h1 className="pixel-font">Admin Access</h1>
            <p>Enter admin PIN to continue</p>
            <form onSubmit={handlePinSubmit} className="pin-form">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••"
                maxLength="6"
                autoFocus
              />
              <button type="submit" className="btn btn-primary">
                Verify PIN
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="protected-content">
      <div className="admin-navbar">
        <span className="admin-badge">🔐 Admin Mode</span>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
      {children}
    </div>
  )
}

export default ProtectedRoute
