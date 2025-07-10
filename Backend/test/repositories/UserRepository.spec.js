import chai from 'chai';
const expect = chai.expect;

import UserRepository from '../../src/repositories/UserRepository.js';

describe('UserRepository (abstract)', () => {
    let repo;

    beforeEach(() => {
        repo = new UserRepository();
    });

    it('should throw error for findOneById()', async () => {
        const id = 'id';

        await expect(repo.findOneById(id)).to.be.rejectedWith('Method findOneById() must be implemented');
    });

    it('should throw error for findOneByUsername()', async () => {
        const username = 'user';

        await expect(repo.findOneByUsername(username)).to.be.rejectedWith('Method findOneByUsername() must be implemented');
    });

    it('should throw error for save()', async () => {
        const userData = {};

        await expect(repo.save(userData)).to.be.rejectedWith('Method save() must be implemented');
    });

    it('should throw error for create()', async () => {
        const userData = { username: 'test', password: 'pass' };

        await expect(repo.create(userData)).to.be.rejectedWith('Method create() must be implemented');
    });
}); 