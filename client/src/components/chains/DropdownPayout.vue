<script>
import CONSTANTS from '@oneplace/constants'
import moment from 'moment'

const GOLOS_FIRST_PAYOUT_DAYS = 1

export default {
  name: 'DropdownPayout',
  props: ['post', 'chain'],
  computed: {
    havePayoutPending() {
      const daysAfterCreated = moment().diff(moment(this.post.created), 'days')
      return +this.post.pending_payout && (
        daysAfterCreated <
        CONSTANTS.BLOCKCHAIN.MAX_PAYOUT_PENDING_DAYS[this.chain]
      )
    },
    havePayout() {
      return !!moment(this.post.last_payout).unix()
    },
    payoutPendingDays() {
      const daysAfterCreated = moment().diff(moment(this.post.created), 'days')
      let days =
        CONSTANTS.BLOCKCHAIN.MAX_PAYOUT_PENDING_DAYS[this.chain] -
        daysAfterCreated
      if (this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS && !this.havePayout)
        days = GOLOS_FIRST_PAYOUT_DAYS
      return days
    },
    pendingPayout() {
      const isGolos = this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS
      const result = []
      if(isGolos){
        result.push(this.$n(this.post.pending_payout, 'currency', 'ru'))
        result.push(`(${this.post.pending_payout_value} GBG)`)
      } else {
        result.push(`${this.post.pending_payout_value} SBD`)
      }
      return result.join(' ')
    },
    readyPayout(){
      const isGolos = this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS
      const result = []
      if(isGolos){
        result.push(this.$n(this.post.total_payout, 'currency', 'ru'))
        result.push(`(${this.post.total_payout_value.toFixed(3)} GBG)`)
      } else {
        result.push(`${this.post.total_payout_value.toFixed(3)} SBD`)
      }
      return result.join(' ')
    }
  }
}
</script>

<template>
  <div class="post-view__pending-payout dropdown">
    <i18n path="chains.pendingPayout" tag="p" v-if="havePayoutPending">
      <span place="payout" class="currency">{{pendingPayout}}</span>
      <span place="days">{{$tc('chains.pendingDays', payoutPendingDays, {count: payoutPendingDays})}}</span>
    </i18n>
    <i18n path="chains.readyPayout" tag="p" v-if="havePayout">
      <span place="payout" class="currency">{{readyPayout}}</span>
    </i18n>
  </div>
</template>

