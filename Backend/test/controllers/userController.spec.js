import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;

import UserController from '../../src/controllers/userController.js';
import {
    createMockLogger,
    createMockReq,
    createMockRes,
    createMockNext,
    createMockUserService,
    getMockUserWithId,
    createMockError,
    mockErrorMessages,
    mockBalanceRequest
} from '../mock/index.js';

describe('UserController', () => {
    let req, res, next, mockUserService, mockLogger, controller;

    beforeEach(() => {
        req = createMockReq({ user: { id: '1' }, body: mockBalanceRequest });
        res = createMockRes();
        next = createMockNext();
        mockUserService = createMockUserService();
        mockLogger = createMockLogger();
        controller = new UserController({ userService: mockUserService, logger: mockLogger });
    });

    afterEach(() => sinon.restore());

    describe('getUserProfile', () => {
        it('should return user profile on success', async () => {
            const fakeProfile = getMockUserWithId('1');
            mockUserService.getUserProfile.resolves(fakeProfile);

            await controller.getUserProfile(req, res, next);

            expect(mockLogger.info).to.have.been.calledWith('Getting user profile', { userid: '1' });
            expect(mockUserService.getUserProfile).to.have.been.calledWith('1');
            expect(mockLogger.info).to.have.been.calledWith('User profile retrieved successfully', { userid: '1' });
            expect(res.status).to.have.been.calledWith(200);
            expect(res.json).to.have.been.calledWith(fakeProfile);
        });

        it('should handle errors and call next with error', async () => {
            const error = createMockError(mockErrorMessages.GENERIC);
            mockUserService.getUserProfile.rejects(error);

            await controller.getUserProfile(req, res, next);

            expect(mockLogger.error).to.have.been.calledWith('Failed to get user profile', { userid: '1', error: error.message });
            expect(next).to.have.been.calledWith(error);
        });

        it('should throw error when req.user is not found', async () => {
            const reqWithoutUser = createMockReq();

            await controller.getUserProfile(reqWithoutUser, res, next);

            expect(mockLogger.error).to.have.been.calledWith('User not found in request');
            expect(next).to.have.been.calledWith(sinon.match.instanceOf(Error));
        });

        it('should handle errors when req.user is undefined in catch block', async () => {
            const reqWithoutUser = createMockReq();

            await controller.getUserProfile(reqWithoutUser, res, next);

            expect(mockLogger.error).to.have.been.calledWith('User not found in request');
            expect(next).to.have.been.calledWith(sinon.match.instanceOf(Error));
        });

        it('should handle service errors with proper error logging', async () => {
            const error = createMockError(mockErrorMessages.SERVICE_ERROR);
            mockUserService.getUserProfile.rejects(error);

            await controller.getUserProfile(req, res, next);

            expect(mockLogger.error).to.have.been.calledWith('Failed to get user profile', { userid: '1', error: error.message });
            expect(next).to.have.been.calledWith(error);
        });
    });

    describe('updateBalance', () => {
        it('should update balance and return result on success', async () => {
            const fakeResult = { message: 'Balance updated', balances: [] };
            mockUserService.handleUpdateBalance.resolves(fakeResult);

            await controller.updateBalance(req, res, next);

            expect(mockLogger.info).to.have.been.calledWith('Updating user balance', { userid: '1', balance: req.body.balance });
            expect(mockUserService.handleUpdateBalance).to.have.been.calledWith('1', req.body.balance);
            expect(mockLogger.info).to.have.been.calledWith('Balance updated successfully', { userid: '1', balance: req.body.balance });
            expect(res.status).to.have.been.calledWith(200);
            expect(res.json).to.have.been.calledWith(fakeResult);
        });

        it('should handle errors and call next with error', async () => {
            const error = createMockError(mockErrorMessages.GENERIC);
            mockUserService.handleUpdateBalance.rejects(error);

            await controller.updateBalance(req, res, next);

            expect(mockLogger.error).to.have.been.calledWith('Failed to update balance', { userid: '1', balance: req.body.balance, error: error.message });
            expect(next).to.have.been.calledWith(error);
        });

        it('should throw error when req.user is not found', async () => {
            const reqWithoutUser = createMockReq({ body: mockBalanceRequest });

            await controller.updateBalance(reqWithoutUser, res, next);

            expect(mockLogger.error).to.have.been.calledWith('User not found in request');
            expect(next).to.have.been.calledWith(sinon.match.instanceOf(Error));
        });

        it('should handle errors when req.user is undefined in catch block', async () => {
            const reqWithoutUser = createMockReq({ body: mockBalanceRequest });

            await controller.updateBalance(reqWithoutUser, res, next);

            expect(mockLogger.error).to.have.been.calledWith('User not found in request');
            expect(next).to.have.been.calledWith(sinon.match.instanceOf(Error));
        });

        it('should handle errors when req.body is undefined in catch block', async () => {
            const reqWithoutBody = createMockReq({ user: { id: '1' } });
            const error = createMockError(mockErrorMessages.SERVICE_ERROR);
            mockUserService.handleUpdateBalance.rejects(error);

            await controller.updateBalance(reqWithoutBody, res, next);

            expect(mockLogger.error).to.have.been.calledWith('Failed to update balance', { userid: '1', balance: undefined, error: error.message });
            expect(next).to.have.been.calledWith(error);
        });

        it('should handle errors when req.body is null in catch block', async () => {
            const reqWithNullBody = createMockReq({ user: { id: '1' }, body: null });

            await controller.updateBalance(reqWithNullBody, res, next);

            expect(mockLogger.error).to.have.been.calledWith('Failed to update balance', { userid: '1', balance: undefined, error: "Cannot destructure property 'balance' of 'req.body' as it is null." });
            expect(next).to.have.been.calledWith(sinon.match.instanceOf(Error));
        });

        it('should handle service errors with proper error logging', async () => {
            const error = createMockError(mockErrorMessages.SERVICE_ERROR);
            mockUserService.handleUpdateBalance.rejects(error);

            await controller.updateBalance(req, res, next);

            expect(mockLogger.error).to.have.been.calledWith('Failed to update balance', { userid: '1', balance: req.body.balance, error: error.message });
            expect(next).to.have.been.calledWith(error);
        });
    });
}); 