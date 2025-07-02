import dotenv from 'dotenv';
import express from 'express';

import container from './config/container.js';
import config from './config.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

class App {
  constructor(opts) {
    this.app = express();
    this.container = opts.container;
    this.port = opts.port || config.server.port;
    this.logger = this.container.get('logger');
    this.app.locals.config = config;
    this.initializeApp();
  }

  initializeApp() {
    this.logger.info('Initializing application');
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
    this.logger.info('Application initialization completed');
  }

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

  setupRoutes() {
    this.logger.info('Setting up routes');

    const userRoute = this.container.getRoute('userRoute');
    this.app.use('/api/users', userRoute);

    this.logger.info('Routes setup completed');
  }

  setupErrorHandling() {
    this.logger.info('Setting up error handling');

    this.app.use(errorHandler);

    this.logger.info('Error handling setup completed');
  }

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

  async runInitializations() {
    const databaseInit = this.container.getInitialization('database');
    await databaseInit();
  }

  async stop() {
    if (this.server) {
      this.logger.info('Stopping server');
      this.server.close();
      this.logger.info('Server stopped successfully');
    }
  }

  getApp() {
    return this.app;
  }
}

const app = new App({
  container,
  port: config.server.port
});

app.start().catch((error) => {
  console.error('Application startup failed:', error);
  process.exit(1);
});

export default app;
