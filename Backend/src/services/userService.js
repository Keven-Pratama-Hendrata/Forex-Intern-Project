import Constants from '../constants.js';

/**
 * Service for user-related operations.
 */
class UserService {
  /**
   * Create a UserService instance.
   * @param {Object} root0 Dependencies for UserService
   * @param {Object} root0.userRepository The user repository
   * @param {Object} root0.logger The logger instance
   * @param {Object} root0.config The configuration object
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
    this.logger.info('Updating user balance', { userId: user._id, currency, amount });

    const balances = [...user.balances];
    const balanceHistory = [...user.balance_history];
    const existingBalanceIndex = balances.findIndex((b) => b.currency === currency);

    if (existingBalanceIndex === -1) {
      if (parseFloat(amount) < 0) {
        this.logger.error('Insufficient funds for new balance', {
          userId: user._id, currency, amount
        });
        throw new Error('Insufficient funds');
      }
      balances.push({ currency, amount: parseFloat(amount) });
    } else {
      const newBalance =
        parseFloat(balances[existingBalanceIndex].amount) + parseFloat(amount);
      if (newBalance < 0) {
        this.logger.error('Insufficient funds for balance update', {
          userId: user._id, currency, amount, newBalance
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
      userId: user._id,
      currency,
      newAmount: balances.find((b) => b.currency === currency).amount
    });

    return { ...user, balances, balance_history: balanceHistory };
  }

  /**
   * Update the user's today balance in USD.
   * @param {Object} user The user object
   * @param {number|string} amount The new today balance in USD
   * @returns {Object} The updated user object
   */
  updateTodayBalanceUsd(user, amount) {
    this.logger.info('Updating today balance USD', { userId: user._id, amount });

    return {
      ...user,
      today_balance_usd: parseFloat(amount),
      last_fetched_date: new Date()
    };
  }

  /**
   * Get the user profile by user ID.
   * @param {string} userId The user ID
   * @returns {Promise<Object>} The user profile object
   */
  async getUserProfile(userId) {
    this.logger.info('Getting user profile', { userId });

    const user = await this.userRepository.ofId(userId);

    if (!user) {
      this.logger.error('User not found', { userId });
      throw new Error('User not found');
    }

    const today = new Date();
    const lastFetched = new Date(user.last_fetched_date);
    let userWithUpdatedHistory = user;

    if (today.toDateString() !== lastFetched.toDateString()) {
      this.logger.info('Updating user history for new day', { userId });
      userWithUpdatedHistory = this.updateTodayBalanceUsd(
        user,
        user.today_balance_usd
      );
      userWithUpdatedHistory = await this.userRepository.save(userWithUpdatedHistory);
    }

    this.logger.info('User profile retrieved successfully', { userId });

    return {
      user_id: userWithUpdatedHistory._id,
      user_name: userWithUpdatedHistory.user_name,
      balances: userWithUpdatedHistory.balances,
      daily_total_usd_history: userWithUpdatedHistory.daily_total_usd_history,
      last_fetched_date: userWithUpdatedHistory.last_fetched_date,
      today_balance_usd: userWithUpdatedHistory.today_balance_usd
    };
  }

  /**
   * Handle updating the user's balance.
   * @param {string} userId The user ID
   * @param {Object} balance The balance update object
   * @returns {Promise<Object>} The result of the balance update
   */
  async handleUpdateBalance(userId, balance) {
    this.logger.info('Handling balance update', { userId, balance });

    const user = await this.userRepository.ofId(userId);

    if (!user) {
      this.logger.error('User not found for balance update', { userId });
      throw new Error('User not found');
    }

    const updatedUserObj = this.updateBalance(user, balance.currency, balance.amount);
    const updatedUser = await this.userRepository.save(updatedUserObj);

    this.logger.info('Balance update completed successfully', { userId, balance });

    return {
      message: 'Balance updated',
      balances: updatedUser.balances
    };
  }
}

export default UserService;
