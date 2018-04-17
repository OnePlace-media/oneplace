<script>
import TopBar from '../../components/common/TopBar.vue'
import SideBar from '../../components/common/SideBar.vue'
import FooterBar from '../../components/common/FooterBar.vue'
import PostModal from '../../components/chains/post/PostModal.vue'
import NotFound from '../../containers/NotFound.vue'
import FooterMini from '../../components/common/FooterMini.vue'

export default {
  name: 'MainLayout',
  components: {
    TopBar,
    SideBar,
    FooterBar,
    FooterMini,
    PostModal,
    NotFound
  },
  computed: {
    page404Flag() {
      return this.$store.state.page404Flag
    }
  }
}
</script>

<template>
  <div id="app" v-if="!page404Flag" data-server-rendered="true">
    <div class="wrapper">
      <top-bar></top-bar>
      <side-bar></side-bar>
      <router-view></router-view>
      <footer-bar></footer-bar>
    </div>
    <post-modal></post-modal>
  </div>
  
  <div id="app" class="wrapper" v-else data-server-rendered="true">
    <div class="login__wrapper">
      <router-link :to="{name:'chain-trend', params:{chain:'s'}}" tag="div" class="login__logo">
        <img src="/static/img/logo.svg" alt="OnePlace" class="img-responsive">
      </router-link>
      <not-found></not-found>
    </div>
    <footer-mini></footer-mini>
  </div>
</template>