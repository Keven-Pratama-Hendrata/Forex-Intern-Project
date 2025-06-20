import jwt from 'jsonwebtoken';
import { findUserByUsername } from '../utils/userUtils.js';

const JWT_SECRET = process.env.JWT_SECRET || 'a7c8d9e0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1';

export const generateToken = (userId, userName) => {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }
    return jwt.sign(
        { user_id: userId, user_name: userName },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

export const loginUserService = async (username, password) => {
    const user = await findUserByUsername(username);

    if (user.password !== password) {
        throw new Error("Username or password is incorrect");
    }

    const token = generateToken(user._id, user.userName);

    return {
        user_id: user._id,
        user_name: user.userName,
        balances: user.balances,
        token
    };
};
