<template>
  <button :disabled="disabled" class="button-styles" :class="`${theme} ${shadow ? 'shadow' : ''}`" @click.stop="onClick">
    <slot></slot>
  </button>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { actionTypes } from '@/store/types'
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

      // 是否需要调用合约
      contract: {
        type: Boolean,
        default: false
      },

      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapState('user', [
        'userInfo'
      ])
    },
    methods: {
      ...mapActions('user', [
        actionTypes.USER_META_LOGIN
      ]),
      onClick () {
        if (this.contract && !this.userInfo.address) {
          this[actionTypes.USER_META_LOGIN]()
          return
        }
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
    padding: 3px 10px;
    margin: 10px;
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
    &.info-1 {
      color: #101010;
      border: none;
      background-color: #FAD054;
      fill: #101010;
      &.shadow {
        box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
    }
    &.info-2 {
      color: #fff;
      border: none;
      background-color: #5AC9B6;
      fill: #fff;
      &.shadow {
        box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
    }
    &.info-3 {
      color: #fff;
      border: none;
      background-color: #ef7a82;
      fill: #fff;
      &.shadow {
        box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
    }
    &.info {
      color: #6732F4;
      border: none;
      // background-image: linear-gradient(-90deg, #BB9BF1 0%, #887BF2 100%);
      background-color: #fff;
      box-shadow: 8px 12px 52px 0 rgba(255, 255, 255, 0.25);
      fill: #724AF9;
      &.shadow {
        box-shadow: 8px 16px 22px 0 rgba(87, 14, 192, 0.25);
      }
      &:disabled {
        color: #a386f0;
        fill: #a386f0;
        background-color: #f1f1f1;
        box-shadow: 4px 8px 11px 0 rgba(87, 14, 192, 0.25);
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
