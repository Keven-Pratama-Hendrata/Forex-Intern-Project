import mongoose from 'mongoose';

/**
 * Schema for daily market prices for multiple currencies.
 * @type {mongoose.Schema}
 */
const marketPriceSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true
    },
    rates: {
        USD: { type: Number, required: true },
        JPY: { type: Number, required: true },
        AUD: { type: Number, required: true },
        EUR: { type: Number, required: true },
        IDR: { type: Number, required: true }
    }
}, {
    toJSON: { getters: true },
    timestamps: true
});

/**
 * MarketPrice model for MongoDB collection 'marketprices'.
 * @type {mongoose.Model}
 */
const MarketPrice = mongoose.model('MarketPrice', marketPriceSchema);

export default MarketPrice; 