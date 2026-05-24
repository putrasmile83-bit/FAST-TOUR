import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import '../styles/admin-panel.css'

function AdminPanel() {
  const navigate = useNavigate()
  const { adminInfo, updateAdminInfo, rules, updateRules, registrations, updatePaymentStatus, paymentStatus } = useApp()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState(adminInfo)
  const [rulesFormData, setRulesFormData] = useState(rules)
  const [backendRegistrations, setBackendRegistrations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch registrations from backend on mount
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/registrations')
        setBackendRegistrations(response.data)
        
        // Sync payment status from backend
        response.data.forEach(reg => {
          if (reg.paymentStatus) {
            updatePaymentStatus(reg.id, reg.paymentStatus)
          }
        })
      } catch (error) {
        console.error('Failed to fetch registrations from backend:', error)
        toast.warning('Using local data (backend may be offline)')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRegistrations()
    // Refresh every 5 seconds to get real-time updates from Telegram bot
    const interval = setInterval(fetchRegistrations, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleAdminInfoChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRulesChange = (e) => {
    const { name, value } = e.target
    setRulesFormData(prev => ({ ...prev, [name]: value }))
  }

  const saveAdminInfo = () => {
    updateAdminInfo(formData)
    toast.success('Admin information updated')
    setEditMode(false)
  }

  const saveRules = () => {
    updateRules(rulesFormData)
    toast.success('Tournament rules updated')
  }

  const verifyPayment = async (registrationId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/registrations/${registrationId}/payment`,
        { status: 'verified' }
      )
      updatePaymentStatus(registrationId, 'verified')
      toast.success('✓ Payment verified!')
    } catch (error) {
      console.error('Error verifying payment:', error)
      toast.error('Failed to verify payment')
    }
  }

  const rejectPayment = async (registrationId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/registrations/${registrationId}/payment`,
        { status: 'rejected' }
      )
      updatePaymentStatus(registrationId, 'rejected')
      toast.error('Payment rejected')
    } catch (error) {
      console.error('Error rejecting payment:', error)
      toast.error('Failed to reject payment')
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-container">
        {/* HEADER */}
        <div className="admin-header">
          <h1 className="pixel-font">Admin Panel</h1>
          <p>Manage tournament settings and registrations</p>
          <button className="btn" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
        </div>

        {/* TABS */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`tab-btn ${activeTab === 'payment' ? 'active' : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            Payment Verification
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
          <button
            className={`tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            Rules
          </button>
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <div className="stats-grid">
              <div className="stat-box card">
                <h3>Total Registrations</h3>
                <p className="stat-number">{backendRegistrations.length}</p>
              </div>
              <div className="stat-box card">
                <h3>Verified Teams</h3>
                <p className="stat-number">{backendRegistrations.filter(r => r.paymentStatus === 'verified').length}</p>
              </div>
              <div className="stat-box card">
                <h3>Pending Payments</h3>
                <p className="stat-number">{backendRegistrations.filter(r => r.paymentStatus === 'pending').length}</p>
              </div>
              <div className="stat-box card">
                <h3>Total Players</h3>
                <p className="stat-number">{backendRegistrations.reduce((sum, r) => sum + parseInt(r.playerCount || 0), 0)}</p>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENT VERIFICATION TAB */}
        {activeTab === 'payment' && (
          <div className="tab-content">
            <div className="payment-verification card">
              <h2>Payment Verification</h2>
              {isLoading ? (
                <p>⏳ Loading payment data from backend...</p>
              ) : backendRegistrations.length > 0 ? (
                <table className="verification-table">
                  <thead>
                    <tr>
                      <th>Team Name</th>
                      <th>Registration ID</th>
                      <th>Fee</th>
                      <th>Status</th>
                      <th>Verified Via</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backendRegistrations.map(reg => (
                      <tr key={reg.id}>
                        <td>{reg.teamName}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>#{reg.id}</td>
                        <td>{reg.fee}K</td>
                        <td>
                          <span className={`badge ${reg.paymentStatus === 'verified' ? 'verified' : 'pending'}`}>
                            {reg.paymentStatus === 'verified' ? '✅ Verified' : '⏳ Pending'}
                          </span>
                        </td>
                        <td>{reg.verifiedVia === 'telegram' ? '📱 Telegram' : reg.verifiedVia === 'web' ? '🌐 Web' : '-'}</td>
                        <td>{new Date(reg.createdAt || reg.id).toLocaleDateString()}</td>
                        <td>
                          {reg.paymentStatus !== 'verified' && (
                            <>
                              <button
                                className="btn-small verify"
                                onClick={() => verifyPayment(reg.id)}
                              >
                                ✓ Verify
                              </button>
                              <button
                                className="btn-small reject"
                                onClick={() => rejectPayment(reg.id)}
                              >
                                ✗ Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No registrations yet. Students will appear here when they register!</p>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="tab-content">
            <div className="settings-form card">
              <h2>Admin Information Settings</h2>
              {editMode ? (
                <div className="form">
                  <div className="form-group">
                    <label>Admin Phone 1</label>
                    <input
                      type="text"
                      name="phone1"
                      value={formData.phone1}
                      onChange={handleAdminInfoChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Admin Phone 2</label>
                    <input
                      type="text"
                      name="phone2"
                      value={formData.phone2}
                      onChange={handleAdminInfoChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Bank Name</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleAdminInfoChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Bank Account</label>
                    <input
                      type="text"
                      name="bankAccount"
                      value={formData.bankAccount}
                      onChange={handleAdminInfoChange}
                    />
                  </div>
                  <div className="form-actions">
                    <button className="btn btn-primary" onClick={saveAdminInfo}>
                      Save Changes
                    </button>
                    <button className="btn" onClick={() => setEditMode(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="info-display">
                  <p><strong>Phone 1:</strong> {adminInfo.phone1}</p>
                  <p><strong>Phone 2:</strong> {adminInfo.phone2}</p>
                  <p><strong>Bank:</strong> {adminInfo.bankName}</p>
                  <p><strong>Account:</strong> {adminInfo.bankAccount}</p>
                  <button className="btn btn-secondary" onClick={() => setEditMode(true)}>
                    Edit Settings
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RULES TAB */}
        {activeTab === 'rules' && (
          <div className="tab-content">
            <div className="rules-form card">
              <h2>Tournament Rules Editor</h2>
              <div className="form">
                <div className="form-group">
                  <label>Rules Title</label>
                  <input
                    type="text"
                    name="title"
                    value={rulesFormData.title}
                    onChange={handleRulesChange}
                  />
                </div>
                <div className="form-group">
                  <label>Rules Content</label>
                  <textarea
                    name="content"
                    value={rulesFormData.content}
                    onChange={handleRulesChange}
                    rows="8"
                  />
                </div>
                <button className="btn btn-primary" onClick={saveRules}>
                  Save Rules
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
