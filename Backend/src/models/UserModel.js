import mongoose from 'mongoose';

/**
 * Parses a Decimal128 value to float.
 * @param {mongoose.Types.Decimal128} v The Decimal128 value to convert.
 * @returns {number} The float representation of the value.
 */
function decimal128ToFloat(v) {
  return parseFloat(v);
}

/**
 * Parses a Double value to float.
 * @param {number} v The double value to convert.
 * @returns {number} The float representation of the value.
 */
function doubleToFloat(v) {
  return parseFloat(v);
}

const moneySchemaFields = {
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    get: decimal128ToFloat
  },
  currency: {
    type: String,
    required: true
  }
};

/**
 * Schema for a single currency balance.
 * @type {mongoose.Schema}
 */
const moneySchema = new mongoose.Schema(moneySchemaFields, {
  id: false,
  toJSON: {
    getters: true
  }
});

const balanceHistorySchemaFields = {
  balance: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    get: decimal128ToFloat
  },
  currency: {
    type: String
  },
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    get: decimal128ToFloat
  },
  date: {
    type: Date,
    default: Date.now
  }
};

/**
 * Schema for a user's balance history entry.
 * @type {mongoose.Schema}
 */
const balanceHistorySchema = new mongoose.Schema(balanceHistorySchemaFields, {
  id: false,
  toJSON: {
    getters: true
  }
});

const dailyTotalUsdHistorySchemaFields = {
  totalUsd: {
    type: mongoose.Schema.Types.Double,
    required: true,
    get: doubleToFloat
  },
  date: {
    type: Date,
    default: Date.now
  },
  rates: {
    type: Map,
    of: String,
    required: true
  }
};

/**
 * Schema for a user's daily total USD history entry.
 * @type {mongoose.Schema}
 */
const dailyTotalUsdHistorySchema = new mongoose.Schema(dailyTotalUsdHistorySchemaFields, {
  id: false,
  toJSON: {
    getters: true
  }
});

const userSchemaFields = {
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  balances: [moneySchema],
  balanceHistory: [balanceHistorySchema],
  lastFetchedDate: {
    type: Date,
    default: Date.now
  },
  todayBalanceUsd: {
    type: mongoose.Schema.Types.Double,
    default: 0.00,
    get: doubleToFloat
  },
  dailyTotalUsdHistory: [dailyTotalUsdHistorySchema]
};

/**
 * Main user schema for the application.
 * @type {mongoose.Schema}
 */
const userSchema = new mongoose.Schema(userSchemaFields, {
  timestamps: true,
  toJSON: {
    getters: true
  }
});

/**
 * User model for MongoDB collection 'users'.
 * @type {mongoose.Model}
 */
const User = mongoose.model('User', userSchema);

export default User;
