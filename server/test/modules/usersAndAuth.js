const {ROLE, STATUS} = require('@oneplace/constants').USER
const {BLOCKCHAIN} = require('@oneplace/constants')
module.exports = STORAGE => {
  const request = STORAGE.chai.request;
  const async = require('async');
  const BASE_URL = STORAGE.BASE_URL;
  describe('User and Auth', function() {
    describe('#POST /users', function() {
      it('Create invalid user, return error, status 422, have basic property', function(done) {
        request(BASE_URL)
          .post('/users')
          .send({email: 'test', password: 's'})
          .set('Accept', 'application/json')
          .end((err, res) => {
            res.should.have.status(422);
            res.body.error.details.codes.should.have.property('email');
            res.body.error.details.codes.email[0].should.be.eql('format');
            done();
          });
      });

      ['first', 'second', 'admin'].forEach(user => {
        it(`Create new ${user}, return object, status 200, have basic property`, function(done) {
          request(BASE_URL)
            .post('/users')
            .send(STORAGE.data.users[user])
            .set('Accept', 'application/json')
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('id');
              res.body.should.have.property('created');
              STORAGE.data.users[user] = Object.assign(STORAGE.data.users[user], res.body);
              done();
            });
        });
      });

      after(function(done) {
        const mysql = STORAGE.app.dataSources.mysql.connector;
        const users = [
          STORAGE.data.users.first.email,
          STORAGE.data.users.second.email
        ];

        async.parallel([
          cbAsync => mysql.execute('UPDATE `users` SET emailVerified = 1 WHERE email IN (?)', [users], cbAsync),
          cbAsync => mysql.execute('UPDATE `users` SET emailVerified = 1, role = ? WHERE email = ?', [ROLE.ADMIN, STORAGE.data.users.admin.email], cbAsync),
        ], err => done(err));
      });
    });

    describe('#POST /users/login', function() {
      it(`Fail login, 401`, function(done) {
        request(BASE_URL)
          .post('/users/login')
          .send({email: 'notFound', password: 'er'})
          .set('Accept', 'application/json')
          .end(function(err, res) {
            res.should.have.status(401);
            done();
          });
      });

      ['first', 'second', 'admin'].forEach(user => {
        it(`Success ${user} login, 200, check access_token`, function(done) {
          request(BASE_URL)
            .post('/users/login')
            .send(STORAGE.data.users[user])
            .set('Accept', 'application/json')
            .end(function(err, res) {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('id');
              res.body.should.have.property('userId');
              res.body.id.length.should.eql(64);
              STORAGE.tokens[user] = res.body.id;
              done();
            });
        });
      });
    });

    describe('#GET /users/current', function() {
      it('Without AccessToken, status 401', function(done) {
        request(BASE_URL)
          .get('/users/current')
          .set('Accept', 'application/json')
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });

      ['first', 'second', 'admin'].forEach(user => {
        it(`Get current ${user} data, ${user} token, status 200, id equal ${user} id`, function(done) {
          request(BASE_URL)
            .get('/users/current')
            .set('Accept', 'application/json')
            .set('authorization', STORAGE.tokens[user])
            .end(function(err, res) {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('id');
              res.body.should.have.property('tags');
              res.body.tags.should.be.a('array');
              res.body.id.should.eql(STORAGE.data.users[user].id);
              done();
            });
        });
      })
    });

    describe('#POST /users/:id/tags', function() {
      it('Without AccessToken, status 401', function(done) {
        request(BASE_URL)
          .post(`/users/${STORAGE.data.users.first.id}/tags`)
          .set('Accept', 'application/json')
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });

      it('With second AccessToken, status 401', function(done) {
        request(BASE_URL)
          .post(`/users/${STORAGE.data.users.first.id}/tags`)
          .set('Accept', 'application/json')
          .set('authorization', STORAGE.tokens.second)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });

      it('With first AccessToken, status 200', function(done) {
        request(BASE_URL)
          .post(`/users/${STORAGE.data.users.first.id}/tags`)
          .send({tags: ['test', 'money', 'life'], chain: BLOCKCHAIN.SOURCE.STEEM})
          .set('Accept', 'application/json')
          .set('authorization', STORAGE.tokens.first)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    })

    // describe('#POST /users/:id/account', function() {
    //   it('Without AccessToken, status 401', function(done) {
    //     request(BASE_URL)
    //       .post(`/users/${STORAGE.data.users.first.id}/account`)
    //       .set('Accept', 'application/json')
    //       .end((err, res) => {
    //         res.should.have.status(401);
    //         done();
    //       });
    //   });

    //   it('with token, bad params, status 400', function(done) {
    //     request(BASE_URL)
    //       .post(`/users/${STORAGE.data.users.first.id}/account`)
    //       .send({username: 't'})
    //       .set('Accept', 'application/json')
    //       .set('authorization', STORAGE.tokens.first)
    //       .end((err, res) => {
    //         res.should.have.status(400)
    //         done()
    //       })
    //   })

    //   it('with token, success, answer have basic property, status 200', function(done) {
    //     request(BASE_URL)
    //       .post(`/users/${STORAGE.data.users.first.id}/account`)
    //       .send({username: 'test', sign: 'any sign for test', chain: BLOCKCHAIN.SOURCE.STEEM})
    //       .set('Accept', 'application/json')
    //       .set('authorization', STORAGE.tokens.first)
    //       .end((err, res) => {
    //         res.should.have.status(200)
    //         res.body.should.be.a('object')
    //         res.body.should.have.property('id')
    //         res.body.should.have.property('username')
    //         res.body.should.have.property('chain')
    //         done()
    //       })
    //   })
    // })

    // describe('#DELETE /users/:id/account', function() {
    //   it('Without AccessToken, status 401', function(done) {
    //     request(BASE_URL)
    //       .delete(`/users/${STORAGE.data.users.first.id}/account`)
    //       .set('Accept', 'application/json')
    //       .end((err, res) => {
    //         res.should.have.status(401);
    //         done();
    //       });
    //   });

    //   it('with token, bad params, status 400', function(done) {
    //     request(BASE_URL)
    //       .delete(`/users/${STORAGE.data.users.first.id}/account`)
    //       .send({username: 't'})
    //       .set('Accept', 'application/json')
    //       .set('authorization', STORAGE.tokens.first)
    //       .end((err, res) => {
    //         res.should.have.status(400)
    //         done()
    //       })
    //   })

    //   it('with token, success, answer have basic property, status 204', function(done) {
    //     request(BASE_URL)
    //       .delete(`/users/${STORAGE.data.users.first.id}/account`)
    //       .send({username: 'test', sign: 'any sign for test', chain: BLOCKCHAIN.SOURCE.STEEM})
    //       .set('Accept', 'application/json')
    //       .set('authorization', STORAGE.tokens.first)
    //       .end((err, res) => {
    //         res.should.have.status(204)
    //         done()
    //       })
    //   })
    // })

    // describe('#PUT|PATCH /users/:id', function() {
    //   it('Without AccessToken, status 401', function(done) {
    //     request(BASE_URL)
    //       .patch(`/my/v2/users/${STORAGE.data.users.first.id}`)
    //       .send({})
    //       .set('Accept', 'application/json')
    //       .end((err, res) => {
    //         res.should.have.status(401);
    //         done();
    //       });
    //   });

    //   it('With second token, status 401', function(done) {
    //     request(BASE_URL)
    //       .patch(`/my/v2/users/${STORAGE.data.users.first.id}`)
    //       .send({})
    //       .set('authorization', STORAGE.tokens.second)
    //       .set('Accept', 'application/json')
    //       .end((err, res) => {
    //         res.should.have.status(401);
    //         done();
    //       });
    //   });

    //   ['first', 'admin'].forEach(user => {
    //     it(`Update attributes by ${user}, check public and protected property, status 200`, function(done) {
    //       let protectedProps = {}, publicProperties = {};
    //       if (user === 'first') {
    //         protectedProps = {
    //           email: `new${STORAGE.data.users.first.email}`,
    //           role: ROLE.ADMIN,
    //           status: STATUS.BANNED
    //         };

    //         publicProperties = {
    //           phone: 'Test company',
    //           name: 'Test FIO',
    //           subscribed: true
    //         };
    //       } else {
    //         publicProperties = {
    //           role: ROLE.ADMIN,
    //           status: STATUS.BANNED
    //         };

    //         protectedProps = {};
    //       }

    //       let properties = Object.assign({}, publicProperties, protectedProps);
    //       request(BASE_URL)
    //         .patch(`/my/v2/users/${STORAGE.data.users.first.id}`)
    //         .send(properties)
    //         .set('Accept', 'application/json')
    //         .set('authorization', STORAGE.tokens[user])
    //         .end((err, res) => {
    //           res.should.have.status(200);
    //           res.body.should.be.a('object');
    //           try {
    //             Object.keys(properties).forEach(property => {
    //               res.body.should.have.property(property);
    //             });

    //             Object.keys(protectedProps).forEach(property => {
    //               res.body[property].should.be.eql(STORAGE.data.users.first[property]);
    //             });

    //             Object.keys(publicProperties).forEach(property => {
    //               res.body[property].should.be.eql(publicProperties[property]);
    //             });
    //           } catch (e) {
    //             throw e;
    //           }
    //           done();
    //         });
    //     });
    //   });

    //   after(function(done) {
    //     request(BASE_URL)
    //       .patch(`/my/v2/users/${STORAGE.data.users.first.id}`)
    //       .send({
    //         role: ROLE.USER,
    //         status: STATUS.ACTIVE
    //       })
    //       .set('Accept', 'application/json')
    //       .set('authorization', STORAGE.tokens.admin)
    //       .end(err => done(err));
    //   });
    // });

    // describe('#GET /users', function() {
    //   ['first', 'second'].forEach(user => {
    //     it(`With ${user} AccessToken, status 401`, function(done) {
    //       request(BASE_URL)
    //         .get(`/my/v2/users`)
    //         .set('authorization', STORAGE.tokens[user])
    //         .set('Accept', 'application/json')
    //         .end((err, res) => {
    //           res.should.have.status(401);
    //           done();
    //         });
    //     });
    //   });


    //   it('Without AccessToken, status 401', function(done) {
    //     request(BASE_URL)
    //       .get('/my/v2/users')
    //       .set('Accept', 'application/json')
    //       .end((err, res) => {
    //         res.should.have.status(401);
    //         done();
    //       });
    //   });

    //   it('Get user list, admin, status 200, return collection, collection.length eql 3', function(done) {
    //     request(BASE_URL)
    //       .get(`/my/v2/users`)
    //       .set('authorization', STORAGE.tokens.admin)
    //       .set('Accept', 'application/json')
    //       .end((err, res) => {
    //         res.should.have.status(200);
    //         res.body.should.be.a('array');
    //         res.body.length.should.be.eql(3);
    //         done();
    //       });
    //   });
    // })
  });
};
