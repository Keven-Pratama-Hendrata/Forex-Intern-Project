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
   * @param {Object} dependencies.marketPriceService The market price service
   */
  constructor({ userRepository, logger, config, marketPriceService }) {
    this.userRepository = userRepository;
    this.logger = logger;
    this.config = config;
    this.marketPriceService = marketPriceService;
  }

  /**
   * Creates a new balance entry.
   * @param {Object} user The user object
   * @param {string} currency The currency code
   * @param {number} amount The amount to add
   * @returns {Object} Updated balances array
   */
  createNewBalance(user, currency, amount) {
    if (parseFloat(amount) < 0) {
      this.logger.error('Insufficient funds for new balance', {
        userid: user.id, currency, amount
      });
      throw new Error('Insufficient funds');
    }

    this.logger.info('New balance created', {
      userid: user.id,
      currency,
      oldBalance: 0,
      change: parseFloat(amount),
      newBalance: parseFloat(amount)
    });

    return [{ currency, amount: parseFloat(amount) }];
  }

  /**
   * Updates an existing balance entry.
   * @param {Array} balances Current balances array
   * @param {number} existingBalanceIndex Index of existing balance
   * @param {Object} user The user object
   * @param {string} currency The currency code
   * @param {number} amount The amount to update
   * @returns {Array} Updated balances array
   */
  updateExistingBalance(balances, existingBalanceIndex, user, currency, amount) {
    const oldBalance = balances[existingBalanceIndex].amount;
    const newBalance = parseFloat(oldBalance) + parseFloat(amount);

    if (newBalance < 0) {
      this.logger.error('Insufficient funds for balance update', {
        userid: user.id, currency, amount, oldBalance, newBalance
      });
      throw new Error('Insufficient funds');
    }

    balances[existingBalanceIndex].amount = newBalance;

    this.logger.info('Balance updated', {
      userid: user.id,
      currency,
      oldBalance: parseFloat(oldBalance),
      change: parseFloat(amount),
      newBalance: newBalance
    });

    return balances;
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
      balances.push(...this.createNewBalance(user, currency, amount));
    } else {
      this.updateExistingBalance(balances, existingBalanceIndex, user, currency, amount);
    }

    balanceHistory.push({
      currency,
      balance: balances.find((b) => b.currency === currency).amount,
      amount: parseFloat(amount),
      date: new Date()
    });

    this.logger.info('Balance change logged to history', {
      userid: user.id,
      currency,
      finalBalance: balances.find((b) => b.currency === currency).amount,
      changeAmount: parseFloat(amount),
      timestamp: new Date().toISOString()
    });

    user.balances = balances;
    user.balanceHistory = balanceHistory;
    return user;
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
   * Calculate transaction amounts based on type and rate.
   * @param {Object} transaction The transaction object
   * @param {number} currencyRate The current exchange rate (IDR per foreign currency)
   * @returns {Object} Calculated amounts
   */
  calculateTransactionAmounts(transaction, currencyRate) {
    let idrAmount, foreignAmount;

    if (transaction.transactionType === 'buy') {
      idrAmount = -transaction.amount;
      foreignAmount = transaction.amount / currencyRate;
    } else {
      foreignAmount = -transaction.amount;
      idrAmount = transaction.amount * currencyRate;
    }

    this.logger.info('Transaction calculation details', {
      transactionType: transaction.transactionType,
      originalAmount: transaction.amount,
      currencyRate,
      idrAmount,
      foreignAmount,
      calculation: transaction.transactionType === 'buy'
        ? `${transaction.amount} IDR ÷ ${currencyRate} = ${transaction.amount / currencyRate} ${transaction.currency}`
        : `${transaction.amount} ${transaction.currency} × ${currencyRate} = ${transaction.amount * currencyRate} IDR`
    });

    return { idrAmount, foreignAmount };
  }

  /**
   * Validates and retrieves user for transaction.
   * @param {string} userid The user ID
   * @param {Object} transaction The transaction object
   * @returns {Promise<Object>} The user object
   */
  async validateAndGetUser(userid, transaction) {
    const user = await this.userRepository.findOneById(userid);

    if (!user) {
      this.logger.error('User not found for transaction', { userid });
      throw new Error('User not found');
    }

    this.logger.info('Initial balances before transaction', {
      userid,
      balances: user.balances,
      transactionType: transaction.transactionType,
      currency: transaction.currency,
      amount: transaction.amount
    });

    return user;
  }

  /**
   * Validates exchange rate from transaction.
   * @param {Object} transaction The transaction object
   * @returns {number} The validated exchange rate
   */
  validateExchangeRate(transaction) {
    const currencyRate = transaction.exchangeRate;

    if (!currencyRate) {
      this.logger.error('Exchange rate not provided', { currency: transaction.currency });
      throw new Error('Exchange rate not available');
    }

    this.logger.info('Using exchange rate from frontend', {
      userid: transaction.userid,
      currency: transaction.currency,
      rate: currencyRate
    });

    return currencyRate;
  }

  /**
   * Updates user balances for transaction.
   * @param {Object} user The user object
   * @param {Object} transaction The transaction object
   * @param {number} idrAmount The IDR amount to update
   * @param {number} foreignAmount The foreign currency amount to update
   * @returns {Object} The updated user object
   */
  updateUserBalances(user, transaction, idrAmount, foreignAmount) {
    this.logger.info('Updating IDR balance', { userid: user.id, idrAmount });
    const updatedUserWithIdr = this.updateBalance(user, 'IDR', idrAmount);

    this.logger.info('Updating foreign currency balance', {
      userid: user.id,
      currency: transaction.currency,
      foreignAmount
    });

    return this.updateBalance(updatedUserWithIdr, transaction.currency, foreignAmount);
  }

  /**
   * Process buy/sell transactions with current market rates.
   * @param {string} userid The user ID
   * @param {Object} transaction The transaction object
   * @param {string} transaction.currency The currency to buy/sell
   * @param {number} transaction.amount The amount to transact
   * @param {string} transaction.transactionType 'buy' or 'sell'
   * @param {number} transaction.exchangeRate The exchange rate from frontend
   * @returns {Promise<Object>} The result of the transaction
   */
  async processTransaction(userid, transaction) {
    this.logger.info('Processing transaction', { userid, transaction });

    const user = await this.validateAndGetUser(userid, transaction);
    const currencyRate = this.validateExchangeRate(transaction);
    const { idrAmount, foreignAmount } = this.calculateTransactionAmounts(transaction, currencyRate);

    this.logger.info('Transaction amounts calculated', {
      userid,
      transactionType: transaction.transactionType,
      originalAmount: transaction.amount,
      idrAmount,
      foreignAmount,
      exchangeRate: currencyRate
    });

    const updatedUser = this.updateUserBalances(user, transaction, idrAmount, foreignAmount);
    const finalUser = await this.userRepository.save(updatedUser);

    this.logger.info('Transaction completed successfully', {
      userid,
      transactionType: transaction.transactionType,
      currency: transaction.currency,
      originalAmount: transaction.amount,
      idrAmount,
      foreignAmount,
      rate: currencyRate,
      finalBalances: finalUser.balances,
      timestamp: new Date().toISOString()
    });

    return {
      message: 'Transaction completed',
      balances: finalUser.balances,
      transaction: {
        type: transaction.transactionType,
        currency: transaction.currency,
        amount: transaction.amount,
        rate: currencyRate,
        idrAmount,
        foreignAmount
      }
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

  /**
   * Get transaction history for the user.
   * @param {string} userid The user ID
   * @returns {Promise<Object>} The transaction history data
   */
  async getTransactionHistory(userid) {
    this.logger.info('Getting transaction history', { userid });

    const user = await this.userRepository.findOneById(userid);

    if (!user) {
      this.logger.error('User not found for transaction history', { userid });
      throw new Error('User not found');
    }

    const history = user.balanceHistory || [];

    this.logger.info('Transaction history retrieved successfully', {
      userid,
      historyCount: history.length
    });

    return {
      username: user.username,
      balanceHistory: history
    };
  }
}

export default UserService;
