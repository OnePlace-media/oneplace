
const CONSTANTS = require('@oneplace/constants')
const postViewComponents = {}
import Trend from './Trend.vue'
import Post from './Post.vue'
import Profile from './Profile.vue'
import PostCreate from './PostCreate.vue'
import Tag from './Tag.vue'

export default [
  {
    name: 'chain-trend',
    path: `:chain(${CONSTANTS.BLOCKCHAIN.SOURCE.STEEM}|${CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS})`,
    component: Trend
  },
  // {
  //   name: 'chain-post-create',
  //   path: `:chain(${CONSTANTS.BLOCKCHAIN.SOURCE.STEEM}|${CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS})/create`,
  //   component: PostCreate
  // },
  {
    name: 'chain-account-view',
    path: `:chain(${CONSTANTS.BLOCKCHAIN.SOURCE.STEEM}|${CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS})/@:username`,
    component: Profile
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
