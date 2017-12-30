module.exports = STORAGE => {
  const blockChains = require('@oneplace/blockchains-api')
  const CONSTANTS = require('@oneplace/constants')

  describe('BlockChains API', function() {
    describe('getAccount', function() {
      it('GOLOS: get oneplace, return account, id eql 38892', function(done) {
        blockChains
          .getAccount(CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS, 'oneplace')
          .then(account => {
            account.should.be.a('object')
            account.should.have.property('id')
            account.id.should.be.eql(38892)
            done()
          })
      })

      it('STEEM: get oneplace, return account, id eql 146920', function(done) {
        blockChains
          .getAccount(CONSTANTS.BLOCKCHAIN.SOURCE.STEEM, 'oneplace')
          .then(account => {
            account.should.be.a('object')
            account.should.have.property('id')
            account.id.should.be.eql(146920)
            done()
          })
      })
    })

    describe('getDiscussionsByTrending', function() {
      it('GOLOS: get by "life" tag, return posts', function(done) {
        blockChains
          .getDiscussionsByTrending(CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS, {select_tags:['life'], limit: 10})
          .then(posts => {
            // console.log(posts)
            done()
          })
      })
    })
  })
}