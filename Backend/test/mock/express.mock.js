import sinon from 'sinon';

export function createMockReq(overrides = {}) {
    return {
        method: 'GET',
        url: '/test',
        headers: {},
        body: {},
        params: {},
        query: {},
        get: sinon.stub(),
        ...overrides
    };
}
export function createMockRes(overrides = {}) {
    return {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis(),
        setHeader: sinon.stub(),
        on: sinon.stub(),
        ...overrides
    };
}

export function createMockNext() {
    return sinon.stub();
} 