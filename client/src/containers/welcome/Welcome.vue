<template>
  <div>
    <div class="register__steps-wrapper">
      <div class="register__steps">
        <div class="register__step register__step--done">1. Create registration</div>
        <div class="register__step" :class="{'register__step--done': step === STEPS.SETUP_TAGS, 'register__step--current': ~[STEPS.CHOOSE_CHAIN,STEPS.ATTACH_CHAIN].indexOf(step)}">2. Add Steem or Golos account</div>
        <div class="register__step" :class="{'register__step--current': step === STEPS.SETUP_TAGS}">3. Set up categories</div>
      </div>
    </div>
    <attach-chain-step v-if="step === STEPS.ATTACH_CHAIN"></attach-chain-step>
    <setup-tags-step v-if="step === STEPS.SETUP_TAGS"></setup-tags-step>
  </div>
</template>

<script>
import AttachChainStep from './AttachChainStep.vue'
import SetupTagsStep from './SetupTagsStep.vue'
import CONSTANTS from '@oneplace/constants'
import Vue from 'vue'

export default {
  name: 'Welcome',
  components: {
    AttachChainStep,
    SetupTagsStep
  },
  beforeRouteLeave(to, from, next) {
    this.$auth.fetch({
      success: () => next()
    })
  },
  computed: {
    chain() {
      return this.$store.state.welcome.chain
    },
    step() {
      return this.$store.state.welcome.step
    },
    STEPS() {
      return CONSTANTS.WELCOME.STEPS
    }
  }
}
</script>