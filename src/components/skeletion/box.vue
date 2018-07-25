<template>
  <div
    v-if="!fading ? value : true"
    class="inherit-box skeletion-breath skeletion-box"
    :class="[{ 'absolute-full': absolute },{ 'fade': fading }, { 'fade-out': fading && !value }, `skeletion-${dark ? 'dark' : 'light'}`]"></div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: true
    },
    absolute: {
      type: Boolean,
      default: false
    },
    dark: {
      type: Boolean,
      default: false
    },
    fading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .skeletion-box {
    &.fade {
      opacity: 1;
      z-index: 999;
      visibility: visible;
      transition: opacity .35s linear, z-index 0s .35s, visibility 0s .35s;
    }
    &.fade-out {
      opacity: 0;
      z-index: -999;
      visibility: hidden;
    }
  }
</style>
