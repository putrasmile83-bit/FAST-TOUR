/**
 * FAST TOUR - Tournament Payment Backend
 * 
 * Architecture: Render/Railway Compatible Express.js Backend
 * Purpose: Manage team registrations, QRIS/DANA payment processing,
 *          real-time payment verification, and admin dashboard
 * 
 * Database: SQLite (dev) / PostgreSQL (production)
 * Deployment: Render.com or Railway.app
 * 
 * Key Features:
 * - Order ID generation (TRN-XXXXX)
 * - Unique nominal system for transfer verification
 * - 10-minute payment countdown timer
 * - Real-time payment status tracking
 * - Admin verification with success/failure notifications
 * - Telegram bot integration for instant notifications
 */

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

// Import services
const paymentService = require('./services/paymentService')
const TelegramBotService = require('./services/telegramService')

// ============================================
// APPLICATION CONFIGURATION
// ============================================

const app = express()
const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'
const ADMIN_PIN = process.env.ADMIN_PIN || 'FT001'

console.log(`
╔════════════════════════════════════════════╗
║ FAST TOUR - BACKEND INITIALIZATION        ║
╠════════════════════════════════════════════╣
║ Environment: ${NODE_ENV.padEnd(29)}║
║ Port: ${PORT.toString().padEnd(35)}║
║ Admin PIN: ${(ADMIN_PIN === 'FT001' ? 'Default (FT001)' : 'Custom').padEnd(26)}║
╚════════════════════════════════════════════╝
`)

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`${timestamp} ${req.method} ${req.path}`)
  next()
})

// ============================================
// DATABASE SETUP
// ============================================

const dataDir = path.join(__dirname, '../data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const DB_PATH = path.join(dataDir, 'tournament.db')
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err.message)
  } else {
    console.log(`✓ Database connected: ${DB_PATH}`)
  }
})

db.run('PRAGMA foreign_keys = ON')

// Database helper functions
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err)
      else resolve({ id: this.lastID, changes: this.changes })
    })
  })
}

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err)
      else resolve(row)
    })
  })
}

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows || [])
    })
  })
}

// Initialize database schema
const initializeDatabase = async () => {
  try {
    // Registrations table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS registrations (
        id TEXT PRIMARY KEY,
        teamName TEXT NOT NULL,
        playerCount INTEGER NOT NULL,
        fee INTEGER NOT NULL,
        status TEXT DEFAULT 'active',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Payments table (NEW - Core payment system)
    await dbRun(`
      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        registrationId TEXT NOT NULL,
        orderId TEXT NOT NULL UNIQUE,
        paymentMethod TEXT NOT NULL,
        baseAmount INTEGER NOT NULL,
        uniqueNominal INTEGER NOT NULL,
        totalAmount INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        proofImage TEXT,
        verifiedBy TEXT,
        expiresAt DATETIME NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        verifiedAt DATETIME,
        FOREIGN KEY (registrationId) REFERENCES registrations(id)
      )
    `)

    // Admin sessions table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS adminSessions (
        telegramId TEXT PRIMARY KEY,
        authenticated INTEGER DEFAULT 0,
        lastActivity DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('✓ Database schema initialized')
  } catch (error) {
    console.error('❌ Database initialization error:', error)
  }
}

initializeDatabase()

// ============================================
// TELEGRAM BOT INITIALIZATION
// ============================================

const telegramService = new TelegramBotService(process.env.TELEGRAM_BOT_TOKEN)
if (process.env.TELEGRAM_BOT_TOKEN) {
  telegramService.initialize()
} else {
  console.warn('⚠️ Telegram bot token not configured, skipping bot initialization')
}

// ============================================
// API ENDPOINTS - Health Check
// ============================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FAST TOUR Backend',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    database: 'connected',
    telegramBot: telegramService.isReady() ? 'active' : 'inactive'
  })
})

// ============================================
// API ENDPOINTS - Registrations
// ============================================

// Create registration
app.post('/api/registrations', async (req, res) => {
  try {
    const { teamName, playerCount, fee } = req.body

    if (!teamName || !playerCount || !fee) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const registrationId = uuidv4()
    await dbRun(
      'INSERT INTO registrations (id, teamName, playerCount, fee) VALUES (?, ?, ?, ?)',
      [registrationId, teamName, playerCount, fee]
    )

    res.status(201).json({
      id: registrationId,
      message: 'Registration successful',
      teamName,
      playerCount,
      fee
    })
  } catch (error) {
    console.error('❌ Registration error:', error)
    res.status(500).json({ error: 'Failed to create registration' })
  }
})

// Get all registrations
app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await dbAll('SELECT * FROM registrations ORDER BY createdAt DESC')
    res.json(registrations)
  } catch (error) {
    console.error('❌ Fetch registrations error:', error)
    res.status(500).json({ error: 'Failed to fetch registrations' })
  }
})

// Get single registration
app.get('/api/registrations/:id', async (req, res) => {
  try {
    const registration = await dbGet('SELECT * FROM registrations WHERE id = ?', [req.params.id])
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' })
    }
    res.json(registration)
  } catch (error) {
    console.error('❌ Fetch registration error:', error)
    res.status(500).json({ error: 'Failed to fetch registration' })
  }
})

// ============================================
// API ENDPOINTS - Payment System
// ============================================

/**
 * Create payment request
 * Generates: Order ID, unique nominal, expiry time
 * Response includes countdown timer data
 */
app.post('/api/payments/create', async (req, res) => {
  try {
    const { registrationId, paymentMethod, baseAmount } = req.body

    if (!registrationId || !paymentMethod || !baseAmount) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Verify registration exists
    const registration = await dbGet('SELECT * FROM registrations WHERE id = ?', [registrationId])
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' })
    }

    // Generate payment details
    const paymentId = uuidv4()
    const orderId = paymentService.generateOrderId()
    const uniqueNominal = paymentService.generateUniqueNominal()
    const totalAmount = baseAmount + uniqueNominal
    const expiresAt = paymentService.calculateExpiryTime()

    await dbRun(
      `INSERT INTO payments (id, registrationId, orderId, paymentMethod, baseAmount, uniqueNominal, totalAmount, status, expiresAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [paymentId, registrationId, orderId, paymentMethod, baseAmount, uniqueNominal, totalAmount, expiresAt]
    )

    const countdown = paymentService.calculateCountdown(expiresAt)

    res.status(201).json({
      paymentId,
      orderId,
      baseAmount,
      uniqueNominal,
      totalAmount,
      countdown: countdown.formatted,
      expiresAt,
      paymentMethod,
      message: 'Payment request created successfully'
    })
  } catch (error) {
    console.error('❌ Create payment error:', error)
    res.status(500).json({ error: 'Failed to create payment' })
  }
})

/**
 * Get payment details with real-time countdown
 */
app.get('/api/payments/:paymentId', async (req, res) => {
  try {
    const payment = await dbGet('SELECT * FROM payments WHERE id = ?', [req.params.paymentId])
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' })
    }

    const status = paymentService.getPaymentStatus(payment)
    res.json(status)
  } catch (error) {
    console.error('❌ Get payment error:', error)
    res.status(500).json({ error: 'Failed to get payment' })
  }
})

/**
 * Upload payment proof
 * Validates image and updates status to 'checking'
 */
app.post('/api/payments/:paymentId/upload-proof', async (req, res) => {
  try {
    const { paymentId } = req.params
    const { proofImage } = req.body

    // Validate proof image
    const validation = paymentService.validatePaymentProof(proofImage)
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error })
    }

    // Get payment details
    const payment = await dbGet('SELECT * FROM payments WHERE id = ?', [paymentId])
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' })
    }

    // Check if payment is expired
    if (paymentService.isPaymentExpired(payment.expiresAt)) {
      return res.status(400).json({ error: 'Payment has expired' })
    }

    // Update payment with proof
    await dbRun(
      'UPDATE payments SET proofImage = ?, status = ? WHERE id = ?',
      [proofImage, 'checking', paymentId]
    )

    res.json({
      message: 'Payment proof uploaded successfully',
      status: 'checking',
      nextStep: 'awaiting_admin_verification'
    })
  } catch (error) {
    console.error('❌ Upload proof error:', error)
    res.status(500).json({ error: 'Failed to upload proof' })
  }
})

/**
 * Get payment status (for real-time polling)
 */
app.get('/api/payments/:paymentId/status', async (req, res) => {
  try {
    const payment = await dbGet('SELECT * FROM payments WHERE id = ?', [req.params.paymentId])
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' })
    }

    const countdown = paymentService.calculateCountdown(payment.expiresAt)
    res.json({
      paymentId: payment.id,
      orderId: payment.orderId,
      status: paymentService.isPaymentExpired(payment.expiresAt) && payment.status === 'pending' ? 'expired' : payment.status,
      countdown: countdown.formatted,
      totalAmount: paymentService.formatRupiah(payment.totalAmount),
      verifiedAt: payment.verifiedAt
    })
  } catch (error) {
    console.error('❌ Get status error:', error)
    res.status(500).json({ error: 'Failed to get payment status' })
  }
})

// ============================================
// API ENDPOINTS - Admin Verification
// ============================================

/**
 * Admin verify payment (success)
 * Requires admin PIN
 * Triggers: Success notification + sound
 */
app.post('/api/admin/verify-payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params
    const adminPin = req.headers['x-admin-pin']

    if (!adminPin || adminPin !== ADMIN_PIN) {
      return res.status(401).json({ error: 'Invalid admin PIN' })
    }

    const payment = await dbGet('SELECT * FROM payments WHERE id = ?', [paymentId])
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' })
    }

    // Update payment to success
    await dbRun(
      'UPDATE payments SET status = ?, verifiedAt = CURRENT_TIMESTAMP, verifiedBy = ? WHERE id = ?',
      ['success', 'admin', paymentId]
    )

    // Update registration status
    await dbRun(
      'UPDATE registrations SET status = ? WHERE id = ?',
      ['verified', payment.registrationId]
    )

    res.json({
      message: 'Payment verified successfully',
      status: 'success',
      sound: 'success',
      orderId: payment.orderId
    })
  } catch (error) {
    console.error('❌ Verify payment error:', error)
    res.status(500).json({ error: 'Failed to verify payment' })
  }
})

/**
 * Admin reject payment (failed)
 * Requires admin PIN
 * Triggers: Failure notification + sound
 */
app.post('/api/admin/reject-payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params
    const { reason } = req.body
    const adminPin = req.headers['x-admin-pin']

    if (!adminPin || adminPin !== ADMIN_PIN) {
      return res.status(401).json({ error: 'Invalid admin PIN' })
    }

    const payment = await dbGet('SELECT * FROM payments WHERE id = ?', [paymentId])
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' })
    }

    // Update payment to failed
    await dbRun(
      'UPDATE payments SET status = ?, verifiedAt = CURRENT_TIMESTAMP, verifiedBy = ? WHERE id = ?',
      ['failed', 'admin', paymentId]
    )

    res.json({
      message: 'Payment rejected',
      status: 'failed',
      sound: 'failed',
      orderId: payment.orderId,
      reason
    })
  } catch (error) {
    console.error('❌ Reject payment error:', error)
    res.status(500).json({ error: 'Failed to reject payment' })
  }
})

/**
 * Get all pending payments for admin dashboard
 */
app.get('/api/admin/payments', async (req, res) => {
  try {
    const adminPin = req.headers['x-admin-pin']
    if (!adminPin || adminPin !== ADMIN_PIN) {
      return res.status(401).json({ error: 'Invalid admin PIN' })
    }

    const payments = await dbAll(`
      SELECT p.*, r.teamName, r.playerCount, r.fee 
      FROM payments p
      JOIN registrations r ON p.registrationId = r.id
      ORDER BY p.createdAt DESC
    `)

    res.json(payments.map(p => ({
      ...p,
      totalAmount: paymentService.formatRupiah(p.totalAmount),
      uniqueNominal: paymentService.formatRupiah(p.uniqueNominal)
    })))
  } catch (error) {
    console.error('❌ Get admin payments error:', error)
    res.status(500).json({ error: 'Failed to fetch payments' })
  }
})

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : undefined
  })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// ============================================
// SERVER STARTUP
// ============================================

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║       FAST TOUR BACKEND RUNNING            ║
╠════════════════════════════════════════════╣
║  URL: http://localhost:${PORT.toString().padEnd(28)}║
║  Status: ✓ Ready for requests             ║
║  Database: ✓ Connected                    ║
║  Telegram Bot: ${telegramService.isReady() ? '✓ Active              ' : '✗ Inactive            '}║
╚════════════════════════════════════════════╝
    `)
  })
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...')
  telegramService.stop()
  process.exit(0)
})

startServer()

module.exports = app
