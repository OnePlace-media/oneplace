
<script>
import AuthHeader from './AuthHeader.vue'
export default {
  name: 'Auth-registration',
  components: {
    AuthHeader
  },
  $_veeValidate: {
    validator: 'new'
  },
  data() {
    return {
      model: {
        email: '',
        password: '',
        lang: ''
      },
      error: null,
      passwordRepeat: '',
      formSubmitted: false,
      processing: false,
      formSuccessSubmitted: false
    }
  },
  methods: {
    checkRepeatPass() {
      if (this.model.password === this.passwordRepeat) {
        this.errors.remove('passwordRepeat')
      } else {
        this.errors.add({
          field: 'passwordRepeat',
          msg: 'Password must repeat',
          rule: 'repeat',
          id: 'repeat'
        })
      }
    },
    onSubmit() {
      if (!this.processing) {
        this.processing = true
        this.wrongCredentials = false
        return this.$validator
          .validateAll()
          .then(() => {
            this.checkRepeatPass()
            if (this.errors.any()) throw new Error('INVALID_FORM')
            this.formSubmitted = true
            this.error = {
              url: `users?redirect=${encodeURIComponent(
                window.location.origin
              )}`,
              model: this.model
            }
            this.model.lang = this.$locale.current()
            return this.axios.post(
              `users?redirect=${encodeURIComponent(window.location.origin)}`,
              this.model
            )
          })
          .then(response => {
            this.processing = false
            this.formSuccessSubmitted = true
          })
          .catch(err => {
            if (err.response && err.response.status === 422) {
              this.$helper.handleValidationError(
                err.response.data.error,
                this.errors
              )
            } else {
              this.formSuccessSubmitted = false
            }
            this.processing = false
          })
      }
    }
  }
}
</script>

<template>
<div class="login-form" v-if="!formSuccessSubmitted">
  <auth-header></auth-header>
  <form class="login-form__body" @submit.prevent="onSubmit" novalidate>
    <div class="login-form__item">
      <input 
        id="email-input"
        @keyup="errors.remove('email', 'uniqueness')" 
        v-model="model.email" 
        v-validate="'required|email'" 
        name="email" 
        type="email" 
        :placeholder="$t('common.placeholders.email')" 
        class="login-form__input" 
        :class="{'login-form__input--error':errors.has('email')}">
      <div v-if="errors.firstByRule('email', 'required')" id="vError-email-required" class="login-form__alert">{{$t('common.validate.emailRequired')}}</div>
      <div v-if="errors.firstByRule('email', 'email')" id="vError-email-format" class="login-form__alert">{{$t('common.validate.emailFormat')}}</div>
      <div v-if="errors.firstByRule('email', 'uniqueness')" id="vError-email-uniqueness" class="login-form__alert">{{$t('common.validate.emailUniqueness')}}</div>
    </div>
    <div class="login-form__item">
      <input 
        id="password-input" 
        autocomplete="off" 
        v-model="model.password" 
        v-validate="'required'" 
        name="password" 
        type="password" 
        :placeholder="$t('common.placeholders.password')" 
        class="login-form__input" 
        :class="{'login-form__input--error':errors.has('password')}">
      <div v-if="errors.firstByRule('password', 'required')" id="vError-password-required" class="login-form__alert">{{$t('common.validate.passwordRequired')}}</div>
    </div>
    <div class="login-form__item">
      <input 
        id="passwordRepeat-input"
        autocomplete="off" 
        v-model="passwordRepeat" 
        name="passwordRepeat" 
        type="password" 
        :placeholder="$t('common.placeholders.passwordRepeat')" 
        class="login-form__input" 
        :class="{'login-form__input--error':errors.has('passwordRepeat')}">
      <div v-if="errors.firstByRule('passwordRepeat', 'repeat')" id="vError-password-repeat" class="login-form__alert">{{$t('common.validate.passwordRepeat')}}</div>
    </div>
    
    <button type="submit" class="btn login-form__btn btn--large" :disabled="processing">{{$t('auth.CreateAccount')}}</button>
  </form>
</div>

<div class="login-form" v-else>
  <header class="login-form__header" id="success-registration-header">
    <h2 class="login-form__title">{{$t('auth.registration.success.header')}}</h2>
  </header>
  <div class="login-form__body">
    <p class="login-form__text">{{$t('auth.registration.success.body1')}}</p>
    <p class="login-form__text login-form__text--alert">
      <strong>{{$t('auth.registration.success.body2')}}</strong>
    </p>
  </div>
</div>
</template>

