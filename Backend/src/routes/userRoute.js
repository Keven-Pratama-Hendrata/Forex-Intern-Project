import express from 'express';

/**
 * Initializes user routes with provided dependencies.
 * @param {Object} dependencies An object containing all dependencies for the user routes.
 * @param {Object} dependencies.userController The user controller instance.
 * @param {Object} dependencies.authController The auth controller instance.
 * @param {Function} dependencies.verifyTokenMiddleware Middleware to verify JWT tokens.
 * @param {Object} dependencies.logger The logger instance.
 * @returns {import('express').Router} The configured Express router for user routes.
 */
//eslint-disable-next-line max-lines-per-function
export default function createUserRoutes({ userController, authController, verifyTokenMiddleware, logger }) {
  const router = express.Router();

  /**
   * Route handler for user login.
   * @param {Object} req Express request object
   * @param {Object} res Express response object
   * @param {Function} next Express next middleware function
   */
  router.post('/login', (req, res, next) => {
    logger.info('Login route accessed', { method: 'POST', path: '/login' });
    authController.loginUser(req, res, next);
  });

  /**
   * Route handler for user signup.
   * @param {Object} req Express request object
   * @param {Object} res Express response object
   * @param {Function} next Express next middleware function
   */
  router.post('/signup', (req, res, next) => {
    logger.info('Signup route accessed', { method: 'POST', path: '/signup' });
    authController.signupUser(req, res, next);
  });

  /**
   * Route handler for getting user profile.
   * @param {Object} req Express request object
   * @param {Object} res Express response object
   * @param {Function} next Express next middleware function
   */
  router.get('/profile', verifyTokenMiddleware, (req, res, next) => {
    logger.info('Profile route accessed', { method: 'GET', path: '/profile' });
    userController.getUserProfile(req, res, next);
  });

  /**
   * Route handler for updating user balance.
   * @param {Object} req Express request object
   * @param {Object} res Express response object
   * @param {Function} next Express next middleware function
   */
  router.post('/balance', verifyTokenMiddleware, (req, res, next) => {
    logger.info('Balance route accessed', { method: 'POST', path: '/balance' });
    userController.updateBalance(req, res, next);
  });

  /**
   * Route handler for processing buy/sell transactions.
   * @param {Object} req Express request object
   * @param {Object} res Express response object
   * @param {Function} next Express next middleware function
   */
  router.post('/transaction', verifyTokenMiddleware, (req, res, next) => {
    logger.info('Transaction route accessed', { method: 'POST', path: '/transaction' });
    userController.processTransaction(req, res, next);
  });

  /**
   * Route handler for getting dashboard data.
   * @param {Object} req Express request object
   * @param {Object} res Express response object
   * @param {Function} next Express next middleware function
   */
  router.get('/dashboard', verifyTokenMiddleware, (req, res, next) => {
    logger.info('Dashboard route accessed', { method: 'GET', path: '/dashboard' });
    userController.getDashboardData(req, res, next);
  });

  /**
   * Route handler for getting transaction history.
   * @param {Object} req Express request object
   * @param {Object} res Express response object
   * @param {Function} next Express next middleware function
   */
  router.get('/history', verifyTokenMiddleware, (req, res, next) => {
    logger.info('Transaction history route accessed', { method: 'GET', path: '/history' });
    userController.getTransactionHistory(req, res, next);
  });

  logger.info('User routes initialized successfully');
  return router;
}
