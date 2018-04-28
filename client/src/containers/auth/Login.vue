<script>
import Vue from 'vue'
import AuthHeader from './AuthHeader.vue'
export default {
  name: 'Auth-login',
  components: {
    AuthHeader
  },
  $_veeValidate: {
    validator: 'new'
  },
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      formSubmitted: false,
      processing: false,
      wrongCredentials: false
    }
  },
  methods: {
    onSubmit() {
      if (!this.processing) {
        this.processing = true
        this.wrongCredentials = false
        return this.$validator
          .validateAll()
          .then(() => {
            if (this.errors.any()) throw new Error('INVALID_FORM')
            this.formSubmitted = true
            this.$auth.login({
              data: this.credentials,
              rememberMe: true,
              success: () => {
                Vue.nextTick(() => {
                  const target = {
                    name: 'chain-trend',
                    params: { chain: 's' }
                  }
                  const from = this.$store.state.core.$router.from
                  if (from) {
                    target.name = from.name
                    target.params = from.params
                  }
                  this.$router.push(target)
                })
              },
              error: res => {
                this.wrongCredentials = true
                this.processing = false
              }
            })
          })
          .catch(() => {
            this.processing = false
          })
      }
    }
  }
}
</script>

<template>
<div class="login-form">
  <auth-header></auth-header>
  <form class="login-form__body" @submit.prevent="onSubmit" novalidate  id="login-form">
    <p class="login-form__text login-form__text--error" v-if="wrongCredentials">{{$t('auth.login.wrongCredentials')}}</p>
    <div class="login-form__item">
      <input 
        id="email-input"
        v-model="credentials.email"
        v-validate="'required|email'"
        @keydown="wrongCredentials = false"
        name="email"
        type="email"
        :placeholder="$t('common.placeholders.email')"
        class="login-form__input"
        :class="{'login-form__input--error': errors.has('email')}"/>
      
      <div v-if="errors.firstByRule('email', 'required')" id="vError-email-required" class="login-form__alert">
        {{$t('common.validate.emailRequired')}}
      </div>
      <div v-if="errors.firstByRule('email', 'email')" id="vError-email-format" class="login-form__alert">
        {{$t('common.validate.emailFormat')}}
      </div>
    </div>
    <div class="login-form__item">
      <input 
        id="password-input"
        v-model="credentials.password"
        v-validate="'required'"
        @keydown="wrongCredentials = false"
        name="password"
        type="password"
        :placeholder="$t('common.placeholders.password')"
        class="login-form__input"
        :class="{'login-form__input--error':errors.has('password')}"/>
      <div v-if="errors.firstByRule('password', 'required')" id="vError-password-required" class="login-form__alert">
        {{$t('common.validate.passwordRequired')}}
      </div>
    </div>
    <!-- <p class="login-form__info" v-html="$t('auth.login.help')"></p> -->
    <button type="submit" class="btn login-form__btn btn--large" :disabled="processing">{{$t('auth.SignIn')}}</button>
    <router-link :to="{name:'auth-recovery'}" class="login-form__bottom-link link">{{$t('auth.login.forgot')}}</router-link>
  </form>
</div>
</template>
