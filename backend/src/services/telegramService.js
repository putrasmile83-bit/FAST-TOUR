/**
 * Telegram Bot Service Module
 * Handles all bot interactions, admin commands, and notifications
 */

const TelegramBot = require('node-telegram-bot-api')

class TelegramBotService {
  constructor(botToken) {
    this.token = botToken
    this.bot = null
    this.isInitialized = false
    this.adminSessions = {}
  }

  /**
   * Initialize the Telegram bot with polling
   */
  initialize() {
    if (this.isInitialized) {
      console.log('⚠️ Bot already initialized')
      return
    }

    try {
      this.bot = new TelegramBot(this.token, { 
        polling: { 
          interval: 500,
          autoStart: true 
        } 
      })

      this.isInitialized = true
      console.log('✓ Telegram Bot initialized and polling')
      this.setupErrorHandlers()
      this.setupCommands()
    } catch (error) {
      console.error('❌ Failed to initialize bot:', error.message)
      this.isInitialized = false
    }
  }

  /**
   * Setup error handlers for bot polling
   */
  setupErrorHandlers() {
    this.bot.on('polling_error', (error) => {
      if (error.code === 'ETELEGRAM' && error.message.includes('conflict')) {
        console.warn('⚠️ Telegram bot conflict detected, restarting...')
        this.bot.stopPolling()
        
        setTimeout(() => {
          console.log('Restarting bot polling...')
          this.bot.startPolling({ restart: true })
          console.log('✓ Bot polling restarted successfully')
        }, 3000)
      } else {
        console.error('❌ Bot polling error:', error.message)
      }
    })
  }

  /**
   * Setup all bot commands
   */
  setupCommands() {
    if (!this.bot) return

    // /start - Welcome message
    this.bot.onText(/\/start/, (msg) => {
      this.sendWelcomeMenu(msg.chat.id)
    })

    // /help - Help menu
    this.bot.onText(/\/help/, (msg) => {
      this.sendHelpMenu(msg.chat.id)
    })

    // /admin - Admin login
    this.bot.onText(/\/admin/, (msg) => {
      const userId = msg.from.id
      this.adminSessions[userId] = { state: 'awaiting_pin' }
      this.bot.sendMessage(msg.chat.id, '🔐 Enter your admin PIN:')
    })

    // /logout - Admin logout
    this.bot.onText(/\/logout/, (msg) => {
      const userId = msg.from.id
      if (this.adminSessions[userId]?.authenticated) {
        delete this.adminSessions[userId]
        this.bot.sendMessage(msg.chat.id, '✓ Logged out successfully')
      } else {
        this.bot.sendMessage(msg.chat.id, '❌ You are not logged in')
      }
    })
  }

  /**
   * Send welcome menu
   */
  sendWelcomeMenu(chatId) {
    const menu = `
🎮 Welcome to FAST TOUR!

Choose an action:
━━━━━━━━━━━━━━━━━━━━━━
📸 /verif    - Payment verification
✅ /status   - Check payment status  
❓ /help     - Get help
🔐 /admin    - Admin login
━━━━━━━━━━━━━━━━━━━━━━
    `.trim()

    this.bot.sendMessage(chatId, menu).catch(err => {
      console.error('Failed to send welcome menu:', err.message)
    })
  }

  /**
   * Send help menu
   */
  sendHelpMenu(chatId) {
    const menu = `
🆘 HELP & SUPPORT

📋 Main Commands:
• /start - Show welcome menu
• /verif - Payment verification  
• /status - Check your status
• /help - This help menu

📞 Contact Admin:
• Pin us for help in Telegram group

❓ Common Questions:
Q: How long to verify payment?
A: Within 2-5 minutes after upload

Q: Lost proof photo?
A: Send /verif again with new photo

Q: Wrong amount transferred?
A: Contact admin immediately
    `.trim()

    this.bot.sendMessage(chatId, menu).catch(err => {
      console.error('Failed to send help menu:', err.message)
    })
  }

  /**
   * Send payment notification to admin
   */
  sendPaymentNotification(chatId, paymentData) {
    const message = `
✅ New Payment Received
━━━━━━━━━━━━━━━━━━━━━━━━
<b>Order ID:</b> <code>${paymentData.orderId}</code>
<b>Team:</b> ${paymentData.teamName}
<b>Amount:</b> ${paymentData.amount}
<b>Method:</b> ${paymentData.method}
<b>Status:</b> Awaiting verification
━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim()

    this.bot.sendMessage(chatId, message, { parse_mode: 'HTML' })
      .catch(err => console.error('Failed to send notification:', err.message))
  }

  /**
   * Send payment success notification
   */
  sendSuccessNotification(chatId, orderId) {
    const message = `
✅ PAYMENT VERIFIED!

Order ID: <code>${orderId}</code>

Your registration is complete!
Good luck in the tournament! 🎮
    `.trim()

    this.bot.sendMessage(chatId, message, { parse_mode: 'HTML' })
      .catch(err => console.error('Failed to send success notification:', err.message))
  }

  /**
   * Send payment failed notification
   */
  sendFailureNotification(chatId, orderId, reason = '') {
    const message = `
❌ PAYMENT REJECTED

Order ID: <code>${orderId}</code>
${reason ? `Reason: ${reason}` : ''}

Please contact admin for assistance.
    `.trim()

    this.bot.sendMessage(chatId, message, { parse_mode: 'HTML' })
      .catch(err => console.error('Failed to send failure notification:', err.message))
  }

  /**
   * Check if user is authenticated as admin
   */
  isAdminAuthenticated(userId) {
    return this.adminSessions[userId]?.authenticated === true
  }

  /**
   * Authenticate admin with PIN
   */
  authenticateAdmin(userId, pin, correctPin) {
    if (pin === correctPin) {
      this.adminSessions[userId] = { 
        authenticated: true,
        state: 'logged_in',
        loginTime: new Date()
      }
      return true
    }
    return false
  }

  /**
   * Get bot instance
   */
  getBot() {
    return this.bot
  }

  /**
   * Check if bot is initialized
   */
  isReady() {
    return this.isInitialized && this.bot !== null
  }

  /**
   * Stop bot polling (for graceful shutdown)
   */
  stop() {
    if (this.bot) {
      this.bot.stopPolling()
      this.isInitialized = false
      console.log('✓ Bot stopped')
    }
  }
}

module.exports = TelegramBotService
