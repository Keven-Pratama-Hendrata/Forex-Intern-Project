import dotenv from 'dotenv';

dotenv.config();

const config = {
    server: {
        port: process.env.PORT || 5001
    },
    db: {
        uri: process.env.DB_URI
    },
    jwt: {
        secretKey: process.env.JWT_SECRET,
        keyAlgorithm: process.env.JWT_ALGORITHM || 'HS256',
        expiry: process.env.JWT_EXPIRY || '24h',
        audience: process.env.JWT_AUDIENCE || 'forex-app'
    },
    rateLimit: {
        windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
        max: process.env.RATE_LIMIT_MAX || 100
    },
    currencyApi: {
        baseUrl: process.env.BASE_URL,
        apiKey: process.env.CURRENCY_API_KEY
    }
};

export default config;
