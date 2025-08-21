import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import sinon from 'sinon';
const expect = chai.expect;

import UserService from '../../src/services/userService.js';
import { mockUsers } from '../mock/users.mock.js';

describe('UserService', () => {
    let userService;
    let mockUserRepository;
    let mockLogger;
    let mockConfig;
    let mockMarketPriceService;

    beforeEach(() => {
        mockUserRepository = {
            findOneById: sinon.stub(),
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
        mockMarketPriceService = {};

        userService = new UserService({
            userRepository: mockUserRepository,
            logger: mockLogger,
            config: mockConfig,
            marketPriceService: mockMarketPriceService
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
            expect(mockLogger.info).to.have.been.calledThrice;
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
            expect(result).to.have.property('lastFetchedDate');
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
        });

        it('should call save when lastFetchedDate is missing', async () => {
            const userid = '507f1f77bcf86cd799439011';
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.lastFetchedDate = null;
            mockUserRepository.findOneById.resolves(user);
            mockUserRepository.save.resolves(user);

            const result = await userService.getUserProfile(userid);

            expect(mockUserRepository.save).to.have.been.called;
            expect(result).to.have.property('userid', user.id);
        });

        it('should NOT call save when lastFetchedDate is today', async () => {
            const userid = '507f1f77bcf86cd799439011';
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.lastFetchedDate = new Date();
            mockUserRepository.findOneById.resolves(user);
            mockUserRepository.save.resolves(user);

            const result = await userService.getUserProfile(userid);

            expect(mockUserRepository.save).to.not.have.been.called;
            expect(result).to.have.property('userid', user.id);
        });

        it('should call save when lastFetchedDate is from a different year', async () => {
            const userid = '507f1f77bcf86cd799439011';
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            const lastYear = new Date();
            lastYear.setFullYear(lastYear.getFullYear() - 1);
            user.lastFetchedDate = lastYear;
            mockUserRepository.findOneById.resolves(user);
            mockUserRepository.save.resolves(user);

            const result = await userService.getUserProfile(userid);

            expect(mockUserRepository.save).to.have.been.called;
            expect(result).to.have.property('userid', user.id);
        });

        it('should throw if saving lastFetchedDate fails', async () => {
            const userid = '507f1f77bcf86cd799439011';
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.lastFetchedDate = new Date(user.lastFetchedDate);
            mockUserRepository.findOneById.resolves(user);
            const saveError = new Error('save-failed');
            mockUserRepository.save.rejects(saveError);

            try {
                await userService.getUserProfile(userid);
                expect.fail('Should have thrown an error');
            } catch (err) {
                expect(err).to.equal(saveError);
                expect(mockLogger.error).to.have.been.calledWith('Failed to update lastFetchedDate', sinon.match({ userid }));
            }
        });
    });

    describe('handleUpdateBalance', () => {
        it('should handle balance update successfully', async () => {
            const userid = '507f1f77bcf86cd799439011';
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.lastFetchedDate = new Date(user.lastFetchedDate);
            const balance = { currency: 'USD', amount: 100.50 };
            const updatedUser = { ...user, balances: [{ currency: 'USD', amount: 1101.00 }] };

            mockUserRepository.findOneById.resolves(user);
            mockUserRepository.save.resolves(updatedUser);

            const result = await userService.handleUpdateBalance(userid, balance);

            expect(mockUserRepository.findOneById).to.have.been.calledWith(userid);
            expect(mockUserRepository.save).to.have.been.called;
            expect(result).to.have.property('message', 'Balance updated');
            expect(result).to.have.property('balances');
            expect(mockLogger.info).to.have.been.calledWith('Balance update completed successfully', { userid, balance });
        });

        it('should throw error when user is not found for balance update', async () => {
            const userid = 'nonexistent_id';
            const balance = { currency: 'USD', amount: 100 };
            mockUserRepository.findOneById.resolves(null);

            try {
                await userService.handleUpdateBalance(userid, balance);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('User not found');
                expect(mockLogger.error).to.have.been.calledWith('User not found for balance update', { userid });
            }
        });
    });

    describe('getDashboardData', () => {
        it('should get dashboard data successfully', async () => {
            const userid = '507f1f77bcf86cd799439011';
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.lastFetchedDate = new Date(user.lastFetchedDate);
            mockUserRepository.findOneById.resolves(user);

            const result = await userService.getDashboardData(userid);

            expect(mockUserRepository.findOneById).to.have.been.calledWith(userid);
            expect(result).to.have.property('username', user.username);
            expect(mockLogger.info).to.have.been.calledWith('Getting dashboard data', { userid });
            expect(mockLogger.info).to.have.been.calledWith('Dashboard data retrieved successfully', { userid });
        });

        it('should throw error when user is not found', async () => {
            const userid = 'nonexistent_id';
            mockUserRepository.findOneById.resolves(null);

            try {
                await userService.getDashboardData(userid);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('User not found');
                expect(mockLogger.error).to.have.been.calledWith('User not found for dashboard', { userid });
            }
        });
    });

    describe('calculateTransactionAmounts', () => {
        it('should calculate buy transaction amounts correctly', () => {
            const transaction = {
                transactionType: 'buy',
                amount: 1000000,
                currency: 'USD'
            };
            const currencyRate = 15000;

            const result = userService.calculateTransactionAmounts(transaction, currencyRate);

            expect(result.idrAmount).to.equal(-1000000);
            expect(result.foreignAmount).to.equal(1000000 / 15000);
            expect(mockLogger.info).to.have.been.calledWith('Transaction calculation details', {
                transactionType: 'buy',
                originalAmount: 1000000,
                currencyRate: 15000,
                idrAmount: -1000000,
                foreignAmount: 1000000 / 15000,
                calculation: '1000000 IDR ÷ 15000 = 66.66666666666667 USD'
            });
        });

        it('should calculate sell transaction amounts correctly', () => {
            const transaction = {
                transactionType: 'sell',
                amount: 100,
                currency: 'USD'
            };
            const currencyRate = 15000;

            const result = userService.calculateTransactionAmounts(transaction, currencyRate);

            expect(result.foreignAmount).to.equal(-100);
            expect(result.idrAmount).to.equal(100 * 15000);
            expect(mockLogger.info).to.have.been.calledWith('Transaction calculation details', {
                transactionType: 'sell',
                originalAmount: 100,
                currencyRate: 15000,
                idrAmount: 1500000,
                foreignAmount: -100,
                calculation: '100 USD × 15000 = 1500000 IDR'
            });
        });
    });

    describe('validateAndGetUser', () => {
        it('should validate and get user successfully', async () => {
            const userid = '507f1f77bcf86cd799439011';
            const transaction = {
                transactionType: 'buy',
                currency: 'USD',
                amount: 100
            };
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            mockUserRepository.findOneById.resolves(user);

            const result = await userService.validateAndGetUser(userid, transaction);

            expect(mockUserRepository.findOneById).to.have.been.calledWith(userid);
            expect(result).to.deep.equal(user);
            expect(mockLogger.info).to.have.been.calledWith('Initial balances before transaction', {
                userid,
                balances: user.balances,
                transactionType: 'buy',
                currency: 'USD',
                amount: 100
            });
        });

        it('should throw error when user is not found', async () => {
            const userid = 'nonexistent_id';
            const transaction = {
                transactionType: 'buy',
                currency: 'USD',
                amount: 100
            };
            mockUserRepository.findOneById.resolves(null);

            try {
                await userService.validateAndGetUser(userid, transaction);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('User not found');
                expect(mockLogger.error).to.have.been.calledWith('User not found for transaction', { userid });
            }
        });
    });

    describe('validateExchangeRate', () => {
        it('should validate exchange rate successfully', () => {
            const transaction = {
                exchangeRate: 15000,
                currency: 'USD',
                userid: '507f1f77bcf86cd799439011'
            };

            const result = userService.validateExchangeRate(transaction);

            expect(result).to.equal(15000);
            expect(mockLogger.info).to.have.been.calledWith('Using exchange rate from frontend', {
                userid: '507f1f77bcf86cd799439011',
                currency: 'USD',
                rate: 15000
            });
        });

        it('should throw error when exchange rate is not provided', () => {
            const transaction = {
                exchangeRate: null,
                currency: 'USD'
            };

            try {
                userService.validateExchangeRate(transaction);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('Exchange rate not available');
                expect(mockLogger.error).to.have.been.calledWith('Exchange rate not provided', { currency: 'USD' });
            }
        });

        it('should throw error when exchange rate is undefined', () => {
            const transaction = {
                exchangeRate: undefined,
                currency: 'USD'
            };

            try {
                userService.validateExchangeRate(transaction);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('Exchange rate not available');
                expect(mockLogger.error).to.have.been.calledWith('Exchange rate not provided', { currency: 'USD' });
            }
        });
    });

    describe('updateUserBalances', () => {
        it('should update user balances for transaction', () => {
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.balances = [
                { currency: 'IDR', amount: 2000000 },
                { currency: 'USD', amount: 1000 }
            ];
            const transaction = {
                currency: 'USD',
                amount: 100
            };
            const idrAmount = -1000000;
            const foreignAmount = 66.67;

            const result = userService.updateUserBalances(user, transaction, idrAmount, foreignAmount);

            expect(mockLogger.info).to.have.been.calledWith('Updating IDR balance', { userid: user.id, idrAmount: -1000000 });
            expect(mockLogger.info).to.have.been.calledWith('Updating foreign currency balance', {
                userid: user.id,
                currency: 'USD',
                foreignAmount: 66.67
            });
            expect(result).to.have.property('balances');
        });
    });

    describe('processTransaction', () => {
        it('should process buy transaction successfully', async () => {
            const userid = '507f1f77bcf86cd799439011';
            const transaction = {
                currency: 'USD',
                amount: 1000000,
                transactionType: 'buy',
                exchangeRate: 15000
            };
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.balances = [
                { currency: 'IDR', amount: 2000000 },
                { currency: 'USD', amount: 1000 }
            ];
            const updatedUser = { ...user, balances: [{ currency: 'USD', amount: 66.67 }] };

            mockUserRepository.findOneById.resolves(user);
            mockUserRepository.save.resolves(updatedUser);

            const result = await userService.processTransaction(userid, transaction);

            expect(mockLogger.info).to.have.been.calledWith('Processing transaction', { userid, transaction });
            expect(mockLogger.info).to.have.been.calledWith('Transaction amounts calculated', {
                userid,
                transactionType: 'buy',
                originalAmount: 1000000,
                idrAmount: -1000000,
                foreignAmount: 1000000 / 15000,
                exchangeRate: 15000
            });
            expect(mockLogger.info).to.have.been.calledWith('Transaction completed successfully', {
                userid,
                transactionType: 'buy',
                currency: 'USD',
                originalAmount: 1000000,
                idrAmount: -1000000,
                foreignAmount: 1000000 / 15000,
                rate: 15000,
                finalBalances: updatedUser.balances,
                timestamp: sinon.match.string
            });
            expect(result).to.have.property('message', 'Transaction completed');
            expect(result).to.have.property('balances');
            expect(result).to.have.property('transaction');
            expect(result.transaction).to.have.property('type', 'buy');
            expect(result.transaction).to.have.property('currency', 'USD');
            expect(result.transaction).to.have.property('amount', 1000000);
            expect(result.transaction).to.have.property('rate', 15000);
        });

        it('should process sell transaction successfully', async () => {
            const userid = '507f1f77bcf86cd799439011';
            const transaction = {
                currency: 'USD',
                amount: 100,
                transactionType: 'sell',
                exchangeRate: 15000
            };
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            user.balances = [
                { currency: 'IDR', amount: 1000000 },
                { currency: 'USD', amount: 200 }
            ];
            const updatedUser = { ...user, balances: [{ currency: 'USD', amount: 900 }] };

            mockUserRepository.findOneById.resolves(user);
            mockUserRepository.save.resolves(updatedUser);

            const result = await userService.processTransaction(userid, transaction);

            expect(result).to.have.property('message', 'Transaction completed');
            expect(result.transaction).to.have.property('type', 'sell');
            expect(result.transaction).to.have.property('currency', 'USD');
            expect(result.transaction).to.have.property('amount', 100);
            expect(result.transaction).to.have.property('rate', 15000);
        });

        it('should throw error when user validation fails', async () => {
            const userid = 'nonexistent_id';
            const transaction = {
                currency: 'USD',
                amount: 100,
                transactionType: 'buy',
                exchangeRate: 15000
            };
            mockUserRepository.findOneById.resolves(null);

            try {
                await userService.processTransaction(userid, transaction);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('User not found');
            }
        });

        it('should throw error when exchange rate validation fails', async () => {
            const userid = '507f1f77bcf86cd799439011';
            const transaction = {
                currency: 'USD',
                amount: 100,
                transactionType: 'buy',
                exchangeRate: null
            };
            const user = JSON.parse(JSON.stringify(mockUsers[0]));
            mockUserRepository.findOneById.resolves(user);

            try {
                await userService.processTransaction(userid, transaction);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('Exchange rate not available');
            }
        });
    });

    describe('getTransactionHistory', () => {
        it('should return transaction history for valid user', async () => {
            const mockUser = {
                id: 'user123',
                username: 'testuser',
                balanceHistory: [
                    {
                        _id: '1',
                        date: '2025-07-31T03:27:24.277+00:00',
                        currency: 'JPY',
                        amount: 908.4886264888182,
                        balance: 4440.368852153083
                    },
                    {
                        _id: '2',
                        date: '2025-07-31T06:30:11.484+00:00',
                        currency: 'IDR',
                        amount: 100000,
                        balance: 1010329.4824890726
                    }
                ]
            };

            mockUserRepository.findOneById.resolves(mockUser);

            const result = await userService.getTransactionHistory('user123');

            expect(result).to.deep.equal({
                username: 'testuser',
                balanceHistory: mockUser.balanceHistory
            });

            expect(mockUserRepository.findOneById).to.have.been.calledWith('user123');
        });

        it('should return empty array when user has no balance history', async () => {
            const mockUser = {
                id: 'user123',
                username: 'testuser',
                balanceHistory: []
            };

            mockUserRepository.findOneById.resolves(mockUser);

            const result = await userService.getTransactionHistory('user123');

            expect(result).to.deep.equal({
                username: 'testuser',
                balanceHistory: []
            });
        });

        it('should handle missing balanceHistory property', async () => {
            const mockUser = {
                id: 'user123',
                username: 'testuser'
            };

            mockUserRepository.findOneById.resolves(mockUser);

            const result = await userService.getTransactionHistory('user123');

            expect(result).to.deep.equal({
                username: 'testuser',
                balanceHistory: []
            });
        });

        it('should throw error when user not found', async () => {
            mockUserRepository.findOneById.resolves(null);

            try {
                await userService.getTransactionHistory('nonexistent');
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('User not found');
                expect(mockLogger.error).to.have.been.calledWith('User not found for transaction history', { userid: 'nonexistent' });
            }
        });

        it('should handle repository errors', async () => {
            const repositoryError = new Error('Database connection failed');
            mockUserRepository.findOneById.rejects(repositoryError);

            try {
                await userService.getTransactionHistory('user123');
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error).to.equal(repositoryError);
            }
        });
    });
}); 