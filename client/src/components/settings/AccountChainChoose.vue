<template>
  <div class="login-form__select-chain">
    <input class="login-form__radio" id="steem-chain" type="radio" name="chain" :value="CHAINS.STEEM" :checked="true" @click="$emit('update:chain', $event.target.value)">
    <label class="login-form__radio-label" :class="{'login-form__radio-label--settings': isSettings}" for="steem-chain">Steem</label>
    <input class="login-form__radio" id="golos-chain" type="radio" name="chain" :value="CHAINS.GOLOS" @click="$emit('update:chain', $event.target.value)">
    <label class="login-form__radio-label login-form__radio-label--settings" for="golos-chain">Golos</label>
  </div>
</template>

<script>
const { BLOCKCHAIN } = require('@oneplace/constants')
export default {
  name: 'ChainChoose',
  props: {
    chain: {
      type: String,
      required: true
    },
    isSettings: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    CHAINS() {
      return BLOCKCHAIN.SOURCE
    }
  }
}
</script>

