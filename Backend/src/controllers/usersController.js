import { getUserProfileService, handleUpdateBalanceService } from '../services/userService.js';

export async function getUserProfile(req, res) {
    try {
        const userId = req.user.user_id;
        const userData = await getUserProfileService(userId);

        res.status(200).json(userData);
    } catch (error) {
        console.error("Error in getUserProfile controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function handleUpdateBalance(req, res) {
    try {
        const userId = req.user.user_id;
        const { balance } = req.body;
        const response = await handleUpdateBalanceService(userId, balance);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error updating balance", error);
        res.status(400).json({ message: error.message });
    }
}