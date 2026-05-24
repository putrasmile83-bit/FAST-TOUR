import React from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import '../styles/rules.css'

function TournamentRulesPage() {
  const navigate = useNavigate()
  const { rules } = useApp()

  const defaultRules = [
    {
      title: 'Match Rules',
      content: [
        'Each match consists of 4 squads competing in a battle royale',
        'Winning condition: Last squad standing',
        'Time limit: 30 minutes per match',
        'Zone auto-closes after time limit'
      ]
    },
    {
      title: 'Team Requirements',
      content: [
        'Minimum 1 player, maximum 4 players per team',
        'All players must have valid Free Fire accounts',
        'Account level must be 15+',
        'Team name must be appropriate and not offensive'
      ]
    },
    {
      title: 'Penalties',
      content: [
        'DC (Disconnect) within first 5 minutes: Team eliminated',
        'Abusive language in chat: Warning (3 strikes = disqualification)',
        'Account sharing: Immediate disqualification',
        'Cheating/Hacking: Permanent ban from tournament'
      ]
    },
    {
      title: 'Registration Rules',
      content: [
        'Registration fee must be paid in full before match start',
        'No refund policy once tournament begins',
        'Team substitution only before tournament starts',
        'Late registration not allowed'
      ]
    },
    {
      title: 'Fair Play System',
      content: [
        'All players must play with original accounts',
        'Screen recording may be required for verification',
        'Suspicious activities will be investigated',
        'Admins have final decision on all disputes'
      ]
    }
  ]

  return (
    <div className="rules-page">
      <div className="rules-container">
        <div className="rules-header">
          <h1 className="pixel-font">Tournament Rules</h1>
          <p>Read and understand all rules before joining</p>
        </div>

        <div className="rules-content">
          {defaultRules.map((section, index) => (
            <div key={index} className="rule-section card animate-slide">
              <h2 className="rule-title">
                <span className="rule-number">{index + 1}</span>
                {section.title}
              </h2>
              <ul className="rule-list">
                {section.content.map((item, i) => (
                  <li key={i} className="rule-item">
                    <span className="rule-bullet">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* IMPORTANT NOTICE */}
        <div className="important-notice card">
          <h3>⚠️ Important Notice</h3>
          <p>
            By registering for this tournament, you acknowledge that you have read and understood all the above rules.
            Violation of any rule may result in disqualification and forfeiture of registration fees.
          </p>
          <p className="notice-highlight">
            Admins reserve the right to modify rules at any time with prior notice to all participants.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="rules-actions">
          <button className="btn btn-primary" onClick={() => navigate('/registration')}>
            Accept & Register
          </button>
          <button className="btn" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default TournamentRulesPage
