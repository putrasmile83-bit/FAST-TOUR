import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import '../styles/landing.css'

function LandingPage() {
  const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="landing-page">
      <motion.div
        className="landing-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* HERO SECTION */}
        <motion.div className="hero-section" variants={itemVariants}>
          <div className="hero-content">
            <h1 className="pixel-font hero-title">FAST TOUR</h1>
            <p className="hero-subtitle">Free Fire Clash Squad Tournament</p>
            <div className="hero-description">
              <p>Join the ultimate Free Fire tournament experience!</p>
              <p>Compete with squads, win prizes, and prove your skills.</p>
            </div>
          </div>
          <div className="hero-visual">
            <div className="pixel-box animate-bounce">
              <span className="pixel-icon">⚔️</span>
            </div>
          </div>
        </motion.div>

        {/* TOURNAMENT INFO */}
        <motion.div className="tournament-info" variants={itemVariants}>
          <div className="info-card">
            <h3>Tournament Details</h3>
            <ul>
              <li>Squad-based competition</li>
              <li>Multiple match tiers</li>
              <li>Fair play system</li>
              <li>Instant verification</li>
              <li>Prize pool available</li>
            </ul>
          </div>
        </motion.div>

        {/* CTA BUTTONS */}
        <motion.div className="cta-section" variants={itemVariants}>
          <button className="btn btn-primary" onClick={() => navigate('/registration')}>
            Join Tournament
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/tournament-rules')}>
            View Rules
          </button>
          <button className="btn" onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
        </motion.div>

        {/* FEATURES */}
        <motion.div className="features-grid" variants={itemVariants}>
          <motion.div className="feature-card card" whileHover={{ y: -5 }}>
            <div className="feature-icon">🎮</div>
            <h4>Easy Registration</h4>
            <p>Simple 3-step registration process</p>
          </motion.div>
          <motion.div className="feature-card card" whileHover={{ y: -5 }}>
            <div className="feature-icon">💳</div>
            <h4>Secure Payment</h4>
            <p>Multiple payment options available</p>
          </motion.div>
          <motion.div className="feature-card card" whileHover={{ y: -5 }}>
            <div className="feature-icon">✅</div>
            <h4>Instant Verification</h4>
            <p>Real-time payment confirmation</p>
          </motion.div>
          <motion.div className="feature-card card" whileHover={{ y: -5 }}>
            <div className="feature-icon">🏆</div>
            <h4>Fair Gameplay</h4>
            <p>Strict rules against cheating</p>
          </motion.div>
        </motion.div>

        {/* FOOTER */}
        <motion.footer className="landing-footer" variants={itemVariants}>
          <p>&copy; 2024 FAST TOUR. All rights reserved.</p>
        </motion.footer>
      </motion.div>
    </div>
  )
}

export default LandingPage
