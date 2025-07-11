import CustomError from '../../src/utils/error.js';

describe('CustomError', () => {
    describe('constructor', () => {
        it('should create CustomError with default values', () => {
            const error = new CustomError('Test error');

            expect(error.message).to.equal('Test error');
            expect(error.statusCode).to.equal(500);
            expect(error.code).to.equal('INTERNAL_ERROR');
            expect(error.name).to.equal('CustomError');
            expect(error).to.be.instanceOf(Error);
            expect(error).to.be.instanceOf(CustomError);
        });

        it('should create CustomError with custom status code', () => {
            const error = new CustomError('Not found', 404);

            expect(error.message).to.equal('Not found');
            expect(error.statusCode).to.equal(404);
            expect(error.code).to.equal('INTERNAL_ERROR');
            expect(error.name).to.equal('CustomError');
        });

        it('should create CustomError with custom status code and error code', () => {
            const error = new CustomError('Unauthorized', 401, 'UNAUTHORIZED');

            expect(error.message).to.equal('Unauthorized');
            expect(error.statusCode).to.equal(401);
            expect(error.code).to.equal('UNAUTHORIZED');
            expect(error.name).to.equal('CustomError');
        });

        it('should capture stack trace', () => {
            const error = new CustomError('Test error');

            expect(error.stack).to.be.a('string');
            expect(error.stack).to.include('CustomError');
        });

        it('should be throwable', () => {
            expect(() => {
                throw new CustomError('Test error');
            }).to.throw('Test error');
        });
    });

    describe('error properties', () => {
        it('should have correct property types', () => {
            const error = new CustomError('Test error', 400, 'BAD_REQUEST');

            expect(typeof error.message).to.equal('string');
            expect(typeof error.statusCode).to.equal('number');
            expect(typeof error.code).to.equal('string');
            expect(typeof error.name).to.equal('string');
            expect(typeof error.stack).to.equal('string');
        });

        it('should be serializable', () => {
            const error = new CustomError('Test error', 500, 'INTERNAL_ERROR');
            const serialized = JSON.stringify(error);

            expect(serialized).to.include('Test error');
            expect(serialized).to.include('500');
            expect(serialized).to.include('INTERNAL_ERROR');
            expect(serialized).to.include('CustomError');
        });
    });
}); 