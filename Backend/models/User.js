import mongoose from "mongoose"

const balanceHistorySchema = new mongoose.Schema({
    balance: { type: mongoose.Schema.Types.Double, required: true, get: v => parseFloat(v) },
    currency: { type: String },
    amount: { type: mongoose.Schema.Types.Double, get: v => parseFloat(v) },
    date: { type: Date, default: Date.now }
}, { _id: false, toJSON: { getters: true } });

const dailyTotalUSDHistorySchema = new mongoose.Schema({
    totalUSD: { type: mongoose.Schema.Types.Double, required: true, get: v => parseFloat(v) },
    date: { type: Date, default: Date.now },
    rates: { type: Map, of: String, required: true }
}, { _id: false, toJSON: { getters: true } });

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    balances: {
        USD: { type: mongoose.Schema.Types.Double, default: 0.00, get: v => parseFloat(v) },
        EUR: { type: mongoose.Schema.Types.Double, default: 0.00, get: v => parseFloat(v) },
        JPY: { type: mongoose.Schema.Types.Double, default: 0.00, get: v => parseFloat(v) },
        AUD: { type: mongoose.Schema.Types.Double, default: 0.00, get: v => parseFloat(v) },
        IDR: { type: mongoose.Schema.Types.Double, default: 0.00, get: v => parseFloat(v) }
    },
    balanceHistory: [balanceHistorySchema],
    lastFetchedDate: { type: Date, default: Date.now },
    todayBalanceUSD: { type: mongoose.Schema.Types.Double, default: 0.00, get: v => parseFloat(v) },
    dailyTotalUSDHistory: [dailyTotalUSDHistorySchema]
}, { timestamps: true, toJSON: { getters: true } });

const User = mongoose.model("User", userSchema);

export default User;