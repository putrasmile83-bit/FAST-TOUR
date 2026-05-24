// API Utilities
class ApiResponse {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    })
  }

  static error(res, message = 'Error', statusCode = 400, error = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: error ? error.message : undefined
    })
  }
}

module.exports = ApiResponse
