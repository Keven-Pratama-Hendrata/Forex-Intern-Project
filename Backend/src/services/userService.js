/**
 * Service for user-related operations.
 */
class UserService {
  /**
   * Creates an instance of UserService.
   * @param {Object} dependencies An object containing all dependencies for UserService.
   * @param {Object} dependencies.userRepository The user repository
   * @param {Object} dependencies.logger The logger instance
   * @param {Object} dependencies.config The configuration object
   */
  constructor({ userRepository, logger, config }) {
    this.userRepository = userRepository;
    this.logger = logger;
    this.config = config;
  }

  /**
   * Update a user's balance for a specific currency.
   * @param {Object} user The user object
   * @param {string} currency The currency code
   * @param {number|string} amount The amount to update
   * @returns {Object} The updated user object
   */
  updateBalance(user, currency, amount) {
    this.logger.info('Updating user balance', { userid: user.id, currency, amount });

    const balances = [...user.balances];
    const balanceHistory = [...user.balanceHistory];
    const existingBalanceIndex = balances.findIndex((b) => b.currency === currency);

    if (existingBalanceIndex === -1) {
      if (parseFloat(amount) < 0) {
        this.logger.error('Insufficient funds for new balance', {
          userid: user.id, currency, amount
        });
        throw new Error('Insufficient funds');
      }
      balances.push({ currency, amount: parseFloat(amount) });
    } else {
      const newBalance =
        parseFloat(balances[existingBalanceIndex].amount) + parseFloat(amount);
      if (newBalance < 0) {
        this.logger.error('Insufficient funds for balance update', {
          userid: user.id, currency, amount, newBalance
        });
        throw new Error('Insufficient funds');
      }
      balances[existingBalanceIndex].amount = newBalance;
    }

    balanceHistory.push({
      currency,
      balance: balances.find((b) => b.currency === currency).amount,
      amount: parseFloat(amount),
      date: new Date()
    });

    this.logger.info('Balance updated successfully', {
      userid: user.id,
      currency,
      newAmount: balances.find((b) => b.currency === currency).amount
    });

    return { ...user, balances, balanceHistory: balanceHistory };
  }

  /**
   * Update the user's today balance in USD.
   * @param {Object} user The user object
   * @param {number|string} amount The new today balance in USD
   * @returns {Object} The updated user object
   */
  updateTodayBalanceUsd(user, amount) {
    this.logger.info('Updating today balance USD', { userid: user.id, amount });

    return {
      id: user.id,
      todayBalanceUsd: parseFloat(amount),
      lastFetchedDate: new Date(),
    };
  }

  /**
   * Get the user profile by user ID.
   * @param {string} userid The user ID
   * @returns {Promise<Object>} The user profile object
   */
  async getUserProfile(userid) {
    const user = await this.userRepository.findOneById(userid);

    if (!user) {
      this.logger.error('User not found', { userid });
      throw new Error('User not found');
    }

    const today = new Date();
    const lastFetched = new Date(user.lastFetchedDate);
    let userWithUpdatedHistory = user;

    if (today.toDateString() !== lastFetched.toDateString()) {
      this.logger.info('Updating user history for new day', { userid });
      userWithUpdatedHistory = this.updateTodayBalanceUsd(
        user,
        user.todayBalanceUsd
      );
      userWithUpdatedHistory = await this.userRepository.save(userWithUpdatedHistory);
    }

    this.logger.info('User profile retrieved successfully', { userid });
    return {
      userid: userWithUpdatedHistory.id,
      username: userWithUpdatedHistory.username,
      balances: userWithUpdatedHistory.balances,
      dailyTotalUsdHistory: userWithUpdatedHistory.dailyTotalUsdHistory,
      lastFetchedDate: userWithUpdatedHistory.lastFetchedDate,
      todayBalanceUsd: userWithUpdatedHistory.todayBalanceUsd
    };
  }

  /**
   * Handle updating the user's balance.
   * @param {string} userid The user ID
   * @param {Object} balance The balance update object
   * @returns {Promise<Object>} The result of the balance update
   */
  async handleUpdateBalance(userid, balance) {
    this.logger.info('Handling balance update', { userid, balance });

    const user = await this.userRepository.findOneById(userid);

    if (!user) {
      this.logger.error('User not found for balance update', { userid });
      throw new Error('User not found');
    }

    const updatedUserObj = this.updateBalance(user, balance.currency, balance.amount);
    const updatedUser = await this.userRepository.save(updatedUserObj);

    this.logger.info('Balance update completed successfully', { userid, balance });

    return {
      message: 'Balance updated',
      balances: updatedUser.balances
    };
  }

  /**
   * Get dashboard data for the user.
   * @param {string} userid The user ID
   * @returns {Promise<Object>} The dashboard data object
   */
  async getDashboardData(userid) {
    this.logger.info('Getting dashboard data', { userid });

    const user = await this.userRepository.findOneById(userid);

    if (!user) {
      this.logger.error('User not found for dashboard', { userid });
      throw new Error('User not found');
    }

    this.logger.info('Dashboard data retrieved successfully', { userid });

    return {
      username: user.username,
      todayBalanceUsd: user.todayBalanceUsd,
      dailyTotalUsdHistory: user.dailyTotalUsdHistory
    };
  }
}

export default UserService;
