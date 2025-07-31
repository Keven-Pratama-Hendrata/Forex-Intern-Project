import UserModel from '../models/UserModel.js';

import UserRepository from './UserRepository.js';

/**
 * Mongoose Repository
 */
class MongooseUserRepository extends UserRepository {
  /**
   * Find a user by ID
   * @param {string} id The user ID
   * @returns {Promise<Object|null>} The user object or null if not found
   */
  async findOneById(id) {
    const mongooseUser = await UserModel.findById(id);

    return mongooseUser;
  }

  /**
   * Find a user by username
   * @param {string} username The username
   * @returns {Promise<Object|null>} The user object or null if not found
   */
  async findOneByUsername(username) {
    const mongooseUser = await UserModel.findOne({ username: username });

    return mongooseUser;
  }

  /**
   * Save a user object
   * @param {Object} user The user object to save
   * @returns {Promise<Object>} The saved user object
   */
  async save(user) {
    let updatedMongooseUser;

    if (user.id) {
      updatedMongooseUser = await UserModel.findByIdAndUpdate(
        user.id,
        { $set: user },
        { new: true }
      );
    } else {
      const newUser = new UserModel(user);

      updatedMongooseUser = await newUser.save();
    }

    return updatedMongooseUser;
  }
}

export default MongooseUserRepository;
