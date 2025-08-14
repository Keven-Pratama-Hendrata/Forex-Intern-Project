/**
 * Custom error class for application-specific errors.
 * @class
 * @extends Error
 */
class CustomError extends Error {
  /**
   * Create a CustomError instance.
   * @param {string} message The error message
   * @param {number} [statusCode=500] The HTTP status code
   * @param {string} [code='INTERNAL_ERROR'] The error code
   */
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convert the CustomError instance to a plain object for JSON serialization.
   * @returns {Object} The serializable error object
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      stack: this.stack
    };
  }
}

export default CustomError;
