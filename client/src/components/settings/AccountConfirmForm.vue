<template>
<form @submit.prevent="onSubmit" class="login-form__body" autocomplete="off">
  <p class="login-form__text">{{$t('welcome.confirmStep.help')}}</p>

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
          :placeholder="$t('common.placeholders.confirmAccountPostingKey', {blockchain: this.chainName})"
          class="login-form__input"
          :class="{'login-form__input--error': errors.has('activeKey')}"/>

        <div v-if="errors.firstByRule('activeKey', 'required')" id="vError-activeKey-required" class="login-form__alert">
          {{$t('common.validate.postingKeyRequired')}}
        </div>
        <div v-if="errors.firstByRule('activeKey', 'notPassed')" id="vError-activeKey-notPassed" class="login-form__alert">
          {{$t('common.validate.postingKeyNotPassed')}}
        </div>
      </div>
    </div>
    <p class="login-form__text login-form__text--security">{{$t('welcome.confirmStep.help2')}}</p>

      <button type="submit" class="btn btn--large login-form__btn" :disabled="processing">
        <span v-show="!processing">{{$t('welcome.confirmStep.confirmAccount')}}</span>
        <span v-show="processing"><pulse-loader :loading="true" :color="'#FFFFFF'" :size="'10px'"></pulse-loader></span>
      </button>

    <div style="overflow:hidden" v-if="view === VIEWS.welcome">
      <a href="" class="login-form__bottom-link link" @click.prevent="skip">
        {{$t('welcome.attachStep.skipThisStep')}}
      </a>
    </div>
    <!-- <div style="overflow:hidden" v-else>
      <router-link class="login-form__bottom-link link" :to="backRoute">{{$t('addAccount.backToOnePlace')}}</router-link>
    </div> -->
  </div>
</form>

</template>

<script>
import Api from '../../plugins/api'
const CONSTANTS = require('@oneplace/constants')

export default {
  name: 'AccountConfirmForm',
  $_veeValidate: {
    validator: 'new'
  },
  props: {
    view: {
      type: String, // welcome, add-account
      required: true
    },
    chain: {
      type: String,
      required: true // s, g
    }
  },
  computed: {
    CHAINS() {
      return CONSTANTS.BLOCKCHAIN.SOURCE
    },
    VIEWS() {
      return {
        WELCOME: 'welcome',
        ADD_ACCOUNT: 'add-account'
      }
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
      const from = this.$store.state.core.$router.from
      if (from) {
        target.name = from.name
        target.params = from.params
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
      }
    }
  },
  methods: {
    clearErrors() {
      this.errors.remove('username', 'notFound')
      this.errors.remove('activeKey', 'notPassed')
    },
    skip() {
      this.$emit('skip', { chain: this.chain })
    },
    onSubmit() {
      this.$validator.validateAll().then(() => {
        if (this.errors.any()) throw new Error('INVALID_FORM')
        this.processing = true
        this.$chains.setChain(this.chain)
        const { Signature } = require('steem/lib/auth/ecc')
        let sign
        try {
          sign = Signature.sign('test', this.model.wif).toHex()
        } catch (e) {
          console.log(e)
          this.errors.add({
            field: 'activeKey',
            rule: 'notPassed',
            scope: 'notPassed',
            id: ['activeKey', 'notPassed'].join(),
            msg: 'active key not passed'
          })
          this.processing = false
          return e
        }

        return this.$store
          .dispatch('saveAccount', {
            id: this.$auth.user().id,
            sign,
            chain: this.chain,
            username: this.model.username,
            isPostingKey: true
          })
          .then(() => {
            this.model.username = ''
            this.model.wif = ''
            this.processing = false
            this.$emit('success', { chain: this.chain })
          })
          .catch(err => {
            if (err.response.status === 404) {
              this.errors.add({
                field: 'username',
                rule: 'notFound',
                scope: 'notFound',
                id: ['username', 'notFound'].join(),
                msg: 'Account not found'
              })
            } else if (err.response.status === 400 || err.name === 'AssertionError') {
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

