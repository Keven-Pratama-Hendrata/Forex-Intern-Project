import sinon from 'sinon';

export function createMockUserRepository(overrides = {}) {
    return {
        findOneById: sinon.stub(),
        findOneByUsername: sinon.stub(),
        save: sinon.stub(),
        create: sinon.stub(),
        ...overrides
    };
} 