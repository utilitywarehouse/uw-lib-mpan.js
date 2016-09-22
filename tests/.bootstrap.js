process.env.NODE_ENV = 'test';

var chai = require('chai');
chai.use(require('chai-things'));
global.should = chai.should();
