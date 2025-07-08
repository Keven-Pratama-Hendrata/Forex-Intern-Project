/**
 * Abstract base class for user repository.
 */
class UserRepository {
  /**
   * Find a user by ID.
   * @param {string} id The user ID
   * @returns {Promise<Object|null>} The user object or null if not found
   */
  // eslint-disable-next-line no-unused-vars
  async findOneById(id) {
    throw new Error('Method findOneById() must be implemented');
  }

  /**
   * Find a user by username.
   * @param {string} username The username
   * @returns {Promise<Object|null>} The user object or null if not found
   */
  // eslint-disable-next-line no-unused-vars
  async findOneByUsername(username) {
    throw new Error('Method findOneByUsername() must be implemented');
  }

  /**
   * Save a user object.
   * @param {Object} user - The user object to save
   * @returns {Promise<Object>} The saved user object
   */
  // eslint-disable-next-line no-unused-vars
  async save(user) {
    throw new Error('Method save() must be implemented');
  }
}

export default UserRepository;
