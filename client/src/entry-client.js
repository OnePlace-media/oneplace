import Vue from 'vue'
import {createApp} from './app'
import VueAuth from "@websanova/vue-auth"
import VueCookie from 'vue-cookie'
import AsyncData from './plugins/asyncData'
// import VueSimplemde from 'vue-simplemde'
// import markdownEditor from 'vue-simplemde/src/markdown-editor.vue'

const VueScrollTo = require('vue-scrollto')
const {app, router, store, i18n} = createApp()

// Vue.use(VueSimplemde)
Vue.use(VueScrollTo, {
  duration: 500,
  easing: "ease",
  offset: -70
})

// Vue.component('markdownEditor', markdownEditor)

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0)
  next()
})
router.onReady(() => {
  if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
  }

  store.dispatch('core/startNowInterval')

  Vue.router = router
  Vue.use(VueCookie)
  Vue.use(VueAuth, {
    auth: require('./containers/auth/tokenBehaviour'),
    http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
    router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
    rolesVar: 'role',
    tokenStore: ['localStorage'],
    authRedirect: {path: '/auth'},
    loginData: {
      url: 'users/login',
      method: 'POST',
      redirect: '/auth',
      fetchUser: true
    },
    parseUserData: function(data) {
      return data
    },
    fetchData: {
      url: 'users/current',
      method: 'GET',
      enabled: true
    },
    refreshData: {
      url: 'users/refresh',
      method: 'GET',
      enabled: true
    }
  })


  Vue.use(AsyncData, {store})

  app.$mount('#app')
})