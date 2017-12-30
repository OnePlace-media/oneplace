<style>
.overlay {
  z-index: 99999999;
  background: rgba(255, 255, 2555, 0.7);
  position: absolute;
  width: 100%;
  height: 100%;
}
.overlay .v-spinner{
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -12px;

  margin-left: -28px;
}
</style>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
export default {
  name: 'Loader',
  props: ['loading'],
  data() {
    return {
      color: '#f2f2f2'
    }
  },
  components: {
    PulseLoader
  }
}
</script>

<template>
  <div class="overlay" v-if="loading">
    <pulse-loader :loading="loading" :color="color" size="15px"></pulse-loader>
  </div>
</template>
