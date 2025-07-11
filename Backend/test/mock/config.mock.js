export function createMockConfig(overrides = {}) {
    return {
        jwt: {
            secretKey: 'test-secret-key',
            expiry: '1h',
            audience: 'CUSTOMER',
            keyAlgorithm: 'HS256'
        },
        ...overrides
    };
} 