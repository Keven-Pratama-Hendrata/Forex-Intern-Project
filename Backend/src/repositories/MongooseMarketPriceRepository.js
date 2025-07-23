import MarketPrice from '../models/MarketPriceModel.js';
import MarketPriceRepository from './MarketPriceRepository.js';

/**
 * Mongoose implementation of MarketPriceRepository.
 */
class MongooseMarketPriceRepository extends MarketPriceRepository {
    /**
     * @inheritdoc
     */
    async getByDate(date) {
        return MarketPrice.findOne({ date }).exec();
    }

    /**
     * @inheritdoc
     */
    async createOrUpdate(date, rates) {
        return MarketPrice.findOneAndUpdate(
            { date },
            { $set: { rates } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        ).exec();
    }

    /**
     * @inheritdoc
     */
    async getAll() {
        return MarketPrice.find({}).sort({ date: 1 }).exec();
    }
}

export default MongooseMarketPriceRepository; 