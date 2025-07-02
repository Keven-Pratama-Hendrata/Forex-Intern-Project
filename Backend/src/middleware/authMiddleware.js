import CustomError from '../utils/error.js';

/**
 * Factory for authentication middleware that verifies JWT tokens
 * @param {Object} deps Dependencies
 * @param {Object} deps.authService The authentication service
 * @param {Object} deps.logger The logger instance
 * @returns {Function} Express middleware function
 */
export default function createAuthMiddleware({ authService, logger }) {
  return function verifyToken(req, res, next) {
    try {
      logger.info('Verifying authentication token');
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        logger.error('No token provided in authorization header');
        throw new CustomError('Access denied. No token provided.', 401, 'NO_TOKEN');
      }
      const decoded = authService.verifyToken(token);
      req.user = decoded;
      logger.info('Token verified successfully', { userId: decoded.user_id });
      next();
    } catch (error) {
      if (error instanceof CustomError) {
        logger.error('Custom error during token verification', { error: error.message, statusCode: error.statusCode });
        next(error);
      } else {
        logger.error('Invalid token during verification', { error: error.message });
        next(new CustomError('Invalid token.', 401, 'INVALID_TOKEN'));
      }
    }
  };
}
