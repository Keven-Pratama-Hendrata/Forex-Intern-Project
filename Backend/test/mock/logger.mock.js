import sinon from 'sinon';

export function createMockLogger() {
    return {
        info: sinon.stub(),
        error: sinon.stub(),
        warn: sinon.stub(),
        debug: sinon.stub(),
    };
} 