/**
 * Controller for user-related actions
 */
class UserController {
  /**
   * Creates an instance of UserController.
   * @param {Object} dependencies An object containing all dependencies for UserController.
   * @param {Object} dependencies.userService The user service
   * @param {Object} dependencies.logger The logger instance
   */
  constructor({ userService, logger }) {
    this.userService = userService;
    this.logger = logger;
  }

  /**
   * Retrieves the user profile
   * @param {Object} req Express request object
   * @param {Object} res Express response object
   * @param {Function} next Express next middleware function
   */
  async getUserProfile(req, res, next) {
    try {
      if (!req.user) {
        this.logger.error('User not found in request');
        throw new Error('User not found in request');
      }
      const { id } = req.user;

      this.logger.info('Getting user profile', { userid: id });

      const profile = await this.userService.getUserProfile(id);

      this.logger.info('User profile retrieved successfully', { userid: id });

      res.status(200).json(profile);
    } catch (err) {
      const { id } = req.user || {};
      this.logger.error('Failed to get user profile', { userid: id, error: err.message });
      next(err);
    }
  }

  /**
   * Updates the user's balance
   * @param {Object} req Express request object
   * @param {Object} res Express response object
   * @param {Function} next Express next middleware function
   */
  async updateBalance(req, res, next) {
    try {
      if (!req.user) {
        this.logger.error('User not found in request');
        throw new Error('User not found in request');
      }
      const { id } = req.user;
      const { balance } = req.body;

      this.logger.info('Updating user balance', { userid: id, balance });

      const result = await this.userService.handleUpdateBalance(id, balance);

      this.logger.info('Balance updated successfully', { userid: id, balance });

      res.status(200).json(result);
    } catch (err) {
      const { id } = req.user || {};
      const { balance } = req.body || {};
      this.logger.error('Failed to update balance', {
        userid: id,
        balance,
        error: err.message
      });
      next(err);
    }
  }
}

export default UserController;
