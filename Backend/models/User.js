import mongoose from "mongoose"

const moneySchema = new mongoose.Schema({
    amount: { type: mongoose.Schema.Types.Decimal128, required: true, get: v => parseFloat(v) },
    currency: { type: String, required: true }
}, { _id: false, toJSON: { getters: true } });

const balance_historySchema = new mongoose.Schema({
    balance: { type: mongoose.Schema.Types.Decimal128, required: true, get: v => parseFloat(v) },
    currency: { type: String },
    amount: { type: mongoose.Schema.Types.Decimal128, get: v => parseFloat(v) },
    date: { type: Date, default: Date.now }
}, { _id: false, toJSON: { getters: true } });

const daily_total_usd_historySchema = new mongoose.Schema({
    total_usd: { type: mongoose.Schema.Types.Double, required: true, get: v => parseFloat(v) },
    date: { type: Date, default: Date.now },
    rates: { type: Map, of: String, required: true }
}, { _id: false, toJSON: { getters: true } });

const userSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    balances: [moneySchema],
    balance_history: [balance_historySchema],
    last_fetched_date: { type: Date, default: Date.now },
    today_balance_usd: { type: mongoose.Schema.Types.Double, default: 0.00, get: v => parseFloat(v) },
    daily_total_usd_history: [daily_total_usd_historySchema]
}, { timestamps: true, toJSON: { getters: true } });

const User = mongoose.model("User", userSchema);

export default User;