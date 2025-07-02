import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(chaiAsPromised);
chai.use(chaiHttp);
chai.use(sinonChai);

global.chai = chai;
global.expect = chai.expect;
global.sinon = sinon;