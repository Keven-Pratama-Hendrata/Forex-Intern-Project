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

/**
 * Dependency injection container for application services, controllers, routes, and middleware.
 * Handles initialization and retrieval of all major app components.
 * @class
 */
class Container {
  /**
   * Constructs the Container and initializes all components.
   */
  constructor() {
    this.services = new Map();
    this.controllers = new Map();
    this.routes = new Map();
    this.middlewares = new Map();
    this.initializations = new Map();
    this.config = config;
    this.initializeContainer();
  }

  /**
   * Initializes all container components in the correct order.
   * @returns {void}
   */
  initializeContainer() {
    this.initializeUtilities();
    this.initializeRepositories();
    this.initializeServices();
    this.initializeControllers();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeInitializations();
  }

  /**
   * Initializes utility services.
   * @returns {void}
   */
  initializeUtilities() {
    this.services.set('logger', Logger);
  }

  /**
   * Initializes repository services.
   * @returns {void}
   */
  initializeRepositories() {
    this.services.set('userRepository', new MongooseUserRepository());
  }

  /**
   * Initializes business logic services.
   * @returns {void}
   */
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

  /**
   * Initializes controllers for handling HTTP requests.
   * @returns {void}
   */
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

  /**
   * Initializes middleware functions for Express.
   * @returns {void}
   */
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

  /**
   * Initializes Express routes.
   * @returns {void}
   */
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

  /**
   * Initializes startup/initialization functions.
   * @returns {void}
   */
  initializeInitializations() {
    this.initializations.set('database', connectDB);
  }

  /**
   * Retrieves a service by name.
   * @param {string} serviceName The name of the service.
   * @returns {*} The service instance.
   * @throws {Error} If the service is not found.
   */
  get(serviceName) {
    if (!this.services.has(serviceName)) {
      throw new Error(`Service '${serviceName}' not found in container`);
    }

    return this.services.get(serviceName);
  }

  /**
   * Retrieves a controller by name.
   * @param {string} controllerName The name of the controller.
   * @returns {*} The controller instance.
   * @throws {Error} If the controller is not found.
   */
  getController(controllerName) {
    if (!this.controllers.has(controllerName)) {
      throw new Error(`Controller '${controllerName}' not found in container`);
    }

    return this.controllers.get(controllerName);
  }

  /**
   * Retrieves a route by name.
   * @param {string} routeName The name of the route.
   * @returns {*} The route instance.
   * @throws {Error} If the route is not found.
   */
  getRoute(routeName) {
    if (!this.routes.has(routeName)) {
      throw new Error(`Route '${routeName}' not found in container`);
    }

    return this.routes.get(routeName);
  }

  /**
   * Retrieves a middleware by name.
   * @param {string} middlewareName The name of the middleware.
   * @returns {*} The middleware instance.
   * @throws {Error} If the middleware is not found.
   */
  getMiddleware(middlewareName) {
    if (!this.middlewares.has(middlewareName)) {
      throw new Error(`Middleware '${middlewareName}' not found in container`);
    }

    return this.middlewares.get(middlewareName);
  }

  /**
   * Retrieves an initialization function by name.
   * @param {string} initName The name of the initialization.
   * @returns {*} The initialization function.
   * @throws {Error} If the initialization is not found.
   */
  getInitialization(initName) {
    if (!this.initializations.has(initName)) {
      throw new Error(`Initialization '${initName}' not found in container`);
    }

    return this.initializations.get(initName);
  }

  /**
   * Registers a new service in the container.
   * @param {string} serviceName The name of the service.
   * @param {*} serviceInstance The service instance.
   * @returns {void}
   */
  register(serviceName, serviceInstance) {
    this.services.set(serviceName, serviceInstance);
  }

  /**
   * Registers a new controller in the container.
   * @param {string} controllerName The name of the controller.
   * @param {*} controllerInstance The controller instance.
   * @returns {void}
   */
  registerController(controllerName, controllerInstance) {
    this.controllers.set(controllerName, controllerInstance);
  }

  /**
   * Registers a new route in the container.
   * @param {string} routeName The name of the route.
   * @param {*} routeInstance The route instance.
   * @returns {void}
   */
  registerRoute(routeName, routeInstance) {
    this.routes.set(routeName, routeInstance);
  }

  /**
   * Registers a new middleware in the container.
   * @param {string} middlewareName The name of the middleware.
   * @param {*} middlewareInstance The middleware instance.
   * @returns {void}
   */
  registerMiddleware(middlewareName, middlewareInstance) {
    this.middlewares.set(middlewareName, middlewareInstance);
  }

  /**
   * Returns all registered services as an object.
   * @returns {Object} All services.
   */
  getAllServices() {
    return Object.fromEntries(this.services);
  }

  /**
   * Returns all registered controllers as an object.
   * @returns {Object} All controllers.
   */
  getAllControllers() {
    return Object.fromEntries(this.controllers);
  }

  /**
   * Returns all registered routes as an object.
   * @returns {Object} All routes.
   */
  getAllRoutes() {
    return Object.fromEntries(this.routes);
  }

  /**
   * Returns all registered middlewares as an object.
   * @returns {Object} All middlewares.
   */
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
