import sinon from 'sinon';

export function createMockUserController(overrides = {}) {
    return {
        getUserProfile: sinon.stub(),
        updateBalance: sinon.stub(),
        ...overrides
    };
}

export function createMockAuthController(overrides = {}) {
    return {
        loginUser: sinon.stub(),
        signupUser: sinon.stub(),
        ...overrides
    };
} 