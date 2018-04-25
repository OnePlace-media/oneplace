// store.js
import Vue from 'vue'
import Vuex from 'vuex'
import core from './modules/core'
import profile from './modules/profile'
import publish from './modules/publish'
import feed from './modules/feed'
import tag from './modules/tag'
import state from './state'

Vue.use(Vuex)


export function createStore() {
  return new Vuex.Store({
    modules: {
      core: core(),
      profile: profile(),
      tag: tag(),
      publish: publish(),
      feed: feed()
    },
    state: state(),
    actions: require('./actions').default,
    mutations: require('./mutations').default,
    getters: require('./getters').default
  })
}