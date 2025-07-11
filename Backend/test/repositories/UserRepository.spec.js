import chai from 'chai';
const expect = chai.expect;

import UserRepository from '../../src/repositories/UserRepository.js';

describe('UserRepository (abstract)', () => {
    let repo;
    beforeEach(() => {
        repo = new UserRepository();
    });

    it('should throw error for findOneById()', async () => {
        await expect(repo.findOneById('id')).to.be.rejectedWith('Method findOneById() must be implemented');
    });

    it('should throw error for findOneByUsername()', async () => {
        await expect(repo.findOneByUsername('user')).to.be.rejectedWith('Method findOneByUsername() must be implemented');
    });

    it('should throw error for save()', async () => {
        await expect(repo.save({})).to.be.rejectedWith('Method save() must be implemented');
    });
}); 