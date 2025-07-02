import jwt from 'jsonwebtoken';

import Constants from '../constants.js';

/**
 * Service for authentication-related operations.
 */
class AuthService {
  /**
   * Create an AuthService instance.
   * @param {Object} root0 Dependencies for AuthService
   * @param {Object} root0.userRepository The user repository
   * @param {Object} root0.logger The logger instance
   * @param {Object} root0.config The configuration object
   */
  constructor({ userRepository, logger, config }) {
    this.userRepository = userRepository;
    this.logger = logger;
    this.config = config;
  }

  /**
   * Generate a JWT token for a user.
   * @param {string} userId The user ID
   * @param {string} userName The user name
   * @returns {string} The generated JWT token
   */
  generateToken(userId, userName) {
    this.logger.info('Generating JWT token', { userId, userName });
    const jwtConfig = this.config.jwt;
    if (!jwtConfig.secretKey) {
      this.logger.error('JWT_SECRET is not configured');
      throw new Error('JWT_SECRET is not configured');
    }
    const token = jwt.sign(
      { user_id: userId, user_name: userName },
      jwtConfig.secretKey,
      {
        expiresIn: jwtConfig.expiry,
        audience: jwtConfig.audience,
        algorithm: jwtConfig.keyAlgorithm
      }
    );
    this.logger.info('JWT token generated successfully', { userId, userName });

    return token;
  }

  /**
   * Authenticate a user by user name and password.
   * @param {string} userName The user name
   * @param {string} password The user password
   * @returns {Promise<Object>} The authenticated user object
   */
  async authenticateUser(userName, password) {
    this.logger.info('Authenticating user', { userName });
    const user = await this.userRepository.ofUserName(userName);
    if (!user) {
      this.logger.error('User not found during authentication', { userName });
      const error = new Error('User not found');
      error.error = Constants.ERROR_CODES.USER_NOT_FOUND;
      throw error;
    }
    if (user.password !== password) {
      this.logger.error('Invalid password during authentication', { userName });
      const error = new Error('Password is incorrect');
      error.error = Constants.ERROR_CODES.INVALID_PASSWORD;
      throw error;
    }
    this.logger.info('User authenticated successfully', { userId: user._id, userName });

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
      this.logger.info('JWT token verified successfully', { userId: decoded.user_id });

      return decoded;
    } catch (error) {
      this.logger.error('JWT token verification failed', { error: error.message });
      throw new Error('Invalid token');
    }
  }
}

export default AuthService;
