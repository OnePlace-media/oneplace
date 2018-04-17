<script>
const MAX_HEIGHT = 56
export default {
  name: 'Slider',
  props: {
    value: {
      type: Number,
      default: 10000
    }
  },
  data() {
    return {
      height: MAX_HEIGHT,
      isSlide: false
    }
  },
  methods: {
    slide($event) {
      this.$emit('update:value', +$event.target.value)
      this.height = MAX_HEIGHT / 100 * (+$event.target.value / 100)
    }
  },
  created() {
    this.slide({ target: { value: this.value } })
  }
}
</script>

<style>
.range-slider .input-range {
  width: 0px;
  z-index: 9999999999999999;
  -webkit-appearance: none;
  height: 70px;
  margin-top: -5px;
  opacity: 0;
  position: absolute;
  border-radius: 5px;
  background: #ffffff;
  outline: none;
  -webkit-writing-mode: bt-lr;
  -ms-writing-mode: bt-lr;
  writing-mode: bt-lr;
  -webkit-appearance: slider-vertical;
}

::-moz-range-track {
  background: #ccc;
  border: 0;
}

input::-moz-focus-inner {
  border: 0;
}
</style>

<template>
<div class="post-view__vote-slider-wrapper" :class="{'post-view__vote-slider-show':isSlide}">
  <div class="post-view__vote-slider range-slider" title="Set vote weight">
    <div class="post-view__vote-slider-bar" id="post-view__vote-slider-bar">
      <input 
        type="range" 
        orient="vertical" 
        class="input-range" 
        min="100" 
        step="100"
        max="10000" 
        :value="value" 
        @input="slide" @change="slide" 
        @mousedown="isSlide = true" 
        @mouseup="isSlide = false"
      />
      <div class="post-view__vote-slider-fill" :style="`height: ${height}px;`"></div>
      <div class="post-view__vote-slider-handle" :style="`bottom: ${height}px;`"></div>
    </div>
  </div>
</div>
</template>
