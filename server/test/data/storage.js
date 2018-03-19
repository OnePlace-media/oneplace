let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

module.exports = {
  chai: chai,
  app: null,
  BASE_URL: 'http://127.0.0.1:3001/api',
  tokens: {
    user: null,
    admin: null
  },
  data: {
    drafts:[],
    users: {
      first: {
        email: `user@domain.com`,
        password: 'user'
      },
      second: {
        email: `user-second@domain.com`,
        password: 'user-second',
      },
      admin: {
        email: `admin@domain.com`,
        password: 'admin'
      }
    }
  }
}