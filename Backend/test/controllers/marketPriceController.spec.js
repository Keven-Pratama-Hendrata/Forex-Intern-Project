import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import sinon from 'sinon';
const expect = chai.expect;

import MarketPriceController from '../../src/controllers/marketPriceController.js';
import Constants from '../../src/constants.js';
import { createMockLogger } from '../mock/logger.mock.js';
import { createMockReq, createMockRes, createMockNext } from '../mock/express.mock.js';
import { mockMarketPriceDoc, mockMarketPriceDocs } from '../mock/market.mock.js';

describe('MarketPriceController', () => {
    let controller, mockService, mockLogger, req, res, next;

    beforeEach(() => {
        mockService = {
            getOrFetchTodayRates: sinon.stub(),
            getHistory: sinon.stub()
        };
        mockLogger = createMockLogger();
        controller = new MarketPriceController({ marketPriceService: mockService, logger: mockLogger });
        req = createMockReq();
        res = createMockRes();
        next = createMockNext();
    });

    afterEach(() => sinon.restore());

    describe('getTodayRates', () => {
        it('should return today rates on success', async () => {
            mockService.getOrFetchTodayRates.resolves(mockMarketPriceDoc);

            await controller.getTodayRates(req, res, next);

            expect(mockService.getOrFetchTodayRates).to.have.been.calledOnce;
            expect(res.status).to.have.been.calledWith(Constants.HTTP_STATUS.OK);
            expect(res.json).to.have.been.calledWith({ date: mockMarketPriceDoc.date, rates: mockMarketPriceDoc.rates });
        });

        it('should handle errors and call next', async () => {
            const error = new Error('fail');
            mockService.getOrFetchTodayRates.rejects(error);

            await controller.getTodayRates(req, res, next);

            expect(mockLogger.error).to.have.been.calledWith('Failed to get today market rates', { error: error.message });
            expect(next).to.have.been.calledWith(error);
        });
    });

    describe('getHistory', () => {
        it('should return history on success', async () => {
            mockService.getOrFetchTodayRates.resolves();
            mockService.getHistory.resolves(mockMarketPriceDocs);

            await controller.getHistory(req, res, next);

            expect(mockService.getOrFetchTodayRates).to.have.been.calledOnce;
            expect(mockService.getHistory).to.have.been.calledOnce;
            expect(res.status).to.have.been.calledWith(Constants.HTTP_STATUS.OK);
            expect(res.json).to.have.been.calledWith(mockMarketPriceDocs);
        });

        it('should handle errors and call next', async () => {
            const error = new Error('fail');
            mockService.getOrFetchTodayRates.rejects(error);

            await controller.getHistory(req, res, next);

            expect(mockLogger.error).to.have.been.calledWith('Failed to get market price history', { error: error.message });
            expect(next).to.have.been.calledWith(error);
        });
    });
}); 