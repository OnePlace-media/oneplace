import Vue from 'vue'
const CONSTANTS = require('@oneplace/constants')
export default class Chains {
  static install() {
    const client = require('steem/lib/browser')
    const SteemUrl = `https://${process.env.STEEM_DOMAIN}`
    const GolosUrl = `https://${process.env.GOLOS_DOMAIN}`
    client.api.setOptions({url: SteemUrl})

    Vue.prototype.$chains = {
      client: client,
      setChain(chain) {
        if (chain === CONSTANTS.BLOCKCHAIN.SOURCE.STEEM) {
          client.api.setOptions({url: SteemUrl})
          client.config.set('address_prefix', 'STM')
          client.config.set('chain_id', '0000000000000000000000000000000000000000000000000000000000000000')
        } else {
          client.api.setOptions({url: GolosUrl})
          client.config.set('address_prefix', 'GLS')
          client.config.set('chain_id', '782a3039b478c839e4cb0c941ff4eaeb7df40bdd68bd441afd444b9da763de12')
        }
      }
    }
  }
}
