class ApiResponse {
  static success(data, message = 'Success') {
    return {
      success: true,
      data,
      message,
      error: null
    };
  }

  static error(error, message = 'Error occurred') {
    return {
      success: false,
      data: null,
      message,
      error
    };
  }

  static notFound(message = 'Resource not found') {
    return {
      success: false,
      data: null,
      message,
      error: 'NOT_FOUND'
    };
  }

  static badRequest(message = 'Bad request') {
    return {
      success: false,
      data: null,
      message,
      error: 'BAD_REQUEST'
    };
  }

  static unauthorized(message = 'Unauthorized') {
    return {
      success: false,
      data: null,
      message,
      error: 'UNAUTHORIZED'
    };
  }

  static forbidden(message = 'Forbidden') {
    return {
      success: false,
      data: null,
      message,
      error: 'FORBIDDEN'
    };
  }
}

module.exports = ApiResponse; 