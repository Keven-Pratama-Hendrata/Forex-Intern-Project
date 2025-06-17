import User from "../../models/User.js";

export async function updateUserBalance(userId, currency, amount) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    if (!user.balances.hasOwnProperty(currency)) {
        throw new Error('Invalid currency');
    }

    const newBalance = parseFloat(user.balances[currency]) + parseFloat(amount);
    if (newBalance < 0) {
        throw new Error('Insufficient funds');
    }

    user.balances[currency] = newBalance;
    user.balanceHistory.push({
        currency,
        balance: newBalance,
        amount: parseFloat(amount),
        date: new Date()
    });

    return user.save();
}

export async function findUserByUsername(username) {
    const user = await User.findOne({ userName: username });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}