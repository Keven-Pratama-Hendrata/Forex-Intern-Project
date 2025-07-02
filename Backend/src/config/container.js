import config from '../config.js';
import AuthController from '../controllers/authController.js';
import UserController from '../controllers/userController.js';
import AuthMiddleware from '../middleware/authMiddleware.js';
import errorHandler from '../middleware/errorHandler.js';
import flowIdMiddleware from '../middleware/flowId.js';
import rateLimiter from '../middleware/rateLimiter.js';
import { MongooseUserRepository } from '../repositories/index.js';
import UserRoute from '../routes/userRoute.js';
import AuthService from '../services/authService.js';
import UserService from '../services/userService.js';
import Logger from '../utils/logger.js';

import { connectDB } from './db.js';

class Container {
  constructor() {
    this.services = new Map();
    this.controllers = new Map();
    this.routes = new Map();
    this.middlewares = new Map();
    this.initializations = new Map();
    this.config = config;
    this.initializeContainer();
  }

  initializeContainer() {
    this.initializeUtilities();
    this.initializeRepositories();
    this.initializeServices();
    this.initializeControllers();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeInitializations();
  }

  initializeUtilities() {
    this.services.set('logger', Logger);
  }

  initializeRepositories() {
    this.services.set('userRepository', new MongooseUserRepository());
  }

  initializeServices() {
    const userRepository = this.services.get('userRepository');
    const logger = this.services.get('logger');

    this.services.set('userService', new UserService({
      userRepository,
      logger,
      config: this.config
    }));

    this.services.set('authService', new AuthService({
      userRepository,
      logger,
      config: this.config
    }));
  }

  initializeControllers() {
    const userService = this.services.get('userService');
    const authService = this.services.get('authService');
    const logger = this.services.get('logger');

    this.controllers.set('userController', new UserController({
      userService,
      logger,
      config: this.config
    }));

    this.controllers.set('authController', new AuthController({
      authService,
      logger,
      config: this.config
    }));
  }

  initializeMiddlewares() {
    const authService = this.services.get('authService');
    const logger = this.services.get('logger');

    this.middlewares.set('authMiddleware', new AuthMiddleware({
      authService,
      logger,
      config: this.config
    }));
    this.middlewares.set('rateLimiter', rateLimiter(this.config));
    this.middlewares.set('errorHandler', errorHandler);
    this.middlewares.set('flowIdMiddleware', flowIdMiddleware);
  }

  initializeRoutes() {
    const userController = this.controllers.get('userController');
    const authController = this.controllers.get('authController');
    const verifyTokenMiddleware = this.middlewares.get('authMiddleware');
    const logger = this.services.get('logger');

    this.routes.set('userRoute', new UserRoute({
      userController,
      authController,
      verifyTokenMiddleware,
      logger,
      config: this.config
    }));
  }

  initializeInitializations() {
    this.initializations.set('database', connectDB);
  }

  get(serviceName) {
    if (!this.services.has(serviceName)) {
      throw new Error(`Service '${serviceName}' not found in container`);
    }

    return this.services.get(serviceName);
  }

  getController(controllerName) {
    if (!this.controllers.has(controllerName)) {
      throw new Error(`Controller '${controllerName}' not found in container`);
    }

    return this.controllers.get(controllerName);
  }

  getRoute(routeName) {
    if (!this.routes.has(routeName)) {
      throw new Error(`Route '${routeName}' not found in container`);
    }

    return this.routes.get(routeName);
  }

  getMiddleware(middlewareName) {
    if (!this.middlewares.has(middlewareName)) {
      throw new Error(`Middleware '${middlewareName}' not found in container`);
    }

    return this.middlewares.get(middlewareName);
  }

  getInitialization(initName) {
    if (!this.initializations.has(initName)) {
      throw new Error(`Initialization '${initName}' not found in container`);
    }

    return this.initializations.get(initName);
  }

  register(serviceName, serviceInstance) {
    this.services.set(serviceName, serviceInstance);
  }

  registerController(controllerName, controllerInstance) {
    this.controllers.set(controllerName, controllerInstance);
  }

  registerRoute(routeName, routeInstance) {
    this.routes.set(routeName, routeInstance);
  }

  registerMiddleware(middlewareName, middlewareInstance) {
    this.middlewares.set(middlewareName, middlewareInstance);
  }

  getAllServices() {
    return Object.fromEntries(this.services);
  }

  getAllControllers() {
    return Object.fromEntries(this.controllers);
  }

  getAllRoutes() {
    return Object.fromEntries(this.routes);
  }

  getAllMiddlewares() {
    return Object.fromEntries(this.middlewares);
  }
}

const container = new Container();

export default container;
export const userService = container.get('userService');
export const authService = container.get('authService');
export const userController = container.getController('userController');
export const authController = container.getController('authController');
export const userRoute = container.getRoute('userRoute');
export const logger = container.get('logger');
