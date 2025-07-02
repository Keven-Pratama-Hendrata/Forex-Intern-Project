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
        secretKey: process.env.JWT_SECRET || 'a7c8d9e0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1',
        keyAlgorithm: process.env.JWT_ALGORITHM || 'HS256',
        expiry: process.env.JWT_EXPIRY || '24h',
        audience: process.env.JWT_AUDIENCE || 'forex-app'
    },
    rateLimit: {
        windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
        max: process.env.RATE_LIMIT_MAX || 100
    }
};

export default config;
