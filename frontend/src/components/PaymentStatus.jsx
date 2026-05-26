import { useState, useEffect } from 'react'
import SoundNotification from './SoundNotification'

export function PaymentStatus({ paymentId, apiUrl }) {
  const [status, setStatus] = useState({
    status: 'pending',
    countdown: '10:00',
    totalAmount: 'Rp0',
    orderId: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [soundType, setSoundType] = useState(null)

  useEffect(() => {
    let interval

    const fetchStatus = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${apiUrl}/api/payments/${paymentId}/status`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch payment status')
        }

        const data = await response.json()
        
        // Check if status changed to success/failed and trigger sound
        if ((data.status === 'success' || data.status === 'failed') && 
            status.status !== data.status) {
          setSoundType(data.status === 'success' ? 'success' : 'failed')
        }

        setStatus(data)
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching payment status:', err)
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchStatus()

    // Poll every 3 seconds
    interval = setInterval(fetchStatus, 3000)

    return () => clearInterval(interval)
  }, [paymentId, apiUrl, status.status])

  const getStatusColor = () => {
    switch (status.status) {
      case 'success':
        return 'text-success'
      case 'failed':
        return 'text-failed'
      case 'checking':
        return 'text-accent'
      default:
        return 'text-muted'
    }
  }

  const getStatusIcon = () => {
    switch (status.status) {
      case 'success':
        return '✓'
      case 'failed':
        return '✗'
      case 'checking':
        return '⏳'
      case 'expired':
        return '⏰'
      default:
        return '⏱'
    }
  }

  if (loading && !status.status) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="animate-pulse mb-">Loading payment status...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="payment-status card">
      <div className="card-header">
        <h3 className="text-center">Payment Status</h3>
      </div>

      <div className="card-body">
        {/* Status Display */}
        <div className={`status-display ${getStatusColor()}`}>
          <div className="status-icon">{getStatusIcon()}</div>
          <div className="status-text">{status.status.toUpperCase()}</div>
        </div>

        {/* Order ID */}
        {status.orderId && (
          <div className="order-info">
            <label>Order ID:</label>
            <div className="order-id text-accent">{status.orderId}</div>
          </div>
        )}

        {/* Amount */}
        <div className="amount-info">
          <label>Total Amount:</label>
          <div className="amount text-accent">{status.totalAmount}</div>
        </div>

        {/* Countdown */}
        {status.status === 'pending' && (
          <div className="countdown-info">
            <label>Time Remaining:</label>
            <div className="countdown">{status.countdown}</div>
          </div>
        )}

        {/* Sound Notification */}
        {soundType && (
          <div className="mt-">
            <SoundNotification type={soundType} autoPlay={true} />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            ⚠ {error}
          </div>
        )}
      </div>

      <style jsx>{`
        .status-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
          border: 2px solid currentColor;
          border-radius: var(--radius-lg);
          gap: var(--spacing-md);
        }

        .status-icon {
          font-size: 2.5rem;
          font-weight: bold;
        }

        .status-text {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .order-info,
        .amount-info,
        .countdown-info {
          margin-bottom: var(--spacing-md);
        }

        .order-info label,
        .amount-info label,
        .countdown-info label {
          display: block;
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: var(--spacing-xs);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .order-id,
        .amount {
          font-size: 1.5rem;
          font-weight: 700;
          font-family: var(--font-mono);
          letter-spacing: 1px;
        }

        .countdown {
          font-size: 2rem;
          font-weight: 700;
          font-family: var(--font-mono);
          color: var(--status-pending);
        }

        .error-message {
          color: var(--status-failed);
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid var(--status-failed);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  )
}

export default PaymentStatus
