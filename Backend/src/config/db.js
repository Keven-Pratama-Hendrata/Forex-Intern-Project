import mongoose from 'mongoose';
import Logger from '../utils/logger.js';

import config from '../config.js';

/**
 * Start connection to database
 */
export const connectDB = async () => {
  try {
    await mongoose.connect(config.db.uri);
    Logger.info('MongoDB connected');
  } catch (error) {
    Logger.error('Error connecting to database', { error });
    process.exit(1);
  }
};
