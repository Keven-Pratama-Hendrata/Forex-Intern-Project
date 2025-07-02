/**
 * Factory for user related routes.
 * @param {Object} root0 Dependencies for the user routes
 * @param {Object} root0.userController The user controller instance
 * @param {Object} root0.authController The auth controller instance
 * @param {Function} root0.verifyTokenMiddleware Middleware to verify JWT tokens
 * @param {Object} root0.logger The logger instance
 * @returns {import('express').Router} The configured Express router for user routes
 */
import express from 'express';

/**
 * Creates and returns the user related routes.
 * @param {Object} root0 An object containing all dependencies for the user routes.
 * @param {Object} root0.userController The user controller instance.
 * @param {Object} root0.authController The auth controller instance.
 * @param {Function} root0.verifyTokenMiddleware Middleware to verify JWT tokens.
 * @param {Object} root0.logger The logger instance.
 * @returns {import('express').Router} Returns the configured Express router for user routes.
 */
export default function createUserRoutes({ userController, authController, verifyTokenMiddleware, logger }) {
  const router = express.Router();

  /**
   * Route handler for user login.
   * @param {import('express').Request} req Express request object
   * @param {import('express').Response} res Express response object
   * @param {Function} next Express next middleware function
   */
  router.post('/login', (req, res, next) => {
    logger.info('Login route accessed', { method: 'POST', path: '/login' });
    authController.loginUser(req, res, next);
  });

  /**
   * Route handler for getting user profile.
   * @param {import('express').Request} req Express request object
   * @param {import('express').Response} res Express response object
   * @param {Function} next Express next middleware function
   */
  router.get('/profile', verifyTokenMiddleware, (req, res, next) => {
    logger.info('Profile route accessed', { method: 'GET', path: '/profile', userId: req.user?.id });
    userController.getUserProfile(req, res, next);
  });

  /**
   * Route handler for updating user balance.
   * @param {import('express').Request} req Express request object
   * @param {import('express').Response} res Express response object
   * @param {Function} next Express next middleware function
   */
  router.post('/balance', verifyTokenMiddleware, (req, res, next) => {
    logger.info('Balance route accessed', { method: 'POST', path: '/balance', userId: req.user?.id });
    userController.updateBalance(req, res, next);
  });

  logger.info('User routes initialized successfully');
  return router;
}
