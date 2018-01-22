// store.js
import Vue from 'vue'
import Vuex from 'vuex'
import core from './modules/core'
Vue.use(Vuex)


export function createStore() {
  return new Vuex.Store({
    modules:{
      core
    },
    state: require('./state').default,
    actions: require('./actions').default,
    mutations: require('./mutations').default,
    getters: require('./getters').default
  })
}