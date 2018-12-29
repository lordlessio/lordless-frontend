<template>
  <router-link to="/" class="inline-block header-logo" :class="[theme, { 'shadow': shadow, 'reverse': reverse }]">
    <svg class="inline-block">
      <use xlink:href="#icon-logo-image"/>
    </svg>
  </router-link>
</template>

<script>
export default {
  name: 'lordless-header-logo',
  props: {
    theme: {
      type: String,
      default: 'dark'
    },
    shadow: {
      type: Boolean,
      default: false
    },
    reverse: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .header-logo {
    position: relative;
    // height: 80px;
    // line-height: 80px;
    transition: all .15s ease-out .15s;
    padding: 11px;
    width: 54px;
    height: 54px;
    border-radius: 100%;
    box-sizing: border-box;
    @include grid('padding', 6px, -1);
    @include grid('width', 40px, -1);
    @include grid('height', 40px, -1);
    &::before {
      content: 'BETA';
      position: absolute;
      right: 0;
      top: 3px;
      font-family: $--font-TTNormsBold;
      font-size: 12px;
      padding: 3px;
      background-color: #fff;
      border-radius: 2px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, .25);
      transform: scale(.75) translateX(60%);
      @include grid('transform', scale(.6) translateX(80%), -1);
    }
    svg {
      fill: inherit;
      width: 100%;
      height: 100%;
    }
    // &.deep-blue {
    //   background-color: $--text-deep-blue-color;
    //   fill: #fff;
    //   color: $--text-deep-blue-color;
    //   &.reverse {
    //     background-color: #fff;
    //     fill: $--text-deep-blue-color;
    //     color: $--text-deep-blue-color;
    //   }
    // }
    &.dark {
      background-color: #fff;
      fill: #0024FF;
      color: #0024FF;
      &.reverse {
        background-color: #fff;
        fill: #0024FF;
        color: #0024FF;
      }
    }
    &.light {
      background-color: $--text-blue-color;
      fill: #fff;
      color: $--text-blue-color;
      &.reverse {
        background-color: #fff;
        fill: $--text-blue-color;
        color: $--text-blue-color;
      }
    }
    &.shadow {
      box-shadow: 0 0 10px 3px rgba(0, 0, 0, .25);
    }
  }
</style>
