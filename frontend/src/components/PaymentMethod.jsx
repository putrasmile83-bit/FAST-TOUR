import { useState } from 'react'

export function PaymentMethod({ method, amount, uniqueNominal, totalAmount, orderId }) {
  const [copied, setCopied] = useState(false)

  // Sample payment details (these would come from backend in production)
  const paymentMethods = {
    QRIS: {
      display: 'QRIS',
      icon: '📱',
      value: '00020126580014Id.Co.BRI.www011628210032000000000000018040000530336050606160104d42a030570010305412345678901234530200302d42a505304039990520400005303643602020120630402F5',
      instructions: 'Scan this QRIS code with any payment app'
    },
    DANA: {
      display: 'DANA',
      icon: '💳',
      value: '+62812345678',
      instructions: 'Send to DANA number'
    },
    TRANSFER: {
      display: 'Bank Transfer',
      icon: '🏦',
      value: '1234567890 (BCA)',
      instructions: 'Transfer to bank account'
    }
  }

  const selectedMethod = paymentMethods[method] || paymentMethods.QRIS

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(selectedMethod.value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="payment-method card">
      <div className="card-header">
        <h3>Payment Method</h3>
      </div>

      <div className="card-body">
        {/* Method Header */}
        <div className="method-header">
          <span className="method-icon">{selectedMethod.icon}</span>
          <span className="method-name">{selectedMethod.display}</span>
        </div>

        {/* Amount Display */}
        <div className="amount-section">
          <div className="amount-item">
            <label>Base Amount:</label>
            <div className="amount-value">{new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0
            }).format(totalAmount - uniqueNominal)}</div>
          </div>

          <div className="amount-item">
            <label>Unique Nominal:</label>
            <div className="amount-value unique-nominal">+{new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0
            }).format(uniqueNominal)}</div>
          </div>

          <div className="amount-item total">
            <label>Total to Send:</label>
            <div className="amount-value total-value">{new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0
            }).format(totalAmount)}</div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="payment-details">
          <p className="instructions">{selectedMethod.instructions}</p>
          
          <div className="copy-section">
            <input
              type="text"
              value={selectedMethod.value}
              readOnly
              className="copy-input"
            />
            <button
              className="btn btn-primary"
              onClick={copyToClipboard}
              title="Copy payment details"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>

          {/* Order ID Reference */}
          {orderId && (
            <div className="order-reference">
              <label>Payment Reference ID:</label>
              <div className="order-id-display">{orderId}</div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .method-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
          padding-bottom: var(--spacing-lg);
          border-bottom: 2px solid var(--bg-hover);
        }

        .method-icon {
          font-size: 2rem;
        }

        .method-name {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .amount-section {
          margin-bottom: var(--spacing-lg);
        }

        .amount-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md);
          margin-bottom: var(--spacing-sm);
          background: var(--bg-surface);
          border-radius: var(--radius-md);
        }

        .amount-item label {
          color: var(--text-muted);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .amount-value {
          font-size: 1.1rem;
          font-weight: 700;
          font-family: var(--font-mono);
          color: var(--text-primary);
        }

        .unique-nominal {
          color: var(--text-accent);
        }

        .amount-item.total {
          background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-hover) 100%);
          border: 2px solid var(--border-color);
          padding: var(--spacing-lg);
        }

        .total-value {
          font-size: 1.5rem;
          color: var(--text-accent);
        }

        .payment-details {
          margin-top: var(--spacing-lg);
        }

        .instructions {
          color: var(--text-muted);
          margin-bottom: var(--spacing-md);
          font-size: 0.95rem;
          font-style: italic;
        }

        .copy-section {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-lg);
        }

        .copy-input {
          flex: 1;
          padding: var(--spacing-md);
          background: var(--bg-surface);
          color: var(--text-primary);
          border: 2px solid var(--bg-hover);
          border-radius: var(--radius-md);
          font-family: var(--font-mono);
          font-size: 0.9rem;
        }

        .copy-input:focus {
          outline: none;
          border-color: var(--text-accent);
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
        }

        .order-reference {
          padding: var(--spacing-md);
          background: var(--bg-surface);
          border-radius: var(--radius-md);
          border-left: 4px solid var(--text-accent);
        }

        .order-reference label {
          display: block;
          color: var(--text-muted);
          font-size: 0.85rem;
          margin-bottom: var(--spacing-xs);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .order-id-display {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-accent);
          font-family: var(--font-mono);
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  )
}

export default PaymentMethod
