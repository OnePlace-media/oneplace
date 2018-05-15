const {ROLE, STATUS} = require('@oneplace/constants').USER
const {BLOCKCHAIN} = require('@oneplace/constants')
module.exports = STORAGE => {
  const request = STORAGE.chai.request;
  const async = require('async');
  const BASE_URL = STORAGE.BASE_URL;
  describe('Drafts', function() {
    describe('#POST /users/{id}/drafts', function() {
      it('Create invalid draft, return error, status 422, have basic property', function(done) {
        request(BASE_URL)
          .post(`/users/${STORAGE.data.users.first.id}/drafts`)
          .send({title: '', body: ''})
          .set('Accept', 'application/json')
          .set('authorization', STORAGE.tokens.first)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.error.details.codes.should.have.property('body')
            done()
          })
      })

      it('Create draft, return draft object, status 201, have basic property', function(done) {
        const data = {title: 'Test draft', body: 'some body'}
        request(BASE_URL)
          .post(`/users/${STORAGE.data.users.first.id}/drafts`)
          .send(data)
          .set('Accept', 'application/json')
          .set('authorization', STORAGE.tokens.first)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('title');
            res.body.title.should.be.eql(data.title);
            res.body.should.have.property('body');
            res.body.body.should.be.eql(data.body);
            done();
          });
      });
    });

    describe('#GET /users/{id}/drafts', function() {
      it('GET drafts without access, return error, status 401', function(done) {
        request(BASE_URL)
          .get(`/users/${STORAGE.data.users.first.id}/drafts`)
          .set('Accept', 'application/json')
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });

      it('GET drafts with access, return array, status 200', function(done) {
        request(BASE_URL)
          .get(`/users/${STORAGE.data.users.first.id}/drafts`)
          .set('authorization', STORAGE.tokens.first)
          .set('Accept', 'application/json')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.length.should.be.eql(1);
            STORAGE.drafts = res.body
            done();
          });
      });
    });

    describe('#PUT /users/{id}/drafts/{draftId}', function() {

      it('Update draft without access, return error, status 401', function(done) {
        const draftId = STORAGE.drafts[0].id
        request(BASE_URL)
          .put(`/users/${STORAGE.data.users.first.id}/drafts/${draftId}`)
          .set('Accept', 'application/json')
          .send({title: 'test'})
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });

      it('Update draft with access, return error, status 422', function(done) {
        const draftId = STORAGE.drafts[0].id
        request(BASE_URL)
          .put(`/users/${STORAGE.data.users.first.id}/drafts/${draftId}`)
          .set('Accept', 'application/json')
          .set('authorization', STORAGE.tokens.first)
          .send({body: ''})
          .end((err, res) => {
            res.should.have.status(422);
            done();
          });
      });

      it('Update draft with access, return draft, status 200', function(done) {
        const draftId = STORAGE.drafts[0].id
        const data = {
          title: 'niew title',
          body: 'new Body'
        }
        request(BASE_URL)
          .put(`/users/${STORAGE.data.users.first.id}/drafts/${draftId}`)
          .set('Accept', 'application/json')
          .set('authorization', STORAGE.tokens.first)
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('title');
            res.body.title.should.be.eql(data.title);
            res.body.should.have.property('body');
            res.body.body.should.be.eql(data.body);
            done();
          });
      });
    });
  });
}