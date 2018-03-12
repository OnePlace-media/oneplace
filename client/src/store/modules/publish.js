import Api from '../../plugins/api'
const CONSTANTS = require('@oneplace/constants')

const TYPES = {
  INIT_FORM_OBJECT: 'INIT_FORM_OBJECT',
  SET_FORM_OBJECT: 'SET_FORM_OBJECT',
  SET_DRAFTS_OBJECT: 'SET_DRAFTS_OBJECT',
  SET_DRAFTS_PROCESSING: 'SET_DRAFTS_PROCESSING',
  SET_DRAFTS_COLLECTION: 'SET_DRAFTS_COLLECTION'
}

export default () => {
  const initState = () => {
    return {
      form: {
        chain: null,
        processing: false,
        body: '',
        tags: [],
        rewardsOpts: '50',
        upVotePost: false
      },
      drafts: {
        loadFromDraft: false,
        active: null,
        processing: false,
        collection: null
      }
    }
  }
  const state = initState()

  const mutations = {
    [TYPES.INIT_FORM_OBJECT](state, params) {
      state.form = initState().form
      state.drafts = initState().drafts
    },
    [TYPES.SET_FORM_OBJECT](state, params) {
      state.form = Object.assign(state.form, params)
    },
    [TYPES.SET_DRAFTS_OBJECT](state, params) {
      state.drafts = Object.assign(state.drafts, params)
    },
    [TYPES.SET_DRAFTS_PROCESSING](state, flag) {
      state.drafts.processing = flag
    },
    [TYPES.SET_DRAFTS_COLLECTION](state, collection) {
      state.drafts.collection = collection
    }
  }

  const actions = {
    initDrafts({commit, state}, {userId}) {
      if (state.drafts.collection === null && userId) {
        commit(TYPES.SET_DRAFTS_OBJECT, {processing: true})
        Api.getDrafts(userId)
          .then(response => {
            commit(TYPES.SET_DRAFTS_OBJECT, {collection: response.data, processing: false})
          })
      }
    },
    saveDraft({commit, state}, {userId}) {
      if (state.form.body && state.form.title) {
        const isNewRecord = state.drafts.active === null
        const {title, body} = state.form
        const result = isNewRecord
          ? Api.createDraft(userId, {title, body})
          : Api.saveDraft(userId, {title, body}, state.drafts.active)

        result
          .then(response => {
            const active = response.data
            const params = {active}
            if (isNewRecord)
              params.collection = state.drafts.collection.concat([response.data])
            else
              params.collection = state.drafts.collection.map(draft => active.id === draft.id ? Object.assign(draft, active) : draft)

            commit(TYPES.SET_DRAFTS_OBJECT, params)
          })
      }
    },
    deleteDraft({commit, state}, {draft}) {
      return Api.deleteDraft(draft)
        .then(response => {
          const collection = state.drafts.collection.filter(_draft => _draft.id !== draft.id)
          commit(TYPES.SET_DRAFTS_OBJECT, {collection})
        })
    },
    submitForm({commit, state}, {account}) {
      commit(TYPES.SET_FORM_OBJECT, {processing: true})
      return Api.savePost(account.username, state.form)
        .then(response => {
          console.log(response)
        })
    }
  }

  return {
    namespaced: true,
    state,
    actions,
    mutations
  }
}