// Telegram Integration Utility
const TelegramBot = require('node-telegram-bot-api')

class TelegramService {
  constructor(botToken, chatId) {
    this.bot = new TelegramBot(botToken, { polling: false })
    this.chatId = chatId
  }

  async sendRegistrationNotification(registration) {
    const message = `
📝 New Registration
━━━━━━━━━━━━━━━━
Team: ${registration.teamName}
Tournament ID: FT-001
Players: ${registration.playerCount}/4
Fee: ${registration.fee}K
Status: PENDING
Date: ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━
    `
    return this.bot.sendMessage(this.chatId, message)
  }

  async sendPaymentNotification(registration, status) {
    const message = `
💰 Payment Update
━━━━━━━━━━━━━━━━
Team: ${registration.teamName}
Amount: ${registration.fee}K
Players: ${registration.playerCount}
Status: ${status.toUpperCase()}
Time: ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━
    `
    return this.bot.sendMessage(this.chatId, message)
  }
}

module.exports = TelegramService
