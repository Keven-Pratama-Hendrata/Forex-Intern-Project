import Constants from '../constants.js';
/**
 * Controller for market price endpoints.
 */
class MarketPriceController {
    /**
     * Creates an instance of MarketPriceController.
     * @param {Object} dependencies The dependencies object.
     * @param {Object} dependencies.marketPriceService The market price service.
     * @param {Object} dependencies.logger The logger instance.
     */
    constructor({ marketPriceService, logger }) {
        this.marketPriceService = marketPriceService;
        this.logger = logger;
    }

    /**
     * Gets today's market rates (fetches from API if not in DB).
     * @param {Object} req Express request object
     * @param {Object} res Express response object
     * @param {Function} next Express next middleware function
     */
    async getTodayRates(req, res, next) {
        try {
            const doc = await this.marketPriceService.getOrFetchTodayRates();
            res.status(Constants.HTTP_STATUS.OK).json({ date: doc.date, rates: doc.rates });
        } catch (err) {
            this.logger.error('Failed to get today market rates', { error: err.message });
            next(err);
        }
    }

    /**
     * Gets all historical market rates.
     * @param {Object} req Express request object
     * @param {Object} res Express response object
     * @param {Function} next Express next middleware function
     */
    async getHistory(req, res, next) {
        try {
            await this.marketPriceService.getOrFetchTodayRates();
            const docs = await this.marketPriceService.getHistory();
            res.status(Constants.HTTP_STATUS.OK).json(docs);
        } catch (err) {
            this.logger.error('Failed to get market price history', { error: err.message });
            next(err);
        }
    }
}

export default MarketPriceController; 