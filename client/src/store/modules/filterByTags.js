import Api from '../../plugins/api'
import CONSTANTS from '@oneplace/constants'
import moment from 'moment'
import Vue from 'vue'

const TYPES = {
  CLEAR_ALL_DATA: 'CLEAR_ALL_DATA',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
  SET_MODAL_SHOW: 'SET_MODAL_SHOW',
  ADD_TAG: 'ADD_TAG',
  REMOVE_TAG: 'REMOVE_TAG'
}


function createState() {
  return {
    modalShow: false,
    include: {},
    exclude: {}
  }
}
export default () => {
  const state = createState()

  const mutations = {
    [TYPES.CLEAR_ALL_DATA](state) {
      Vue.set(state, 'modalShow', false)
      Vue.set(state, 'include', {})
      Vue.set(state, 'exclude', {})
    },
    [TYPES.CLEAR_FILTERS](state) {
      Vue.set(state, 'include', {})
      Vue.set(state, 'exclude', {})
    },
    [TYPES.SET_MODAL_SHOW](state, flag) {
      state.modalShow = flag
    },
    [TYPES.ADD_TAG](state, tag) {
      if (!state.exclude[tag.text]) {
        if (state.include[tag.text]) Vue.delete(state.include, tag.text)
        else Vue.set(state.include, tag.text, true)
      }
      Vue.delete(state.exclude, tag.text)
    },
    [TYPES.REMOVE_TAG](state, tag) {
      Vue.set(state.exclude, tag.text, true)
      Vue.delete(state.include, tag.text)
    }
  }

  const actions = {
    add({commit}, {chain, username}) {

    }
  }

  return {
    namespaced: true,
    state,
    actions,
    mutations
  }
}