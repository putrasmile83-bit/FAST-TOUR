import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { toast } from 'react-toastify'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import axios from 'axios'
import QRISDisplay from '../components/QRISDisplay'
import '../styles/payment.css'

function PaymentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { adminInfo, addRegistration, updatePaymentStatus } = useApp()
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('bank')
  const [showQRIS, setShowQRIS] = useState(false)
  const [confirmPayment, setConfirmPayment] = useState(false)
  const [teamData, setTeamData] = useState(null)
  const [registrationId, setRegistrationId] = useState(null)

  useEffect(() => {
    // Get registration from state (passed from RegistrationPage)
    if (location.state?.registration) {
      const registration = location.state.registration
      setRegistrationId(registration.id)
      setTeamData({ teamName: registration.teamName, fee: registration.fee })
      setPaymentAmount(registration.fee)
    } else {
      // Fallback: try to get from search params
      const team = searchParams.get('team')
      const amount = searchParams.get('amount')
      if (team) {
        setTeamData({ teamName: team, fee: amount || '5' })
        setPaymentAmount(amount || '5')
      }
    }
  }, [location.state, searchParams])

  const handlePaymentAmountChange = (e) => {
    setPaymentAmount(e.target.value)
    setShowQRIS(false)
    setConfirmPayment(false)
  }

  const handleGenerateQRIS = () => {
    if (!paymentAmount) {
      toast.error('Please select payment amount')
      return
    }
    setShowQRIS(true)
  }

  const handleConfirmPayment = async () => {
    if (!registrationId) {
      toast.error('Registration not found')
      return
    }

    try {
      // Send PENDING status (not verified!) - requires admin approval
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/registrations/${registrationId}/payment`,
        { status: 'pending', method: paymentMethod, proofMethod: 'web' }
      )

      // Also update local context
      updatePaymentStatus(registrationId, 'pending')

      setConfirmPayment(true)
      toast.success('⏳ Payment submitted for verification! Admin will review shortly.')
      toast.info('Or: Send proof to Telegram bot @FT_PaymentBot for instant verification!')
      
      setTimeout(() => {
        navigate('/admin-contact', { state: { registrationId } })
      }, 3000)
    } catch (error) {
      console.error('Payment verification error:', error)
      toast.error('Could not submit payment. Please try again.')
    }
  }

  const openWhatsApp = () => {
    const message = `Hello Admin, I have completed the payment.\n\nTeam: ${teamData?.teamName || 'N/A'}\nRegistration ID: #${registrationId || 'N/A'}\nAmount: ${paymentAmount}K\n\nPlease verify my registration.`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${adminInfo.phone1.replace('+', '')}?text=${encodedMessage}`, '_blank')
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1 className="pixel-font">Payment Gateway</h1>
          <p>Complete your tournament registration</p>
        </div>

        <div className="payment-grid">
          {/* PAYMENT METHOD SELECTION */}
          <div className="payment-section card">
            <h2>Select Payment Method</h2>
            <div className="payment-methods">
              <label className="method-option">
                <input
                  type="radio"
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="method-label">
                  🏦 Bank Transfer
                </span>
              </label>
              <label className="method-option">
                <input
                  type="radio"
                  value="qris"
                  checked={paymentMethod === 'qris'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="method-label">
                  📱 QRIS
                </span>
              </label>
            </div>

            {/* AMOUNT SELECTION */}
            <div className="amount-section">
              <h3>Select Amount</h3>
              <div className="amount-grid">
                {['1', '2', '3', '4', '5'].map(amount => (
                  <button
                    key={amount}
                    className={`amount-btn ${paymentAmount === amount ? 'active' : ''}`}
                    onClick={() => handlePaymentAmountChange({ target: { value: amount } })}
                  >
                    {amount}K
                  </button>
                ))}
              </div>
              <div className="custom-amount">
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={paymentAmount}
                  onChange={handlePaymentAmountChange}
                />
              </div>
            </div>

            {/* BANK TRANSFER INFO */}
            {paymentMethod === 'bank' && (
              <div className="bank-info animate-slide">
                <h3>Bank Transfer Details</h3>
                <div className="bank-details">
                  <div className="detail-row">
                    <span className="label">DANA ONLY:</span>
                    <span className="value">{adminInfo.bankName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Account Number:</span>
                    <span className="value copy-text">{adminInfo.bankAccount}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Fee:</span>
                    <span className="value highlight">{paymentAmount}K</span>
                  </div>
                </div>
                <p className="info-text">
                  Please transfer the exact amount to the account above. After transfer, click confirm button.
                </p>
              </div>
            )}

            {/* QRIS DISPLAY */}
            {paymentMethod === 'qris' && (
              <div className="qris-section">
                <button className="btn btn-primary" onClick={handleGenerateQRIS}>
                  Generate QRIS ({paymentAmount}K)
                </button>
                {showQRIS && (
                  <div className="animate-slide">
                    <QRISDisplay 
                      amount={paymentAmount} 
                      registrationId={registrationId}
                      onClose={() => setShowQRIS(false)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PAYMENT SUMMARY */}
          <div className="payment-section card">
            <h2>Payment Summary</h2>
            
            {/* TEAM INFO */}
            {teamData && (
              <div className="team-info" style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #fff' }}>
                <div className="summary-row">
                  <span>Team Name</span>
                  <span className="highlight">{teamData.teamName}</span>
                </div>
                {registrationId && (
                  <div className="summary-row">
                    <span>Registration ID</span>
                    <span className="copy-text" style={{ cursor: 'pointer', fontFamily: 'monospace' }}>
                      #{registrationId}
                    </span>
                  </div>
                )}
              </div>
            )}
            
            <div className="summary">
              <div className="summary-row">
                <span>Tournament Registration</span>
                <span>{paymentAmount}K</span>
              </div>
              <div className="summary-row">
                <span>Fees</span>
                <span>0K</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span className="highlight">{paymentAmount}K</span>
              </div>
            </div>

            <div className="confirmation-section">
              <label className="confirm-checkbox">
                <input
                  type="checkbox"
                  checked={confirmPayment}
                  onChange={(e) => setConfirmPayment(e.target.checked)}
                />
                <span>I have completed the payment</span>
              </label>
            </div>

            <div className="payment-actions">
              <button
                className="btn btn-primary"
                onClick={handleConfirmPayment}
                disabled={!confirmPayment || !paymentAmount}
              >
                Confirm Payment
              </button>
              <button className="btn btn-secondary" onClick={openWhatsApp}>
                📱 Message Admin
              </button>
            </div>

            <div className="admin-contacts">
              <h4>Contact Admin</h4>
              <p>Admin 1: {adminInfo.phone1}</p>
              <p>Admin 2: {adminInfo.phone2}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
