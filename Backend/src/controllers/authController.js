/**
 * Controller for authentication-related actions
 */
class AuthController {
  /**
   * Creates an instance of AuthController.
   * @param {Object} dependencies An object containing all dependencies for AuthController.
   * @param {Object} dependencies.authService The authentication service
   * @param {Object} dependencies.logger The logger instance
   */
  constructor({ authService, logger }) {
    this.authService = authService;
    this.logger = logger;
  }

  /**
   * Handles user login.
   * @param {Object} req Express request object
   * @param {Object} res Express response object
   * @param {Function} next Express next middleware function
   */
  async loginUser(req, res, next) {
    let username, password;
    try {
      ({ username, password } = req.body);

      this.logger.info('Login attempt', { username });

      const user = await this.authService.authenticateUser(username, password);
      const token = this.authService.generateToken(user.id, user.username);

      this.logger.info('Login successful', { userid: user.id, username });

      res.status(200).json({ token });
    } catch (err) {
      this.logger.error('Login failed', { username, error: err.message });
      next(err);
    }
  }

  /**
   * Handles user signup.
   * @param {Object} req Express request object
   * @param {Object} res Express response object
   * @param {Function} next Express next middleware function
   */
  async signupUser(req, res, next) {
    let username, password;
    try {
      ({ username, password } = req.body);

      this.logger.info('Signup attempt', { username });

      const user = await this.authService.createUser(username, password);

      this.logger.info('Signup successful', { userid: user.id, username });

      res.status(201).json({ message: 'User created' });
    } catch (err) {
      this.logger.error('Signup failed', { username, error: err.message });
      next(err);
    }
  }
}

export default AuthController;
