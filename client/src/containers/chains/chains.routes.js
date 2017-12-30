
const CONSTANTS = require('@oneplace/constants')
const postViewComponents = {}
import Trend from './Trend.vue'
import Post from './Post.vue'

export default [{
  name: 'chain-trend',
  path: `:chain(${CONSTANTS.BLOCKCHAIN.SOURCE.STEEM}|${CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS})`,
  component: Trend,
  meta: {
    title: ''
  }
}, {
  name: 'chain-post-view',
  path: `:chain(${CONSTANTS.BLOCKCHAIN.SOURCE.STEEM}|${CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS})/@:username/:permlink`,
  component: Post,
  meta: {
    title: ''
  }
}]
