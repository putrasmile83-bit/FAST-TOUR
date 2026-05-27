import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import '../styles/payment.css'

/**
 * FAST TOUR - Simplified Payment Page
 * Clean, stable, no styled-jsx
 */

function PaymentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  // State
  const [registrationId, setRegistrationId] = useState(null)
  const [teamData, setTeamData] = useState(null)
  const [paymentData, setPaymentData] = useState(null)
  const [selectedMethod, setSelectedMethod] = useState('QRIS')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Get registration data
  useEffect(() => {
    if (location.state?.registration) {
      const reg = location.state.registration
      setRegistrationId(reg.id)
      setTeamData({
        teamName: reg.teamName,
        playerCount: reg.playerCount,
        fee: reg.fee
      })
    }
  }, [location.state])

  // Create payment
  const handleCreatePayment = async () => {
    if (!registrationId) {
      setError('No registration ID found')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${apiUrl}/api/payments/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId,
          paymentMethod: selectedMethod,
          baseAmount: (teamData?.fee || 0) * 1000
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create payment')
      }

      const data = await response.json()
      setPaymentData(data)
      toast.success('✓ Payment created! You have 10 minutes.')
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Auto-create payment
  useEffect(() => {
    if (registrationId && teamData && !paymentData && !error) {
      handleCreatePayment()
    }
  }, [registrationId, teamData])

  if (!teamData) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="page-header">
          <h1>💳 Complete Payment</h1>
          <p>Fast Tournament Registration</p>
        </div>

        {error && (
          <div className="message error">
            ⚠ {error}
          </div>
        )}

        {paymentData ? (
          <div className="payment-grid">
            {/* LEFT: Payment Info */}
            <div>
              {/* Team Info */}
              <div className="payment-section">
                <h2>📋 Registration</h2>
                <div className="info-item">
                  <span className="info-label">Team</span>
                  <span className="info-value">{teamData.teamName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Players</span>
                  <span className="info-value">{teamData.playerCount}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Base Fee</span>
                  <span className="info-value accent">Rp{(teamData.fee * 1000).toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Countdown */}
              <div className="payment-section">
                <h2>⏱️ Time Remaining</h2>
                <div className="countdown-display">{paymentData.countdown || '10:00'}</div>
              </div>

              {/* Payment Method */}
              <div className="payment-section">
                <h2>💳 Method</h2>
                <div className="payment-methods">
                  {['QRIS', 'DANA', 'TRANSFER'].map(m => (
                    <label key={m} className={`method-option ${selectedMethod === m ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="method"
                        value={m}
                        checked={selectedMethod === m}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                      />
                      <span className="method-label">
                        {m === 'QRIS' && '📱 QRIS'}
                        {m === 'DANA' && '💳 DANA'}
                        {m === 'TRANSFER' && '🏦 Bank Transfer'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Payment Details */}
            <div>
              {/* Amount Summary */}
              <div className="payment-section">
                <h2>💰 Amount Details</h2>
                <div className="info-item">
                  <span className="info-label">Base Amount</span>
                  <span className="info-value">Rp{(teamData.fee * 1000).toLocaleString('id-ID')}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Unique Nominal</span>
                  <span className="info-value accent">+Rp{paymentData.uniqueNominal?.toLocaleString('id-ID')}</span>
                </div>
                <div className="info-item" style={{ background: 'var(--gradient-primary)', color: '#000', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}>
                  <span className="info-label" style={{ color: '#000' }}>TOTAL TO SEND</span>
                  <span className="info-value" style={{ color: '#000', fontSize: '1.25rem' }}>Rp{paymentData.totalAmount?.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Order ID */}
              {paymentData.orderId && (
                <div className="payment-section">
                  <h2>🔢 Order ID</h2>
                  <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-accent)', fontFamily: 'monospace' }}>
                    {paymentData.orderId}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 'var(--spacing-md)', textAlign: 'center' }}>
                    ℹ️ Use this when transferring via bank
                  </p>
                </div>
              )}

              {/* Status */}
              <div className="payment-section">
                <h2>📊 Status</h2>
                <div className="status-box">
                  <div className="status-icon">⏳</div>
                  <div className="status-text">Pending</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 'var(--spacing-md)' }}>
                    Waiting for payment proof...
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className="payment-section">
                <h2>📝 Instructions</h2>
                <ol style={{ marginLeft: 'var(--spacing-lg)', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                  <li>Transfer exact amount: <strong style={{ color: 'var(--text-accent)' }}>Rp{paymentData.totalAmount?.toLocaleString('id-ID')}</strong></li>
                  <li>Take screenshot of transfer confirmation</li>
                  <li>Come back and upload the proof</li>
                  <li>Admin will verify (usually < 5 minutes)</li>
                </ol>
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Creating payment...</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default PaymentPage
