export const mockUsers = [
    {
        _id: '507f1f77bcf86cd799439011',
        user_name: 'john_doe',
        password: 'password123',
        balances: [
            { currency: 'USD', amount: 1000.50 },
            { currency: 'EUR', amount: 500.25 }
        ],
        balance_history: [
            {
                currency: 'USD',
                balance: 1000.50,
                amount: 100.00,
                date: new Date('2024-01-15')
            }
        ],
        daily_total_usd_history: [
            {
                date: new Date('2024-01-15'),
                total: 1500.75
            }
        ],
        last_fetched_date: new Date('2024-01-15'),
        today_balance_usd: 1500.75
    },
    {
        _id: '507f1f77bcf86cd799439012',
        user_name: 'jane_smith',
        password: '123456',
        balances: [
            { currency: 'USD', amount: 2500.00 },
            { currency: 'GBP', amount: 750.80 }
        ],
        balance_history: [
            {
                currency: 'USD',
                balance: 2500.00,
                amount: 500.00,
                date: new Date('2024-01-15')
            }
        ],
        daily_total_usd_history: [
            {
                date: new Date('2024-01-15'),
                total: 3250.80
            }
        ],
        last_fetched_date: new Date('2024-01-15'),
        today_balance_usd: 3250.80
    }
];

export const mockUserForAuth = {
    _id: '507f1f77bcf86cd799439011',
    user_name: 'test_user',
    password: 'test_password',
    balances: [],
    balance_history: [],
    daily_total_usd_history: [],
    last_fetched_date: new Date(),
    today_balance_usd: 0
}; 