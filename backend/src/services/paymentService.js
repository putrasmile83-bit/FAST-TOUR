/**
 * Payment Service Module
 * Handles order ID generation, unique nominals, payment tracking, and status updates
 */

const { v4: uuidv4 } = require('uuid')

/**
 * Generate unique Order ID (e.g., TRN-92831)
 * @returns {string} Order ID in format TRN-XXXXX
 */
const generateOrderId = () => {
  const prefix = 'TRN'
  const randomNum = Math.floor(Math.random() * 100000)
  return `${prefix}-${randomNum.toString().padStart(5, '0')}`
}

/**
 * Generate unique nominal for transfer verification
 * Users must add this amount to make exact transfer
 * Example: Rp1.127 (amount = 1.127)
 * @returns {number} Unique nominal (1000-9999)
 */
const generateUniqueNominal = () => {
  return Math.floor(Math.random() * 9000) + 1000
}

/**
 * Calculate payment expiry time (10 minutes from now)
 * @returns {string} ISO timestamp of expiry time
 */
const calculateExpiryTime = () => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 10)
  return now.toISOString()
}

/**
 * Calculate time remaining until expiry
 * @param {string} expiryTime - ISO timestamp of expiry
 * @returns {object} Object with minutes, seconds, isExpired
 */
const calculateCountdown = (expiryTime) => {
  const now = new Date()
  const expiry = new Date(expiryTime)
  const diff = expiry - now
  
  if (diff <= 0) {
    return {
      minutes: 0,
      seconds: 0,
      formatted: '00:00',
      isExpired: true,
      total: 0
    }
  }

  const minutes = Math.floor(diff / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  
  return {
    minutes,
    seconds,
    formatted: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    isExpired: false,
    total: diff
  }
}

/**
 * Format currency to Rupiah format
 * @param {number} amount - Amount in rupiah
 * @returns {string} Formatted string like "Rp1.234.567"
 */
const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

/**
 * Validate payment proof image
 * @param {string} base64Image - Base64 encoded image
 * @returns {object} { valid: boolean, error: string | null }
 */
const validatePaymentProof = (base64Image) => {
  if (!base64Image) {
    return { valid: false, error: 'No image provided' }
  }

  if (!base64Image.startsWith('data:image')) {
    return { valid: false, error: 'Invalid image format. Must be JPEG or PNG' }
  }

  // Check base64 size (max 5MB)
  const sizeInBytes = base64Image.length * 0.75
  const sizeInMB = sizeInBytes / (1024 * 1024)
  
  if (sizeInMB > 5) {
    return { valid: false, error: `Image too large (${sizeInMB.toFixed(1)}MB). Max 5MB.` }
  }

  return { valid: true, error: null }
}

/**
 * Create payment request object
 * @param {string} registrationId
 * param {string} paymentMethod - 'QRIS' or 'DANA'
 * @param {number} amount - Base amount in rupiah
 * @returns {object} Payment request with order ID, nominal, etc.
 */
const createPaymentRequest = (registrationId, paymentMethod, amount) => {
  const paymentId = uuidv4()
  const orderId = generateOrderId()
  const uniqueNominal = generateUniqueNominal()
  const totalAmount = amount + uniqueNominal
  const expiresAt = calculateExpiryTime()
  const countdown = calculateCountdown(expiresAt)

  return {
    paymentId,
    registrationId,
    orderId,
    paymentMethod,
    baseAmount: amount,
    uniqueNominal,
    totalAmount,
    expiresAt,
    countdown,
    status: 'pending',
    createdAt: new Date().toISOString()
  }
}

/**
 * Check if payment is expired
 * @param {string} expiresAt - ISO timestamp
 * @returns {boolean}
 */
const isPaymentExpired = (expiresAt) => {
  return new Date(expiresAt) < new Date()
}

/**
 * Get payment status with detailed information
 * @param {object} payment - Payment record from database
 * @returns {object} Payment status with countdown and formatted values
 */
const getPaymentStatus = (payment) => {
  const countdown = calculateCountdown(payment.expiresAt)
  const isExpired = isPaymentExpired(payment.expiresAt)

  return {
    paymentId: payment.id,
    orderId: payment.orderId,
    registrationId: payment.registrationId,
    status: isExpired && payment.status === 'pending' ? 'expired' : payment.status,
    amount: formatRupiah(payment.amount),
    uniqueNominal: formatRupiah(payment.uniqueNominal),
    totalAmount: formatRupiah(payment.totalAmount),
    countdown: countdown.formatted,
    isExpired,
    verifiedAt: payment.verifiedAt,
    verifiedBy: payment.verifiedVia
  }
}

module.exports = {
  generateOrderId,
  generateUniqueNominal,
  calculateExpiryTime,
  calculateCountdown,
  formatRupiah,
  validatePaymentProof,
  createPaymentRequest,
  isPaymentExpired,
  getPaymentStatus
}
