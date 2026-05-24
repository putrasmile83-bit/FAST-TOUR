import React from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { toast } from 'react-toastify'
import '../styles/admin-contact.css'

function AdminContactPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { adminInfo } = useApp()
  const teamName = searchParams.get('team')

  const handleWhatsAppRedirect = (phone) => {
    const message = `Hello, I am interested in FAST TOUR tournament.`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${phone.replace('+', '')}?text=${encodedMessage}`, '_blank')
    toast.success('Opening WhatsApp...')
  }

  const handleJoinGroup = (type) => {
    if (type === 'whatsapp') {
      toast.info('WhatsApp group link opened')
      window.open('https://chat.whatsapp.com/Ga28nKnvXlyDqX9QjbTzeY', '_blank')
    } else if (type === 'channel') {
      toast.info('Telegram channel link opened')
      window.open('https://t.me/+DeFlVW_cGeUwMWY1', '_blank')
    }
  }

  return (
    <div className="admin-contact-page">
      <div className="admin-contact-container">
        <div className="contact-header">
          <h1 className="pixel-font">Admin Contact</h1>
          <p>Get in touch with our tournament admins</p>
        </div>

        <div className="contact-grid">
          {/* ADMIN 1 */}
          <div className="contact-card card animate-slide">
            <div className="admin-badge">Admin 1</div>
            <h2>Tournament Manager</h2>
            <div className="admin-details">
              <p className="admin-phone">{adminInfo.phone1}</p>
              <button
                className="btn btn-primary"
                onClick={() => handleWhatsAppRedirect(adminInfo.phone1)}
              >
                <FaWhatsapp style={{ marginRight: '8px' }} />
                Chat on WhatsApp
              </button>
            </div>
          </div>

          {/* ADMIN 2 */}
          <div className="contact-card card animate-slide">
            <div className="admin-badge admin-badge-2">Admin 2</div>
            <h2>Technical Support</h2>
            <div className="admin-details">
              <p className="admin-phone">{adminInfo.phone2}</p>
              <button
                className="btn btn-primary"
                onClick={() => handleWhatsAppRedirect(adminInfo.phone2)}
              >
                <FaWhatsapp style={{ marginRight: '8px' }} />
                Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* JOIN COMMUNITY */}
        <div className="community-section card">
          <h2>Join Our Community</h2>
          <p>Connect with other players and stay updated on tournament news</p>
          <div className="community-grid">
            <button
              className="btn btn-secondary"
              onClick={() => handleJoinGroup('whatsapp')}
            >
              🔗 Join WhatsApp Group
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleJoinGroup('channel')}
            >
              📱 Join Telegram Channel
            </button>
          </div>
        </div>

        {/* PAYMENT CONFIRMATION */}
        <div className="payment-confirmation card">
          <h2>Payment Confirmation Status</h2>
          <p className="confirmation-text">
            If you have completed the payment, our admins will verify it within 5-10 minutes.
          </p>
          <div className="status-box">
            <div className="status-indicator pending">⏳</div>
            <p>Status: <strong>Awaiting Verification</strong></p>
          </div>
          <p className="confirmation-hint">
            You will receive a WhatsApp message once payment is confirmed.
          </p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="quick-actions">
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
          <button className="btn" onClick={() => navigate('/tournament-rules')}>
            Tournament Rules
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminContactPage
