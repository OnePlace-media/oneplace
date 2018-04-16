const {BLOCKCHAIN} = require('@oneplace/constants')

class PostingWrapper {
  constructor({steemDomain, golosDomain, WIF, username}) {
    const clients = {
      [BLOCKCHAIN.SOURCE.STEEM]: require('steem')
    }
    Object.keys(require.cache).forEach(key => {
      if (~key.indexOf('node_modules/steem')) {
        delete require.cache[key]
      }
    })
    clients[BLOCKCHAIN.SOURCE.GOLOS] = require('steem')

    clients[BLOCKCHAIN.SOURCE.STEEM].api.setOptions({url: `http://${steemDomain}`})
    clients[BLOCKCHAIN.SOURCE.GOLOS].api.setOptions({url: `http://${golosDomain}`})
    clients[BLOCKCHAIN.SOURCE.GOLOS].config.set('address_prefix', 'GLS');
    clients[BLOCKCHAIN.SOURCE.GOLOS].config.set('chain_id', '782a3039b478c839e4cb0c941ff4eaeb7df40bdd68bd441afd444b9da763de12')

    this.clients = clients
    this.WIF = WIF
    this.CLIENT_ID = username
  }
  comment(chain, {parentAuthor, parentPermlink, author, permlink, body, title, tags = [], rewardsOpts = '50', isUpdate = false}) {
    rewardsOpts = +rewardsOpts
    const percent_steem_dollars = rewardsOpts === 100 ? 0 : 10000
    const max_accepted_payout = `${rewardsOpts ? '1000000.000' : '0.000'} ${chain === BLOCKCHAIN.SOURCE.STEEM ? 'SBD' : 'GBG'}`

    return new Promise((resolve, reject) => {
      const jsonMetadata = {}
      if (tags.length) {
        jsonMetadata.tags = tags
      }
      jsonMetadata.app = 'oneplace'

      const isPost = !parentAuthor && !parentPermlink
      if (!parentPermlink) parentPermlink = tags.length ? tags[0] : 'general'

      if (!permlink && !isPost) {
        permlink = this.clients[chain].formatter.commentPermlink(parentAuthor, parentPermlink)
        if (permlink.length > 255)
          permlink.substr(permlink.length - 255, permlink.length)

        permlink = permlink.toLowerCase().replace(/[^a-z0-9-]+/g, "")
      }

      const operations = [
        ['comment', {
          parent_author: parentAuthor || '',
          parent_permlink: parentPermlink || '',
          author: author,
          permlink: permlink || '',
          title: title || '',
          body: body,
          json_metadata: JSON.stringify(jsonMetadata)
        }]
      ]
      rewardsOpts = +rewardsOpts
      if (!isUpdate) {
        const options = {
          author,
          permlink,
          max_accepted_payout,
          percent_steem_dollars,
          allow_votes: true,
          allow_curation_rewards: true,
          extensions: [
            [0, {
              beneficiaries: [
                {account: this.CLIENT_ID, weight: isPost ? 500 : 1000}
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