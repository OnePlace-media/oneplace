<template>
  <div class="register__steps-wrapper">
    <div class="register__steps">
      <div class="register__step register__step--done">
        1. {{$t('welcome.createRegistration')}}
      </div>
      <div class="register__step" :class="{'register__step--done': attachStepDone, 'register__step--current': attachStepCurrent}">
        2. {{$t('welcome.addSteemOrGolosAccount')}}
      </div>
      <div class="register__step" :class="{'register__step--current': tagsStepCurrent}">
        3. {{$t('welcome.setUpCategories')}}
      </div>
    </div>
  </div>
</template>

<script>
import { WELCOME } from '@oneplace/constants'

export default {
  name: 'WelcomeStepBar',
  props: {
    step: {
      type: Number,
      required: true
    }
  },
  computed: {
    attachStepDone() {
      return this.step > WELCOME.STEPS.CONFIRM
    },
    attachStepCurrent() {
      return ~[WELCOME.STEPS.ATTACH, WELCOME.STEPS.CONFIRM].indexOf(this.step)
    },
    tagsStepCurrent() {
      return this.step === WELCOME.STEPS.TAGS
    }
  }
}
</script>
