import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;

import createRateLimiter from '../../src/middleware/rateLimiter.js';

describe('rateLimiter middleware', () => {
    it('should return a middleware function with default config', () => {
        const config = { rateLimit: {} };

        const middleware = createRateLimiter(config);

        expect(middleware).to.be.a('function');
    });

    it('should return a middleware function with custom config', () => {
        const config = { rateLimit: { windowMs: 1000, max: 5 } };

        const middleware = createRateLimiter(config);

        expect(middleware).to.be.a('function');
    });
}); 