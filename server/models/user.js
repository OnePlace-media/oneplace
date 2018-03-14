const uuid = require('uuid/v1');
const {ROLE, STATUS} = require('@oneplace/constants').USER
const {BLOCKCHAIN} = require('@oneplace/constants')


const validator = require('validator');

module.exports = Model => {
  /** VALIDATION SECTION */

  delete Model.validations.email;
  Model.validatesUniquenessOf('email', {message: 'email is not unique'});
  Model.validatesPresenceOf('email');
  Model.validate('email', function(invalid) {
    if (!validator.isEmail(this.email)) {
      invalid();
    }
  }, {code: 'format', message: 'Must provide a valid email'});

  /** VALIDATION SECTION END */


  let AccessToken, async, Tag;
  Model.appInit = () => {
    async = Model.app.libs.async;
    AccessToken = Model.app.models.AccessToken;
  };

  Model.beforeRemote('create', (ctx, unused, next) => {
    ctx.req.body.role = ROLE.USER;
    ctx.req.body.status = STATUS.ACTIVE;
    ctx.req.body.emailVerified = false;
    ctx.req.body.verificationToken = uuid();
    next();
  });

  Model.afterRemote('create', (ctx, userInstance, next) => {
    if (process.env.NODE_ENV !== 'test') {
      userInstance.sendEmailConfirmation(ctx.req.query.redirect, next);
    } else {
      next();
    }
  });

  Model.current = async (req, cb) => {
    if (process.env.NODE_ENV === 'production') {
      let user = await Model.findById(req.accessToken.userId, {include: ['accounts']})
      for (let account of user.accounts()) {
        account.avatar = await blockChains.getAvatar(account.chain, account.username)
        account.data = await blockChains.getAccount(account.chain, account.username)
      }
      const tags = await getTagWithOrder(user.id)
      user = JSON.parse(JSON.stringify(user))
      user.tags = tags
      return user
    } else {
      return {"id": "d887e0a0-2366-11e8-8be8-c7ecaeda43f5", "email": "rusov.d.s@gmail.com", "role": 1, "status": 1, "emailVerified": true, "online": null, "ip": null, "lang": "en", "created": 1520578526, "updated": 1520820561, "accounts": [{"id": 1, "username": "rusovds", "chain": "g", "avatar": "https://steemitimages.com/100x100/https://pp.userapi.com/c639320/v639320337/4d7a8/yIGYsRgNg80.jpg", "data": {"id": 90379, "name": "rusovds", "owner": {"weight_threshold": 1, "account_auths": [], "key_auths": [["GLS7oku1nUusspKuzkTGxYNzev2crZbzQu75BxkqLgHnUzAW1PsxN", 1]]}, "active": {"weight_threshold": 1, "account_auths": [], "key_auths": [["GLS5Kn2iM1QxErE7pVox2KbLCnNhsXH5YxEQH7MLYQkwTQxoD1815", 1]]}, "posting": {"weight_threshold": 1, "account_auths": [["oneplace", 1], ["oneplace.app", 1]], "key_auths": [["GLS5xccEAnr7jfcVRBXVu3rpxzZhYbZrZr98hf5Jfcdg2h5G6k3DA", 1]]}, "memo_key": "GLS5uyEx2vVWj2N92dTnALdbfxWpYv989j7zkqAFp9Z5aAwvt5cy6", "json_metadata": "{\"profile\":{\"profile_image\":\"https://pp.userapi.com/c639320/v639320337/4d7a8/yIGYsRgNg80.jpg\"}}", "proxy": "", "last_owner_update": "2017-12-11T06:40:06", "last_account_update": "2018-03-07T01:30:06", "created": "2017-12-10T14:23:42", "mined": false, "owner_challenged": false, "active_challenged": false, "last_owner_proved": "1970-01-01T00:00:00", "last_active_proved": "1970-01-01T00:00:00", "recovery_account": "golosio", "last_account_recovery": "1970-01-01T00:00:00", "reset_account": "null", "comment_count": 0, "lifetime_vote_count": 0, "post_count": 43, "can_vote": true, "voting_power": 9950, "last_vote_time": "2018-03-09T14:53:33", "balance": "0.000 GOLOS", "savings_balance": "0.000 GOLOS", "sbd_balance": "0.003 GBG", "sbd_seconds": "263711112", "sbd_seconds_last_update": "2018-02-25T10:53:06", "sbd_last_interest_payment": "2018-02-16T08:26:15", "savings_sbd_balance": "0.000 GBG", "savings_sbd_seconds": "0", "savings_sbd_seconds_last_update": "1970-01-01T00:00:00", "savings_sbd_last_interest_payment": "1970-01-01T00:00:00", "savings_withdraw_requests": 0, "vesting_shares": "33695.433055 GESTS", "vesting_withdraw_rate": "0.000000 GESTS", "next_vesting_withdrawal": "1969-12-31T23:59:59", "withdrawn": 0, "to_withdraw": 0, "withdraw_routes": 0, "curation_rewards": 0, "posting_rewards": 2760, "proxied_vsf_votes": [0, 0, 0, 0, 0, 0, 0, 0], "witnesses_voted_for": 0, "average_bandwidth": 176086036, "lifetime_bandwidth": "81524000000", "last_bandwidth_update": "2018-03-09T14:53:33", "average_market_bandwidth": 127998532, "last_market_bandwidth_update": "2018-02-21T00:11:30", "last_post": "2018-03-07T02:06:51", "last_root_post": "2018-02-16T02:36:54", "post_bandwidth": 11722, "new_average_bandwidth": "7672068101", "new_average_market_bandwidth": 3890098718, "vesting_balance": "0.000 GOLOS", "reputation": "439345795585", "transfer_history": [], "market_history": [], "post_history": [], "vote_history": [], "other_history": [], "witness_votes": [], "tags_usage": [], "guest_bloggers": [], "blog_category": {}}}], "tags": []}
    }
  }

  function getTagWithOrder(userId) {
    const mysql = Model.dataSource.connector
    return new Promise((resolve, reject) => {
      mysql.execute('SELECT * FROM tags JOIN usertag ON tags.id = usertag.tagId WHERE usertag.userId=? ORDER BY usertag.id', [userId], (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })
  }

  Model.remoteMethod('current', {
    accepts: [
      {arg: 'req', type: 'object', 'http': {source: 'req'}}
    ],
    returns: {type: 'object', root: true},
    http: {path: '/current', verb: 'get'},
    description: 'Get current user',
  });

  Model.refresh = async req => req.accessToken

  Model.remoteMethod('refresh', {
    accepts: [
      {arg: 'req', type: 'object', 'http': {source: 'req'}}
    ],
    returns: {type: 'object', root: true},
    http: {path: '/refresh', verb: 'get'},
    description: 'refresh',
  });

  const blockChains = require('@oneplace/blockchains-api')
  const {Signature, PublicKey} = require('steem/lib/auth/ecc')

  Model.saveAccount = async function(id, sign, username, chain) {
    const account = await blockChains.getAccount(chain, username);
    if (!account) {
      const error = new Error('account not found')
      error.status = 404
      throw error
    }

    if (process.env.NODE_ENV !== 'test') {
      const key = account.active.key_auths[0][0]
      const publicKey = PublicKey.fromString(key, BLOCKCHAIN.PREFIXES[chain])
      const signature = Signature.fromHex(sign)
      if (!signature.verifyBuffer(new Buffer('test'), publicKey)) {
        const error = new Error('bad sign')
        error.status = 400
        throw error
      }
    }


    const Account = Model.app.models.account
    const data = {username, chain}
    const result = await Account.findOrCreate({where: data}, data)
    await linkAccount(id, result[0].id)
    return result[0]
  };

  function linkAccount(id, accountId) {
    const mysql = Model.dataSource.connector
    return new Promise((resolve, reject) => {
      mysql.execute('INSERT IGNORE INTO `useraccount`(userId, accountId) VALUE(?,?)', [id, accountId], (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })
  }

  function unLinkAccount(id, accountId, chainAcount) {
    const mysql = Model.dataSource.connector
    return new Promise((resolve, reject) => {
      mysql.execute('SELECT COUNT(userId) as cnt FROM `useraccount` WHERE accountId=?', [accountId], (err, result) => {
        if (err) reject(err)
        else {
          const {posting, memo_key, json_metadata} = chainAcount
          const CLIENT_ID = Model.app.get('postingWrapper').username
          const persmissionExists = !!~posting.account_auths.findIndex(item => item[0] === CLIENT_ID)
          if (result[0].cnt > 1 || !persmissionExists) {
            mysql.execute('DELETE FROM `useraccount`WHERE userId=? AND accountId=?', [id, accountId], (err, result) => {
              if (err) reject(err)
              else resolve(result)
            })
          } else {

            const error = new Error('account not found')
            error.status = 405
            reject(error)
          }
        }
      })

    })
  }

  Model.remoteMethod('saveAccount', {
    accepts: [
      {arg: 'id', type: 'string', required: true},
      {arg: 'sign', type: 'string', required: true},
      {arg: 'username', type: 'string', required: true},
      {arg: 'chain', type: 'string', required: true}
    ],
    returns: {type: 'object', root: true},
    http: {path: '/:id/account', verb: 'post'},
    description: 'Save link user and account',
  });

  Model.removeAccount = async function(id, username, chain) {
    const Account = Model.app.models.account
    const account = await Account.findOne({where: {username, chain}})
    if (!account) {
      const error = new Error('account not found')
      error.status = 404
      throw error
    }
    const chainAccount = await blockChains.getAccount(chain, username, true)
    if (!chainAccount) {
      const error = new Error('account not found')
      error.status = 404
      throw error
    }
    try {
      await unLinkAccount(id, account.id, chainAccount)
    } catch (e) {
      throw e
    }
  }

  Model.remoteMethod('removeAccount', {
    accepts: [
      {arg: 'id', type: 'string', required: true},
      {arg: 'username', type: 'string', required: true},
      {arg: 'chain', type: 'string', required: true}
    ],
    returns: {type: 'object', root: true},
    http: {path: '/:id/account', verb: 'delete'},
    description: 'Remove link user and account',
  });

  function unlinkAllTags(id, chain) {
    const mysql = Model.dataSource.connector
    return new Promise((resolve, reject) => {
      mysql.execute('DELETE FROM `usertag` WHERE userId = ? AND (SELECT id FROM tags WHERE `tags`.`id` = `usertag`.`tagId` AND tags.chain=?)', [id, chain], (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })
  }

  function linkAllTags(id, tags) {
    const mysql = Model.dataSource.connector
    return new Promise((resolve, reject) => {
      mysql.execute('INSERT INTO `usertag`(userId, tagId) VALUES ?', [tags.map(tag => [id, tag.id])], (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })
  }

  Model.checkAccountLink = (chain, username, userId) => {
    const mysql = Model.dataSource.connector
    return new Promise((resolve, reject) => {
      const sql = 'SELECT COUNT(*) as cnt FROM `useraccount` WHERE userId=? AND accountId=(SELECT id FROM `accounts` WHERE chain=? AND username=?)'
      const data = [userId, chain, username]
      mysql.execute(sql, data, (err, result) => {
        if (err) reject(err)
        else resolve(!!result[0].cnt)
      })
    })
  }

  Model.saveTags = async function(id, tags, chain) {
    const Tag = Model.app.models.tag
    tags = tags.splice(0, 20)
    const _tags = []
    for (let text of tags) {
      const data = {text, chain}
      const result = await Tag.findOrCreate({where: data}, data)
      _tags.push(result[0])
    }
    await unlinkAllTags(id, chain)
    if (_tags.length) {
      await linkAllTags(id, _tags)
    }

    return _tags
  }

  Model.remoteMethod('saveTags', {
    accepts: [
      {arg: 'id', type: 'string', required: true},
      {arg: 'tags', type: 'array', required: true},
      {arg: 'chain', type: 'string', required: true}
    ],
    returns: {type: 'object', root: true},
    http: {path: '/:id/tags', verb: 'post'},
    description: 'Save user tags ',
  });

  Model.afterRemoteError('confirm', (ctx, next) => {
    ctx.res.writeHead(301, {
      'Location': ctx.req.query.redirect || Model.app.get('origin')
    })
    ctx.res.end()
  })
};