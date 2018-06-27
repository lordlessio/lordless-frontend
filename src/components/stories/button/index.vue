<template>
  <button class="button-styles" :class="`theme-${theme}`" @click.stop="onClick">
    <slot></slot>
  </button>
</template>

<script>
  export default {
    name: 'my-button',

    props: {
      theme: {
        type: String,
        default: 'default'
      }
    },
    methods: {
      onClick () {
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss">
  .button-styles {
    border-radius: 3px;
    font-size: 15pt;
    padding: 3px 10px;
    margin: 10px;
    border-width: 1px;
    border-style: solid;
    font-weight: inherit;
    cursor: pointer;
    svg {
      fill: inherit;
    }
    &.theme-default {
      border-color: #eee;
      background-color: #FFFFFF;
      fill: #373737;
    }
    &.theme-info-1 {
      color: #101010;
      border: none;
      background-color: #FAD054;
      fill: #101010;
    }
    &.theme-info-2 {
      color: #fff;
      border: none;
      background-color: #5AC9B6;
      fill: #fff;
    }
    &.theme-info-3 {
      color: #fff;
      border: none;
      background-color: #ef7a82;
      fill: #fff;
    }
    &.theme-info {
      color: #6732F4;
      border: none;
      // background-image: linear-gradient(-90deg, #BB9BF1 0%, #887BF2 100%);
      // background-color: #fff;
      box-shadow: 8px 12px 52px 0 rgba(255, 255, 255, 0.25);
      fill: #724AF9;
    }
    &.theme-buy {
      color: #fff;
      border: none;
      background-image: linear-gradient(-45deg, #B24AFF 0%, #F956E8 100%);
      box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      fill: #fff;
    }
  }
</style>
