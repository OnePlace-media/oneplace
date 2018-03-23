<template>
  <span>{{timeAgoString}}</span>
</template>

<script>
import timeago from 'timeago.js'
import moment from 'moment'
timeago.register('ru', require('timeago.js/locales/ru.js'))

const timeagoInstance = timeago()
export default {
  name: 'TimeAgo',
  props: {
    time: {
      type: String,
      required: true
    }
  },
  computed: {
    timeAgoString() {
      timeagoInstance.setLocale(this.$locale.current())

      return timeagoInstance.format((/^\d+$/.test(this.time) ? this.time : moment(this.time).unix()) * 1000)
    }
  }
}
</script>
