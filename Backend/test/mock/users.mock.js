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
        dailyTotalUsdHistory: [
            {
                date: new Date('2024-01-15'),
                total: 1500.75
            }
        ],
        lastFetchedDate: new Date('2024-01-15'),
        todayBalanceUsd: 1500.75
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
        dailyTotalUsdHistory: [
            {
                date: new Date('2024-01-15'),
                total: 3250.80
            }
        ],
        lastFetchedDate: new Date('2024-01-15'),
        todayBalanceUsd: 3250.80
    }
];

export const mockUserForAuth = {
    id: '507f1f77bcf86cd799439011',
    username: 'test_user',
    password: 'test_password',
    balances: [],
    balanceHistory: [],
    dailyTotalUsdHistory: [],
    lastFetchedDate: new Date(),
    todayBalanceUsd: 0
}; 