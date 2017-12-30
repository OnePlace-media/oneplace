// store.js
import Vue from 'vue'
const Vuex = require('vuex')

Vue.use(Vuex)

export function createStore() {
  return new Vuex.Store({
    state: require('./state').default,
    actions: require('./actions').default,
    mutations: require('./mutations').default,
    getters: require('./getters').default
  })
}