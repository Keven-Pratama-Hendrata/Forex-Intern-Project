/**
 * Controller for authentication-related actions
 */
class AuthController {
  /**
   * @param {Object} root0 Dependencies for AuthController
   * @param {Object} root0.authService The authentication service
   * @param {Object} root0.logger The logger instance
   */
  constructor({ authService, logger }) {
    this.authService = authService;
    this.logger = logger;
  }

  /**
   * Handles user login.
   * @param {import('express').Request} req Express request object
   * @param {import('express').Response} res Express response object
   * @param {Function} next Express next middleware function
   */
  async loginUser(req, res, next) {
    try {
      const { user_name, password } = req.body;
      this.logger.info('Login attempt', { user_name });

      const user = await this.authService.authenticateUser(user_name, password);
      const token = this.authService.generateToken(user._id, user.user_name);

      this.logger.info('Login successful', { userId: user._id, user_name });
      res.status(200).json({ token });
    } catch (err) {
      this.logger.error('Login failed', { user_name: req.body.user_name, error: err.message });
      next(err);
    }
  }
}

export default AuthController;
