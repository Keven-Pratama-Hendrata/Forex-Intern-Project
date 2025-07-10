import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;

import AuthController from '../../src/controllers/authController.js';
import {
    createMockLogger,
    createMockReq,
    createMockRes,
    createMockNext,
    createMockAuthService,
    getMockUserWithId,
    createMockError,
    mockErrorMessages
} from '../mock/index.js';

describe('AuthController', () => {
    let req, res, next, mockAuthService, mockLogger, controller;

    beforeEach(() => {
        req = createMockReq({ body: { username: 'test', password: 'pass' } });
        res = createMockRes();
        next = createMockNext();
        mockAuthService = createMockAuthService();
        mockLogger = createMockLogger();
        controller = new AuthController({ authService: mockAuthService, logger: mockLogger });
    });

    afterEach(() => sinon.restore());

    describe('loginUser', () => {
        it('should return token on successful login', async () => {
            const fakeUser = getMockUserWithId('1');
            fakeUser.username = 'test';
            const fakeToken = 'token';
            mockAuthService.authenticateUser.resolves(fakeUser);
            mockAuthService.generateToken.returns(fakeToken);

            await controller.loginUser(req, res, next);

            expect(mockLogger.info).to.have.been.calledWith('Login attempt', { username: 'test' });
            expect(mockAuthService.authenticateUser).to.have.been.calledWith('test', 'pass');
            expect(mockAuthService.generateToken).to.have.been.calledWith('1', 'test');
            expect(mockLogger.info).to.have.been.calledWith('Login successful', { userid: '1', username: 'test' });
            expect(res.status).to.have.been.calledWith(200);
            expect(res.json).to.have.been.calledWith({ token: fakeToken });
        });

        it('should handle errors and call next with error', async () => {
            const error = createMockError(mockErrorMessages.GENERIC);
            mockAuthService.authenticateUser.rejects(error);

            await controller.loginUser(req, res, next);

            expect(mockLogger.error).to.have.been.calledWith('Login failed', { username: 'test', error: error.message });
            expect(next).to.have.been.calledWith(error);
        });
    });

    describe('signupUser', () => {
        it('should return token on successful signup', async () => {
            const fakeUser = getMockUserWithId('2');
            fakeUser.username = 'test';
            const fakeToken = 'newtoken';
            mockAuthService.registerUser.resolves(fakeUser);
            mockAuthService.generateToken.returns(fakeToken);

            await controller.signupUser(req, res, next);

            expect(mockLogger.info).to.have.been.calledWith('Signup attempt', { username: 'test' });
            expect(mockAuthService.registerUser).to.have.been.calledWith('test', 'pass');
            expect(mockAuthService.generateToken).to.have.been.calledWith('2', 'test');
            expect(mockLogger.info).to.have.been.calledWith('Signup successful', { userid: '2', username: 'test' });
            expect(res.status).to.have.been.calledWith(201);
            expect(res.json).to.have.been.calledWith({ token: fakeToken });
        });

        it('should handle errors and call next with error', async () => {
            const error = createMockError(mockErrorMessages.USERNAME_EXISTS);
            mockAuthService.registerUser.rejects(error);

            await controller.signupUser(req, res, next);

            expect(mockLogger.error).to.have.been.calledWith('Signup failed', { username: 'test', error: error.message });
            expect(next).to.have.been.calledWith(error);
        });

        it('should handle signup with different user data', async () => {
            const signupReq = createMockReq({ body: { username: 'anotheruser', password: 'password123' } });
            const fakeUser = getMockUserWithId('3');
            fakeUser.username = 'anotheruser';
            const fakeToken = 'anothertoken';
            mockAuthService.registerUser.resolves(fakeUser);
            mockAuthService.generateToken.returns(fakeToken);

            await controller.signupUser(signupReq, res, next);

            expect(mockLogger.info).to.have.been.calledWith('Signup attempt', { username: 'anotheruser' });
            expect(mockAuthService.registerUser).to.have.been.calledWith('anotheruser', 'password123');
            expect(mockAuthService.generateToken).to.have.been.calledWith('3', 'anotheruser');
            expect(mockLogger.info).to.have.been.calledWith('Signup successful', { userid: '3', username: 'anotheruser' });
            expect(res.status).to.have.been.calledWith(201);
            expect(res.json).to.have.been.calledWith({ token: fakeToken });
        });
    });
}); 