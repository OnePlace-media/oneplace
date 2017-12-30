<template>
  <footer class="footer footer--lite">
    <div class="container footer__wrapper">
      <div class="footer__lang-switch">
        <span class="footer__lang" :class="{'footer__lang--active':$locale.check('en')}" @click="$locale.change('en')">English</span>
        <span class="footer__lang" :class="{'footer__lang--active':$locale.check('ru')}" @click="$locale.change('ru')">Русский</span>
      </div>
    </div>
  </footer>
</template>
