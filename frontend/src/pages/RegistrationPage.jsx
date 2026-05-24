import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import '../styles/registration.css'

function RegistrationPage() {
  const navigate = useNavigate()
  const { addRegistration } = useApp()
  const [formData, setFormData] = useState({
    teamName: '',
    playerCount: '1',
    fee: '1'
  })
  const [isLoading, setIsLoading] = useState(false)

  const playerOptions = ['1', '2', '3', '4']
  const feeOptions = ['1', '2', '3', '4', '5']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.teamName.trim()) {
      toast.error('Please enter team name')
      return
    }

    setIsLoading(true)

    try {
      // Add registration to context
      const registration = addRegistration(formData)

      // Send to backend
      const response = await axios.post('http://localhost:5000/api/registrations', {
        ...formData,
        registrationId: registration.id
      })

      toast.success('Registration submitted! Proceeding to payment...')

      // Redirect to payment page
      setTimeout(() => {
        navigate('/payment', {
          state: { registration }
        })
      }, 1500)
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="registration-header">
          <h1 className="pixel-font">Tournament Registration</h1>
          <p>Join FAST TOUR today!</p>
        </div>

        <form onSubmit={handleSubmit} className="registration-form card">
          {/* TEAM NAME */}
          <div className="form-group">
            <label htmlFor="teamName" className="form-label">Team Name *</label>
            <input
              type="text"
              id="teamName"
              name="teamName"
              value={formData.teamName}
              onChange={handleInputChange}
              placeholder="Enter your team name"
              maxLength="50"
              required
            />
          </div>

          {/* PLAYER COUNT */}
          <div className="form-group">
            <label htmlFor="playerCount" className="form-label">Number of Players *</label>
            <div className="option-grid">
              {playerOptions.map(option => (
                <button
                  key={option}
                  type="button"
                  className={`option-btn ${formData.playerCount === option ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, playerCount: option }))}
                >
                  {option}/4
                </button>
              ))}
            </div>
          </div>

          {/* MATCH FEE */}
          <div className="form-group">
            <label htmlFor="fee" className="form-label">Match Fee (K) *</label>
            <div className="option-grid">
              {feeOptions.map(option => (
                <button
                  key={option}
                  type="button"
                  className={`option-btn ${formData.fee === option ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, fee: option }))}
                >
                  {option}K
                </button>
              ))}
            </div>
          </div>

          {/* SUMMARY */}
          <div className="registration-summary card">
            <h3>Registration Summary</h3>
            <div className="summary-item">
              <span>Team Name:</span>
              <span className="value">{formData.teamName || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span>Players:</span>
              <span className="value">{formData.playerCount}/4</span>
            </div>
            <div className="summary-item total">
              <span>Fee:</span>
              <span className="value highlight">{formData.fee}K</span>
            </div>
          </div>

          {/* TERMS */}
          <div className="form-group checkbox">
            <label>
              <input type="checkbox" required />
              <span>I agree to the tournament rules and fair play policy</span>
            </label>
          </div>

          {/* ACTION BUTTONS */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Proceed to Payment'}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => navigate('/tournament-rules')}
            >
              View Rules
            </button>
          </div>
        </form>

        {/* INFO SECTION */}
        <div className="registration-info">
          <div className="info-card card">
            <h3>What happens next?</h3>
            <ol>
              <li>Fill in your team details</li>
              <li>Proceed to secure payment</li>
              <li>Receive payment confirmation</li>
              <li>Join WhatsApp group</li>
              <li>Start playing!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegistrationPage
