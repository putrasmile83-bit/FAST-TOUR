// WhatsApp Message Generator
class WhatsAppService {
  static generatePaymentConfirmationMessage(teamName, amount) {
    return `Hello Admin, I have completed the payment.\n\nTeam: ${teamName}\nAmount: ${amount}K\n\nPlease confirm my registration.`
  }

  static generateRegistrationMessage(teamName, playerCount, fee) {
    return `Hello, I want to register my team for FAST TOUR.\n\nTeam Name: ${teamName}\nPlayers: ${playerCount}/4\nFee: ${fee}K`
  }

  static getWhatsAppLink(phoneNumber, message) {
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`
  }
}

module.exports = WhatsAppService
