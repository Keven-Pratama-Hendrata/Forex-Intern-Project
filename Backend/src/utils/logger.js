/**
 * Logger utility for application logging.
 */
const Logger = {
  /**
   * Log an info message.
   * @param {string} message The log message
   * @param {Object} [meta={}] Additional metadata
   */
  info(message, meta = {}) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta);
  },

  /**
   * Log an error message.
   * @param {string} message The log message
   * @param {Object} [meta={}] Additional metadata
   */
  error(message, meta = {}) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, meta);
  },

  /**
   * Log a warning message.
   * @param {string} message The log message
   * @param {Object} [meta={}] Additional metadata
   */
  warn(message, meta = {}) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta);
  },

  /**
   * Log a debug message.
   * @param {string} message The log message
   * @param {Object} [meta={}] Additional metadata
   */
  debug(message, meta = {}) {
    console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta);
  },

  /**
   * Express middleware to log HTTP requests.
   * @param {import('express').Request} req Express request object
   * @param {import('express').Response} res Express response object
   * @param {Function} next Express next middleware function
   */
  logRequest(req, res, next) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      Logger.info('HTTP Request', {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });
    });

    next();
  }
};

export default Logger;
