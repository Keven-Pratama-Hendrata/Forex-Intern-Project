import chai from 'chai';
const expect = chai.expect;

import User from '../../src/models/UserModel.js';

describe('UserModel', () => {
    it('should have required fields', () => {
        const schemaPaths = User.schema.paths;
        expect(schemaPaths).to.have.property('user_name');
        expect(schemaPaths.user_name.options.required).to.be.true;
        expect(schemaPaths).to.have.property('password');
        expect(schemaPaths.password.options.required).to.be.true;
        expect(schemaPaths).to.have.property('balances');
        expect(schemaPaths).to.have.property('balance_history');
        expect(schemaPaths).to.have.property('last_fetched_date');
        expect(schemaPaths).to.have.property('today_balance_usd');
        expect(schemaPaths).to.have.property('daily_total_usd_history');
    });

    it('should enforce unique user_name', () => {
        expect(User.schema.paths.user_name.options.unique).to.be.true;
    });

    it('should use getter for today_balance_usd', () => {
        const path = User.schema.paths.today_balance_usd;
        expect(path.options.get).to.be.a('function');
        expect(path.options.get(123.45)).to.equal(123.45);
    });

    it('should use getter for balances.amount', () => {
        const balancesSchema = User.schema.paths.balances.schema;
        const amountPath = balancesSchema.paths.amount;
        expect(amountPath.options.get).to.be.a('function');
        expect(amountPath.options.get('123.45')).to.equal(123.45);
    });

    it('should use getter for balance_history.balance', () => {
        const balanceHistorySchema = User.schema.paths.balance_history.schema;
        const balancePath = balanceHistorySchema.paths.balance;
        expect(balancePath.options.get).to.be.a('function');
        expect(balancePath.options.get('456.78')).to.equal(456.78);
    });

    it('should use getter for daily_total_usd_history.total_usd', () => {
        const dailyTotalUsdHistorySchema = User.schema.paths.daily_total_usd_history.schema;
        const totalUsdPath = dailyTotalUsdHistorySchema.paths.total_usd;
        expect(totalUsdPath.options.get).to.be.a('function');
        expect(totalUsdPath.options.get('789.01')).to.equal(789.01);
    });

    it('should apply getters when converting to JSON', () => {
        const user = new User({
            user_name: 'testuser',
            password: 'pass',
            balances: [{ amount: '123.45', currency: 'USD' }],
            balance_history: [{ balance: '456.78', currency: 'USD', amount: '10.00', date: new Date() }],
            today_balance_usd: '789.01',
            daily_total_usd_history: [{
                total_usd: '234.56',
                date: new Date(),
                rates: { USD: '1.0' }
            }]
        });
        const json = user.toJSON();
        expect(json.today_balance_usd).to.equal(789.01);
        expect(json.balances[0].amount).to.equal(123.45);
        expect(json.balance_history[0].balance).to.equal(456.78);
        expect(json.daily_total_usd_history[0].total_usd).to.equal(234.56);
    });
}); 