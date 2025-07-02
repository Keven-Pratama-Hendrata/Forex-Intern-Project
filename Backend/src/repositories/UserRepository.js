/**
 * Abstract base class for user repository.
 */
class UserRepository {
  /**
   * Find a user by ID.
   * @param {string} _id The user ID
   * @returns {Promise<Object|null>} The user object or null if not found
   */
  // eslint-disable-next-line no-unused-vars
  async ofId(_id) {
    throw new Error('Method ofId() must be implemented');
  }

  /**
   * Find a user by user name.
   * @param {string} _userName The user name
   * @returns {Promise<Object|null>} The user object or null if not found
   */
  // eslint-disable-next-line no-unused-vars
  async ofUserName(_userName) {
    throw new Error('Method ofUserName() must be implemented');
  }

  /**
   * Save a user object.
   * @param {Object} _user - The user object to save
   * @returns {Promise<Object>} The saved user object
   */
  // eslint-disable-next-line no-unused-vars
  async save(_user) {
    throw new Error('Method save() must be implemented');
  }
}

export default UserRepository;
