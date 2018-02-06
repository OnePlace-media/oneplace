import Vue from 'vue'
import {createApp} from './app'
import VueAuth from "@websanova/vue-auth"
import VueCookie from 'vue-cookie'
const VueScrollTo = require('vue-scrollto')
const {app, router, store, i18n} = createApp()
Vue.use(VueScrollTo, {
  duration: 500,
  easing: "ease",
  offset: -70
})


router.onReady(() => {
  if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
  }

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


  Vue.mixin({
    beforeRouteUpdate(to, from, next) {
      const {asyncData} = this.$options
      if (asyncData) {
        asyncData({
          store: store,
          route: to
        })
      }
      next()
    },
    beforeMount() {
      const {asyncData} = this.$options
      if (asyncData) {
        this.dataPromise = asyncData({
          store: store,
          route: this.$route
        })
      }
    }
  })

  app.$mount('#app')
})