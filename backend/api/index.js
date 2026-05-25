require('dotenv').config()
const express = require('express')
const cors = require('cors')
const TelegramBot = require('node-telegram-bot-api')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs')

// Initialize Express
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// ============================================
// SQLITE DATABASE SETUP
// ============================================

const dataDir = path.join(__dirname, '../data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const DB_PATH = path.join(dataDir, 'tournament.db')
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Database error:', err.message)
  } else {
    console.log(`✓ SQLite database connected: ${DB_PATH}`)
  }
})

db.run('PRAGMA foreign_keys = ON')

// Initialize database tables
const initializeDatabase = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY,
      teamName TEXT NOT NULL,
      playerCount INTEGER NOT NULL,
      fee INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      paymentStatus TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      verifiedAt DATETIME,
      verifiedVia TEXT,
      proofImage TEXT
    )
  `)
}

initializeDatabase()

// ============================================
// TELEGRAM BOT SETUP
// ============================================

let botInitialized = false
let bot = null
const adminLoginSession = {}

const initializeBot = () => {
  if (botInitialized) {
    console.log('⚠️ Bot already initialized, skipping...')
    return
  }

  try {
    bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: { interval: 500 } })
    botInitialized = true
    console.log('✓ Telegram Bot initialized and polling')

    // Bot error handler
    bot.on('polling_error', (error) => {
      if (error.code === 'ETELEGRAM' && error.message.includes('conflict')) {
        console.warn('⚠️ Telegram bot conflict detected!')
        console.log('Stopping polling and restarting in 3 seconds...')
        bot.stopPolling()
        setTimeout(() => {
          console.log('Restarting bot polling...')
          bot.startPolling({ restart: true })
          console.log('✓ Bot polling restarted successfully')
        }, 3000)
      } else {
        console.error('❌ Telegram bot polling error:', error.message)
      }
    })

    // Bot command: /start
    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id
      bot.sendMessage(
        chatId,
        `📋 Welcome to FAST TOUR Payment Verification Bot!\n\n` +
        `Choose an action:\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📸 /verif    - Upload payment proof\n` +
        `✅ /status   - Check payment status\n` +
        `❓ /help     - Get help\n` +
        `🔐 /admin    - Admin login\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `Send any of these commands to get started!`,
        { parse_mode: 'Markdown' }
      )
    })

    // Bot command: /admin
    bot.onText(/\/admin/, (msg) => {
      const chatId = msg.chat.id
      adminLoginSession[chatId] = { awaiting_pin: true }
      bot.sendMessage(chatId, 'Enter your admin PIN:')
    })

    // Bot message handler
    bot.on('message', (msg) => {
      const chatId = msg.chat.id
      const text = msg.text

      if (adminLoginSession[chatId]?.awaiting_pin) {
        if (text === (process.env.ADMIN_PIN || 'FT001')) {
          adminLoginSession[chatId] = { authenticated: true }
          bot.sendMessage(chatId, '✅ Login successful!\n\nYou can now use:\n/list - Show registrations\n/stats - Show statistics\n/logout - Logout')
        } else {
          bot.sendMessage(chatId, '❌ Invalid PIN')
        }
        return
      }

      if (adminLoginSession[chatId]?.authenticated) {
        if (text === '/list') {
          // Show recent registrations
          db.all(
            'SELECT * FROM registrations ORDER BY createdAt DESC LIMIT 10',
            [],
            (err, rows) => {
              if (err) {
                bot.sendMessage(chatId, '❌ Error fetching registrations')
                return
              }
              let message = '📋 Recent Registrations:\n\n'
              if (rows.length === 0) {
                message += 'No registrations yet.'
              } else {
                rows.forEach((reg, i) => {
                  message += `${i + 1}. ${reg.teamName}\n   Status: ${reg.paymentStatus}\n\n`
                })
              }
              bot.sendMessage(chatId, message)
            }
          )
          return
        }

        if (text === '/stats') {
          // Show statistics
          db.all('SELECT paymentStatus, COUNT(*) as count FROM registrations GROUP BY paymentStatus', [], (err, rows) => {
            if (err) {
              bot.sendMessage(chatId, '❌ Error fetching stats')
              return
            }
            let message = '📊 Payment Statistics:\n\n'
            rows.forEach((row) => {
              message += `${row.paymentStatus}: ${row.count}\n`
            })
            bot.sendMessage(chatId, message)
          })
          return
        }

        if (text === '/logout') {
          delete adminLoginSession[chatId]
          bot.sendMessage(chatId, '👋 Logged out')
          return
        }
      }

      // Default responses for non-admin users
      if (text === '/verif') {
        bot.sendMessage(chatId, '📸 Please send your payment proof (screenshot or photo)')
      } else if (text === '/status') {
        bot.sendMessage(chatId, '✅ Send your team name to check payment status')
      } else if (text === '/help') {
        bot.sendMessage(
          chatId,
          '❓ Need help?\n\n' +
          '/start - Show menu\n' +
          '/verif - Upload payment proof\n' +
          '/status - Check status\n' +
          '/admin - Admin login'
        )
      }
    })

    // Photo handler
    bot.on('photo', (msg) => {
      const chatId = msg.chat.id
      if (adminLoginSession[chatId]?.authenticated) {
        bot.sendMessage(chatId, '✅ Photo received and saved')
      } else {
        bot.sendMessage(chatId, '📸 Photo received. Our team will review it shortly!')
      }
    })

    console.log('✓ Bot is ready to receive messages')
  } catch (error) {
    console.error('❌ Error initializing bot:', error.message)
    botInitialized = false
  }
}

// Initialize bot
initializeBot()

// ============================================
// API ROUTES
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' })
})

// Register a team
app.post('/api/register', (req, res) => {
  const { teamName, playerCount, fee } = req.body

  if (!teamName || !playerCount || !fee) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  db.run(
    'INSERT INTO registrations (teamName, playerCount, fee) VALUES (?, ?, ?)',
    [teamName, playerCount, fee],
    function (err) {
      if (err) {
        console.error('❌ Database error:', err.message)
        return res.status(500).json({ error: 'Failed to register team' })
      }
      res.status(201).json({ id: this.lastID, message: 'Registration successful' })
    }
  )
})

// Get all registrations
app.get('/api/registrations', (req, res) => {
  db.all('SELECT * FROM registrations ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) {
      console.error('❌ Database error:', err.message)
      return res.status(500).json({ error: 'Failed to fetch registrations' })
    }
    res.json(rows)
  })
})

// Get registration by ID
app.get('/api/registrations/:id', (req, res) => {
  const { id } = req.params
  db.get('SELECT * FROM registrations WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('❌ Database error:', err.message)
      return res.status(500).json({ error: 'Failed to fetch registration' })
    }
    if (!row) {
      return res.status(404).json({ error: 'Registration not found' })
    }
    res.json(row)
  })
})

// Update payment status
app.put('/api/registrations/:id/payment', (req, res) => {
  const { id } = req.params
  const { status, proofImage, verifiedVia } = req.body

  if (!status) {
    return res.status(400).json({ error: 'Status is required' })
  }

  db.run(
    'UPDATE registrations SET paymentStatus = ?, proofImage = ?, verifiedVia = ?, verifiedAt = CURRENT_TIMESTAMP WHERE id = ?',
    [status, proofImage, verifiedVia, id],
    (err) => {
      if (err) {
        console.error('❌ Database error:', err.message)
        return res.status(500).json({ error: 'Failed to update payment status' })
      }
      res.json({ message: 'Payment status updated' })
    }
  )
})

// ============================================
// EXPORT FOR VERCEL SERVERLESS
// ============================================

module.exports = app
