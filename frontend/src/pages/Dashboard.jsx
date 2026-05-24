import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { toast } from 'react-toastify'
import '../styles/dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const { registrations, paymentStatus } = useApp()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRegistrations = registrations.filter(reg =>
    reg.teamName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPaymentStatusColor = (status) => {
    return status === 'verified' ? 'status-verified' : 'status-pending'
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* HEADER */}
        <div className="dashboard-header">
          <h1 className="pixel-font">Tournament Dashboard</h1>
          <div className="header-actions">
            <input
              type="text"
              placeholder="Search team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="btn btn-primary" onClick={() => navigate('/registration')}>
              New Registration
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="dashboard-stats">
          <div className="stat-card card">
            <div className="stat-label">Total Teams</div>
            <div className="stat-value">{registrations.length}</div>
          </div>
          <div className="stat-card card">
            <div className="stat-label">Verified Teams</div>
            <div className="stat-value">
              {Object.values(paymentStatus).filter(s => s === 'verified').length}
            </div>
          </div>
          <div className="stat-card card">
            <div className="stat-label">Pending Teams</div>
            <div className="stat-value">
              {Object.values(paymentStatus).filter(s => s === 'pending').length}
            </div>
          </div>
          <div className="stat-card card">
            <div className="stat-label">Total Players</div>
            <div className="stat-value">
              {registrations.reduce((sum, reg) => sum + parseInt(reg.playerCount || 0), 0)}
            </div>
          </div>
        </div>

        {/* REGISTRATIONS LIST */}
        <div className="registrations-table card">
          <h2>Recent Registrations</h2>
          {filteredRegistrations.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>Players</th>
                  <th>Fee</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map(reg => (
                  <tr key={reg.id}>
                    <td className="team-name">{reg.teamName}</td>
                    <td>{reg.playerCount}</td>
                    <td>{reg.fee}K</td>
                    <td>
                      <span className={`badge ${getPaymentStatusColor(paymentStatus[reg.id] || 'pending')}`}>
                        {paymentStatus[reg.id] === 'verified' ? '✓ Verified' : 'Pending'}
                      </span>
                    </td>
                    <td>{new Date(reg.id).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-small"
                        onClick={() => navigate(`/admin-contact?team=${reg.teamName}`)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No registrations yet. Start by joining the tournament!</p>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className="quick-actions card">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <button className="btn btn-secondary" onClick={() => navigate('/tournament-rules')}>
              View Rules
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/admin-contact')}>
              Contact Admin
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/registration')}>
              New Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
