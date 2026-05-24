import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/qris-display.css'

function QRISDisplay({ amount, registrationId, onClose }) {
  const [qrCode, setQrCode] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFullScreen, setShowFullScreen] = useState(false)

  useEffect(() => {
    generateQRIS()
  }, [amount, registrationId])

  const generateQRIS = async () => {
    try {
      setLoading(true)
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      const response = await axios.post(`${apiUrl}/api/qris/generate`, {
        amount: parseInt(amount),
        registrationId: registrationId || Date.now()
      })

      setQrCode(response.data.qrCode)
      setError(null)
    } catch (err) {
      console.error('QRIS generation failed:', err)
      setError('Failed to generate QRIS code')
    } finally {
      setLoading(false)
    }
  }

  const downloadQRIS = () => {
    if (!qrCode) return
    
    const link = document.createElement('a')
    link.href = qrCode
    link.download = `QRIS_${registrationId}_${amount}K.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="qris-display-wrapper">
      {/* Modal Overlay */}
      {showFullScreen && (
        <div className="qris-fullscreen-modal" onClick={() => setShowFullScreen(false)}>
          <div className="qris-fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <button className="qris-close-btn" onClick={() => setShowFullScreen(false)}>✕</button>
            
            {loading ? (
              <div className="qris-loading">Loading QRIS...</div>
            ) : error ? (
              <div className="qris-error">{error}</div>
            ) : qrCode ? (
              <div className="qris-fullscreen-qr">
                <img src={qrCode} alt="QRIS Code" className="qris-image-fullscreen" />
                <div className="qris-fullscreen-info">
                  <p><strong>Amount:</strong> {amount}K</p>
                  <p><strong>Registration ID:</strong> #{registrationId}</p>
                  <button className="btn btn-primary" onClick={downloadQRIS}>
                    ⬇️ Download QR Code
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Main QRIS Display */}
      <div className="qris-display-card">
        <div className="qris-header">
          <h3>📱 Scan to Pay</h3>
          <p className="qris-amount">Amount: <span className="highlight">{amount}K</span></p>
        </div>

        <div className="qris-container">
          {loading ? (
            <div className="qris-loading-spinner">
              <div className="spinner"></div>
              <p>Generating QRIS Code...</p>
            </div>
          ) : error ? (
            <div className="qris-error-message">
              <p>❌ {error}</p>
              <button className="btn btn-secondary" onClick={generateQRIS}>
                Retry
              </button>
            </div>
          ) : qrCode ? (
            <div className="qris-content">
              <div className="qris-image-wrapper">
                <img 
                  src={qrCode} 
                  alt="QRIS Code" 
                  className="qris-image"
                  onClick={() => setShowFullScreen(true)}
                />
                <p className="qris-hint">Click to view larger</p>
              </div>

              <div className="qris-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={() => setShowFullScreen(true)}
                >
                  👁️ View Full Size
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={downloadQRIS}
                >
                  ⬇️ Download
                </button>
              </div>

              <div className="qris-instructions">
                <h4>Instructions:</h4>
                <ol>
                  <li>Open your mobile banking app</li>
                  <li>Select "Scan QR Code"</li>
                  <li>Scan the code above</li>
                  <li>Confirm payment of <strong>{amount}K</strong></li>
                  <li>Take a screenshot and upload as proof</li>
                </ol>
              </div>
            </div>
          ) : null}
        </div>

        {!loading && !error && (
          <div className="qris-footer">
            <p>💡 Having trouble? Contact admin for manual payment instructions.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default QRISDisplay
