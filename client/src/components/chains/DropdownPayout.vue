<script>
import CONSTANTS from '@oneplace/constants'
import moment from 'moment'

export default {
  name: 'DropdownPayout',
  props: ['post', 'chain'],
  computed: {
    now() {
      return this.$store.state.core.now
    },
    havePayoutPending() {
      const daysAfterCreated = moment().diff(moment(this.post.created), 'days')
      return (
        daysAfterCreated <
        CONSTANTS.BLOCKCHAIN.MAX_PAYOUT_PENDING_DAYS[this.chain]
      )
    },
    havePayout() {
      return !!moment(this.post.last_payout).unix()
    },
    payoutPendingTimeMoment() {
      const end = moment(this.post.cashout_time)
      const start = moment.unix(this.now)
      return end.from(start)
    },
    pendingPayout() {
      const isGolos = this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS
      const result = []
      if (isGolos) {
        result.push(this.$n(this.post.pending_payout, 'currency', 'ru'))
        result.push(`(${this.post.pending_payout_value} GBG)`)
      } else {
        result.push(`${this.post.pending_payout_value} SBD`)
      }
      return result.join(' ')
    },
    readyPayout() {
      const isGolos = this.chain === CONSTANTS.BLOCKCHAIN.SOURCE.GOLOS
      const result = []
      if (isGolos) {
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
  <div class="post-view__pending-payout dropdown" :now="now">
    <i18n path="chains.pendingPayout" tag="p" v-if="havePayoutPending">
      <span place="payout" class="currency">{{pendingPayout}}</span>
      <span place="fromNow">{{payoutPendingTimeMoment}}</span>
    </i18n>
    <i18n path="chains.readyPayout" tag="p" v-if="havePayout">
      <span place="payout" class="currency">{{readyPayout}}</span>
    </i18n>
  </div>
</template>

