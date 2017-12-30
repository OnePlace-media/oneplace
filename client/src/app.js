import Vue from 'vue'
import App from './App.vue'
import Helper from './plugins/helper'
import {createRouter} from './router'
import {createStore} from './store'
import {sync} from 'vuex-router-sync'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VeeValidate from 'vee-validate'
import Vue2TouchEvents from 'vue2-touch-events'
import VueI18n from 'vue-i18n'
import moment from 'moment'
import VueLocalStorage from 'vue-localstorage'
import NoSSR from 'vue-no-ssr'
import VueTimeago from 'vue-timeago'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import Chains from './plugins/chains'

import 'vue2-toast/lib/toast.css'
import Toast from 'vue2-toast'

Vue.use(Toast, {
  defaultType: 'center',
  duration: 3000,
  wordWrap: true
})

Vue.use(Chains)
Vue.use(VueTimeago, {
  name: 'timeago',
  locale: 'en-US',
  locales: {
    'en': require('vue-timeago/locales/en-US.json'),
    'ru': require('vue-timeago/locales/ru-RU.json')
  }
})


Vue.use(VueI18n)
Vue.use(Vue2TouchEvents)
Vue.use(VeeValidate, {inject: false, events: 'blur'})

Vue.use(VueAxios, axios)

Vue.axios.defaults.baseURL = `/api/`
// Vue.axios.defaults.baseURL = `http://127.0.0.1:3001/api/`

Vue.component('pulse-loader', PulseLoader)
Vue.use(Helper)

Vue.use(VueLocalStorage)
Vue.component('no-ssr', NoSSR)

Vue.filter('golosTag', require('./filters/golos.tag').golosTag)
Vue.filter('unGolosTag', require('./filters/golos.tag').unGolosTag)
Vue.filter('toLowerCase', function(input) {return input.toLowerCase()})

const CONSTANTS = require('@oneplace/constants')

export function createApp(ssrContext) {
  const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: require('./i18n/en'),
      ru: require('./i18n/ru')
    }
  })

  Vue.prototype.$locale = {
    change(language) {
      i18n.locale = language
      Vue.localStorage.set('locale', language)
    },
    current() {
      return i18n.locale
    },
    check(locale) {
      return i18n.locale === locale
    }
  }

  const router = createRouter(i18n)
  const store = createStore()
  router.beforeEach((to, from, next) => {
    if (to.params.chain) store.commit('setChain', {chain: to.params.chain})
    next()
  })
  sync(store, router)
  const app = new Vue({
    beforeMount() {
      Vue.prototype.$locale.change(Vue.localStorage.get('locale') || 'en')
      const currentChain = this.$route.params.chain || Vue.localStorage.get('chainLast')
      store.commit('setChain', {chain: currentChain})
      const chains = [CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS, CONSTANTS.BLOCKCHAIN.SOURCE.STEEM]
      chains.forEach(chain => {
        const accountId = Vue.localStorage.get(`accLast-${chain}`)
        if (accountId) {
          store.commit('setUserAccountActive', {chain, accountId})
        }
      })
    },
    localStorage: {
      locale: {
        type: String,
        default: 'en'
      },
      default_auth_token: {
        type: String
      },
      accId: {
        type: Number
      },
      chainLast: {
        type: String,
        default: CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS
      },
      [`accLast-${CONSTANTS.BLOCKCHAIN.SOURCE.STEEM}`]: {
        type: Number
      },
      [`accLast-${CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS}`]: {
        type: Number
      }
    },
    router,
    store,
    i18n,
    ssrContext,
    render: h => h(App)
  })
  return {app, router, store, i18n}
}