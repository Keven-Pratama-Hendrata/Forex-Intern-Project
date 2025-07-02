import { v4 as uuidv4 } from 'uuid';

function isValidFlowId(flowId) {
  return (
    typeof flowId === 'string'
    && /^[a-zA-Z0-9/+_\-=]{8,128}$/.test(flowId)
  );
}

/**
 * Middleware to assign a unique flow ID to each request.
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {Function} next Express next middleware function
 */
export default function flowIdMiddleware(req, res, next) {
  let flowId = req.header('X-Flow-ID');
  if (!isValidFlowId(flowId)) {
    flowId = uuidv4();
  }
  req.flowId = flowId;
  res.setHeader('X-Flow-ID', flowId);
  next();
}
