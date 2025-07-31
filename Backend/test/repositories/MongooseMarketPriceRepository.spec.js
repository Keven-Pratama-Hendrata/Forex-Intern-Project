import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import sinon from 'sinon';
const expect = chai.expect;

import MongooseMarketPriceRepository from '../../src/repositories/MongooseMarketPriceRepository.js';
import * as MarketPriceModule from '../../src/models/MarketPriceModel.js';

describe('MongooseMarketPriceRepository', () => {
    let repo, findOneStub, findOneAndUpdateStub, findStub;

    beforeEach(() => {
        repo = new MongooseMarketPriceRepository();
        findOneStub = sinon.stub(MarketPriceModule.default, 'findOne');
        findOneAndUpdateStub = sinon.stub(MarketPriceModule.default, 'findOneAndUpdate');
        findStub = sinon.stub(MarketPriceModule.default, 'find');
    });

    afterEach(() => sinon.restore());

    describe('getByDate', () => {
        it('should call findOne with correct date', async () => {
            const date = new Date();
            const execStub = sinon.stub().resolves('doc');
            findOneStub.returns({ exec: execStub });

            const result = await repo.getByDate(date);

            expect(findOneStub).to.have.been.calledWith({ date });
            expect(execStub).to.have.been.calledOnce;
            expect(result).to.equal('doc');
        });
    });

    describe('createOrUpdate', () => {
        it('should call findOneAndUpdate with correct args', async () => {
            const date = new Date();
            const rates = { USD: 1.0 };
            const execStub = sinon.stub().resolves('doc');
            findOneAndUpdateStub.returns({ exec: execStub });

            const result = await repo.createOrUpdate(date, rates);

            expect(findOneAndUpdateStub).to.have.been.calledWith(
                { date },
                { $set: { rates } },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            expect(execStub).to.have.been.calledOnce;
            expect(result).to.equal('doc');
        });
    });

    describe('getAll', () => {
        it('should call find and sort by date', async () => {
            const sortStub = sinon.stub().returns({ exec: sinon.stub().resolves('docs') });
            findStub.returns({ sort: sortStub });

            const result = await repo.getAll();

            expect(findStub).to.have.been.calledWith({});
            expect(sortStub).to.have.been.calledWith({ date: 1 });
            expect(result).to.equal('docs');
        });
    });
}); 