<template>
  <button role="button" aria-label="click" :disabled="disabled" class="button-styles" :class="[`${theme}`, { 'shadow': shadow, 'inverse': inverse, 'none-radius': !radius }]" @click.stop="onClick">
    <slot v-if="!loading"></slot>
    <span v-if="loading">
      <i class="el-icon-loading"></i>
    </span>
  </button>
</template>

<script>
  export default {
    name: 'lordless-btn',

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
      },

      radius: {
        type: Number,
        default: 5
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
    font-size: 16px;
    border-style: solid;
    font-family: $--font-TTNormsBold;
    font-weight: inherit;
    white-space: nowrap;
    outline: none;
    border-radius: 5px;
    // border-width: 1px;
    border: none;
    cursor: pointer;
    svg {
      fill: inherit;
    }
    a {
      color: inherit;
    }
    &.none-radius {
      border-radius: 0;
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
    &.blue-purple {
      color: $--text-blue-purple-color;
      border: none;
      // background-image: linear-gradient(-90deg, #BB9BF1 0%, #887BF2 100%);
      background-color: #fff;
      fill: $--text-blue-purple-color;
      &.shadow {
        box-shadow: 2.5px 5px 10px 0 rgba(0, 0, 0, .25);
        // box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
      &.inverse {
        color: #fff;
        background-color: $--text-blue-purple-color;
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
    &.red {
      color: $--text-red-color;
      border: none;
      // background-image: linear-gradient(-90deg, #BB9BF1 0%, #887BF2 100%);
      background-color: #fff;
      fill: $--text-red-color;
      &.shadow {
        box-shadow: 2.5px 5px 10px 0 rgba(0, 0, 0, .25);
        // box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
      &.inverse {
        color: #fff;
        background-color: #EB8785;
        fill: #fff;
      }
    }
    &.promotion {
      font-family: inherit;
      color: #fff;
      background-image: linear-gradient(-45deg, #F5515F 0%, #D1001F 100%);
    }
    &.blue-linear {
      color: #fff;
      fill: #fff;
      background-image: linear-gradient(-225deg, #124BDC 0%, #0079FF 100%);
      &.shadow {
        box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, .15);
        // box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
      &.inverse {
        color: #0079FF;
        background-color: #fff;
        background-image: none;
      }
    }
    &.red-linear {
      color: #fff;
      background-image: linear-gradient(45deg, #D1001F 0%, #F5515F 100%);
      fill: #fff;
      &.shadow {
        box-shadow: 2.5px 5px 10px 0 rgba(0, 0, 0, .25);
        // box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
      &.inverse {
        color: #F5515F;
        background-color: #fff;
        fill: #F5515F;
      }
    }
    &.purple-linear {
      color: #fff;
      background-image: linear-gradient(-45deg, #7D72F0 0%, #1613B0 100%);
      fill: #fff;
      &.shadow {
        box-shadow: 2.5px 5px 10px 0 rgba(0, 0, 0, .25);
        // box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
      &.inverse {
        color: #7D72F0;
        background-color: #fff;
        fill: #7D72F0;
      }
    }
    &.dialog {
      color: $--dialog-btn-color;
      background-color: #fff;
      fill: $--dialog-btn-color;
      &.shadow {
        box-shadow: 2.5px 5px 10px 0 rgba(0, 0, 0, .25);
        // box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
      &.inverse {
        color: #fff;
        background-color: $--dialog-btn-color;
        fill: #fff;
      }
    }
    &.glossary {
      color: #0B2A48;
      background-color: #fff;
      fill: #0B2A48;
      &.shadow {
        box-shadow: 2.5px 5px 10px 0 rgba(0, 0, 0, .25);
        // box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
      &.inverse {
        color: #fff;
        background-color: #0B2A48;
        fill: #fff;
      }
    }
    &.yellow {
      color: #555;
      fill: #555;
      background-color: #FFCC66;
      &.shadow {
        box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, .15);
        // box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
      &.inverse {
        color: #FFCC66;
        background-color: #fff;
        background-image: none;
      }
    }
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
      position: relative;
      cursor: no-drop;
      &.shadow {
        box-shadow: none;
        // box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, .7);
        cursor: no-drop;
        border-radius: inherit;
      }
    }
  }
</style>
