<template>
<form @submit.prevent="onSubmit" class="settings__account-action" autocomplete="off">
    <div class="login-form__wrapper">
      <div class="login-form__item" >
          <input 
          id="username-input"
          v-model="account.username"
          name="username"
          type="text"
          class="login-form__input"
          disabled="disabled"/>
      </div>
      <div class="login-form__item">
        <div class="login-form__item">
          <input 
            id="activeKey-input"
            v-model="model.wif"
            v-validate="'required'"
            @keydown="clearErrors"
            name="activeKey"
            type="password"
            :placeholder="$t('common.placeholders.activeKey')"
            class="login-form__input"
            :class="{'login-form__input--error': errors.has('activeKey')}"/>

          <div v-if="errors.firstByRule('activeKey', 'required')" id="vError-activeKey-required" class="login-form__alert">
            {{$t('common.validate.activeKeyRequired')}}
          </div>
          <div v-if="errors.firstByRule('activeKey', 'notPassed')" id="vError-activeKey-notPassed" class="login-form__alert">
            {{$t('common.validate.activeKeyNotPassed')}}
          </div>
        </div>
      </div>
      <p class="login-form__text login-form__text--alert login-form__text--small" v-html="$t('accountForm.aboutRemove')"></p>
      
      <button type="submit" class="btn btn--large account-action__btn" :disabled="processing">
        <span v-show="!processing">{{$t('accountForm.removeAccount')}}</span>
        <span v-show="processing"><pulse-loader :loading="true" :color="'#FFFFFF'" :size="'10px'"></pulse-loader></span>
      </button>
      <a class="btn btn--large account-action__btn account-action__btn--sc" @click="removeWithSteemConnect" v-if="chain === CHAINS.STEEM">
        {{$t('accountForm.removeWithSteemConnect')}}
      </a>
      <a href="#" class="login-form__bottom-link link" @click.prevent="$emit('cancel')">{{$t('accountForm.cancelRemoveAccount')}}</a>
    </div>
  </form>
</template>

<script>
import Api from '../../plugins/api'
const CONSTANTS = require('@oneplace/constants')

const hasAuthority = (user, role = 'posting') => {
  const auths = user[role].account_auths.map(auth => auth[0])
  return auths.indexOf(process.env.APPLICATION_USERNAME) !== -1
}
const removePostingAuthority = (wif, username, client) => {
  return new Promise((resolve, reject) => {
    client.api.getAccounts([username], (err, [account]) => {
      if (err) {
        reject(err)
      } else {
        if (account) {
          const { posting, memo_key, json_metadata } = account
          if (hasAuthority(account)) {
            posting.account_auths = posting.account_auths.filter(
              item => item[0] !== process.env.APPLICATION_USERNAME
            )
            client.broadcast.accountUpdate(
              wif,
              username,
              undefined,
              undefined,
              posting,
              memo_key,
              json_metadata,
              (errA, resultA) => {
                if (errA) reject(errA)
                else resolve(resultA)
              }
            )
          } else {
            resolve({})
          }
        } else {
          const err = new Error('Account not found')
          err.status = 404
          reject(err)
        }
      }
    })
  })
}
export default {
  name: 'AccountRemoveForm',
  $_veeValidate: {
    validator: 'new'
  },
  props: {
    account: {
      type: Object,
      required: true
    }
  },
  computed: {
    CHAINS() {
      return CONSTANTS.BLOCKCHAIN.SOURCE
    },
    chain() {
      return this.account.chain
    },
    chainName() {
      return {
        s: 'steem',
        g: 'golos'
      }[this.chain]
    }
  },
  data() {
    return {
      processing: false,
      wrongCredentials: false,
      model: {
        wif: ''
      }
    }
  },
  methods: {
    clearErrors() {
      this.errors.remove('username', 'notFound')
      this.errors.remove('activeKey', 'notPassed')
    },
    onSubmit() {
      this.processing = true
      this.$chains.setChain(this.account.chain)
      removePostingAuthority(
        this.model.wif,
        this.account.username,
        this.$chains.client
      )
        .then(result => {
          this.$emit('success', this.account)
        })
        .catch(err => {
          if (err.status === 404) {
            this.errors.add({
              field: 'username',
              rule: 'notFound',
              scope: 'notFound',
              id: ['username', 'notFound'].join(),
              msg: 'Account not found'
            })
          } else if (err.status === 400 || err.name === 'AssertionError') {
            this.errors.add({
              field: 'activeKey',
              rule: 'notPassed',
              scope: 'notPassed',
              id: ['activeKey', 'notPassed'].join(),
              msg: 'active key not passed'
            })
          }
          this.processing = false
        })
    },
    removeWithSteemConnect() {
      const redirectUri = encodeURIComponent(window.location.origin + `/settings?rm=${this.account.chain}:${this.account.username}`)
      const appName = 'oneplace.app'
      window.open(
        `https://steemconnect.com/revoke/@${appName}?&redirect_uri=${redirectUri}`,
        '_blank'
      )
    }
  }
}
</script>

