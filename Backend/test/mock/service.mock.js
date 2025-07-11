import sinon from 'sinon';

export function createMockAuthService(overrides = {}) {
    return {
        authenticateUser: sinon.stub(),
        registerUser: sinon.stub(),
        generateToken: sinon.stub(),
        verifyToken: sinon.stub(),
        ...overrides
    };
}

export function createMockUserService(overrides = {}) {
    return {
        getUserProfile: sinon.stub(),
        updateBalance: sinon.stub(),
        handleUpdateBalance: sinon.stub(),
        ...overrides
    };
} 