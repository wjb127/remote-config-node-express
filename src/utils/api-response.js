class ApiResponse {
  static success(data, message = 'Success') {
    return {
      success: true,
      data,
      message
    };
  }

  static error(error, message = 'Error') {
    return {
      success: false,
      error: error.message || error,
      message
    };
  }

  static notFound(message = 'Resource not found') {
    return {
      success: false,
      error: 'Not Found',
      message
    };
  }

  static badRequest(message = 'Bad Request') {
    return {
      success: false,
      error: 'Bad Request',
      message
    };
  }

  static unauthorized(message = 'Unauthorized') {
    return {
      success: false,
      error: 'Unauthorized',
      message
    };
  }

  static forbidden(message = 'Forbidden') {
    return {
      success: false,
      error: 'Forbidden',
      message
    };
  }
}

module.exports = ApiResponse; 