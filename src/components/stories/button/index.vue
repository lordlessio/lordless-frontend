<template>
  <button :disabled="disabled" class="button-styles" :class="[`${theme}`, { 'shadow': shadow, 'inverse': inverse }]" @click.stop="onClick">
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
      },

      shadow: {
        type: Boolean,
        default: false
      },

      inverse: {
        type: Boolean,
        default: false
      },

      disabled: {
        type: Boolean,
        default: false
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
  @import '@/assets/stylus/mixin/color_mixin.scss';
  .button-styles {
    border-radius: 3px;
    font-size: 15pt;
    border-width: 1px;
    border-style: solid;
    font-weight: inherit;
    cursor: pointer;
    white-space: nowrap;
    outline: none;
    svg {
      fill: inherit;
    }
    &:disabled {
      cursor: no-drop;
    }
    &.default {
      border-color: #eee;
      background-color: #FFFFFF;
      fill: #373737;
      &.shadow {
        box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
    }
    &.info {
      color: #6732F4;
      border: none;
      // background-image: linear-gradient(-90deg, #BB9BF1 0%, #887BF2 100%);
      background-color: #fff;
      fill: #724AF9;
      &.shadow {
        box-shadow: 2.5px 5px 10px 0 rgba(0, 0, 0, .25);
        // box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
      &:disabled {
        color: #a386f0;
        fill: #a386f0;
        background-color: #f1f1f1;
        box-shadow: 1.25px 2.5px 5px 0 rgba(0, 0, 0, .25);
        // box-shadow: 4px 8px 11px 0 rgba(87, 14, 192, 0.25);
      }
      &.inverse {
        color: #fff;
        background-color: #724AF9;
        fill: #fff;
        &:disabled {
          color: #ddd;
          fill: #ddd;
          background-color: #a386f0;
          box-shadow: 1.25px 2.5px 5px 0 rgba(0, 0, 0, .25);
          // box-shadow: 4px 8px 11px 0 rgba(87, 14, 192, 0.25);
        }
      }
    }
    &.pink {
      color: #fff;
      border: none;
      background-image: linear-gradient(to right, #F956E8 0%, #B24AFF 100%);
      fill: #fff;
      &.shadow {
        box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
    }
    &.pink-gray {
      color: #fff;
      border: none;
      background-image: linear-gradient(to right, #ffbebe 0%, #c87eff 100%);
      fill: #fff;
      &.shadow {
        box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
    }
    &.purple-gradient {
      color: #fff;
      border: none;
      background-image: linear-gradient(to right, #BB9BF1 0%, #887BF2 100%);
      fill: #fff;
      &.shadow {
        box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
      &:disabled {
        background-image: linear-gradient(to right, #d7c3f8 0%, #bab2f6 100%);
        box-shadow: 4px 8px 11px 0 rgba(87, 14, 192, 0.25);
      }
    }
    &.purple {
      color: #fff;
      border: none;
      background-color: $--secondary-color;
      fill: #fff;
      &.shadow {
        box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
      &:disabled {
        background-color: #bcb5ff;
        box-shadow: 4px 8px 11px 0 rgba(87, 14, 192, 0.25);
      }
    }
  }
</style>
