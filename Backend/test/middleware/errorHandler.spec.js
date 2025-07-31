import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;

import errorHandler from '../../src/middleware/errorHandler.js';

describe('errorHandler middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
        next = sinon.stub();
    });

    it('should handle default error', () => {
        const err = new Error('Something went wrong');

        errorHandler(err, req, res, next);

        expect(res.status).to.have.been.calledWith(500);
        expect(res.json).to.have.been.calledWith({
            code: 'INTERNAL_ERROR',
            error: { message: 'Something went wrong' },
            message: 'Something went wrong',
        });
    });

    it('should handle custom error code and statusCode', () => {
        const err = new Error('Custom error');
        err.code = 'CUSTOM_CODE';
        err.statusCode = 400;

        errorHandler(err, req, res, next);

        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({
            code: 'CUSTOM_CODE',
            error: { message: 'Custom error' },
            message: 'Custom error',
        });
    });

    it('should handle missing error message', () => {
        const err = {};

        errorHandler(err, req, res, next);

        expect(res.status).to.have.been.calledWith(500);
        expect(res.json).to.have.been.calledWith({
            code: 'INTERNAL_ERROR',
            error: { message: 'Internal Server Error' },
            message: 'Internal Server Error',
        });
    });
}); 