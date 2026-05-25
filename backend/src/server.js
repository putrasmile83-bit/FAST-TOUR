require('dotenv').config()
const express = require('express')
const cors = require('cors')
const TelegramBot = require('node-telegram-bot-api')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs')

// Initialize Express
const app = express()
const PORT = process.env.PORT || 5000

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

  db.run(`
    CREATE TABLE IF NOT EXISTS telegramUsers (
      telegramUserId INTEGER PRIMARY KEY,
      registrationId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  console.log('✓ SQLite tables initialized')
}

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

// Initialize database on startup
initializeDatabase()

// ============================================
// TELEGRAM BOT SETUP - FIXED FOR CONFLICTS
// ============================================

const botToken = process.env.TELEGRAM_BOT_TOKEN || '8278697371:AAEXIhx_lXQDLv4uWoIZagZat-Tuxk0x5_Y'
let bot = null
let botInitialized = false
let adminLoginSession = {} // Track admin login sessions per user

// Initialize bot with proper error handling and conflict prevention
if (botToken && botToken !== 'your_token_here') {
  try {
    bot = new TelegramBot(botToken, { polling: { interval: 500, autoStart: true } })
    botInitialized = true
    
    console.log('✓ Telegram Bot initialized and polling')
    console.log('✓ Bot is ready to receive messages')
  // ========== ADMIN COMMANDS ==========
  
  // /admin - Admin Login
  bot.onText(/\/admin/, (msg) => {
    const chatId = msg.chat.id
    const userId = msg.from.id
    
    const loginMsg = `
🔐 ADMIN LOGIN

Enter your admin PIN to access admin functions:
    `.trim()
    
    bot.sendMessage(chatId, loginMsg)
    adminLoginSession[userId] = { state: 'awaiting_pin' }
  })

  // /logout - Admin Logout
  bot.onText(/\/logout/, (msg) => {
    const chatId = msg.chat.id
    const userId = msg.from.id
    
    if (adminLoginSession[userId]?.authenticated) {
      delete adminLoginSession[userId]
      bot.sendMessage(chatId, '✓ Logged out successfully.')
    } else {
      bot.sendMessage(chatId, '❌ You are not logged in.')
    }
  })

    // /start - Welcome menu
    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id
      const userId = msg.from.id
      
      const menu = `
🎮 Welcome to FAST TOUR Payment Verification Bot!

Choose an action:
━━━━━━━━━━━━━━━━━━━━━━
📸 /verif    - Upload payment proof
✅ /status   - Check payment status  
❓ /help     - Get help
🔐 /admin    - Admin login
━━━━━━━━━━━━━━━━━━━━━━

Send any of these commands to get started!
      `.trim()
      
      bot.sendMessage(chatId, menu, { parse_mode: 'HTML' })
        .catch(err => console.error('Failed to send menu:', err.message))
    })

    // /verif - Payment verification workflow
    bot.onText(/\/verif/, (msg) => {
      const chatId = msg.chat.id
      const userId = msg.from.id
      
      const verifMenu = `
📸 PAYMENT VERIFICATION

Step 1️⃣ Send your Registration ID (a long number)
Step 2️⃣ Send a clear photo of your payment receipt
Step 3️⃣ We'll verify instantly ✓

Example Registration ID: 1716445678

What's your Registration ID?
      `.trim()
      
      bot.sendMessage(chatId, verifMenu)
        .catch(err => console.error('Failed to send verification menu:', err.message))
    })

    // /status - Check payment status
    bot.onText(/\/status/, async (msg) => {
      const chatId = msg.chat.id
      const userId = msg.from.id

      try {
        const userMapping = await dbGet('SELECT registrationId FROM telegramUsers WHERE telegramUserId = ?', [userId])
        if (!userMapping) {
          bot.sendMessage(chatId, '❌ No registration found.\n\nFirst send your Registration ID with /verif')
          return
        }

        const registration = await dbGet('SELECT * FROM registrations WHERE id = ?', [userMapping.registrationId])
        if (!registration) {
          bot.sendMessage(chatId, '❌ Registration not found in system.')
          return
        }

        const status = registration.paymentStatus === 'verified' ? '✅ VERIFIED' : '⏳ PENDING'
        const statusMsg = `
📊 Payment Status

Team: <b>${registration.teamName}</b>
Registration ID: <code>${registration.id}</code>
Fee: <b>${registration.fee}K</b>
Players: <b>${registration.playerCount}</b>
Status: <b>${status}</b>
        `.trim()
        
        bot.sendMessage(chatId, statusMsg, { parse_mode: 'HTML' })
      } catch (error) {
        console.error('Status check error:', error)
        bot.sendMessage(chatId, '❌ Error checking status. Please try again.')
      }
    })

    // /help - Get help
    bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id
      const helpMsg = `
🆘 HELP & SUPPORT

📋 Commands:
• /start - Show main menu
• /verif - Verify your payment
• /status - Check status

📞 Admin Contact:
• WhatsApp: <a href="https://wa.me/62${process.env.ADMIN_PHONE_1?.replace(/\D/g, '').slice(-10)}">Admin 1</a>
• WhatsApp: <a href="https://wa.me/62${process.env.ADMIN_PHONE_2?.replace(/\D/g, '').slice(-10)}">Admin 2</a>

❓ Problems?
Send /start and follow the steps carefully!
      `.trim()
      
      bot.sendMessage(chatId, helpMsg, { parse_mode: 'HTML' })
        .catch(err => console.error('Failed to send help:', err.message))
    })

    // Handle text messages (Registration ID or Admin PIN)
    bot.on('message', async (msg) => {
      if (msg.text && msg.text.startsWith('/')) return
      if (msg.photo) return

      const chatId = msg.chat.id
      const userId = msg.from.id
      const text = msg.text

      // Check if user is in admin login flow
      if (adminLoginSession[userId]?.state === 'awaiting_pin') {
        // Validate admin PIN
        const adminPin = process.env.ADMIN_PIN || 'FT001'
        if (text === adminPin) {
          adminLoginSession[userId].authenticated = true
          adminLoginSession[userId].state = 'logged_in'
          bot.sendMessage(chatId, `
✅ Admin logged in successfully!

Available admin commands:
• /list - List all registrations
• /verify - Verify a payment
• /stats - Show payment statistics
• /logout - Logout
          `.trim())
          return
        } else {
          bot.sendMessage(chatId, '❌ Incorrect PIN. Try again.')
          return
        }
      }

      // Regular registration ID handling
      if (text && !isNaN(text) && text.trim().length > 0) {
        try {
          const regId = parseInt(text)
          const registration = await dbGet('SELECT * FROM registrations WHERE id = ?', [regId])

          if (!registration) {
            bot.sendMessage(chatId, `❌ Registration ID <code>${regId}</code> not found.\n\nPlease check and try again or contact admin.`, 
              { parse_mode: 'HTML' })
            return
          }

          // Map user to registration
          await dbRun('INSERT OR REPLACE INTO telegramUsers (telegramUserId, registrationId) VALUES (?, ?)', [userId, regId])

          const confirmMsg = `
✅ Registration found!

<b>Team:</b> ${registration.teamName}
<b>ID:</b> <code>${regId}</code>
<b>Fee:</b> ${registration.fee}K
<b>Players:</b> ${registration.playerCount}

Now please send a clear photo of your payment proof/receipt.
          `.trim()

          bot.sendMessage(chatId, confirmMsg, { parse_mode: 'HTML' })
        } catch (error) {
          console.error('Message processing error:', error)
          bot.sendMessage(chatId, '❌ Error processing your message. Please try again.')
        }
      }
    })

    // Handle photo uploads
    bot.on('photo', async (msg) => {
      const chatId = msg.chat.id
      const userId = msg.from.id

      try {
        const userMapping = await dbGet('SELECT registrationId FROM telegramUsers WHERE telegramUserId = ?', [userId])
        if (!userMapping) {
          bot.sendMessage(chatId, '❌ Please send your Registration ID first with /verif')
          return
        }

        const regId = userMapping.registrationId
        const registration = await dbGet('SELECT * FROM registrations WHERE id = ?', [regId])
        if (!registration) {
          bot.sendMessage(chatId, '❌ Registration not found.')
          return
        }

        const photo = msg.photo[msg.photo.length - 1]
        const fileSize = photo.file_size

        if (fileSize < 10000) {
          bot.sendMessage(chatId, `⚠️ Photo too small (${Math.round(fileSize/1024)}KB). Send a full screenshot of your receipt.`)
          return
        }

        // Update payment status to verified
        await dbRun(
          'UPDATE registrations SET paymentStatus = ?, proofImage = ?, verifiedAt = CURRENT_TIMESTAMP, verifiedVia = ? WHERE id = ?',
          ['verified', photo.file_id, 'telegram', regId]
        )

        const confirmMsg = `
✅ PAYMENT VERIFIED!

<b>Team:</b> ${registration.teamName}
<b>ID:</b> <code>${regId}</code>
<b>Amount:</b> ${registration.fee}K
<b>Status:</b> <b>VERIFIED ✓</b>

Your registration is complete! Good luck! 🎮
        `.trim()

        bot.sendMessage(chatId, confirmMsg, { parse_mode: 'HTML' })

        // Notify admin
        if (process.env.TELEGRAM_CHAT_ID) {
          const adminMsg = `
✅ Payment Verified via Telegram Bot
━━━━━━━━━━━━━━━━━━━━━━━━━
<b>Team:</b> ${registration.teamName}
<b>ID:</b> <code>${regId}</code>
<b>Amount:</b> ${registration.fee}K
<b>Players:</b> ${registration.playerCount}
<b>Verified by:</b> User ${userId}
━━━━━━━━━━━━━━━━━━━━━━━━━
          `
          bot.sendMessage(process.env.TELEGRAM_CHAT_ID, adminMsg, { parse_mode: 'HTML' })
        }

        console.log(`✓ Payment verified via Telegram for registration ${regId}`)
      } catch (error) {
        console.error('Photo processing error:', error)
        bot.sendMessage(chatId, '❌ Error processing photo. Please try again.')
      }
    })

    bot.on('polling_error', (error) => {
      if (error.code === 'ETELEGRAM' && error.message.includes('conflict')) {
        console.warn('⚠️ Telegram bot conflict detected - restarting...')
      } else {
        console.error('❌ Telegram bot polling error:', error.message)
      }
    })

    // Admin commands
    bot.onText(/\/list/, async (msg) => {
      const chatId = msg.chat.id
      const userId = msg.from.id

      if (!adminLoginSession[userId]?.authenticated) {
        bot.sendMessage(chatId, '❌ Admin login required. Use /admin')
        return
      }

      try {
        const registrations = await dbAll('SELECT * FROM registrations ORDER BY createdAt DESC LIMIT 10')
        if (registrations.length === 0) {
          bot.sendMessage(chatId, 'No registrations found.')
          return
        }

        let list = '📋 Recent Registrations:\n━━━━━━━━━━━━━━━\n'
        registrations.forEach((reg, i) => {
          list += `${i + 1}. ${reg.teamName} (ID: ${reg.id})\n   Fee: ${reg.fee}K | Status: ${reg.paymentStatus}\n`
        })
        bot.sendMessage(chatId, list)
      } catch (error) {
        bot.sendMessage(chatId, '❌ Error fetching registrations')
      }
    })

    bot.onText(/\/stats/, async (msg) => {
      const chatId = msg.chat.id
      const userId = msg.from.id

      if (!adminLoginSession[userId]?.authenticated) {
        bot.sendMessage(chatId, '❌ Admin login required. Use /admin')
        return
      }

      try {
        const allRegs = await dbAll('SELECT * FROM registrations')
        const verified = allRegs.filter(r => r.paymentStatus === 'verified').length
        const pending = allRegs.filter(r => r.paymentStatus === 'pending').length
        const totalFee = allRegs.reduce((sum, r) => sum + parseInt(r.fee || 0), 0)

        const stats = `
📊 PAYMENT STATISTICS
━━━━━━━━━━━━━━━━━
Total Registrations: <b>${allRegs.length}</b>
Verified Payments: <b>${verified}</b> ✅
Pending Payments: <b>${pending}</b> ⏳
Total Fees Collected: <b>${totalFee}K</b>
Total Players: <b>${allRegs.reduce((sum, r) => sum + parseInt(r.playerCount || 0), 0)}</b>
        `.trim()

        bot.sendMessage(chatId, stats, { parse_mode: 'HTML' })
      } catch (error) {
        bot.sendMessage(chatId, '❌ Error fetching statistics')
      }
    })

  } catch (error) {
    console.error('❌ Failed to initialize Telegram Bot:', error.message)
    botInitialized = false
    bot = null
  }
} else {
  console.log('⚠️ Telegram Bot token not configured.')
  bot = null
}

// ============================================
// API ROUTES
// ============================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() })
})

// Get Admin Info
app.get('/api/admin-info', (req, res) => {
  res.json({
    phone1: process.env.ADMIN_PHONE_1 || '+6285857322097',
    phone2: process.env.ADMIN_PHONE_2 || '+628972337396',
    bankName: process.env.ADMIN_BANK_NAME || 'DANA ONLY',
    bankAccount: process.env.ADMIN_BANK_ACCOUNT || '085716941474',
    qrisCode: process.env.ADMIN_QRIS_CODE || 'qris_code'
  })
})

// Register Team
app.post('/api/registrations', async (req, res) => {
  try {
    const { teamName, playerCount, fee, registrationId } = req.body

    if (!teamName || !playerCount || !fee) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const id = registrationId || Date.now()
    
    await dbRun(
      `INSERT INTO registrations (id, teamName, playerCount, fee, status, paymentStatus)
       VALUES (?, ?, ?, ?, 'pending', 'pending')`,
      [id, teamName, playerCount, fee]
    )

    const registration = await dbGet('SELECT * FROM registrations WHERE id = ?', [id])

    res.status(201).json({
      message: 'Registration submitted successfully',
      registration
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get All Registrations
app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await dbAll('SELECT * FROM registrations ORDER BY createdAt DESC')
    res.json(registrations)
  } catch (error) {
    console.error('Fetch error:', error)
    res.status(500).json({ message: 'Error fetching registrations', error: error.message })
  }
})

// Get Registration by ID
app.get('/api/registrations/:id', async (req, res) => {
  try {
    const registration = await dbGet('SELECT * FROM registrations WHERE id = ?', [req.params.id])
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' })
    }
    res.json(registration)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registration', error: error.message })
  }
})

// Get Payment Status
app.get('/api/registrations/:id/payment-status', async (req, res) => {
  try {
    const registration = await dbGet('SELECT * FROM registrations WHERE id = ?', [req.params.id])
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' })
    }
    res.json({
      registrationId: registration.id,
      teamName: registration.teamName,
      paymentStatus: registration.paymentStatus,
      verifiedAt: registration.verifiedAt || null,
      verifiedVia: registration.verifiedVia || null,
      fee: registration.fee
    })
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message })
  }
})

// Update Payment Status
app.put('/api/registrations/:id/payment', async (req, res) => {
  try {
    const { status, proofImage, verifiedVia } = req.body
    const regId = req.params.id

    const registration = await dbGet('SELECT * FROM registrations WHERE id = ?', [regId])
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' })
    }

    await dbRun(
      `UPDATE registrations 
       SET paymentStatus = ?, proofImage = ?, verifiedVia = ?, verifiedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, proofImage || null, verifiedVia || 'web', regId]
    )

    const updated = await dbGet('SELECT * FROM registrations WHERE id = ?', [regId])

    if (bot && process.env.TELEGRAM_CHAT_ID) {
      const message = `
💰 Payment Update
━━━━━━━━━━━━━━━━
Team: ${updated.teamName}
Amount: ${updated.fee}K
Status: ${status.toUpperCase()}
Verified Via: ${verifiedVia || 'web'}
━━━━━━━━━━━━━━━━
      `
      bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message)
    }

    res.json({
      message: 'Payment status updated',
      registration: updated
    })
  } catch (error) {
    console.error('Update error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Payment Stats
app.get('/api/stats/payments', async (req, res) => {
  try {
    const allRegs = await dbAll('SELECT * FROM registrations')
    const verified = allRegs.filter(r => r.paymentStatus === 'verified').length
    const pending = allRegs.filter(r => r.paymentStatus === 'pending').length
    const totalFee = allRegs.reduce((sum, r) => sum + parseInt(r.fee || 0), 0)

    res.json({
      totalRegistrations: allRegs.length,
      verifiedPayments: verified,
      pendingPayments: pending,
      totalFeesCollected: totalFee + 'K',
      totalPlayers: allRegs.reduce((sum, r) => sum + parseInt(r.playerCount || 0), 0)
    })
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message })
  }
})

// WhatsApp Message Generator
app.post('/api/whatsapp/message', (req, res) => {
  try {
    const { teamName, amount, adminPhone } = req.body
    const message = `Hello Admin, I have completed the payment.\n\nTeam: ${teamName}\nAmount: ${amount}K\n\nPlease confirm my registration.`

    res.json({
      message,
      whatsappUrl: `https://wa.me/${adminPhone.replace('+', '')}?text=${encodeURIComponent(message)}`
    })
  } catch (error) {
    res.status(500).json({ message: 'Error generating message', error: error.message })
  }
})

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Server error', error: err.message })
})

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Start Server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════╗
║  FAST TOUR Backend Server          ║
║  SQLite Database Enabled           ║
║  Running on port ${PORT}             ║
╚════════════════════════════════════╝
  `)
})

// Graceful shutdown
process.on('SIGINT', () => {
  db.close()
  console.log('Database closed')
  process.exit(0)
})
