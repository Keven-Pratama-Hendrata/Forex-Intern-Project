import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import sinon from 'sinon';
const expect = chai.expect;

import UserService from '../../src/services/userService.js';
import { mockUsers } from '../mock/index.js';

describe('UserService', () => {
    let userService;
    let mockUserRepository;
    let mockLogger;
    let mockConfig;

    beforeEach(() => {
        mockUserRepository = {
            ofId: sinon.stub(),
            save: sinon.stub(),
        };
        mockLogger = {
            info: sinon.stub(),
            error: sinon.stub(),
        };
        mockConfig = {
            jwt: {
                secretKey: 'test-secret-key',
                expiry: '1h',
                audience: 'CUSTOMER',
                keyAlgorithm: 'HS256'
            }
        };

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
            user.last_fetched_date = new Date(user.last_fetched_date);
            const currency = 'USD';
            const amount = 100.50;

            const result = userService.updateBalance(user, currency, amount);

            expect(result.balances).to.have.length(2);
            const usdBalance = result.balances.find(b => b.currency === 'USD');
            expect(usdBalance.amount).to.equal(1101.00); // 1000.50 + 100.50
            expect(result.balance_history).to.have.length(2);
            expect(mockLogger.info).to.have.been.calledTwice;
        });

        it('should add new balance when currency does not exist', () => {
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.last_fetched_date = new Date(user.last_fetched_date);
            const currency = 'JPY';
            const amount = 50000;

            const result = userService.updateBalance(user, currency, amount);

            expect(result.balances).to.have.length(3);
            const jpyBalance = result.balances.find(b => b.currency === 'JPY');
            expect(jpyBalance.amount).to.equal(50000);
            expect(result.balance_history).to.have.length(2);
        });

        it('should throw error when insufficient funds for new balance', () => {
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.last_fetched_date = new Date(user.last_fetched_date);
            const currency = 'JPY';
            const amount = -100;

            expect(() => {
                userService.updateBalance(user, currency, amount);
            }).to.throw('Insufficient funds');
            expect(mockLogger.error).to.have.been.called;
        });

        it('should throw error when insufficient funds for existing balance', () => {
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.last_fetched_date = new Date(user.last_fetched_date);
            const currency = 'USD';
            const amount = -2000;

            expect(() => {
                userService.updateBalance(user, currency, amount);
            }).to.throw('Insufficient funds');
            expect(mockLogger.error).to.have.been.called;
        });

        it('should handle string amounts correctly', () => {
            const user = {
                _id: 'test-id',
                balances: [{ currency: 'USD', amount: 100.00 }],
                balance_history: []
            };
            user.last_fetched_date = new Date(user.last_fetched_date);
            const currency = 'USD';
            const amount = '50.25';

            const result = userService.updateBalance(user, currency, amount);

            const usdBalance = result.balances.find(b => b.currency === 'USD');
            expect(usdBalance.amount).to.equal(150.25);
            expect(result.balance_history).to.have.length(1);
        });
    });

    describe('updateTodayBalanceUsd', () => {
        it('should update today balance USD successfully', () => {
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.last_fetched_date = new Date(user.last_fetched_date);
            const amount = 2000.00;

            const result = userService.updateTodayBalanceUsd(user, amount);

            expect(result.today_balance_usd).to.equal(2000.00);
            expect(result.last_fetched_date).to.be.instanceOf(Date);
            expect(mockLogger.info).to.have.been.calledWith('Updating today balance USD', {
                userId: user._id,
                amount
            });
        });

        it('should handle string amount correctly', () => {
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.last_fetched_date = new Date(user.last_fetched_date);
            const amount = '1500.75';

            const result = userService.updateTodayBalanceUsd(user, amount);

            expect(result.today_balance_usd).to.equal(1500.75);
        });
    });

    describe('getUserProfile', () => {
        it('should get user profile successfully', async () => {
            const userId = '507f1f77bcf86cd799439011';
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.last_fetched_date = new Date(user.last_fetched_date);
            mockUserRepository.ofId.resolves(user);
            mockUserRepository.save.resolves(user);

            const result = await userService.getUserProfile(userId);

            expect(mockUserRepository.ofId).to.have.been.calledWith(userId);
            expect(result).to.have.property('user_id', user._id);
            expect(result).to.have.property('user_name', user.user_name);
            expect(result).to.have.property('balances');
            expect(result).to.have.property('daily_total_usd_history');
            expect(result).to.have.property('last_fetched_date');
            expect(result).to.have.property('today_balance_usd');
            expect(mockLogger.info).to.have.been.calledWith('User profile retrieved successfully', { userId });
        });

        it('should throw error when user is not found', async () => {
            const userId = 'nonexistent_id';
            mockUserRepository.ofId.resolves(null);

            try {
                await userService.getUserProfile(userId);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('User not found');
                expect(mockLogger.error).to.have.been.calledWith('User not found', { userId });
            }
        });

        it('should update user history for new day', async () => {
            const userId = '507f1f77bcf86cd799439011';
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.last_fetched_date = new Date(user.last_fetched_date);
            mockUserRepository.ofId.resolves(user);
            mockUserRepository.save.resolves(user);

            const result = await userService.getUserProfile(userId);

            expect(mockUserRepository.save).to.have.been.called;
            expect(result).to.have.property('user_id', user._id);
            expect(mockLogger.info).to.have.been.calledWith('Updating user history for new day', { userId });
        });
    });

    describe('handleUpdateBalance', () => {
        it('should handle balance update successfully', async () => {
            const userId = '507f1f77bcf86cd799439011';
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.last_fetched_date = new Date(user.last_fetched_date);
            const balance = { currency: 'USD', amount: 100.50 };
            const updatedUser = { ...user, balances: [{ currency: 'USD', amount: 1101.00 }] };

            mockUserRepository.ofId.resolves(user);
            mockUserRepository.save.resolves(updatedUser);

            const result = await userService.handleUpdateBalance(userId, balance);

            expect(mockUserRepository.ofId).to.have.been.calledWith(userId);
            expect(mockUserRepository.save).to.have.been.called;
            expect(result).to.have.property('message', 'Balance updated');
            expect(result).to.have.property('balances');
            expect(mockLogger.info).to.have.been.calledWith('Balance update completed successfully', { userId, balance });
        });

        it('should throw error when user is not found for balance update', async () => {
            const userId = 'nonexistent_id';
            const balance = { currency: 'USD', amount: 100 };
            mockUserRepository.ofId.resolves(null);

            try {
                await userService.handleUpdateBalance(userId, balance);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('User not found');
                expect(mockLogger.error).to.have.been.calledWith('User not found for balance update', { userId });
            }
        });
    });
}); 