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
    cursor: pointer;
    &.theme-default {
      border-color: #eee;
      background-color: #FFFFFF;
    }
    &.theme-bye {
      color: #fff;
      border: none;
      background-color: #ef7a82;
    }
  }
</style>
