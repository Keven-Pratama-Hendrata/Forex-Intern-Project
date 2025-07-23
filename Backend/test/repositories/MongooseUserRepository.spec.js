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
        const fakeUser = { id: '1', username: 'test' };
        findByIdStub.resolves(fakeUser);
        const result = await repo.findOneById('1');
        expect(findByIdStub).to.have.been.calledWith('1');
        expect(result).to.equal(fakeUser);
    });

    it('should find user by user name', async () => {
        const fakeUser = { id: '2', username: 'foo' };
        findOneStub.resolves(fakeUser);
        const result = await repo.findOneByUsername('foo');
        expect(findOneStub).to.have.been.calledWith({ username: 'foo' });
        expect(result).to.equal(fakeUser);
    });

    it('should update user if id exists', async () => {
        const fakeUser = { id: '3', username: 'bar' };
        findByIdAndUpdateStub.resolves(fakeUser);
        const result = await repo.save(fakeUser);
        expect(findByIdAndUpdateStub).to.have.been.calledWith('3', { $set: fakeUser }, { new: true });
        expect(result).to.equal(fakeUser);
    });

    it('should create user if id does not exist', async () => {
        const fakeUser = { username: 'baz' };
        const savedUser = { id: '4', username: 'baz' };
        saveStub.resolves(savedUser);
        const result = await repo.save(fakeUser);
        expect(saveStub).to.have.been.calledOnce;
        expect(result).to.equal(savedUser);
    });
}); 