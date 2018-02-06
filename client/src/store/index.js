// store.js
import Vue from 'vue'
import Vuex from 'vuex'
import core from './modules/core'
import profile from './modules/profile'
import state from './state'

Vue.use(Vuex)


export function createStore() {
  return new Vuex.Store({
    modules: {
      core: core(),
      profile: profile()
    },
    state: state(),
    actions: require('./actions').default,
    mutations: require('./mutations').default,
    getters: require('./getters').default
  })
}