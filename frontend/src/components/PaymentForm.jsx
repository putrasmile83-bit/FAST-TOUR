import { useState, useRef } from 'react'

export function PaymentForm({ paymentId, apiUrl, onProofUploaded }) {
  const [proofImage, setProofImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File too large. Maximum 5MB allowed.' })
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file.' })
      return
    }

    // Convert to base64
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result
      setProofImage(base64)
      setPreview(base64)
      setMessage(null)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!proofImage) {
      setMessage({ type: 'error', text: 'Please select an image first.' })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/api/payments/${paymentId}/upload-proof`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ proofImage })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload proof')
      }

      const data = await response.json()
      setMessage({ type: 'success', text: 'Payment proof uploaded successfully!' })
      setProofImage(null)
      setPreview(null)
      
      onProofUploaded?.()
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="payment-form card">
      <div className="card-header">
        <h3>Upload Payment Proof</h3>
        <p className="text-muted">Upload a screenshot or photo of your payment confirmation</p>
      </div>

      <div className="card-body">
        {/* File Input */}
        <div className="upload-area">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          {preview ? (
            <div className="preview-container">
              <img src={preview} alt="Payment proof preview" className="preview-image" />
              <button
                className="btn btn-secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Image
              </button>
            </div>
          ) : (
            <div
              className="upload-prompt"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon">📸</div>
              <div className="upload-text">Click to select image or drag & drop</div>
              <div className="upload-hint">Supported formats: JPG, PNG, GIF, WebP (Max 5MB)</div>
            </div>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className={`message ${message.type}`}>
            {message.type === 'success' ? '✓' : '⚠'} {message.text}
          </div>
        )}

        {/* Upload Button */}
        {preview && (
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={loading}
            style={{ width: '100%', marginTop: 'var(--spacing-lg)' }}
          >
            {loading ? 'Uploading...' : 'Upload Proof'}
          </button>
        )}
      </div>

      <style jsx>{`
        .payment-form {
          margin-top: var(--spacing-lg);
        }

        .card-header p {
          margin: 0;
          font-size: 0.9rem;
        }

        .upload-area {
          margin-bottom: var(--spacing-lg);
        }

        .upload-prompt {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          padding: var(--spacing-xl);
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-normal);
          background: var(--bg-surface);
        }

        .upload-prompt:hover {
          background: var(--bg-hover);
          border-color: var(--text-accent);
        }

        .upload-icon {
          font-size: 2.5rem;
        }

        .upload-text {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .upload-hint {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .preview-container {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          align-items: center;
        }

        .preview-image {
          max-width: 100%;
          max-height: 300px;
          border-radius: var(--radius-lg);
          border: 2px solid var(--border-color);
        }

        .message {
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          margin-top: var(--spacing-md);
        }

        .message.success {
          background: rgba(74, 222, 128, 0.1);
          color: var(--status-success);
          border: 1px solid var(--status-success);
        }

        .message.error {
          background: rgba(248, 113, 113, 0.1);
          color: var(--status-failed);
          border: 1px solid var(--status-failed);
        }
      `}</style>
    </div>
  )
}

export default PaymentForm
