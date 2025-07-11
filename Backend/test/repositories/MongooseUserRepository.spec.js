import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;

import MongooseUserRepository from '../../src/repositories/MongooseUserRepository.js';
import * as UserModelModule from '../../src/models/UserModel.js';
import { getMockUserWithId } from '../mock/index.js';

describe('MongooseUserRepository', () => {
    let repo;
    let findByIdStub, findOneStub, findByIdAndUpdateStub, saveStub;

    beforeEach(() => {
        repo = new MongooseUserRepository();
        findByIdStub = sinon.stub(UserModelModule.default, 'findById');
        findOneStub = sinon.stub(UserModelModule.default, 'findOne');
        findByIdAndUpdateStub = sinon.stub(UserModelModule.default, 'findByIdAndUpdate');
        saveStub = sinon.stub(UserModelModule.default.prototype, 'save');
    });

    afterEach(() => sinon.restore());

    it('should find user by id', async () => {
        const fakeUser = getMockUserWithId('1');
        const userId = '1';
        findByIdStub.resolves(fakeUser);

        const result = await repo.findOneById(userId);

        expect(findByIdStub).to.have.been.calledWith('1');
        expect(result).to.equal(fakeUser);
    });

    it('should find user by user name', async () => {
        const fakeUser = getMockUserWithId('2');
        fakeUser.username = 'foo';
        const username = 'foo';
        findOneStub.resolves(fakeUser);

        const result = await repo.findOneByUsername(username);

        expect(findOneStub).to.have.been.calledWith({ username: 'foo' });
        expect(result).to.equal(fakeUser);
    });

    it('should update user if id exists', async () => {
        const fakeUser = getMockUserWithId('3');
        fakeUser.username = 'bar';
        findByIdAndUpdateStub.resolves(fakeUser);

        const result = await repo.save(fakeUser);

        expect(findByIdAndUpdateStub).to.have.been.calledWith('3', fakeUser, { new: true });
        expect(result).to.equal(fakeUser);
    });

    it('should create user if id does not exist', async () => {
        const fakeUser = { username: 'baz' };
        const savedUser = getMockUserWithId('4');
        savedUser.username = 'baz';
        saveStub.resolves(savedUser);

        const result = await repo.save(fakeUser);

        expect(saveStub).to.have.been.calledOnce;
        expect(result).to.equal(savedUser);
    });

    it('should create and save a new user', async () => {
        const userData = { username: 'newuser', password: 'password123' };
        const createdUser = getMockUserWithId('5');
        createdUser.username = 'newuser';
        createdUser.password = 'password123';
        saveStub.resolves(createdUser);

        const result = await repo.create(userData);

        expect(saveStub).to.have.been.calledOnce;
        expect(result).to.equal(createdUser);
    });
}); 