
const CONSTANTS = require('@oneplace/constants')
const postViewComponents = {}
import Trend from './Trend.vue'
import Post from './Post.vue'
import Profile from './Profile.vue'
import Feed from './Feed.vue'
import Tag from './Tag.vue'

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
    name: 'chain-account-feed',
    path: `:chain(${CONSTANTS.BLOCKCHAIN.SOURCE.STEEM}|${CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS})/@:username/feed`,
    component: Feed
  },
  {
    name: 'chain-post-view',
    path: `:chain(${CONSTANTS.BLOCKCHAIN.SOURCE.STEEM}|${CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS})/@:username/:permlink`,
    component: Post
  },
  {
    name: 'chain-tag-view',
    path: `:chain(${CONSTANTS.BLOCKCHAIN.SOURCE.STEEM}|${CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS})/tag/:tag`,
    component: Tag
  }
]
