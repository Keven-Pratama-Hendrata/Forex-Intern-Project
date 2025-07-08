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
            findOneByUsername: sinon.stub(),
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
            const userid = '507f1f77bcf86cd799439011';
            const username = 'test_user';
            const jwtSpy = sinon.spy(jwt, 'sign');

            const token = authService.generateToken(userid, username);

            expect(jwtSpy).to.have.been.calledWith(
                { userid: userid, username: username },
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
                authServiceWithoutSecret.generateToken('userid', 'username');
            }).to.throw('JWT_SECRET is not configured');
        });
    });

    describe('authenticateUser', () => {
        it('should authenticate user successfully with correct credentials', async () => {
            const username = 'test_user';
            const password = 'test_password';
            mockUserRepository.findOneByUsername.resolves(mockUserForAuth);

            const result = await authService.authenticateUser(username, password);

            expect(mockUserRepository.findOneByUsername).to.have.been.calledWith(username);
            expect(result).to.deep.equal(mockUserForAuth);
            expect(mockLogger.info).to.have.been.calledWith('User authenticated successfully', {
                userid: mockUserForAuth.id,
                username
            });
        });

        it('should throw error when user is not found', async () => {
            const username = 'nonexistent_user';
            const password = 'test_password';
            mockUserRepository.findOneByUsername.resolves(null);

            try {
                await authService.authenticateUser(username, password);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('User not found');
                expect(error.error).to.equal(Constants.ERROR_CODES.USER_NOT_FOUND);
                expect(mockLogger.error).to.have.been.calledWith('User not found during authentication', { username });
            }
        });

        it('should throw error when password is incorrect', async () => {
            const username = 'test_user';
            const password = 'wrong_password';
            mockUserRepository.findOneByUsername.resolves(mockUserForAuth);

            try {
                await authService.authenticateUser(username, password);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('Password is incorrect');
                expect(error.error).to.equal(Constants.ERROR_CODES.INVALID_PASSWORD);
                expect(mockLogger.error).to.have.been.calledWith('Invalid password during authentication', { username });
            }
        });
    });

    describe('verifyToken', () => {
        it('should verify valid JWT token successfully', () => {
            const userid = '507f1f77bcf86cd799439011';
            const username = 'test_user';
            const payload = { userid: userid, username: username };
            const token = jwt.sign(payload, mockConfig.jwt.secretKey, {
                expiresIn: '1h',
                audience: mockConfig.jwt.audience,
                algorithm: mockConfig.jwt.keyAlgorithm
            });

            const result = authService.verifyToken(token);

            expect(result).to.have.property('userid', userid);
            expect(result).to.have.property('username', username);
            expect(mockLogger.info).to.have.been.calledWith('JWT token verified successfully', { userid });
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
                { userid: 'test', username: 'test' },
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