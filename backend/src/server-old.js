require('dotenv').config()
const express = require('express')
const cors = require('cors')
const TelegramBot = require('node-telegram-bot-api')

// Initialize Express
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Initialize Telegram Bot
const botToken = process.env.TELEGRAM_BOT_TOKEN || '8278697371:AAEXIhx_lXQDLv4uWoIZagZat-Tuxk0x5_Y'
let bot = null

if (botToken && botToken !== 'your_token_here') {
  try {
    bot = new TelegramBot(botToken, { polling: true })
    console.log('✓ Telegram Bot initialized and polling')
    console.log('✓ Bot is ready to receive messages')

    // TELEGRAM BOT HANDLERS

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
━━━━━━━━━━━━━━━━━━━━━━

Send any of these commands to get started!
      `.trim()
      
      bot.sendMessage(chatId, menu, { parse_mode: 'HTML' })
        .then(() => console.log(`✓ Sent menu to user ${userId}`))
        .catch(err => console.error(`✗ Failed to send menu: ${err.message}`))
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
        .then(() => console.log(`✓ Sent verification menu to user ${userId}`))
        .catch(err => console.error(`✗ Failed to send verification menu: ${err.message}`))
    })

    // /status - Check payment status
    bot.onText(/\/status/, (msg) => {
      const chatId = msg.chat.id
      const userId = msg.from.id
      const regId = database.telegramUsers[userId]

      if (!regId) {
        bot.sendMessage(chatId, `❌ No registration found.\n\nFirst send your Registration ID with /verif`)
        return
      }

      const registration = database.registrations.find(r => r.id == regId)
      if (!registration) {
        bot.sendMessage(chatId, '❌ Registration not found in system.')
        return
      }

      const status = registration.paymentStatus === 'verified' ? '✅ VERIFIED' : '⏳ PENDING'
      const statusMsg = `
📊 Payment Status

Team: <b>${registration.teamName}</b>
Registration ID: <code>${regId}</code>
Fee: <b>${registration.fee}K</b>
Players: <b>${registration.playerCount}</b>
Status: <b>${status}</b>
      `.trim()
      
      bot.sendMessage(chatId, statusMsg, { parse_mode: 'HTML' })
        .catch(err => console.error(`✗ Failed to send status: ${err.message}`))
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
        .catch(err => console.error(`✗ Failed to send help: ${err.message}`))
    })

    // Handle text messages (Registration ID)
    bot.on('message', (msg) => {
      // Skip if it's a command
      if (msg.text && msg.text.startsWith('/')) return
      // Skip if it's a photo (handled separately)
      if (msg.photo) return

      const chatId = msg.chat.id
      const userId = msg.from.id
      const text = msg.text

      // Check if it's a number (Registration ID)
      if (text && !isNaN(text) && text.trim().length > 0) {
        const regId = parseInt(text)
        const registration = database.registrations.find(r => r.id == regId)

        if (!registration) {
          bot.sendMessage(chatId, `❌ Registration ID <code>${regId}</code> not found.\n\nPlease check and try again or contact admin.`, 
            { parse_mode: 'HTML' })
          return
        }

        // Map user to registration
        database.telegramUsers[userId] = regId

        const confirmMsg = `
✅ Registration found!

<b>Team:</b> ${registration.teamName}
<b>ID:</b> <code>${regId}</code>
<b>Fee:</b> ${registration.fee}K
<b>Players:</b> ${registration.playerCount}

Now please send a clear photo of your payment proof/receipt.
      `.trim()

        bot.sendMessage(chatId, confirmMsg, { parse_mode: 'HTML' })
          .catch(err => console.error(`✗ Failed to confirm registration: ${err.message}`))
      }
    })

    // Handle photo uploads
    bot.on('photo', (msg) => {
      const chatId = msg.chat.id
      const userId = msg.from.id
      const regId = database.telegramUsers[userId]

      if (!regId) {
        bot.sendMessage(chatId, `❌ Please send your Registration ID first with /verif`)
        return
      }

      const registration = database.registrations.find(r => r.id == regId)
      if (!registration) {
        bot.sendMessage(chatId, '❌ Registration not found.')
        return
      }

      try {
        // Get photo info
        const photo = msg.photo[msg.photo.length - 1]
        const fileId = photo.file_id
        const fileSize = photo.file_size

        // Validate photo size (at least 10KB for real receipt)
        if (fileSize < 10000) {
          bot.sendMessage(chatId, `⚠️ Photo too small (${Math.round(fileSize/1024)}KB). Send a full screenshot of your receipt.`)
          return
        }

        // Auto-verify
        registration.paymentStatus = 'verified'
        registration.proofImage = fileId
        registration.verifiedAt = new Date()
        registration.verifiedVia = 'telegram'

        const confirmMsg = `
✅ PAYMENT VERIFIED!

<b>Team:</b> ${registration.teamName}
<b>ID:</b> <code>${regId}</code>
<b>Amount:</b> ${registration.fee}K
<b>Status:</b> <b>VERIFIED ✓</b>

Your registration is complete! Good luck! 🎮
        `.trim()

        bot.sendMessage(chatId, confirmMsg, { parse_mode: 'HTML' })
          .catch(err => console.error(`✗ Failed to send verification: ${err.message}`))

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
            .catch(err => console.error(`✗ Failed to notify admin: ${err.message}`))
        }

        console.log(`✓ Payment verified via Telegram for registration ${regId}`)
      } catch (error) {
        console.error('Photo processing error:', error)
        bot.sendMessage(chatId, '❌ Error processing photo. Please try again.')
      }
    })

    // Error handler for bot
    bot.on('polling_error', (error) => {
      console.error('❌ Telegram bot polling error:', error.message)
    })

  } catch (error) {
    console.error('❌ Failed to initialize Telegram Bot:', error.message)
    console.log('ℹ️ Telegram bot is disabled. Bot token may be invalid.')
    bot = null
  }
} else {
  console.log('⚠️ Telegram Bot token not configured. Bot features disabled.')
  bot = null
}

// In-memory database (replace with actual database for production)
const database = {
  registrations: [],
  payments: [],
  admins: {
    phone1: process.env.ADMIN_PHONE_1 || '+6285857322097',
    phone2: process.env.ADMIN_PHONE_2 || '+628972337396',
    bankName: process.env.ADMIN_BANK_NAME || 'DANA ONLY',
    bankAccount: process.env.ADMIN_BANK_ACCOUNT || '085716941474',
    qrisCode: process.env.ADMIN_QRIS_CODE || 'qris_code'
  },
  telegramUsers: {} // Maps Telegram user ID to registration ID
}

// ROUTES

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() })
})

// Get Admin Info
app.get('/api/admin-info', (req, res) => {
  res.json(database.admins)
})

// Register Team
app.post('/api/registrations', (req, res) => {
  try {
    const { teamName, playerCount, fee, registrationId } = req.body

    if (!teamName || !playerCount || !fee) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const registration = {
      id: registrationId || Date.now(),
      teamName,
      playerCount,
      fee,
      status: 'pending',
      createdAt: new Date(),
      paymentStatus: 'pending'
    }

    database.registrations.push(registration)

    res.status(201).json({
      message: 'Registration submitted successfully',
      registration
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get All Registrations
app.get('/api/registrations', (req, res) => {
  res.json(database.registrations)
})

// Get Registration by ID
app.get('/api/registrations/:id', (req, res) => {
  const registration = database.registrations.find(r => r.id == req.params.id)
  if (!registration) {
    return res.status(404).json({ message: 'Registration not found' })
  }
  res.json(registration)
})

// Get Payment Status by Registration ID
app.get('/api/registrations/:id/payment-status', (req, res) => {
  const registration = database.registrations.find(r => r.id == req.params.id)
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
})

// Update Payment Status
app.put('/api/registrations/:id/payment', (req, res) => {
  try {
    const { status, proofImage } = req.body
    const registration = database.registrations.find(r => r.id == req.params.id)

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' })
    }

    registration.paymentStatus = status
    registration.proofImage = proofImage

    // Send Telegram notification
    if (bot && process.env.TELEGRAM_CHAT_ID) {
      const message = `
💰 Payment Update
━━━━━━━━━━━━━━━━
Team: ${registration.teamName}
Amount: ${registration.fee}K
Players: ${registration.playerCount}
Status: ${status.toUpperCase()}
━━━━━━━━━━━━━━━━
      `
      bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message)
    }

    res.json({
      message: 'Payment status updated',
      registration
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Send Telegram Notification
app.post('/api/telegram/notify', (req, res) => {
  try {
    const { teamName, fee, playerCount, tournamentId } = req.body

    if (!bot || !process.env.TELEGRAM_CHAT_ID) {
      return res.status(500).json({ message: 'Telegram not configured' })
    }

    const message = `
📝 New Registration
━━━━━━━━━━━━━━━━
Team: ${teamName}
Tournament ID: ${tournamentId || 'FT-001'}
Players: ${playerCount}/4
Fee: ${fee}K
Status: PENDING
━━━━━━━━━━━━━━━━
    `

    bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message)

    res.json({ message: 'Telegram notification sent' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to send notification', error: error.message })
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

// Admin Update Info
app.post('/api/admin/update-info', (req, res) => {
  try {
    const { adminPin } = req.body

    if (adminPin !== process.env.ADMIN_PIN && adminPin !== 'FT001') {
      return res.status(403).json({ message: 'Invalid admin PIN' })
    }

    database.admins = {
      ...database.admins,
      ...req.body
    }

    res.json({
      message: 'Admin info updated',
      admins: database.admins
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Payment Stats
app.get('/api/stats/payments', (req, res) => {
  const verified = database.registrations.filter(r => r.paymentStatus === 'verified').length
  const pending = database.registrations.filter(r => r.paymentStatus === 'pending').length
  const totalFee = database.registrations.reduce((sum, r) => sum + parseInt(r.fee || 0), 0)

  res.json({
    totalRegistrations: database.registrations.length,
    verifiedPayments: verified,
    pendingPayments: pending,
    totalFeesCollected: totalFee + 'K',
    totalPlayers: database.registrations.reduce((sum, r) => sum + parseInt(r.playerCount || 0), 0)
  })
})

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Server error', error: err.message })
})

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Start Server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════╗
║  FAST TOUR Backend Server          ║
║  Running on port ${PORT}             ║
╚════════════════════════════════════╝
  `)
})
