import { randomUUID } from 'crypto';

function isValidFlowId(flowId) {
    return (
        typeof flowId === 'string' &&
        /^[a-zA-Z0-9/+_\-=]{8,128}$/.test(flowId)
    );
}

function flowIdMiddleware(req, res, next) {
    let flowId = req.header('X-Flow-ID');
    if (!isValidFlowId(flowId)) {
        flowId = randomUUID();
    }
    req.flowId = flowId;
    res.setHeader('X-Flow-ID', flowId);
    if (process.env.NODE_ENV !== 'test') {
        console.log(`[Flow-ID] ${flowId} ${req.method} ${req.originalUrl}`);
    }
    next();
}

export default flowIdMiddleware; 