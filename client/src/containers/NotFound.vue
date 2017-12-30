<template>
  <div class="error-block--404 error-block" id="error-block--404-key">
    <router-link :to="{name:'chain-trend', params:{chain:'g'}}" class="error-block__back link">{{$t('common.returnToOnePlace')}}</router-link>
  </div>
</template>

<script>
export default {
  asyncData({ store, route }) {
    return new Promise((resolve, reject) => {
      resolve(404)
    })
  }
}
</script>
