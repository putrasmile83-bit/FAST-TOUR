import React, { useState } from 'react'
import '../styles/qris-display.css'

function QRISDisplay({ amount, registrationId, onClose }) {
  const [showFullScreen, setShowFullScreen] = useState(false)
  
  // Use the placeholder image from public assets
  const qrisImagePath = '/assets/qris-placeholder.png'

  const downloadQRIS = () => {
    const link = document.createElement('a')
    link.href = qrisImagePath
    link.download = `QRIS_${registrationId || 'payment'}_${amount || ''}K.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="qris-display-wrapper">
      {/* Full-Screen Modal */}
      {showFullScreen && (
        <div className="qris-fullscreen-modal" onClick={() => setShowFullScreen(false)}>
          <div className="qris-fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <button className="qris-close-btn" onClick={() => setShowFullScreen(false)}>✕</button>
            <img src={qrisImagePath} alt="QRIS Payment Code" className="qris-image-fullscreen" />
          </div>
        </div>
      )}

      {/* Main QRIS Display Card */}
      <div className="qris-display-card">
        <div className="qris-header">
          <h3>📱 Scan to Pay</h3>
          <p className="qris-amount">Amount: <span className="highlight">{amount}K</span></p>
        </div>

        <div className="qris-container">
          <div className="qris-image-wrapper">
            <img 
              src={qrisImagePath} 
              alt="QRIS Payment Code" 
              className="qris-image"
              onClick={() => setShowFullScreen(true)}
              title="Click to view in full screen"
            />
            <p className="qris-hint">👆 Click to view larger</p>
          </div>

          <div className="qris-actions">
            <button 
              className="btn btn-primary" 
              onClick={() => setShowFullScreen(true)}
            >
              👁️ View Full Screen
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={downloadQRIS}
            >
              ⬇️ Download
            </button>
          </div>

          <div className="qris-instructions">
            <h4>📋 How to Pay:</h4>
            <ol>
              <li>Open your bank's mobile app</li>
              <li>Select <strong>"Scan QR Code"</strong></li>
              <li>Scan the QRIS code above</li>
              <li>Confirm payment of <strong>{amount}K IDR</strong></li>
              <li>Take screenshot as proof of payment</li>
            </ol>
          </div>
        </div>

        <div className="qris-footer">
          <p>💡 <strong>Tip:</strong> For best results, hold your phone 15-20cm from the QR code</p>
        </div>
      </div>
    </div>
  )
}

export default QRISDisplay
