import Api from '../../plugins/api'
import getSlug from 'speakingurl'
import base58 from 'bs58'
import secureRandom from 'secure-random'

const CONSTANTS = require('@oneplace/constants')

const TYPES = {
  INIT_FORM_OBJECT: 'INIT_FORM_OBJECT',
  SET_FORM_OBJECT: 'SET_FORM_OBJECT',
  SET_DRAFTS_OBJECT: 'SET_DRAFTS_OBJECT',
  SET_EDITOR_OBJECT: 'SET_EDITOR_OBJECT',
}

const generatePermLink = (chain, data, prefix = '') => {
  if (data.permlink) return Promise.resolve()
  else {
    let permlink = getSlug(data.title.replace(/[<>]/g, ''), {truncate: 128}).toLowerCase()
    if (prefix) permlink = [prefix, permlink].join('-')
    return Api.getContent(chain, data.author, permlink)
      .then(response => {
        const prefix = base58.encode(secureRandom.randomBuffer(4)).toLowerCase()
        return generatePermLink(chain, data, prefix)
      })
      .catch(err => {
        if (err.response && err.response.status === 404) {
          data.permlink = permlink
          return data
        } else
          throw err
      })
  }
}

export default () => {
  const initState = () => {
    return {
      editor: {
        showModalImage: false,
        showModalLink: false,
        startCursor: {line: 0, ch: 0, sticky: null},
        endCursor: {line: 0, ch: 0, sticky: null}
      },
      form: {
        chain: null,
        processing: false,
        permlink: null,
        body: '',
        title: '',
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
    [TYPES.SET_EDITOR_OBJECT](state, params) {
      state.editor = Object.assign(state.editor, params)
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

            params.collection.sort((a, b) => a.time - b.time)
            commit(TYPES.SET_DRAFTS_OBJECT, params)
          })
      }
    },
    createDraft({commit, state}) {
      commit(TYPES.SET_DRAFTS_OBJECT, {loadFromDraft: false, active: null})
      commit(TYPES.SET_FORM_OBJECT, {body: '', title: ''})
    },
    deleteDraft({commit, state}, {draft}) {
      return Api.deleteDraft(draft)
        .then(response => {
          const params = {}
          params.collection = state.drafts.collection.filter(_draft => _draft.id !== draft.id)

          if (state.drafts.active && state.drafts.active.id === draft.id) {
            params.active = null
            params.loadFromDraft = false
            commit(TYPES.SET_FORM_OBJECT, {body: '', title: ''})
          }
          commit(TYPES.SET_DRAFTS_OBJECT, params)
        })
    },
    selectDraft({commit, state}, {draft}) {
      const {body, title} = draft

      commit(TYPES.SET_DRAFTS_OBJECT, {loadFromDraft: true, active: draft})
      commit(TYPES.SET_FORM_OBJECT, {body, title})
    },
    submitForm({commit, state}, {chain, account}) {
      commit(TYPES.SET_FORM_OBJECT, {processing: true})
      const data = state.form
      data.author = account.username
      return generatePermLink(chain, data)
        .then(() => Api.savePost(chain, account.username, state.form))
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