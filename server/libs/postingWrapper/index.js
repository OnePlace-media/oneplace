const CONSTANTS = require('@oneplace/constants')

class PostingWrapper {
  constructor({steemDomain, golosDomain, WIF, username}) {
    const clients = {
      [CONSTANTS.BLOCKCHAIN.SOURCE.STEEM]: require('steem')
    }
    Object.keys(require.cache).forEach(key => {
      if (~key.indexOf('node_modules/steem')) {
        delete require.cache[key]
      }
    })
    clients[CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS] = require('steem')

    clients[CONSTANTS.BLOCKCHAIN.SOURCE.STEEM].api.setOptions({url: `http://${steemDomain}`})
    clients[CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS].api.setOptions({url: `http://${golosDomain}`})
    clients[CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS].config.set('address_prefix', 'GLS');
    clients[CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS].config.set('chain_id', '782a3039b478c839e4cb0c941ff4eaeb7df40bdd68bd441afd444b9da763de12')

    this.clients = clients
    this.WIF = WIF
    this.CLIENT_ID = username
  }
  comment(chain, {parentAuthor, parentPermlink, author, permlink, body}) {
    return new Promise((resolve, reject) => {
      const title = ''
      const jsonMetadata = '{}'
      const isUpdate = !!permlink
      if (!permlink) {
        permlink = this.clients[chain].formatter.commentPermlink(parentAuthor, parentPermlink)
        if (permlink.length > 255)
          permlink.substr(permlink.length - 255, permlink.length)

        permlink = permlink.toLowerCase().replace(/[^a-z0-9-]+/g, "")
      }

      const operations = [
        ['comment', {
          parent_author: parentAuthor,
          parent_permlink: parentPermlink,
          author: author,
          permlink: permlink,
          title: title,
          body: body,
          json_metadata: jsonMetadata
        }]
      ]
      if (chain === CONSTANTS.BLOCKCHAIN.SOURCE.STEEM && !isUpdate) {
        const options = {
          author,
          permlink,
          max_accepted_payout: '1000000.000 SBD',
          percent_steem_dollars: 10000,
          allow_votes: true,
          allow_curation_rewards: true,
          extensions: [
            [0, {
              beneficiaries: [
                {account: this.CLIENT_ID, weight: 1000}
              ]
            }]
          ]
        }
        operations.push(['comment_options', options])
      }

      this.clients[chain].broadcast.send(
        {operations, extensions: []},
        {posting: this.WIF},
        (err, res) => {
          if (err) reject(err)
          else
            resolve({
              body,
              author,
              permlink,
              children: [],
              votes: 0,
              active_votes: [],
              payout: '0.00',
              created: new Date().toISOString().split('.')[0] + "+00:00"
            })
        })
    })
  }

  vote(chain, {voter, author, permlink, weight}) {
    return new Promise((resolve, reject) => {
      this.clients[chain].broadcast.vote(this.WIF, voter, author, permlink, weight, (err, result) => {
        if (err) reject(err)
        else resolve({
          voter,
          weight: weight,
          time: new Date().toISOString().split('.')[0] + "+00:00"
        })
      })
    })
  }

  follow(chain, {follower, following, unfollow}) {
    return new Promise((resolve, reject) => {
      const json = JSON.stringify(
        ['follow', {
          follower: follower,
          following: following,
          what: unfollow ? [] : ['blog']
        }]
      )

      this.clients[chain].broadcast.customJson(this.WIF, [], [follower], 'follow', json, (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })
  }

  delete_comment(chain, {author, permlink}) {
    return new Promise((resolve, reject) => {
      const json = JSON.stringify(
        ['delete_comment', {
          author,
          permlink
        }]
      )

      this.clients[chain].broadcast.deleteComment(this.WIF, author, permlink, (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })
  }
}
module.exports = PostingWrapper