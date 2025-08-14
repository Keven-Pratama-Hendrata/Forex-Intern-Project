import express from 'express';

/**
 * Initializes market price routes with provided dependencies.
 * @param {Object} dependencies An object containing all dependencies for the market price routes.
 * @param {Object} dependencies.marketPriceController The market price controller instance.
 * @param {Object} dependencies.logger The logger instance.
 * @returns {import('express').Router} The configured Express router for market price routes.
 */
export default function createMarketPriceRoutes({ marketPriceController, logger }) {
    const router = express.Router();

    /**
     * Route handler for getting historical market rates.
     */
    router.get('/history', (req, res, next) => {
        logger.info('Market price history route accessed', { method: 'GET', path: '/history' });
        marketPriceController.getHistory(req, res, next);
    });

    logger.info('Market price routes initialized successfully');
    return router;
} 