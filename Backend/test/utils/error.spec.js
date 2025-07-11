import CustomError from '../../src/utils/error.js';

describe('CustomError', () => {
    describe('constructor', () => {
        it('should create CustomError with default values', () => {
            const message = 'Test error';

            const error = new CustomError(message);

            expect(error.message).to.equal('Test error');
            expect(error.statusCode).to.equal(500);
            expect(error.code).to.equal('INTERNAL_ERROR');
            expect(error.name).to.equal('CustomError');
            expect(error).to.be.instanceOf(Error);
            expect(error).to.be.instanceOf(CustomError);
        });

        it('should create CustomError with custom status code', () => {
            const message = 'Not found';
            const statusCode = 404;

            const error = new CustomError(message, statusCode);

            expect(error.message).to.equal('Not found');
            expect(error.statusCode).to.equal(404);
            expect(error.code).to.equal('INTERNAL_ERROR');
            expect(error.name).to.equal('CustomError');
        });

        it('should create CustomError with custom status code and error code', () => {
            const message = 'Unauthorized';
            const statusCode = 401;
            const code = 'UNAUTHORIZED';

            const error = new CustomError(message, statusCode, code);

            expect(error.message).to.equal('Unauthorized');
            expect(error.statusCode).to.equal(401);
            expect(error.code).to.equal('UNAUTHORIZED');
            expect(error.name).to.equal('CustomError');
        });

        it('should capture stack trace', () => {
            const message = 'Test error';

            const error = new CustomError(message);

            expect(error.stack).to.be.a('string');
            expect(error.stack).to.include('CustomError');
        });

        it('should be throwable', () => {
            const message = 'Test error';

            expect(() => {
                throw new CustomError(message);
            }).to.throw('Test error');
        });
    });

    describe('error properties', () => {
        it('should have correct property types', () => {
            const message = 'Test error';
            const statusCode = 400;
            const code = 'BAD_REQUEST';

            const error = new CustomError(message, statusCode, code);

            expect(typeof error.message).to.equal('string');
            expect(typeof error.statusCode).to.equal('number');
            expect(typeof error.code).to.equal('string');
            expect(typeof error.name).to.equal('string');
            expect(typeof error.stack).to.equal('string');
        });

        it('should be serializable', () => {
            const message = 'Test error';
            const statusCode = 500;
            const code = 'INTERNAL_ERROR';

            const error = new CustomError(message, statusCode, code);
            const serialized = JSON.stringify(error);

            expect(serialized).to.include('Test error');
            expect(serialized).to.include('500');
            expect(serialized).to.include('INTERNAL_ERROR');
            expect(serialized).to.include('CustomError');
        });
    });
}); 