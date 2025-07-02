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
  async ofId(id) {
    const mongooseUser = await UserModel.findById(id);

    return mongooseUser;
  }

  /**
   * Find a user by user name
   * @param {string} userName The user name
   * @returns {Promise<Object|null>} The user object or null if not found
   */
  async ofUserName(userName) {
    const mongooseUser = await UserModel.findOne({ user_name: userName });

    return mongooseUser;
  }

  /**
   * Save a user object
   * @param {Object} user The user object to save
   * @returns {Promise<Object>} The saved user object
   */
  async save(user) {
    let updatedMongooseUser;
    if (user._id) {
      updatedMongooseUser = await UserModel.findByIdAndUpdate(
        user._id,
        user,
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
