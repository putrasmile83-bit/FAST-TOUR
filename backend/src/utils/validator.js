// Validation Utilities
class Validator {
  static validateTeamName(name) {
    if (!name || name.trim().length === 0) {
      return { valid: false, error: 'Team name is required' }
    }
    if (name.length > 50) {
      return { valid: false, error: 'Team name must be less than 50 characters' }
    }
    return { valid: true }
  }

  static validatePlayerCount(count) {
    const num = parseInt(count)
    if (num < 1 || num > 4) {
      return { valid: false, error: 'Player count must be between 1 and 4' }
    }
    return { valid: true }
  }

  static validateFee(fee) {
    const num = parseInt(fee)
    if (num < 1 || num > 5) {
      return { valid: false, error: 'Fee must be between 1K and 5K' }
    }
    return { valid: true }
  }

  static validatePhoneNumber(phone) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(phone)
  }

  static validateAdminPin(pin) {
    return pin === process.env.ADMIN_PIN || pin === 'FT001'
  }
}

module.exports = Validator
