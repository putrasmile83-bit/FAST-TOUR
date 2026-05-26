import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import CountdownTimer from '../components/CountdownTimer'
import PaymentStatus from '../components/PaymentStatus'
import PaymentForm from '../components/PaymentForm'
import PaymentMethod from '../components/PaymentMethod'

/**
 * FAST TOUR - Payment Page
 * 
 * Payment Flow:
 * 1. User enters registration -> initiates payment
 * 2. Backend generates: Order ID (TRN-XXXXX), unique nominal (1000-9999)
 * 3. User sees: Total amount = base + unique nominal, 10-minute countdown
 * 4. User selects payment method (QRIS/DANA/Transfer) and transfers exact amount
 * 5. User uploads proof screenshot
 * 6. Admin verifies -> Success sound + green checkmark ✓
 * 7. On rejection -> Failed sound + red X ✗
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

  // Initialize: Get registration data from location state or URL params
  useEffect(() => {
    if (location.state?.registration) {
      const registration = location.state.registration
      setRegistrationId(registration.id)
      setTeamData({
        teamName: registration.teamName,
        playerCount: registration.playerCount,
        fee: registration.fee
      })
    } else {
      const team = searchParams.get('team')
      const amount = searchParams.get('amount')
      if (team && amount) {
        setTeamData({
          teamName: team,
          playerCount: 0,
          fee: parseInt(amount)
        })
      }
    }
  }, [location.state, searchParams])

  // Create payment request
  const handleCreatePayment = async () => {
    if (!registrationId) {
      setError('Registration ID not found')
      toast.error('Please register first')
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
          baseAmount: (teamData?.fee || 0) * 1000 // Convert to rupiah
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create payment')
      }

      const data = await response.json()
      setPaymentData(data)
      toast.success('Payment request created! You have 10 minutes to complete it.')
    } catch (err) {
      setError(err.message)
      toast.error(`Error: ${err.message}`)
      console.error('Payment creation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleProofUploaded = () => {
    toast.info('✓ Proof uploaded! Admin will verify your payment shortly.')
  }

  const handlePaymentExpired = () => {
    setError('Payment has expired. Please create a new payment request.')
    toast.warning('Payment expired. Creating new payment...')
    setTimeout(() => {
      setPaymentData(null)
      handleCreatePayment()
    }, 2000)
  }

  // Initial payment creation
  useEffect(() => {
    if (registrationId && teamData && !paymentData && !error) {
      handleCreatePayment()
    }
  }, [registrationId, teamData])

  if (!teamData) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
        <h2>Loading registration data...</h2>
        <p className="text-muted">Please wait</p>
      </div>
    )
  }

  return (
    <div className="payment-page container">
      <div className="page-header">
        <h1>Complete Your Payment</h1>
        <p className="text-muted">Fast Tournament Registration - Payment System</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>⚠</span> {error}
        </div>
      )}

      {paymentData ? (
        <div className="grid grid-2">
          {/* LEFT COLUMN: Payment Info & Form */}
          <div>
            {/* Team Summary */}
            <div className="card">
              <div className="card-header">
                <h3>Registration Details</h3>
              </div>
              <div className="card-body">
                <div className="detail-item">
                  <label>Team Name</label>
                  <div className="detail-value">{teamData.teamName}</div>
                </div>
                <div className="detail-item">
                  <label>Players</label>
                  <div className="detail-value">{teamData.playerCount || 'N/A'}</div>
                </div>
                <div className="detail-item">
                  <label>Base Fee</label>
                  <div className="detail-value">Rp{(teamData.fee * 1000).toLocaleString('id-ID')}</div>
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            <CountdownTimer
              expiresAt={paymentData.expiresAt}
              onExpired={handlePaymentExpired}
            />

            {/* Payment Method Selection */}
            <div className="card">
              <div className="card-header">
                <h3>Payment Method</h3>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {['QRIS', 'DANA', 'TRANSFER'].map(method => (
                  <label key={method} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    background: selectedMethod === method ? 'var(--bg-hover)' : 'transparent',
                    border: `2px solid ${selectedMethod === method ? 'var(--border-color)' : 'var(--bg-hover)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)'
                  }}>
                    <input
                      type="radio"
                      name="payment-method"
                      value={method}
                      checked={selectedMethod === method}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: 600 }}>
                      {method === 'QRIS' && '📱 QRIS'}
                      {method === 'DANA' && '💳 DANA'}
                      {method === 'TRANSFER' && '🏦 Bank Transfer'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Payment Status & Form */}
          <div>
            {/* Payment Status with Real-time Polling */}
            <PaymentStatus
              paymentId={paymentData.paymentId}
              apiUrl={apiUrl}
            />

            {/* Payment Method Details & Amount */}
            <PaymentMethod
              method={selectedMethod}
              amount={teamData.fee * 1000}
              uniqueNominal={paymentData.uniqueNominal}
              totalAmount={paymentData.totalAmount}
              orderId={paymentData.orderId}
            />

            {/* Upload Payment Proof */}
            <PaymentForm
              paymentId={paymentData.paymentId}
              apiUrl={apiUrl}
              onProofUploaded={handleProofUploaded}
            />
          </div>
        </div>
      ) : loading ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div className="animate-pulse mb-" style={{ fontSize: '1.25rem' }}>
            Creating payment request...
          </div>
          <p className="text-muted">Generating your payment details</p>
        </div>
      ) : null}

      <style jsx>{`
        .payment-page {
          min-height: 100vh;
          padding-top: var(--spacing-xl);
          padding-bottom: var(--spacing-xl);
        }

        .page-header {
          text-align: center;
          margin-bottom: var(--spacing-2xl);
        }

        .page-header h1 {
          margin-bottom: var(--spacing-md);
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .alert {
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          margin-bottom: var(--spacing-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          font-weight: 600;
        }

        .alert-error {
          background: rgba(248, 113, 113, 0.1);
          border: 2px solid var(--status-failed);
          color: var(--status-failed);
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md);
          margin-bottom: var(--spacing-sm);
          background: var(--bg-surface);
          border-radius: var(--radius-md);
        }

        .detail-item label {
          color: var(--text-muted);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-weight: 700;
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .page-header {
            margin-bottom: var(--spacing-xl);
          }

          .detail-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .detail-item label {
            margin-bottom: var(--spacing-xs);
          }
        }
      `}</style>
    </div>
  )
}

export default PaymentPage
