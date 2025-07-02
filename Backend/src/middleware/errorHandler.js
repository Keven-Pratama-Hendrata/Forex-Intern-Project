import Logger from '../utils/logger.js';

/**
 * Express error handling middleware.
 * @param {Error} err The error object
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {Function} next Express next middleware function (required for Express to recognize this as an error handler)
 */
export default function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Internal Server Error';
  res.status(err.statusCode || 500).json({
    code,
    error: { message },
    message,
  });
}
