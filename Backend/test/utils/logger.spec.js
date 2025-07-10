import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;

import Logger from '../../src/utils/logger.js';

describe('Logger utility', () => {
    let consoleLogStub, consoleErrorStub, consoleWarnStub;

    beforeEach(() => {
        consoleLogStub = sinon.stub(console, 'log');
        consoleErrorStub = sinon.stub(console, 'error');
        consoleWarnStub = sinon.stub(console, 'warn');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should log info messages', () => {
        const message = 'Test info';
        const data = { foo: 'bar' };

        Logger.info(message, data);

        expect(consoleLogStub).to.have.been.calledWithMatch(
            sinon.match(/^\[INFO\] .+ - Test info$/),
            { foo: 'bar' }
        );
    });

    it('should log error messages', () => {
        const message = 'Test error';
        const data = { foo: 'bar' };

        Logger.error(message, data);

        expect(consoleErrorStub).to.have.been.calledWithMatch(
            sinon.match(/^\[ERROR\] .+ - Test error$/),
            { foo: 'bar' }
        );
    });

    it('should log warn messages', () => {
        const message = 'Test warn';
        const data = { foo: 'bar' };

        Logger.warn(message, data);

        expect(consoleWarnStub).to.have.been.calledWithMatch(
            sinon.match(/^\[WARN\] .+ - Test warn$/),
            { foo: 'bar' }
        );
    });

    it('should log debug messages', () => {
        const message = 'Test debug';
        const data = { foo: 'bar' };

        Logger.debug(message, data);

        expect(consoleLogStub).to.have.been.calledWithMatch(
            sinon.match(/^\[DEBUG\] .+ - Test debug$/),
            { foo: 'bar' }
        );
    });

    it('should log HTTP request info on finish', () => {
        const req = {
            method: 'GET',
            url: '/api/test',
            get: sinon.stub().withArgs('User-Agent').returns('test-agent'),
            ip: '127.0.0.1'
        };
        const res = {
            statusCode: 200,
            on: sinon.stub()
        };
        const next = sinon.stub();

        res.on.callsFake((event, handler) => {
            if (event === 'finish') handler();
        });

        Logger.logRequest(req, res, next);

        expect(res.on).to.have.been.calledWith('finish', sinon.match.func);
        expect(consoleLogStub).to.have.been.calledWithMatch(
            sinon.match(/^\[INFO\] .+ - HTTP Request$/),
            sinon.match({
                method: 'GET',
                url: '/api/test',
                statusCode: 200,
                duration: sinon.match.string,
                userAgent: 'test-agent',
                ip: '127.0.0.1'
            })
        );
        expect(next).to.have.been.calledOnce;
    });
}); 