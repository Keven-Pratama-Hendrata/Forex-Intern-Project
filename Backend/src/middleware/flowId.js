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
    next();
}

export default flowIdMiddleware; 