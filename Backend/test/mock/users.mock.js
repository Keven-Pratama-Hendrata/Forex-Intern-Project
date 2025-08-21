export const mockUsers = [
    {
        id: '507f1f77bcf86cd799439011',
        username: 'john_doe',
        password: 'password123',
        balances: [
            { currency: 'USD', amount: 1000.50 },
            { currency: 'EUR', amount: 500.25 }
        ],
        balanceHistory: [
            {
                currency: 'USD',
                balance: 1000.50,
                amount: 100.00,
                date: new Date('2024-01-15')
            }
        ],
        lastFetchedDate: new Date('2024-01-15'),

    },
    {
        id: '507f1f77bcf86cd799439012',
        username: 'jane_smith',
        password: '123456',
        balances: [
            { currency: 'USD', amount: 2500.00 },
            { currency: 'GBP', amount: 750.80 }
        ],
        balanceHistory: [
            {
                currency: 'USD',
                balance: 2500.00,
                amount: 500.00,
                date: new Date('2024-01-15')
            }
        ],
        lastFetchedDate: new Date('2024-01-15'),

    }
];

export const mockUserForAuth = {
    id: '507f1f77bcf86cd799439011',
    username: 'test_user',
    password: 'test_password',
    balances: [],
    balanceHistory: [],
    lastFetchedDate: new Date()
}; 