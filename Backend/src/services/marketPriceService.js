import Constants from '../constants.js';
/**
 * Service for market price operations (multi-currency).
 */
class MarketPriceService {
    /**
     * Creates an instance of MarketPriceService.
     * @param {Object} dependencies The dependencies object.
     * @param {Object} dependencies.marketPriceRepository The market price repository.
     * @param {Object} dependencies.logger The logger instance.
     * @param {Object} dependencies.config The configuration object (should include BASE_URL, CURRENCY_API_KEY).
     */
    constructor({ marketPriceRepository, logger, config }) {
        this.marketPriceRepository = marketPriceRepository;
        this.logger = logger;
        this.config = config;
    }

    /**
     * Fetches today's rates from DB or CurrencyFreaks API, stores if new.
     * @returns {Promise<Object>} Today's rates document.
     */
    async getOrFetchTodayRates() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let doc = await this.marketPriceRepository.getByDate(today);
        if (doc) {
            this.logger.info('Market rates found in DB for today', { date: today });
            return doc;
        }
        this.logger.info('Fetching market rates from CurrencyFreaks API', { date: today });
        const rates = await this.fetchRatesFromAPI();
        doc = await this.marketPriceRepository.createOrUpdate(today, rates);
        this.logger.info('Stored new market rates for today', { date: today, rates });
        return doc;
    }

    /**
     * Fetches all stored market rates (history).
     * @returns {Promise<Array>} Array of market price documents.
     */
    async getHistory() {
        return this.marketPriceRepository.getAll();
    }

    /**
     * Fetches rates for USD, JPY, AUD, EUR, IDR from CurrencyFreaks API.
     * @returns {Promise<Object>} Rates object.
     */
    async fetchRatesFromAPI() {
        const { baseUrl, apiKey } = this.config.currencyApi;
        const symbols = ['JPY', 'AUD', 'EUR', 'IDR'];
        const url = `${baseUrl}?apikey=${apiKey}&symbols=${symbols.join(',')}`;
        const res = await fetch(url);
        if (!res.ok) {
            this.logger.error('Failed to fetch rates from CurrencyFreaks', { status: res.status });
            throw new Error(Constants.ERROR_CODES.RATE_LIMIT_EXCEEDED);
        }
        const data = await res.json();

        const rates = {};
        for (const symbol of symbols) {
            rates[symbol] = parseFloat(data.rates[symbol]);
        }
        return rates;
    }
}

export default MarketPriceService; 