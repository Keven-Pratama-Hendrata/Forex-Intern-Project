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
        req = createMockReq({ user: { userid: '1' }, body: { balance: { currency: 'USD', amount: 100 } } });
        res = createMockRes();
        next = createMockNext();
        mockUserService = {
            getUserProfile: sinon.stub(),
            handleUpdateBalance: sinon.stub(),
            processTransaction: sinon.stub()
        };
        mockLogger = createMockLogger();
        controller = new UserController({ userService: mockUserService, logger: mockLogger });
    });

    afterEach(() => sinon.restore());

    describe('getUserProfile', () => {
        it('should return user profile on success', async () => {
            const fakeProfile = { userid: '1', username: 'test' };
            mockUserService.getUserProfile.resolves(fakeProfile);

            await controller.getUserProfile(req, res, next);

            expect(mockLogger.info).to.have.been.calledWith('Getting user profile', { userid: '1' });
            expect(mockUserService.getUserProfile).to.have.been.calledWith('1');
            expect(mockLogger.info).to.have.been.calledWith('User profile retrieved successfully', { userid: '1' });
            expect(res.status).to.have.been.calledWith(200);
            expect(res.json).to.have.been.calledWith(fakeProfile);
        });

        it('should handle errors and call next with error', async () => {
            const error = new Error('fail');
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
            const error = new Error('Service error');
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
            const error = new Error('fail');
            mockUserService.handleUpdateBalance.rejects(error);

            await controller.updateBalance(req, res, next);

            expect(mockLogger.error).to.have.been.calledWith('Failed to update balance', { userid: '1', balance: req.body.balance, error: error.message });
            expect(next).to.have.been.calledWith(error);
        });

        it('should throw error when req.user is not found', async () => {
            const reqWithoutUser = createMockReq({ body: { balance: { currency: 'USD', amount: 100 } } });

            await controller.updateBalance(reqWithoutUser, res, next);

            expect(mockLogger.error).to.have.been.calledWith('User not found in request');
            expect(next).to.have.been.calledWith(sinon.match.instanceOf(Error));
        });

        it('should handle errors when req.user is undefined in catch block', async () => {
            const reqWithoutUser = createMockReq({ body: { balance: { currency: 'USD', amount: 100 } } });

            await controller.updateBalance(reqWithoutUser, res, next);

            expect(mockLogger.error).to.have.been.calledWith('User not found in request');
            expect(next).to.have.been.calledWith(sinon.match.instanceOf(Error));
        });

        it('should handle errors when req.body is undefined in catch block', async () => {
            const reqWithoutBody = createMockReq({ user: { userid: '1' } });
            const error = new Error('Service error');
            mockUserService.handleUpdateBalance.rejects(error);

            await controller.updateBalance(reqWithoutBody, res, next);

            expect(mockLogger.error).to.have.been.calledWith('Failed to update balance', { userid: '1', balance: undefined, error: error.message });
            expect(next).to.have.been.calledWith(error);
        });

        it('should handle errors when req.body is null in catch block', async () => {
            const reqWithNullBody = createMockReq({ user: { userid: '1' }, body: null });

            await controller.updateBalance(reqWithNullBody, res, next);

            expect(mockLogger.error).to.have.been.calledWith('Failed to update balance', { userid: '1', balance: undefined, error: "Cannot destructure property 'balance' of 'req.body' as it is null." });
            expect(next).to.have.been.calledWith(sinon.match.instanceOf(Error));
        });

        it('should handle service errors with proper error logging', async () => {
            const error = new Error('Service error');
            mockUserService.handleUpdateBalance.rejects(error);

            await controller.updateBalance(req, res, next);

            expect(mockLogger.error).to.have.been.calledWith('Failed to update balance', { userid: '1', balance: req.body.balance, error: error.message });
            expect(next).to.have.been.calledWith(error);
        });
    });

    describe('processTransaction', () => {
        it('should process transaction and return result on success', async () => {
            const transactionData = { currency: 'USD', amount: 100, transactionType: 'buy', exchangeRate: 15000 };
            req = createMockReq({
                user: { userid: '1' },
                body: transactionData
            });
            const fakeResult = {
                message: 'Transaction completed',
                balances: [{ currency: 'USD', amount: 100 }],
                transaction: { type: 'buy', currency: 'USD', amount: 100, rate: 15000 }
            };
            mockUserService.processTransaction.resolves(fakeResult);

            await controller.processTransaction(req, res, next);

            expect(mockLogger.info).to.have.been.calledWith('Processing transaction', {
                userid: '1',
                currency: 'USD',
                amount: 100,
                transactionType: 'buy',
                exchangeRate: 15000
            });
            expect(mockUserService.processTransaction).to.have.been.calledWith('1', transactionData);
            expect(mockLogger.info).to.have.been.calledWith('Transaction processed successfully', {
                userid: '1',
                currency: 'USD',
                amount: 100,
                transactionType: 'buy',
                exchangeRate: 15000
            });
            expect(res.status).to.have.been.calledWith(200);
            expect(res.json).to.have.been.calledWith(fakeResult);
        });

        it('should handle errors and call next with error', async () => {
            const transactionData = { currency: 'USD', amount: 100, transactionType: 'buy', exchangeRate: 15000 };
            req = createMockReq({
                user: { userid: '1' },
                body: transactionData
            });
            const error = new Error('Transaction failed');
            mockUserService.processTransaction.rejects(error);

            await controller.processTransaction(req, res, next);

            expect(mockLogger.error).to.have.been.calledWith('Failed to process transaction', {
                userid: '1',
                currency: 'USD',
                amount: 100,
                transactionType: 'buy',
                exchangeRate: 15000,
                error: error.message
            });
            expect(next).to.have.been.calledWith(error);
        });

        it('should throw error when req.user is not found', async () => {
            const reqWithoutUser = createMockReq({
                body: { currency: 'USD', amount: 100, transactionType: 'buy', exchangeRate: 15000 }
            });

            await controller.processTransaction(reqWithoutUser, res, next);

            expect(mockLogger.error).to.have.been.calledWith('User not found in request');
            expect(next).to.have.been.calledWith(sinon.match.instanceOf(Error));
        });

        it('should handle errors when req.user is undefined in catch block', async () => {
            const reqWithoutUser = createMockReq({
                body: { currency: 'USD', amount: 100, transactionType: 'buy', exchangeRate: 15000 }
            });

            await controller.processTransaction(reqWithoutUser, res, next);

            expect(mockLogger.error).to.have.been.calledWith('User not found in request');
            expect(next).to.have.been.calledWith(sinon.match.instanceOf(Error));
        });

        it('should handle errors when req.body is undefined in catch block', async () => {
            const reqWithoutBody = createMockReq({ user: { userid: '1' } });
            const error = new Error('Service error');
            mockUserService.processTransaction.rejects(error);

            await controller.processTransaction(reqWithoutBody, res, next);

            expect(mockLogger.error).to.have.been.calledWith('Failed to process transaction', {
                userid: '1',
                currency: undefined,
                amount: undefined,
                transactionType: undefined,
                exchangeRate: undefined,
                error: error.message
            });
            expect(next).to.have.been.calledWith(error);
        });

        it('should handle errors when req.body is null in catch block', async () => {
            const reqWithNullBody = createMockReq({ user: { userid: '1' }, body: null });

            await controller.processTransaction(reqWithNullBody, res, next);

            expect(mockLogger.error).to.have.been.calledWith('Failed to process transaction', {
                userid: '1',
                currency: undefined,
                amount: undefined,
                transactionType: undefined,
                exchangeRate: undefined,
                error: "Cannot destructure property 'currency' of 'req.body' as it is null."
            });
            expect(next).to.have.been.calledWith(sinon.match.instanceOf(Error));
        });

        it('should handle service errors with proper error logging', async () => {
            const transactionData = { currency: 'USD', amount: 100, transactionType: 'buy', exchangeRate: 15000 };
            req = createMockReq({
                user: { userid: '1' },
                body: transactionData
            });
            const error = new Error('Service error');
            mockUserService.processTransaction.rejects(error);

            await controller.processTransaction(req, res, next);

            expect(mockLogger.error).to.have.been.calledWith('Failed to process transaction', {
                userid: '1',
                currency: 'USD',
                amount: 100,
                transactionType: 'buy',
                exchangeRate: 15000,
                error: error.message
            });
            expect(next).to.have.been.calledWith(error);
        });
    });

    describe('getDashboardData', () => {
        it('should return dashboard data on success', async () => {
            const fakeDashboard = { username: 'test', todayBalanceUsd: 100, dailyTotalUsdHistory: [] };
            mockUserService.getDashboardData = sinon.stub().resolves(fakeDashboard);
            req = createMockReq({ user: { userid: '1' } });

            await controller.getDashboardData(req, res, next);

            expect(mockUserService.getDashboardData).to.have.been.calledWith('1');
            expect(res.status).to.have.been.calledWith(200);
            expect(res.json).to.have.been.calledWith(fakeDashboard);
        });

        it('should handle errors and call next with error', async () => {
            const error = new Error('fail');
            mockUserService.getDashboardData = sinon.stub().rejects(error);
            req = createMockReq({ user: { userid: '1' } });

            await controller.getDashboardData(req, res, next);

            expect(mockLogger.error).to.have.been.calledWith('Failed to get dashboard data', { userid: '1', error: error.message });
            expect(next).to.have.been.calledWith(error);
        });

        it('should throw error when req.user is not found', async () => {
            req = createMockReq();

            await controller.getDashboardData(req, res, next);

            expect(mockLogger.error).to.have.been.calledWith('User not found in request');
            expect(next).to.have.been.calledWith(sinon.match.instanceOf(Error));
        });
    });
}); 