<template>
<form class="settings__account-action" v-if="view === VIEWS.SETTINGS" @submit.prevent="onSubmit" autocomplete="off">
  <p class="login-form__text login-form__text--settings">{{$t('settings.addBlockChainAccount')}}:</p>
  <chain-choose :is-settings="true" :chain.sync="chain"></chain-choose>
  <div class="login-form__wrapper">
    <div class="login-form__item">
        <input 
        id="username-input"
        v-model="model.username"
        v-validate="'required'"
        @keyup="clearErrors"
        name="username"
        type="text"
        :placeholder="$t('common.placeholders.addAccountUsername', {blockchain: this.chainName})"
        class="login-form__input"
        :class="{'login-form__input--error': errors.has('username')}"/>
      
      <div v-if="errors.firstByRule('username', 'required')" id="vError-username-required" class="login-form__alert">
        {{$t('common.validate.usernameRequired')}}
      </div>
      <div v-if="errors.firstByRule('username', 'notFound')" id="vError-username-notfound" class="login-form__alert">
        {{$t('common.validate.usernameNotFound')}}
      </div>
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
          :placeholder="$t('common.placeholders.addAccountActiveKey', {blockchain: this.chainName})"
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
    <p class="login-form__text login-form__text--small login-form__text--alert" v-html="$t('accountForm.aboutPrivate')"></p>
    <button type="submit" class="btn btn--large account-action__btn" :disabled="processing">
      <span v-show="!processing">{{$t('accountForm.addAccount')}}</span>
      <span v-show="processing"><pulse-loader :loading="true" :color="'#FFFFFF'" :size="'10px'"></pulse-loader></span>
    </button>
    <a class="login-form__bottom-link link" href="#" @click.prevent="$emit('close')">{{$t('accountForm.cancelRemoveAccount')}}</a>
  </div>
</form>

<form @submit.prevent="onSubmit" class="login-form__body"  v-else-if="view === VIEWS.WELCOME" autocomplete="off">
  <p class="login-form__text">{{$t('welcome.attachChainStep.help')}}</p>
  <chain-choose :is-settings="true" :chain.sync="chain"></chain-choose>

  <div class="login-form__wrapper">
    <div class="login-form__item">
        <input 
        id="username-input"
        v-model="model.username"
        v-validate="'required'"
        @keyup="clearErrors"
        name="username"
        type="text"
        :placeholder="$t('common.placeholders.addAccountUsername', {blockchain: this.chainName})"
        class="login-form__input"
        :class="{'login-form__input--error': errors.has('username')}"/>
      
      <div v-if="errors.firstByRule('username', 'required')" id="vError-username-required" class="login-form__alert">
        {{$t('common.validate.usernameRequired')}}
      </div>
      <div v-if="errors.firstByRule('username', 'notFound')" id="vError-username-notfound" class="login-form__alert">
        {{$t('common.validate.usernameNotFound')}}
      </div>
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
          :placeholder="$t('common.placeholders.addAccountActiveKey', {blockchain: this.chainName})"
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
    <p class="login-form__text login-form__text--alert" v-html="$t('accountForm.aboutPrivate')"></p>
    <button type="submit" class="btn login-form__btn btn--large" :disabled="processing">
      <span v-show="!processing">{{$t('welcome.attachChainStep.addBlockchainAccount')}}</span>
      <span v-show="processing"><pulse-loader :loading="true" :color="'#FFFFFF'" :size="'10px'"></pulse-loader></span>
    </button>
    <div style="overflow:hidden">
      <a href="#" class="login-form__bottom-link link" @click.prevent="skip">{{$t('welcome.attachChainStep.skipThisStep')}}</a>
    </div>
  </div>
</form>

<form @submit.prevent="onSubmit" class="login-form__body"  v-else-if="view === VIEWS.ADD_ACCOUNT" autocomplete="off">
  <p class="login-form__text">{{$t('addAccount.help')}}</p>
  <div class="login-form__wrapper">
    <div class="login-form__item">
        <input 
        id="username-input"
        v-model="model.username"
        v-validate="'required'"
        @keyup="clearErrors"
        name="username"
        type="text"
        :placeholder="$t('common.placeholders.addAccountUsername', {blockchain: this.chainName})"
        class="login-form__input"
        :class="{'login-form__input--error': errors.has('username')}"/>
      
      <div v-if="errors.firstByRule('username', 'required')" id="vError-username-required" class="login-form__alert">
        {{$t('common.validate.usernameRequired')}}
      </div>
      <div v-if="errors.firstByRule('username', 'notFound')" id="vError-username-notfound" class="login-form__alert">
        {{$t('common.validate.usernameNotFound')}}
      </div>
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
          :placeholder="$t('common.placeholders.addAccountActiveKey', {blockchain: this.chainName})"
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
    <p class="login-form__text login-form__text--alert" v-html="$t('accountForm.aboutPrivate')"></p>
    <button type="submit" class="btn login-form__btn btn--large" :disabled="processing">
      <span v-show="!processing">{{$t('welcome.attachChainStep.addBlockchainAccountReplace', {blockchain: this.chainName})}}</span>
      <span v-show="processing"><pulse-loader :loading="true" :color="'#FFFFFF'" :size="'10px'"></pulse-loader></span>
    </button>
    <div style="overflow:hidden">
      <router-link class="login-form__bottom-link link" :to="backRoute">{{$t('addAccount.backToOnePlace')}}</router-link>
    </div>
  </div>
</form>
</template>

<script>
import Api from '../../../plugins/api'
const CONSTANTS = require('@oneplace/constants')
import ChainChoose from './_chainChoose.vue'

const hasAuthority = (user, role = 'posting') => {
  const auths = user[role].account_auths.map(auth => auth[0])
  return ~auths.indexOf(process.env.APPLICATION_USERNAME)
}
const addPostingAuthority = ({ username, wif }, client) => {
  return new Promise((resolve, reject) => {
    client.api.getAccounts([username], (err, [account]) => {
      if (err) {
        reject(err)
      } else {
        if (account) {
          const { posting, memo_key, json_metadata } = account
          if (!hasAuthority(account)) {
            posting.account_auths.push([
              process.env.APPLICATION_USERNAME,
              posting.weight_threshold
            ])
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
  name: 'AccountForm',
  $_veeValidate: {
    validator: 'new'
  },
  props: ['view'],
  components: {
    ChainChoose
  },
  created() {
    this.chain = this.$route.params.chain || CONSTANTS.BLOCKCHAIN.SOURCE.STEEM
  },
  computed: {
    CHAINS() {
      return CONSTANTS.BLOCKCHAIN.SOURCE
    },
    VIEWS() {
      return {
        WELCOME: 'welcome',
        SETTINGS: 'settings',
        ADD_ACCOUNT: 'add-account'
      }
    },
    removeMode() {
      return this.$store.state.accountForm.removeMode
    },
    chainName() {
      return {
        s: 'Steem',
        g: 'Golos'
      }[this.chain]
    },
    backRoute() {
      const target = {
        name: 'chain-trend',
        params: { chain: this.CHAINS.STEEM }
      }
      if (this.$store.state.$router.from) {
        target.name = this.$store.state.$router.from.name
        target.params = this.$store.state.$router.from.params
      }
      return target
    }
  },
  data() {
    return {
      processing: false,
      wrongCredentials: false,
      model: {
        username: '',
        wif: ''
      },
      chain: null
    }
  },
  methods: {
    clearErrors() {
      this.errors.remove('username', 'notFound')
      this.errors.remove('activeKey', 'notPassed')
    },
    skip() {
      this.$store.commit('setWelcomeChain', this.chain)
      this.$store.commit('setTagsFormChain', this.chain)
      this.$store.commit('setWelcomeStep', CONSTANTS.WELCOME.STEPS.SETUP_TAGS)
    },
    onSubmit() {
      this.$validator.validateAll().then(() => {
        if (this.errors.any()) throw new Error('INVALID_FORM')
        this.processing = true
        this.$store.commit('setWelcomeChain', this.chain)
        this.$chains.setChain(this.chain)
        addPostingAuthority(this.model, this.$chains.client)
          .then(result => {
            const { Signature } = require('steem/lib/auth/ecc')
            const sign = Signature.sign('test', this.model.wif).toHex()
            const method =
              this.view === this.VIEWS.WELCOME
                ? 'saveAccountWelcome'
                : 'saveAccount'
            return this.$store
              .dispatch(method, {
                id: this.$auth.user().id,
                sign,
                chain: this.chain,
                username: this.model.username
              })
              .then(() => {
                if (
                  ~[this.VIEWS.SETTINGS, this.VIEWS.ADD_ACCOUNT].indexOf(
                    this.view
                  )
                ) {
                  this.$auth.fetch()
                  this.$emit('success')
                }
                this.model.username = ''
                this.model.wif = ''
                this.processing = false

                this.$store.commit('setWelcomeChain', this.chain)
                this.$store.commit('setTagsFormChain', this.chain)
                this.$store.commit(
                  'setWelcomeStep',
                  CONSTANTS.WELCOME.STEPS.SETUP_TAGS
                )

                this.$emit('success')
              })
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
      })
    }
  }
}
</script>

