<script>
import Vue from 'vue'
export default {
  name: 'Auth-recovery',
  $_veeValidate: {
    validator: 'new'
  },
  data() {
    return {
      model: {
        email: ''
      },
      formSubmitted: false,
      processing: false,
      formSuccessSubmitted: false,
      wrongCredentials: false
    }
  },
  methods: {
    onSubmit() {
      if (!this.processing) {
        this.processing = true
        this.wrongCredentials = false
        this.$validator
          .validateAll()
          .then(() => {
            if (this.errors.any()) throw new Error('INVALID_FORM')
            this.formSubmitted = true
            return this.axios.post(`users/reset`, this.model)
          })
          .then(response => {
            this.processing = false
            this.formSuccessSubmitted = true
          })
          .catch(err => {
            if (err.response && ~[422, 404, 401].indexOf(err.response.status)) {
              let _errors
              switch (err.response.status) {
                case 422:
                  _errors = err.response.data.error
                  break
                case 401:
                case 404:
                  const _rules = { 401: 'verified', 404: 'notfound' }
                  _errors = {
                    details: {
                      codes: {
                        email: [errors[err.response.status]]
                      },
                      messages: {
                        email: [errors[err.response.status]]
                      }
                    }
                  }
                  break
              }
              this.$helper.handleValidationError(
                _errors,
                this.errors
              )
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
  <header class="login-form__header login-form__header--large">
    <h2 class="h2 login-form__title">{{$t('auth.recovery.header')}}</h2>
  </header>
  <form class="login-form__body" @submit.prevent="onSubmit" novalidate>
    <p class="login-form__text">{{$t('auth.recovery.help')}}</p>
    <div class="login-form__item">
      <input v-model="model.email" @keydown="errors.remove('email')" v-validate="'required|email'" name="email" type="email" :placeholder="$t('common.placeholders.email')" class="login-form__input" :class="{'login-form__input--error':errors.has('email')}">
      <div v-show="errors.firstByRule('email', 'required')" id="vError-email-required" class="login-form__alert">{{$t('common.validate.emailRequired')}}</div>
      <div v-show="errors.firstByRule('email', 'email')" id="vError-email-format" class="login-form__alert">{{$t('common.validate.emailFormat')}}</div>
      <div v-show="errors.firstByRule('email', 'verified')" id="vError-email-verified" class="login-form__alert">{{$t('common.validate.emailVerified')}}</div>
      <div v-show="errors.firstByRule('email', 'notfound')" id="vError-email-notfound" class="login-form__alert">{{$t('common.validate.emailNotFound')}}</div>
    </div>
    <button type="submit" class="btn login-form__btn btn--large" :disabled="processing">{{$t('auth.ResetPassword')}}</button>
  </form>
</div>

<div class="login-form" v-else>
  <header class="login-form__header login-form__header--large">
    <h2 class="h2 login-form__title">{{$t('auth.recovery.success.header')}}</h2>
  </header>
  <div class="login-form__body">
    <p class="login-form__text">{{$t('auth.recovery.success.body')}}</p>
  </div>
</div>
</template>
