import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;

import AuthController from '../../src/controllers/authController.js';
import { createMockLogger } from '../mock/logger.mock.js';
import { createMockReq, createMockRes, createMockNext } from '../mock/express.mock.js';

describe('AuthController', () => {
    let req, res, next, mockAuthService, mockLogger, controller;

    beforeEach(() => {
        req = createMockReq({ body: { username: 'test', password: 'pass' } });
        res = createMockRes();
        next = createMockNext();
        mockAuthService = { authenticateUser: sinon.stub(), generateToken: sinon.stub() };
        mockLogger = createMockLogger();
        controller = new AuthController({ authService: mockAuthService, logger: mockLogger });
    });

    afterEach(() => sinon.restore());

    describe('loginUser', () => {
        it('should return token on successful login', async () => {
            const fakeUser = { id: '1', username: 'test' };
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
            const error = new Error('fail');
            mockAuthService.authenticateUser.rejects(error);

            await controller.loginUser(req, res, next);

            expect(mockLogger.error).to.have.been.calledWith('Login failed', { username: 'test', error: error.message });
            expect(next).to.have.been.calledWith(error);
        });
    });
}); 