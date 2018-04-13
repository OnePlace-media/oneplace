<template>
  <div>
    <div class="register__steps-wrapper">
      <welcome-step-bar :step="step"></welcome-step-bar>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { WELCOME } from '@oneplace/constants'
import WelcomeStepBar from '../../components/welcome/WelcomeStepBar.vue'

const STEPS = {
  'welcome-step-attach': WELCOME.STEPS.ATTACH,
  'welcome-step-confirm': WELCOME.STEPS.CONFIRM,
  'welcome-step-tags': WELCOME.STEPS.TAGS
}
export default {
  name: 'Welcome',
  components: {
    WelcomeStepBar
  },
  beforeRouteLeave(to, from, next) {
    this.$auth.fetch({
      success: () => next()
    })
  },
  computed: {
    step() {
      return STEPS[this.$route.name]
    }
  }
}
</script>