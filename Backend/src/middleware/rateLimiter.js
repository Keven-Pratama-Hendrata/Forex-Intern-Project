const RATE_LIMIT = 10;
const WINDOW_MS = 60 * 1000;

const ipMap = new Map();

function rateLimiter(req, res, next) {
    const now = Date.now();
    const ip = req.ip;
    let entry = ipMap.get(ip);
    if (!entry || now > entry.reset) {
        entry = { count: 0, reset: now + WINDOW_MS };
        ipMap.set(ip, entry);
    }
    entry.count++;
    const remaining = Math.max(0, RATE_LIMIT - entry.count);
    const resetSeconds = Math.ceil((entry.reset - now) / 1000);

    res.setHeader('X-RateLimit-Limit', RATE_LIMIT);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetSeconds);

    if (entry.count > RATE_LIMIT) {
        res.setHeader('Retry-After', resetSeconds);
        const accept = req.headers.accept || '';
        const wantsProblem = accept.includes('application/problem+json');
        const problem = {
            type: '/problems/too-many-requests',
            title: 'Too Many Requests',
            status: 429,
            detail: `Rate limit exceeded. Try again in ${resetSeconds} seconds.`
        };
        if (wantsProblem) {
            res.status(429).type('application/problem+json').json(problem);
        } else {
            res.status(429).json({ message: problem.detail });
        }
        return;
    }
    next();
}

module.exports = rateLimiter; 