import { mockUsers } from './users.mock.js';

export const mockBalanceRequest = { balance: { currency: 'USD', amount: 100 } };

export const mockErrorMessages = {
    GENERIC: 'fail',
    USERNAME_EXISTS: 'Username already exists',
    SERVICE_ERROR: 'Service error',
    USER_NOT_FOUND: 'User not found',
    INSUFFICIENT_FUNDS: 'Insufficient funds',
    TOKEN_EXPIRED: 'Token expired',
    JWT_FAILED: 'JWT verification failed',
    CUSTOM_ERROR: 'Custom error',
    SOMETHING_WRONG: 'Something went wrong'
};

export const createMockError = (message = mockErrorMessages.GENERIC) => new Error(message);

export const getMockUserWithId = (id) => {
    const user = JSON.parse(JSON.stringify(mockUsers[0]));
    user.id = id;
    return user;
};

export const getMockBalance = (currency = 'USD', amount = 100.50) => {
    return { currency, amount };
}; 