import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;

import MongooseUserRepository from '../../src/repositories/MongooseUserRepository.js';
import * as UserModelModule from '../../src/models/UserModel.js';

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
        const fakeUser = { _id: '1', user_name: 'test' };
        findByIdStub.resolves(fakeUser);
        const result = await repo.ofId('1');
        expect(findByIdStub).to.have.been.calledWith('1');
        expect(result).to.equal(fakeUser);
    });

    it('should find user by user name', async () => {
        const fakeUser = { _id: '2', user_name: 'foo' };
        findOneStub.resolves(fakeUser);
        const result = await repo.ofUserName('foo');
        expect(findOneStub).to.have.been.calledWith({ user_name: 'foo' });
        expect(result).to.equal(fakeUser);
    });

    it('should update user if _id exists', async () => {
        const fakeUser = { _id: '3', user_name: 'bar' };
        findByIdAndUpdateStub.resolves(fakeUser);
        const result = await repo.save(fakeUser);
        expect(findByIdAndUpdateStub).to.have.been.calledWith('3', fakeUser, { new: true });
        expect(result).to.equal(fakeUser);
    });

    it('should create user if _id does not exist', async () => {
        const fakeUser = { user_name: 'baz' };
        const savedUser = { _id: '4', user_name: 'baz' };
        saveStub.resolves(savedUser);
        const result = await repo.save(fakeUser);
        expect(saveStub).to.have.been.calledOnce;
        expect(result).to.equal(savedUser);
    });
}); 