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
      const { userid } = req.user;

      this.logger.info('Getting user profile', { userid });

      const profile = await this.userService.getUserProfile(userid);

      this.logger.info('User profile retrieved successfully', { userid });

      res.status(200).json(profile);
    } catch (err) {
      const { userid } = req.user || {};
      this.logger.error('Failed to get user profile', { userid, error: err.message });
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
      const { userid } = req.user;
      const { balance } = req.body;

      this.logger.info('Updating user balance', { userid, balance });

      const result = await this.userService.handleUpdateBalance(userid, balance);

      this.logger.info('Balance updated successfully', { userid, balance });

      res.status(200).json(result);
    } catch (err) {
      const { userid } = req.user || {};
      const { balance } = req.body || {};
      this.logger.error('Failed to update balance', {
        userid,
        balance,
        error: err.message
      });
      next(err);
    }
  }

  /**
   * Retrieves dashboard data for the current user
   * @param {Object} req Express request object
   * @param {Object} res Express response object
   * @param {Function} next Express next middleware function
   */
  async getDashboardData(req, res, next) {
    try {
      if (!req.user) {
        this.logger.error('User not found in request');
        throw new Error('User not found in request');
      }
      const { userid } = req.user;

      const dashboardData = await this.userService.getDashboardData(userid);

      res.status(200).json(dashboardData);
    } catch (err) {
      const { userid } = req.user || {};
      this.logger.error('Failed to get dashboard data', { userid, error: err.message });
      next(err);
    }
  }
}

export default UserController;
