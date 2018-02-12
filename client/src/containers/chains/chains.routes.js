
const CONSTANTS = require('@oneplace/constants')
const postViewComponents = {}
import Trend from './Trend.vue'
import Post from './Post.vue'
import Profile from './Profile.vue'

export default [
  {
    name: 'chain-trend',
    path: `:chain(${CONSTANTS.BLOCKCHAIN.SOURCE.STEEM}|${CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS})`,
    component: Trend
  },
  {
    name: 'chain-account-view',
    path: `:chain(${CONSTANTS.BLOCKCHAIN.SOURCE.STEEM}|${CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS})/@:username`,
    component: Profile
  },
  {
    name: 'chain-post-view',
    path: `:chain(${CONSTANTS.BLOCKCHAIN.SOURCE.STEEM}|${CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS})/@:username/:permlink`,
    component: Post
  }
]
