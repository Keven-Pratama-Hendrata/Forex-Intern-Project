import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import sinon from 'sinon';
const expect = chai.expect;

import jwt from 'jsonwebtoken';
import AuthService from '../../src/services/authService.js';
import Constants from '../../src/constants.js';
import { mockUserForAuth } from '../mock/index.js';

describe('AuthService', () => {
    let authService;
    let mockUserRepository;
    let mockLogger;
    let mockConfig;

    beforeEach(() => {
        mockUserRepository = {
            ofUserName: sinon.stub(),
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

        authService = new AuthService({
            userRepository: mockUserRepository,
            logger: mockLogger,
            config: mockConfig
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('generateToken', () => {
        it('should generate JWT token successfully', () => {
            const userId = '507f1f77bcf86cd799439011';
            const userName = 'test_user';
            const jwtSpy = sinon.spy(jwt, 'sign');

            const token = authService.generateToken(userId, userName);

            expect(jwtSpy).to.have.been.calledWith(
                { user_id: userId, user_name: userName },
                mockConfig.jwt.secretKey,
                {
                    expiresIn: mockConfig.jwt.expiry,
                    audience: mockConfig.jwt.audience,
                    algorithm: mockConfig.jwt.keyAlgorithm
                }
            );
            expect(token).to.be.a('string');
            expect(mockLogger.info).to.have.been.calledTwice;
        });

        it('should throw error when JWT_SECRET is not configured', () => {
            const authServiceWithoutSecret = new AuthService({
                userRepository: mockUserRepository,
                logger: mockLogger,
                config: { jwt: { secretKey: null } }
            });

            expect(() => {
                authServiceWithoutSecret.generateToken('user_id', 'user_name');
            }).to.throw('JWT_SECRET is not configured');
        });
    });

    describe('authenticateUser', () => {
        it('should authenticate user successfully with correct credentials', async () => {
            const userName = 'test_user';
            const password = 'test_password';
            mockUserRepository.ofUserName.resolves(mockUserForAuth);

            const result = await authService.authenticateUser(userName, password);

            expect(mockUserRepository.ofUserName).to.have.been.calledWith(userName);
            expect(result).to.deep.equal(mockUserForAuth);
            expect(mockLogger.info).to.have.been.calledWith('User authenticated successfully', {
                userId: mockUserForAuth._id,
                userName
            });
        });

        it('should throw error when user is not found', async () => {
            const userName = 'nonexistent_user';
            const password = 'test_password';
            mockUserRepository.ofUserName.resolves(null);

            try {
                await authService.authenticateUser(userName, password);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('User not found');
                expect(error.error).to.equal(Constants.ERROR_CODES.USER_NOT_FOUND);
                expect(mockLogger.error).to.have.been.calledWith('User not found during authentication', { userName });
            }
        });

        it('should throw error when password is incorrect', async () => {
            const userName = 'test_user';
            const password = 'wrong_password';
            mockUserRepository.ofUserName.resolves(mockUserForAuth);

            try {
                await authService.authenticateUser(userName, password);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('Password is incorrect');
                expect(error.error).to.equal(Constants.ERROR_CODES.INVALID_PASSWORD);
                expect(mockLogger.error).to.have.been.calledWith('Invalid password during authentication', { userName });
            }
        });
    });

    describe('verifyToken', () => {
        it('should verify valid JWT token successfully', () => {
            const userId = '507f1f77bcf86cd799439011';
            const userName = 'test_user';
            const payload = { user_id: userId, user_name: userName };
            const token = jwt.sign(payload, mockConfig.jwt.secretKey, {
                expiresIn: '1h',
                audience: mockConfig.jwt.audience,
                algorithm: mockConfig.jwt.keyAlgorithm
            });

            const result = authService.verifyToken(token);

            expect(result).to.have.property('user_id', userId);
            expect(result).to.have.property('user_name', userName);
            expect(mockLogger.info).to.have.been.calledWith('JWT token verified successfully', { userId });
        });

        it('should throw error for invalid token', () => {
            const invalidToken = 'invalid.token.here';

            expect(() => {
                authService.verifyToken(invalidToken);
            }).to.throw('Invalid token');
            expect(mockLogger.error).to.have.been.called;
        });

        it('should throw error for expired token', () => {
            const expiredToken = jwt.sign(
                { user_id: 'test', user_name: 'test' },
                mockConfig.jwt.secretKey,
                {
                    expiresIn: '0s',
                    audience: mockConfig.jwt.audience,
                    algorithm: mockConfig.jwt.keyAlgorithm
                }
            );

            expect(() => {
                authService.verifyToken(expiredToken);
            }).to.throw('Invalid token');
            expect(mockLogger.error).to.have.been.called;
        });
    });
}); 