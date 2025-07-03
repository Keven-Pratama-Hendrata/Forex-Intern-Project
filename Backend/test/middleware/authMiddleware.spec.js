import createAuthMiddleware from '../../src/middleware/authMiddleware.js';
import CustomError from '../../src/utils/error.js';
import sinon from 'sinon';

describe('AuthMiddleware', () => {
    let authMiddleware;
    let mockAuthService;
    let mockLogger;
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockAuthService = {
            verifyToken: sinon.stub(),
        };
        mockLogger = {
            info: sinon.stub(),
            error: sinon.stub(),
        };
        mockReq = {
            headers: {},
        };
        mockRes = {};
        mockNext = sinon.stub();

        authMiddleware = createAuthMiddleware({
            authService: mockAuthService,
            logger: mockLogger,
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('verifyToken', () => {
        it('should verify token successfully and set user in request', () => {
            const token = 'valid.jwt.token';
            const decodedToken = { user_id: '123', user_name: 'test_user' };

            mockReq.headers.authorization = `Bearer ${token}`;
            mockAuthService.verifyToken.returns(decodedToken);

            authMiddleware(mockReq, mockRes, mockNext);

            expect(mockAuthService.verifyToken).to.have.been.calledWith(token);
            expect(mockReq.user).to.deep.equal(decodedToken);
            expect(mockNext).to.have.been.calledWith();
            expect(mockLogger.info).to.have.been.calledWith('Token verified successfully', { userId: decodedToken.user_id });
        });

        it('should throw error when no authorization header is provided', () => {
            authMiddleware(mockReq, mockRes, mockNext);

            expect(mockNext).to.have.been.calledWith(sinon.match.instanceOf(CustomError));
            const error = mockNext.firstCall.args[0];
            expect(error.message).to.equal('Access denied. No token provided.');
            expect(error.statusCode).to.equal(401);
            expect(error.code).to.equal('NO_TOKEN');
            expect(mockLogger.error).to.have.been.calledWith('No token provided in authorization header');
        });

        it('should throw error when authorization header format is invalid', () => {
            mockReq.headers.authorization = 'InvalidFormat';

            authMiddleware(mockReq, mockRes, mockNext);

            expect(mockNext).to.have.been.calledWith(sinon.match.instanceOf(CustomError));
            const error = mockNext.firstCall.args[0];
            expect(error.message).to.equal('Access denied. No token provided.');
            expect(error.statusCode).to.equal(401);
            expect(error.code).to.equal('NO_TOKEN');
        });

        it('should handle custom errors from auth service', () => {
            const token = 'valid.jwt.token';
            const customError = new CustomError('Token expired', 401, 'TOKEN_EXPIRED');

            mockReq.headers.authorization = `Bearer ${token}`;
            mockAuthService.verifyToken.throws(customError);

            authMiddleware(mockReq, mockRes, mockNext);

            expect(mockNext).to.have.been.calledWith(customError);
            expect(mockLogger.error).to.have.been.calledWith('Custom error during token verification', {
                error: customError.message,
                statusCode: customError.statusCode
            });
        });

        it('should handle generic errors from auth service', () => {
            const token = 'invalid.jwt.token';
            const genericError = new Error('JWT verification failed');

            mockReq.headers.authorization = `Bearer ${token}`;
            mockAuthService.verifyToken.throws(genericError);

            authMiddleware(mockReq, mockRes, mockNext);

            expect(mockNext).to.have.been.calledWith(sinon.match.instanceOf(CustomError));
            const error = mockNext.firstCall.args[0];
            expect(error.message).to.equal('Invalid token.');
            expect(error.statusCode).to.equal(401);
            expect(error.code).to.equal('INVALID_TOKEN');
            expect(mockLogger.error).to.have.been.calledWith('Invalid token during verification', {
                error: genericError.message
            });
        });

        it('should handle empty authorization header', () => {
            mockReq.headers.authorization = '';

            authMiddleware(mockReq, mockRes, mockNext);

            expect(mockNext).to.have.been.calledWith(sinon.match.instanceOf(CustomError));
            const error = mockNext.firstCall.args[0];
            expect(error.message).to.equal('Access denied. No token provided.');
            expect(error.statusCode).to.equal(401);
        });
    });
}); 