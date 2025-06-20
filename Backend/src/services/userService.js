import { updateUserBalance } from '../utils/userUtils.js';

export const getUserProfileService = async (userId) => {
    const user = await updateBalanceHistoryOnDateChange(userId);

    return {
        user_id: user._id,
        user_name: user.user_name,
        balances: user.balances,
        daily_total_usd_history: user.daily_total_usd_history,
        last_fetched_date: user.last_fetched_date,
        today_balance_usd: user.today_balance_usd
    };
};

export const handleUpdateBalanceService = async (userId, balance) => {
    const updatedUser = await updateUserBalance(userId, balance);
    return {
        message: "Balance updated",
        balances: updatedUser.balances
    };
};
