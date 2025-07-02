/**
 * Controller for user-related actions
 */
class UserController {
  /**
   * @param {Object} root0 Dependencies for UserController
   * @param {Object} root0.userService The user service
   * @param {Object} root0.logger The logger instance
   */
  constructor({ userService, logger }) {
    this.userService = userService;
    this.logger = logger;
  }

  /**
   * Retrieves the user profile
   * @param {import('express').Request} req Express request object
   * @param {import('express').Response} res Express response object
   * @param {Function} next Express next middleware function
   */
  async getUserProfile(req, res, next) {
    try {
      const userId = req.user.id;
      this.logger.info('Getting user profile', { userId });

      const profile = await this.userService.getUserProfile(userId);

      this.logger.info('User profile retrieved successfully', { userId });
      res.status(200).json(profile);
    } catch (err) {
      this.logger.error('Failed to get user profile', { userId: req.user?.id, error: err.message });
      next(err);
    }
  }

  /**
   * Updates the user's balance
   * @param {import('express').Request} req Express request object
   * @param {import('express').Response} res Express response object
   * @param {Function} next Express next middleware function
   */
  async updateBalance(req, res, next) {
    try {
      const userId = req.user.id;
      const { balance } = req.body;
      this.logger.info('Updating user balance', { userId, balance });

      const result = await this.userService.handleUpdateBalance(userId, balance);

      this.logger.info('Balance updated successfully', { userId, balance });
      res.status(200).json(result);
    } catch (err) {
      this.logger.error('Failed to update balance', {
        userId: req.user?.id,
        balance: req.body.balance,
        error: err.message
      });
      next(err);
    }
  }
}

export default UserController;
