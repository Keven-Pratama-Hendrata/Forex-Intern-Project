import { updateUserBalance } from '../utils/userUtils.js';

export async function getUserProfile(req, res) {
    try {
        const userId = req.user.userId;
        const user = await updateBalanceHistoryOnDateChange(userId);

        res.status(200).json({
            userId: user._id,
            userName: user.userName,
            balances: user.balances,
            dailyTotalUSDHistory: user.dailyTotalUSDHistory,
            lastFetchedDate: user.lastFetchedDate,
            todayBalanceUSD: user.todayBalanceUSD
        });
    } catch (error) {
        console.error("Error in getUserProfile controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function handleUpdateBalance(req, res) {
    try {
        const userId = req.user.userId;
        const { currency, amount } = req.body;
        const updatedUser = await updateUserBalance(userId, currency, amount);
        res.status(200).json({ message: "Balance updated", balances: updatedUser.balances });
    } catch (error) {
        console.error("Error updating balance", error);
        res.status(400).json({ message: error.message });
    }
}