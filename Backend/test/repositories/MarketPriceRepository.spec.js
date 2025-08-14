import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;

import MarketPriceRepository from '../../src/repositories/MarketPriceRepository.js';

describe('MarketPriceRepository', () => {
    let repo;

    beforeEach(() => {
        repo = new MarketPriceRepository();
    });

    describe('getByDate', () => {
        it('should throw not implemented error', async () => {
            const date = new Date();

            await expect(repo.getByDate(date)).to.be.rejectedWith('Method getByDate() must be implemented');
        });
    });

    describe('createOrUpdate', () => {
        it('should throw not implemented error', async () => {
            const date = new Date();
            const rates = {};

            await expect(repo.createOrUpdate(date, rates)).to.be.rejectedWith('Method createOrUpdate() must be implemented');
        });
    });

    describe('getAll', () => {
        it('should throw not implemented error', async () => {
            await expect(repo.getAll()).to.be.rejectedWith('Method getAll() must be implemented');
        });
    });
}); 