import dotenv from 'dotenv';
import express from 'express';

import container from './config/container.js';
import config from './config.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

/**
 * Main application class for the backend server.
 * Handles initialization, middleware, routes, error handling, and server lifecycle.
 * @class
 */
class App {
  /**
   * Constructs the App instance and initializes the application.
   * @param {Object} opts Options for the app.
   * @param {Object} opts.container Dependency injection container.
   * @param {number} [opts.port] Port to run the server on.
   */
  constructor(opts) {
    this.app = express();
    this.container = opts.container;
    this.port = opts.port || config.server.port;
    this.logger = this.container.get('logger');
    this.app.locals.config = config;
    this.initializeApp();
  }

  /**
   * Initializes the application by setting up middleware, routes, and error handling.
   * @returns {void}
   */
  initializeApp() {
    this.logger.info('Initializing application');
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
    this.logger.info('Application initialization completed');
  }

  /**
   * Sets up all middleware for the Express app, including CORS and custom middleware.
   * @returns {void}
   */
  setupMiddleware() {
    this.logger.info('Setting up middleware');

    this.app.use(express.json());

    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Flow-ID');
      res.header('Access-Control-Allow-Credentials', 'true');

      if (req.method === 'OPTIONS') {
        return res.status(200).end();
      }
      next();
    });

    const flowIdMiddleware = this.container.getMiddleware('flowIdMiddleware');
    const rateLimiter = this.container.getMiddleware('rateLimiter');

    this.app.use(flowIdMiddleware);
    this.app.use(rateLimiter);

    this.logger.info('Middleware setup completed');
  }

  /**
   * Sets up all application routes.
   * @returns {void}
   */
  setupRoutes() {
    this.logger.info('Setting up routes');

    const userRoute = this.container.getRoute('userRoute');
    this.app.use('/api/users', userRoute);

    const marketPriceRoute = this.container.getRoute('marketPriceRoute');
    this.app.use('/api/market', marketPriceRoute);

    this.logger.info('Routes setup completed');
  }

  /**
   * Sets up global error handling middleware.
   * @returns {void}
   */
  setupErrorHandling() {
    this.logger.info('Setting up error handling');

    this.app.use(errorHandler);

    this.logger.info('Error handling setup completed');
  }

  /**
   * Starts the server and runs initializations.
   * @async
   * @returns {Promise<void>} Resolves when the server has started.
   */
  async start() {
    try {
      this.logger.info('Starting server', { port: this.port });

      await this.runInitializations();

      return new Promise((resolve) => {
        this.server = this.app.listen(this.port, () => {
          this.logger.info('Server started successfully', { port: this.port });
          resolve();
        });
      });
    } catch (error) {
      this.logger.error('Failed to start server', { error: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Runs all required initializations before starting the server.
   * @async
   * @returns {Promise<void>}
   */
  async runInitializations() {
    const databaseInit = this.container.getInitialization('database');

    await databaseInit();
  }

  /**
   * Stops the server if it is running.
   * @async
   * @returns {Promise<void>|void} Resolves when the server has stopped, or void if the server was not running.
   */
  async stop() {
    if (this.server) {
      this.logger.info('Stopping server');

      this.server.close();

      this.logger.info('Server stopped successfully');
    }
  }

  /**
   * Returns the Express app instance used by the server.
   * @returns {import('express').Express} The Express app instance used by the server to handle HTTP requests.
   */
  getApp() {
    return this.app;
  }
}

/**
 * The main application instance.
 * @type {App}
 */
const app = new App({
  container,
  port: config.server.port
});

app.start().catch((error) => {
  console.error('Application startup failed:', error);
  process.exit(1);
});

export default app;
