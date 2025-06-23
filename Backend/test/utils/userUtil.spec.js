const UserModel = require('../../models/User');
const userUtil = require('../../src/utils/userUtils');

describe('#UserUtil', async () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  describe('#updateUserBalance', async () => {
    it('should throw error when user is not found', async () => {
      sandbox.stub(UserModel, 'findById').resolves(undefined);
      const userId = '1234567890';
      const balance = 10_000_000;

      await expect(userUtil.updateUserBalance(userId, balance)).to.be.rejectedWith(Error);
    });

    it('should throw error when balance is less than 0', async () => {
      sandbox.stub(UserModel, 'findById').resolves({});
      const userId = '1234567890';
      const balance = -20;

      await expect(userUtil.updateUserBalance(userId, balance)).to.be.rejectedWith(Error);
    });
  });

  describe('#findUserByUsername', async () => {
    it('should call user model with given param', async () => {
      sandbox.stub(UserModel, 'findOne').resolves({});
      const username = 'username';
      const expectedParam = { user_name: username };

      await userUtil.findUserByUsername(username);

      expect(UserModel.findOne).to.be.calledWith(expectedParam);
    });

    it('should throw error when user is not found', async () => {
      sandbox.stub(UserModel, 'findOne').resolves(undefined);
      const username = 'username';

      await expect(userUtil.findUserByUsername(username)).to.be.rejectedWith(Error);
    });
  });
});
