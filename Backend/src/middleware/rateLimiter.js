import rateLimit from 'express-rate-limit';

/**
 * Factory for rate limiting middleware.
 * @param {{ rateLimitWindowMs?: number, rateLimitMax?: number }} config Configuration object for rate limiting
 * @returns {import('express').RequestHandler} Express middleware function
 */
export default function createRateLimiter(config) {
  return rateLimit({
    windowMs: config.rateLimit.windowMs || 15 * 60 * 1000,
    max: config.rateLimit.max || 100,
    message: {
      code: 'TOO_MANY_REQUESTS',
      error: { message: 'Too many requests, please try again later.' },
      message: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
}
