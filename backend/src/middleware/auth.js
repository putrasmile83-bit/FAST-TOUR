// Authentication Middleware
const validateAdminPin = (req, res, next) => {
  const adminPin = req.headers['x-admin-pin'] || req.body.adminPin
  const validPin = process.env.ADMIN_PIN || 'FT001'

  if (!adminPin || adminPin !== validPin) {
    return res.status(403).json({
      success: false,
      message: 'Invalid admin PIN'
    })
  }

  next()
}

module.exports = { validateAdminPin }
