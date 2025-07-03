import chai from 'chai';
const expect = chai.expect;

import UserRepository from '../../src/repositories/UserRepository.js';

describe('UserRepository (abstract)', () => {
    let repo;
    beforeEach(() => {
        repo = new UserRepository();
    });

    it('should throw error for ofId()', async () => {
        await expect(repo.ofId('id')).to.be.rejectedWith('Method ofId() must be implemented');
    });

    it('should throw error for ofUserName()', async () => {
        await expect(repo.ofUserName('user')).to.be.rejectedWith('Method ofUserName() must be implemented');
    });

    it('should throw error for save()', async () => {
        await expect(repo.save({})).to.be.rejectedWith('Method save() must be implemented');
    });
}); 