import CONSTANTS from '@oneplace/constants'

export default {
  page404Flag: false,
  chain: null,
  $router: {
    from: null
  },
  user: {
    accounts: {
      [CONSTANTS.BLOCKCHAIN.SOURCE.STEEM]: {
        items: [],
        active: null
      },
      [CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS]: {
        items: [],
        active: null
      }
    },
    dropDownOpen: false
  },
  trends: {
    activeTag: null,
    data: {
      [CONSTANTS.BLOCKCHAIN.SOURCE.STEEM]: {
        processing: false,
        collection: []
      },
      [CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS]: {
        processing: false,
        collection: []
      }
    }
  },
  welcome: {
    step: CONSTANTS.WELCOME.STEPS.ATTACH_CHAIN,
    chain: null
  },
  tagsForm: {
    chain: null,
    storages: {
      [CONSTANTS.BLOCKCHAIN.SOURCE.STEEM]: [],
      [CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS]: []
    }
  },
  accountForm: {
    chain: null
  },
  postView: {
    post: null,
    replies: [],
    processing: false,
    repliesProcessing: false
  }
}