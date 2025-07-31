import jwt from 'jsonwebtoken';

import Constants from '../constants.js';

/**
 * Service for authentication-related operations.
 */
class AuthService {
  /**
   * Creates an instance of AuthService.
   * @param {Object} dependencies An object containing all dependencies for AuthService.
   * @param {Object} dependencies.userRepository The user repository
   * @param {Object} dependencies.logger The logger instance
   * @param {Object} dependencies.config The configuration object
   */
  constructor({ userRepository, logger, config }) {
    this.userRepository = userRepository;
    this.logger = logger;
    this.config = config;
  }

  /**
   * Generate a JWT token for a user.
   * @param {string} userid The user ID
   * @param {string} username The username
   * @returns {string} The generated JWT token
   */
  generateToken(userid, username) {
    this.logger.info('Generating JWT token', { userid, username });
    const jwtConfig = this.config.jwt;
    if (!jwtConfig.secretKey) {
      this.logger.error('JWT_SECRET is not configured');
      throw new Error('JWT_SECRET is not configured');
    }
    const token = jwt.sign(
      { userid: userid, username: username },
      jwtConfig.secretKey,
      {
        expiresIn: jwtConfig.expiry,
        audience: jwtConfig.audience,
        algorithm: jwtConfig.keyAlgorithm
      }
    );
    this.logger.info('JWT token generated successfully', { userid, username });

    return token;
  }

  /**
   * Authenticate a user by username and password.
   * @param {string} username The username
   * @param {string} password The user password
   * @returns {Promise<Object>} The authenticated user object
   */
  async authenticateUser(username, password) {
    this.logger.info('Authenticating user', { username });

    const user = await this.userRepository.findOneByUsername(username);

    if (!user) {
      this.logger.error('User not found during authentication', { username });
      const error = new Error('User not found');
      error.error = Constants.ERROR_CODES.USER_NOT_FOUND;
      throw error;
    }

    if (user.password !== password) {
      this.logger.error('Invalid password during authentication', { username });
      const error = new Error('Password is incorrect');
      error.error = Constants.ERROR_CODES.INVALID_PASSWORD;
      throw error;
    }

    this.logger.info('User authenticated successfully', { userid: user.id, username });

    return user;
  }

  /**
   * Verify a JWT token.
   * @param {string} token The JWT token
   * @returns {Object} The decoded token payload
   */
  verifyToken(token) {
    this.logger.info('Verifying JWT token');
    const jwtConfig = this.config.jwt;
    try {
      const decoded = jwt.verify(token, jwtConfig.secretKey, {
        audience: jwtConfig.audience,
        algorithms: [jwtConfig.keyAlgorithm]
      });
      this.logger.info('JWT token verified successfully', { userid: decoded.userid });

      return decoded;
    } catch (error) {
      this.logger.error('JWT token verification failed', { error: error.message });
      throw new Error('Invalid token');
    }
  }
}

export default AuthService;
