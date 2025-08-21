import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import sinon from 'sinon';
const expect = chai.expect;

import MarketPriceService from '../../src/services/marketPriceService.js';
import Constants from '../../src/constants.js';
import { mockMarketPriceDoc, mockMarketPriceDocs } from '../mock/market.mock.js';

function createMockLogger() {
    return {
        info: sinon.stub(),
        error: sinon.stub()
    };
}

describe('MarketPriceService', () => {
    let service, mockRepo, mockLogger, mockConfig;

    beforeEach(() => {
        mockRepo = {
            getByDate: sinon.stub(),
            createOrUpdate: sinon.stub(),
            getAll: sinon.stub()
        };
        mockLogger = createMockLogger();
        mockConfig = {
            currencyApi: {
                baseUrl: 'http://api',
                apiKey: 'key'
            }
        };
        service = new MarketPriceService({ marketPriceRepository: mockRepo, logger: mockLogger, config: mockConfig });
    });

    afterEach(() => sinon.restore());

    describe('getOrFetchTodayRates', () => {
        it('should return today rates from DB if found', async () => {
            const today = new Date(); today.setHours(0, 0, 0, 0);
            const doc = { ...mockMarketPriceDoc, date: today };
            mockRepo.getByDate.resolves(doc);

            const result = await service.getOrFetchTodayRates();

            expect(mockRepo.getByDate).to.have.been.calledOnce;
            expect(result).to.equal(doc);
            expect(mockLogger.info).to.have.been.calledWith('Market rates found in DB for today', { date: today });
        });

        it('should fetch from API and store if not in DB', async () => {
            const today = new Date(); today.setHours(0, 0, 0, 0);
            mockRepo.getByDate.resolves(null);
            const fakeRates = { ...mockMarketPriceDoc.rates };
            const fakeDoc = { ...mockMarketPriceDoc, date: today, rates: fakeRates };
            sinon.stub(service, 'fetchRatesFromAPI').resolves(fakeRates);
            mockRepo.createOrUpdate.resolves(fakeDoc);

            const result = await service.getOrFetchTodayRates();

            expect(service.fetchRatesFromAPI).to.have.been.calledOnce;
            expect(mockRepo.createOrUpdate).to.have.been.calledWith(today, fakeRates);
            expect(result).to.equal(fakeDoc);
            expect(mockLogger.info).to.have.been.calledWith('Fetching market rates from CurrencyFreaks API', { date: today });
            expect(mockLogger.info).to.have.been.calledWith('Stored new market rates for today', { date: today, rates: fakeRates });
        });
    });

    describe('getHistory', () => {
        it('should return all market price history', async () => {
            mockRepo.getAll.resolves(mockMarketPriceDocs);

            const result = await service.getHistory();

            expect(mockRepo.getAll).to.have.been.calledOnce;
            expect(result).to.equal(mockMarketPriceDocs);
        });
    });

    describe('fetchRatesFromAPI', () => {
        let fetchStub;
        beforeEach(() => {
            fetchStub = sinon.stub(global, 'fetch');
        });
        afterEach(() => {
            fetchStub.restore();
        });

        it('should fetch rates from API and return parsed rates', async () => {
            const fakeResponse = {
                ok: true,
                json: async () => ({ rates: { JPY: '100', AUD: '1.5', EUR: '0.9', IDR: '15000' } })
            };
            fetchStub.resolves(fakeResponse);

            const result = await service.fetchRatesFromAPI();

            expect(fetchStub).to.have.been.calledOnce;
            expect(result).to.deep.equal({ JPY: 100, AUD: 1.5, EUR: 0.9, IDR: 15000 });
        });

        it('should log and throw error if API response is not ok', async () => {
            const fakeResponse = { ok: false, status: 429 };
            fetchStub.resolves(fakeResponse);

            let error;
            try {
                await service.fetchRatesFromAPI();
            } catch (err) {
                error = err;
            }

            expect(mockLogger.error).to.have.been.calledWith('Failed to fetch rates from CurrencyFreaks', { status: 429 });
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal(Constants.ERROR_CODES.RATE_LIMIT_EXCEEDED);
        });
    });
}); 