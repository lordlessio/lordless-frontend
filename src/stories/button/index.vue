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
    &.theme-info-3, &.theme-buy {
      color: #fff;
      border: none;
      background-color: #ef7a82;
      fill: #fff;
    }
  }
</style>
