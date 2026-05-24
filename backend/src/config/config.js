// API Configuration
module.exports = {
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  ADMIN_PIN: process.env.REACT_APP_ADMIN_PIN || 'FT001',
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  ADMIN_INFO: {
    phone1: process.env.ADMIN_PHONE_1 || '+6285857322097',
    phone2: process.env.ADMIN_PHONE_2 || '+628972337396',
    bankName: process.env.ADMIN_BANK_NAME || 'DANA ONLY',
    bankAccount: process.env.ADMIN_BANK_ACCOUNT || '085716941474',
    qrisCode: process.env.ADMIN_QRIS_CODE || 'qris_code'
  }
}
