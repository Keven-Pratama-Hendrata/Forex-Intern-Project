import User from "../../models/User.js";

export async function updateUserBalance(userId, balance) {
    const { currency, amount } = balance;
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const idx = user.balances.findIndex(b => b.currency === currency);
    if (idx === -1) {
        if (parseFloat(amount) < 0) {
            throw new Error('Insufficient funds');
        }
        user.balances.push({ currency, amount });
        user.balance_history.push({
            currency,
            balance: amount,
            amount: amount,
            date: new Date()
        });
    } else {
        const newBalance = parseFloat(user.balances[idx].amount) + parseFloat(amount);
        if (newBalance < 0) {
            throw new Error('Insufficient funds');
        }
        user.balances[idx].amount = newBalance;
        user.balance_history.push({
            currency,
            balance: newBalance,
            amount: parseFloat(amount),
            date: new Date()
        });
    }
    return user.save();
}

export async function findUserByUsername(username) {
    const user = await User.findOne({ user_name: username });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}