import CONSTANTS from '@oneplace/constants'

export default () => {
  return {
    page404Flag: false,
    chain: null,
    params: {
      [CONSTANTS.BLOCKCHAIN.SOURCE.STEEM]: {
        processing: false,
        time: null,
        feedPrice: {},
        rewardFunds: {},
        globalProps: {}
      },
      [CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS]: {
        processing: false,
        time: null,
        goldPrice: null,
        feedPrice: {},
        rewardFunds: {},
        globalProps: {},
      }
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
      repliesProcessing: false,
      replieDeleteProcessing: false
    }
  }
}