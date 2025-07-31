import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import sinon from 'sinon';
const expect = chai.expect;

import createMarketPriceRoutes from '../../src/routes/marketRoute.js';

describe('marketRoute', () => {
    let marketPriceController, logger, router;

    beforeEach(() => {
        marketPriceController = {
            getHistory: sinon.stub()
        };
        logger = { info: sinon.stub() };
        router = createMarketPriceRoutes({ marketPriceController, logger });
        logger.info.resetHistory();
    });

    it('should register /history GET and call logger and controller', () => {
        const req = {}, res = {}, next = () => { };
        const route = router.stack.find(r => r.route && r.route.path === '/history');
        expect(route).to.exist;

        route.route.stack[0].handle(req, res, next);

        expect(logger.info).to.have.been.calledWith('Market price history route accessed', { method: 'GET', path: '/history' });
        expect(marketPriceController.getHistory).to.have.been.calledWith(req, res, next);
    });

    it('should log routes initialized', () => {
        createMarketPriceRoutes({ marketPriceController, logger });

        expect(logger.info).to.have.been.calledWith('Market price routes initialized successfully');
    });
}); 