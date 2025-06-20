import { loginUserService } from '../services/authService.js';

export async function loginUser(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const userData = await loginUserService(username, password);

        res.status(200).json({
            message: "Login successful",
            ...userData
        });
    } catch (error) {
        console.error("Error in loginUser controller", error);
        if (error.message === 'User not found') {
            return res.status(401).json({ message: "Username or password is incorrect" });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}