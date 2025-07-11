import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import sinon from 'sinon';
const expect = chai.expect;

import UserService from '../../src/services/userService.js';
import {
    mockUsers,
    createMockUserRepository,
    createMockLogger,
    createMockConfig,
    getMockBalance,
    createMockError,
    mockErrorMessages
} from '../mock/index.js';

describe('UserService', () => {
    let userService;
    let mockUserRepository;
    let mockLogger;
    let mockConfig;

    beforeEach(() => {
        mockUserRepository = createMockUserRepository();
        mockLogger = createMockLogger();
        mockConfig = createMockConfig();

        userService = new UserService({
            userRepository: mockUserRepository,
            logger: mockLogger,
            config: mockConfig
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('updateBalance', () => {
        it('should update existing balance successfully', () => {
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.lastFetchedDate = new Date(user.lastFetchedDate);
            const currency = 'USD';
            const amount = 100.50;

            const result = userService.updateBalance(user, currency, amount);

            expect(result.balances).to.have.length(2);
            const usdBalance = result.balances.find(b => b.currency === 'USD');
            expect(usdBalance.amount).to.equal(1101.00);
            expect(result.balanceHistory).to.have.length(2);
            expect(mockLogger.info).to.have.been.calledTwice;
        });

        it('should add new balance when currency does not exist', () => {
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.lastFetchedDate = new Date(user.lastFetchedDate);
            const currency = 'JPY';
            const amount = 50000;

            const result = userService.updateBalance(user, currency, amount);

            expect(result.balances).to.have.length(3);
            const jpyBalance = result.balances.find(b => b.currency === 'JPY');
            expect(jpyBalance.amount).to.equal(50000);
            expect(result.balanceHistory).to.have.length(2);
        });

        it('should throw error when insufficient funds for new balance', () => {
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.lastFetchedDate = new Date(user.lastFetchedDate);
            const currency = 'JPY';
            const amount = -100;

            expect(() => {
                userService.updateBalance(user, currency, amount);
            }).to.throw('Insufficient funds');
            expect(mockLogger.error).to.have.been.called;
        });

        it('should throw error when insufficient funds for existing balance', () => {
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.lastFetchedDate = new Date(user.lastFetchedDate);
            const currency = 'USD';
            const amount = -2000;

            expect(() => {
                userService.updateBalance(user, currency, amount);
            }).to.throw('Insufficient funds');
            expect(mockLogger.error).to.have.been.called;
        });

        it('should handle string amounts correctly', () => {
            const user = {
                id: 'test-id',
                balances: [{ currency: 'USD', amount: 100.00 }],
                balanceHistory: []
            };
            user.lastFetchedDate = new Date(user.lastFetchedDate);
            const currency = 'USD';
            const amount = '50.25';

            const result = userService.updateBalance(user, currency, amount);

            const usdBalance = result.balances.find(b => b.currency === 'USD');
            expect(usdBalance.amount).to.equal(150.25);
            expect(result.balanceHistory).to.have.length(1);
        });
    });

    describe('updateTodayBalanceUsd', () => {
        it('should update today balance USD successfully', () => {
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.lastFetchedDate = new Date(user.lastFetchedDate);
            const amount = 2000.00;

            const result = userService.updateTodayBalanceUsd(user, amount);

            expect(result.todayBalanceUsd).to.equal(2000.00);
            expect(result.lastFetchedDate).to.be.instanceOf(Date);
            expect(mockLogger.info).to.have.been.calledWith('Updating today balance USD', {
                userid: user.id,
                amount
            });
        });

        it('should handle string amount correctly', () => {
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.lastFetchedDate = new Date(user.lastFetchedDate);
            const amount = '1500.75';

            const result = userService.updateTodayBalanceUsd(user, amount);

            expect(result.todayBalanceUsd).to.equal(1500.75);
        });
    });

    describe('getUserProfile', () => {
        it('should get user profile successfully', async () => {
            const userid = '507f1f77bcf86cd799439011';
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.lastFetchedDate = new Date(user.lastFetchedDate);
            mockUserRepository.findOneById.resolves(user);
            mockUserRepository.save.resolves(user);

            const result = await userService.getUserProfile(userid);

            expect(mockUserRepository.findOneById).to.have.been.calledWith(userid);
            expect(result).to.have.property('userid', user.id);
            expect(result).to.have.property('username', user.username);
            expect(result).to.have.property('balances');
            expect(result).to.have.property('dailyTotalUsdHistory');
            expect(result).to.have.property('lastFetchedDate');
            expect(result).to.have.property('todayBalanceUsd');
            expect(mockLogger.info).to.have.been.calledWith('User profile retrieved successfully', { userid });
        });

        it('should throw error when user is not found', async () => {
            const userid = 'nonexistent_id';
            mockUserRepository.findOneById.resolves(null);

            try {
                await userService.getUserProfile(userid);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('User not found');
                expect(mockLogger.error).to.have.been.calledWith('User not found', { userid });
            }
        });

        it('should update user history for new day', async () => {
            const userid = '507f1f77bcf86cd799439011';
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.lastFetchedDate = new Date(user.lastFetchedDate);
            mockUserRepository.findOneById.resolves(user);
            mockUserRepository.save.resolves(user);

            const result = await userService.getUserProfile(userid);

            expect(mockUserRepository.save).to.have.been.called;
            expect(result).to.have.property('userid', user.id);
            expect(mockLogger.info).to.have.been.calledWith('Updating user history for new day', { userid });
        });
    });

    describe('handleUpdateBalance', () => {
        it('should handle balance update successfully', async () => {
            const userid = '507f1f77bcf86cd799439011';
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.lastFetchedDate = new Date(user.lastFetchedDate);
            const balance = getMockBalance();
            const updatedUser = { ...user, balances: [{ currency: 'USD', amount: 1101.00 }] };

            mockUserRepository.findOneById.resolves(user);
            mockUserRepository.save.resolves(updatedUser);

            const result = await userService.handleUpdateBalance(userid, balance);

            expect(mockUserRepository.findOneById).to.have.been.calledWith(userid);
            expect(mockUserRepository.save).to.have.been.called;
            expect(result).to.deep.equal({
                message: 'Balance updated',
                balances: updatedUser.balances
            });
            expect(mockLogger.info).to.have.been.calledWith('Balance update completed successfully', { userid, balance });
        });

        it('should throw error when user is not found', async () => {
            const userid = 'nonexistent_id';
            const balance = getMockBalance();
            mockUserRepository.findOneById.resolves(null);

            try {
                await userService.handleUpdateBalance(userid, balance);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('User not found');
                expect(mockLogger.error).to.have.been.calledWith('User not found for balance update', { userid });
            }
        });

        it('should handle service errors', async () => {
            const userid = '507f1f77bcf86cd799439011';
            const balance = getMockBalance();
            const error = createMockError(mockErrorMessages.SERVICE_ERROR);
            mockUserRepository.findOneById.rejects(error);

            try {
                await userService.handleUpdateBalance(userid, balance);
                expect.fail('Should have thrown an error');
            } catch (caughtError) {
                expect(caughtError.message).to.equal('Service error');
                expect(mockLogger.error).to.not.have.been.called;
            }
        });
    });
}); 