import jwt from 'jsonwebtoken';
import { findUserByUsername } from '../utils/userUtils.js';
import User from '../../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'a7c8d9e0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1';

export const generateToken = (userId, user_name) => {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }
    return jwt.sign(
        { user_id: userId, user_name },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

export const loginUserService = async (username, password) => {
    const user = await findUserByUsername(username);

    if (user.password !== password) {
        throw new Error("Username or password is incorrect");
    }

    const token = generateToken(user._id, user.user_name);

    return {
        user_id: user._id,
        user_name: user.user_name,
        balances: user.balances,
        token
    };
};

export const registerUserService = async (username, password) => {
    let existingUser;
    try {
        existingUser = await findUserByUsername(username);
    } catch (err) {
        existingUser = null;
    }
    if (existingUser) {
        throw new Error('Username already exists');
    }

    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }

    const supportedCurrencies = ['AUD', 'EUR', 'IDR', 'JPY', 'USD'];
    const initialBalances = supportedCurrencies.map(currency => ({ currency, amount: 0 }));

    const newUser = new User({
        user_name: username,
        password: password,
        balances: initialBalances,
        balance_history: [],
        daily_total_usd_history: []
    });
    await newUser.save();

    const token = generateToken(newUser._id, newUser.user_name);

    return {
        user_id: newUser._id,
        user_name: newUser.user_name,
        balances: newUser.balances,
        token
    };
};
