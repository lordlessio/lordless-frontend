<template>
  <button :disabled="disabled" class="button-styles" :class="[`${theme}`, { 'shadow': shadow, 'inverse': inverse }]" @click.stop="onClick">
    <slot v-if="!loading"></slot>
    <span v-if="loading">
      <i class="el-icon-loading"></i>
    </span>
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
      },

      loading: {
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
  @import '@/assets/stylus/mixin/index.scss';
  .button-styles {
    font-size: 16px;
    border-style: solid;
    font-family: $--font-TTNormsBold;
    font-weight: inherit;
    white-space: nowrap;
    outline: none;
    border-radius: 5px;
    border-width: 1px;
    cursor: pointer;
    svg {
      fill: inherit;
    }
    &.inherit {
      &.shadow {
        box-shadow: 2.5px 5px 10px 0 rgba(0, 0, 0, .25);
      }
    }
    &.default {
      border-color: #eee;
      background-color: #FFFFFF;
      fill: #373737;
      &.shadow {
        box-shadow: 2.5px 5px 10px 0 rgba(0, 0, 0, .25);
      }
    }
    &.deep-blue {
      color: $--text-deep-blue-color;
      border: none;
      // background-image: linear-gradient(-90deg, #BB9BF1 0%, #887BF2 100%);
      background-color: #fff;
      fill: $--text-deep-blue-color;
      &.shadow {
        box-shadow: 2.5px 5px 10px 0 rgba(0, 0, 0, .25);
        // box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
      &.inverse {
        color: #fff;
        background-color: $--text-deep-blue-color;
        fill: #fff;
      }
    }
    &.blue {
      color: $--text-blue-color;
      border: none;
      // background-image: linear-gradient(-90deg, #BB9BF1 0%, #887BF2 100%);
      background-color: #fff;
      fill: $--text-blue-color;
      &.shadow {
        box-shadow: 2.5px 5px 10px 0 rgba(0, 0, 0, .25);
        // box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
      &.inverse {
        color: #fff;
        background-color: $--text-blue-color;
        fill: #fff;
      }
    }
    &.green {
      color: #69D1C3;
      border: none;
      // background-image: linear-gradient(-90deg, #BB9BF1 0%, #887BF2 100%);
      background-color: #fff;
      fill: #69D1C3;
      &.shadow {
        box-shadow: 2.5px 5px 10px 0 rgba(0, 0, 0, .25);
        // box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
      &.inverse {
        color: #fff;
        background-color: #69D1C3;
        fill: #fff;
      }
    }
    // &.red {
    //   color: #EB8785;
    //   border: none;
    //   // background-image: linear-gradient(-90deg, #BB9BF1 0%, #887BF2 100%);
    //   background-color: #fff;
    //   fill: #EB8785;
    //   &.shadow {
    //     box-shadow: 2.5px 5px 10px 0 rgba(0, 0, 0, .25);
    //     // box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
    //   }
    //   &.inverse {
    //     color: #fff;
    //     background-color: #EB8785;
    //     fill: #fff;
    //   }
    // }
    // &.pink {
    //   color: #fff;
    //   border: none;
    //   background-image: linear-gradient(to right, #F956E8 0%, #B24AFF 100%);
    //   fill: #fff;
    //   &.shadow {
    //     box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
    //   }
    // }
    // &.pink-gray {
    //   color: #fff;
    //   border: none;
    //   background-image: linear-gradient(to right, #ffbebe 0%, #c87eff 100%);
    //   fill: #fff;
    //   &.shadow {
    //     box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
    //   }
    // }
    // &.purple-gradient {
    //   color: #fff;
    //   border: none;
    //   background-image: linear-gradient(to right, #BB9BF1 0%, #887BF2 100%);
    //   fill: #fff;
    //   &.shadow {
    //     box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
    //   }
    // }
    // &.purple {
    //   color: #fff;
    //   border: none;
    //   background-color: $--secondary-color;
    //   fill: #fff;
    //   &.shadow {
    //     box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
    //   }
    // }
    &:disabled {
      opacity: .5;
      cursor: no-drop;
    }
  }
</style>
