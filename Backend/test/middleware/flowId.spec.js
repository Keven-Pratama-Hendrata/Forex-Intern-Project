import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;

import flowIdMiddleware from '../../src/middleware/flowId.js';

describe('flowIdMiddleware', () => {
    let req, res, next;
    const fakeUuid = '123e4567-e89b-12d3-a456-426614174000';
    const fakeUuidFn = () => fakeUuid;

    beforeEach(() => {
        req = { header: sinon.stub(), flowId: undefined };
        res = { setHeader: sinon.stub() };
        next = sinon.stub();
    });

    it('should use valid flow ID from header', () => {
        req.header.withArgs('X-Flow-ID').returns('abcd1234ABCD');

        flowIdMiddleware(req, res, next, fakeUuidFn);

        expect(req.flowId).to.equal('abcd1234ABCD');
        expect(res.setHeader).to.have.been.calledWith('X-Flow-ID', 'abcd1234ABCD');
        expect(next).to.have.been.calledOnce;
    });

    it('should generate new flow ID if header is missing', () => {
        req.header.withArgs('X-Flow-ID').returns(undefined);

        flowIdMiddleware(req, res, next, fakeUuidFn);

        expect(req.flowId).to.equal(fakeUuid);
        expect(res.setHeader).to.have.been.calledWith('X-Flow-ID', fakeUuid);
        expect(next).to.have.been.calledOnce;
    });

    it('should generate new flow ID if header is invalid', () => {
        req.header.withArgs('X-Flow-ID').returns('!@#$');

        flowIdMiddleware(req, res, next, fakeUuidFn);

        expect(req.flowId).to.equal(fakeUuid);
        expect(res.setHeader).to.have.been.calledWith('X-Flow-ID', fakeUuid);
        expect(next).to.have.been.calledOnce;
    });
}); 