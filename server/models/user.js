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
    let user = await Model.findById(req.accessToken.userId, {include: ['accounts']})
    for (let account of user.accounts()) {
      account.avatar = await blockChains.getAvatar(account.chain, account.username)
      account.data = await blockChains.getAccount(account.chain, account.username)
    }
    const tags = await getTagWithOrder(user.id)
    user = JSON.parse(JSON.stringify(user))
    user.tags = tags
    return user
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

  Model.remoteMethod('saveAccount', {
    accepts: [
      {arg: 'id', type: 'string', required: true},
      {arg: 'sign', type: 'string', required: true},
      {arg: 'username', type: 'string', required: true},
      {arg: 'chain', type: 'string', required: true},
      {arg: 'isPostingKey', type: 'boolean'},
    ],
    returns: {type: 'object', root: true},
    http: {path: '/:id/account', verb: 'post'},
    description: 'Save link user and account',
  })

  Model.saveAccount = async function(id, sign, username, chain, isPostingKey = false) {
    const account = await blockChains.getAccount(chain, username);
    if (!account) {
      const error = new Error('account not found')
      error.status = 404
      throw error
    }

    if (process.env.NODE_ENV !== 'test') {
      const key = account[isPostingKey ? 'posting' : 'active'].key_auths[0][0]
      const publicKey = PublicKey.fromString(key, BLOCKCHAIN.PREFIXES[chain])
      const signature = Signature.fromHex(sign)
      if (!signature.verifyBuffer(new Buffer('test'), publicKey)) {
        const error = new Error('bad sign')
        error.status = 400
        throw error
      }

      const auth = account.posting.account_auths.find(i => i[0] === Model.app.get('postingWrapper').username)
      if (!auth) {
        const error = new Error('bad permissions')
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