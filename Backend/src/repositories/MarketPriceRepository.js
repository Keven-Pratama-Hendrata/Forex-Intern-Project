/**
 * Abstract base class for market price repository.
 */
class MarketPriceRepository {
    /**
     * Get the market price document for a specific date.
     * @param {Date} date The date to query.
     * @returns {Promise<Object|null>} The market price document or null if not found.
     */
    // eslint-disable-next-line no-unused-vars
    async getByDate(date) {
        throw new Error('Method getByDate() must be implemented');
    }

    /**
     * Create or update the market price document for a date.
     * @param {Date} date The date for the price.
     * @param {Object} rates The rates object (USD, JPY, AUD, EUR, IDR).
     * @returns {Promise<Object>} The created or updated market price document.
     */
    // eslint-disable-next-line no-unused-vars
    async createOrUpdate(date, rates) {
        throw new Error('Method createOrUpdate() must be implemented');
    }

    /**
     * Get all market price documents, sorted by date ascending.
     * @returns {Promise<Array>} Array of market price documents.
     */
    async getAll() {
        throw new Error('Method getAll() must be implemented');
    }
}

export default MarketPriceRepository; 