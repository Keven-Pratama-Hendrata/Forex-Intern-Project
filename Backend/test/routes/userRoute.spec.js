import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;

import createUserRoutes from '../../src/routes/userRoute.js';

describe('userRoute', () => {
    let userController, authController, verifyTokenMiddleware, logger, router;

    beforeEach(() => {
        userController = {
            getUserProfile: sinon.stub(),
            updateBalance: sinon.stub()
        };
        authController = {
            loginUser: sinon.stub()
        };
        verifyTokenMiddleware = sinon.stub().callsFake((req, res, next) => next());
        logger = { info: sinon.stub() };
        router = createUserRoutes({ userController, authController, verifyTokenMiddleware, logger });
        logger.info.resetHistory();
    });

    it('should register /login POST and call authController.loginUser and logger', () => {
        const req = {}, res = {}, next = () => { };
        const route = router.stack.find(r => r.route && r.route.path === '/login');
        expect(route).to.exist;
        route.route.stack[0].handle(req, res, next);
        expect(logger.info).to.have.been.calledWith('Login route accessed', { method: 'POST', path: '/login' });
        expect(authController.loginUser).to.have.been.calledWith(req, res, next);
    });

    it('should register /profile GET and call verifyTokenMiddleware, userController.getUserProfile, and logger', () => {
        const req = { user: { id: 'test' } }, res = {}, next = () => { };
        const route = router.stack.find(r => r.route && r.route.path === '/profile');
        expect(route).to.exist;
        route.route.stack[0].handle(req, res, () => {
            route.route.stack[1].handle(req, res, next);
        });
        expect(verifyTokenMiddleware).to.have.been.called;
        const found = logger.info.getCalls().some(call =>
            call.args[0] === 'Profile route accessed' &&
            call.args[1] &&
            call.args[1].method === 'GET' &&
            call.args[1].path === '/profile' &&
            call.args[1].userid === 'test'
        );
        expect(found).to.be.true;
        expect(userController.getUserProfile).to.have.been.calledWith(req, res, next);
    });

    it('should register /balance POST and call verifyTokenMiddleware, userController.updateBalance, and logger', () => {
        const req = { user: { id: 'test' } }, res = {}, next = () => { };
        const route = router.stack.find(r => r.route && r.route.path === '/balance');
        expect(route).to.exist;
        route.route.stack[0].handle(req, res, () => {
            route.route.stack[1].handle(req, res, next);
        });
        expect(verifyTokenMiddleware).to.have.been.called;
        const found = logger.info.getCalls().some(call =>
            call.args[0] === 'Balance route accessed' &&
            call.args[1] &&
            call.args[1].method === 'POST' &&
            call.args[1].path === '/balance' &&
            call.args[1].userid === 'test'
        );
        expect(found).to.be.true;
        expect(userController.updateBalance).to.have.been.calledWith(req, res, next);
    });

    it('should log routes initialized', () => {
        createUserRoutes({ userController, authController, verifyTokenMiddleware, logger });
        expect(logger.info).to.have.been.calledWith('User routes initialized successfully');
    });
}); 