import chai from 'chai';
const expect = chai.expect;

import User from '../../src/models/UserModel.js';

describe('UserModel', () => {
    it('should have required fields', () => {
        const schemaPaths = User.schema.paths;

        expect(schemaPaths).to.have.property('username');
        expect(schemaPaths.username.options.required).to.be.true;
        expect(schemaPaths).to.have.property('password');
        expect(schemaPaths.password.options.required).to.be.true;
        expect(schemaPaths).to.have.property('balances');
        expect(schemaPaths).to.have.property('balanceHistory');
        expect(schemaPaths).to.have.property('lastFetchedDate');
    });

    it('should enforce unique username', () => {
        expect(User.schema.paths.username.options.unique).to.be.true;
    });


    it('should use getter for balances.amount', () => {
        const balancesSchema = User.schema.paths.balances.schema;
        const amountPath = balancesSchema.paths.amount;

        expect(amountPath.options.get).to.be.a('function');
        expect(amountPath.options.get('123.45')).to.equal(123.45);
    });

    it('should use getter for balanceHistory.balance', () => {
        const balanceHistorySchema = User.schema.paths.balanceHistory.schema;
        const balancePath = balanceHistorySchema.paths.balance;

        expect(balancePath.options.get).to.be.a('function');
        expect(balancePath.options.get('456.78')).to.equal(456.78);
    });


    it('should apply getters when converting to JSON', () => {
        const user = new User({
            username: 'testuser',
            password: 'pass',
            balances: [{ amount: '123.45', currency: 'USD' }],
            balanceHistory: [{ balance: '456.78', currency: 'USD', amount: '10.00', date: new Date() }],
        });

        const json = user.toJSON();

        expect(json.balances[0].amount).to.equal(123.45);
        expect(json.balanceHistory[0].balance).to.equal(456.78);
    });
}); 