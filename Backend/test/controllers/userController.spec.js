import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;

import UserController from '../../src/controllers/userController.js';
import { createMockLogger } from '../mock/logger.mock.js';
import { createMockReq, createMockRes, createMockNext } from '../mock/express.mock.js';

describe('UserController', () => {
    let req, res, next, mockUserService, mockLogger, controller;

    beforeEach(() => {
        req = createMockReq({ user: { id: '1' }, body: { balance: { currency: 'USD', amount: 100 } } });
        res = createMockRes();
        next = createMockNext();
        mockUserService = {
            getUserProfile: sinon.stub(),
            handleUpdateBalance: sinon.stub()
        };
        mockLogger = createMockLogger();
        controller = new UserController({ userService: mockUserService, logger: mockLogger });
    });

    afterEach(() => sinon.restore());

    describe('getUserProfile', () => {
        it('should return user profile on success', async () => {
            const fakeProfile = { user_id: '1', user_name: 'test' };
            mockUserService.getUserProfile.resolves(fakeProfile);
            await controller.getUserProfile(req, res, next);
            expect(mockLogger.info).to.have.been.calledWith('Getting user profile', { userId: '1' });
            expect(mockUserService.getUserProfile).to.have.been.calledWith('1');
            expect(mockLogger.info).to.have.been.calledWith('User profile retrieved successfully', { userId: '1' });
            expect(res.status).to.have.been.calledWith(200);
            expect(res.json).to.have.been.calledWith(fakeProfile);
        });
        it('should handle errors and call next with error', async () => {
            const error = new Error('fail');
            mockUserService.getUserProfile.rejects(error);
            await controller.getUserProfile(req, res, next);
            expect(mockLogger.error).to.have.been.calledWith('Failed to get user profile', { userId: '1', error: error.message });
            expect(next).to.have.been.calledWith(error);
        });
    });

    describe('updateBalance', () => {
        it('should update balance and return result on success', async () => {
            const fakeResult = { message: 'Balance updated', balances: [] };
            mockUserService.handleUpdateBalance.resolves(fakeResult);
            await controller.updateBalance(req, res, next);
            expect(mockLogger.info).to.have.been.calledWith('Updating user balance', { userId: '1', balance: req.body.balance });
            expect(mockUserService.handleUpdateBalance).to.have.been.calledWith('1', req.body.balance);
            expect(mockLogger.info).to.have.been.calledWith('Balance updated successfully', { userId: '1', balance: req.body.balance });
            expect(res.status).to.have.been.calledWith(200);
            expect(res.json).to.have.been.calledWith(fakeResult);
        });
        it('should handle errors and call next with error', async () => {
            const error = new Error('fail');
            mockUserService.handleUpdateBalance.rejects(error);
            await controller.updateBalance(req, res, next);
            expect(mockLogger.error).to.have.been.calledWith('Failed to update balance', { userId: '1', balance: req.body.balance, error: error.message });
            expect(next).to.have.been.calledWith(error);
        });
    });
}); 