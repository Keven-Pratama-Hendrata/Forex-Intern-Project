import chai from 'chai';
const expect = chai.expect;

import User from '../../src/models/UserModel.js';
import { mockUsers } from '../mock/index.js';

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
        expect(schemaPaths).to.have.property('todayBalanceUsd');
        expect(schemaPaths).to.have.property('dailyTotalUsdHistory');
    });

    it('should enforce unique username', () => {
        expect(User.schema.paths.username.options.unique).to.be.true;
    });

    it('should use getter for todayBalanceUsd', () => {
        const path = User.schema.paths.todayBalanceUsd;
        const testValue = 123.45;

        const result = path.options.get(testValue);

        expect(path.options.get).to.be.a('function');
        expect(result).to.equal(123.45);
    });

    it('should use getter for balances.amount', () => {
        const balancesSchema = User.schema.paths.balances.schema;
        const amountPath = balancesSchema.paths.amount;
        const testValue = '123.45';

        const result = amountPath.options.get(testValue);

        expect(amountPath.options.get).to.be.a('function');
        expect(result).to.equal(123.45);
    });

    it('should use getter for balanceHistory.balance', () => {
        const balanceHistorySchema = User.schema.paths.balanceHistory.schema;
        const balancePath = balanceHistorySchema.paths.balance;
        const testValue = '456.78';

        const result = balancePath.options.get(testValue);

        expect(balancePath.options.get).to.be.a('function');
        expect(result).to.equal(456.78);
    });

    it('should use getter for dailyTotalUsdHistory.totalUsd', () => {
        const dailyTotalUsdHistorySchema = User.schema.paths.dailyTotalUsdHistory.schema;
        const totalUsdPath = dailyTotalUsdHistorySchema.paths.totalUsd;
        const testValue = '789.01';

        const result = totalUsdPath.options.get(testValue);

        expect(totalUsdPath.options.get).to.be.a('function');
        expect(result).to.equal(789.01);
    });

    it('should apply getters when converting to JSON', () => {
        const user = new User(mockUsers[0]);

        const json = user.toJSON();

        expect(json.todayBalanceUsd).to.equal(1500.75);
        expect(json.balances[0].amount).to.equal(1000.50);
        expect(json.balanceHistory[0].balance).to.equal(1000.50);
        expect(json.dailyTotalUsdHistory[0].totalUsd).to.equal(1500.75);
    });

    it('should apply getters when converting second mock user to JSON', () => {
        const user = new User(mockUsers[1]);

        const json = user.toJSON();

        expect(json.todayBalanceUsd).to.equal(3250.80);
        expect(json.balances[0].amount).to.equal(2500.00);
        expect(json.balances[1].amount).to.equal(750.80);
        expect(json.balanceHistory[0].balance).to.equal(2500.00);
        expect(json.dailyTotalUsdHistory[0].totalUsd).to.equal(3250.80);
    });
}); 