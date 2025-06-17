import jwt from 'jsonwebtoken';
import { findUserByUsername } from '../utils/userUtils.js';

const JWT_SECRET = process.env.JWT_SECRET || 'a7c8d9e0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1';

const generateToken = (userId, userName) => {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }
    return jwt.sign(
        { userId, userName },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

export async function loginUser(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const user = await findUserByUsername(username);

        if (user.password !== password) {
            return res.status(401).json({ message: "Username or password is incorrect" });
        }

        const token = generateToken(user._id, user.userName);

        res.status(200).json({
            message: "Login successful",
            userId: user._id,
            userName: user.userName,
            balances: user.balances,
            token
        });
    } catch (error) {
        console.error("Error in loginUser controller", error);
        if (error.message === 'User not found') {
            return res.status(401).json({ message: "Username or password is incorrect" });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
} 