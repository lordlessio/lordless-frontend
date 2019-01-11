<template>
  <div class="checkbox-box" :class="[ theme, { 'loading': loading } ]">
    <span class="inline-block checkbox-inner" :class="loading ? 'rotating' : ''" @click.stop="toggleChoose">
      <svg>
        <use :xlink:href="`#${loading ? 'icon-static-loading' : `icon-radio-${(value || choose) ? 'selected' : 'unselected'}`}`"/>
      </svg>
    </span>
  </div>
</template>

<script>
export default {
  name: 'lordless-check-box',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    sync: {
      type: Boolean,
      default: false
    },
    choose: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: 'light'
    }
  },
  data: () => {
    return {}
  },
  methods: {
    toggleChoose () {
      if (this.sync) {
        this.$emit('click', () => {
          this.$emit('input', !this.value)
        })
      } else {
        this.$emit('click')
        this.$emit('input', !this.value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/color_mixin.scss';
  .checkbox-box {
    width: inherit;
    height: inherit;
    line-height: 1;
    &.dark {
      .checkbox-inner {
        fill: #4586FC;
      }
      &.loading {
        .checkbox-inner {
          fill: #0024FF;
        }
      }
    }
    &.light {
      .checkbox-inner {
        fill: #fff;
      }
    }
  }

  @keyframes rotateBox {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .checkbox-inner {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: inherit;
    cursor: pointer;
    // fill: #fff;
    // &::after {
    //   content: "";
    //   box-sizing: content-box;
    //   border: 2px solid;
    //   border-color: #fff;
    //   border-left: 0;
    //   border-top: 0;
    //   height: 60%;
    //   left: 50%;
    //   position: absolute;
    //   top: 17%;
    //   transform: rotate(40deg) translateX(-50%);
    //   width: 25%;
    //   visibility: hidden;
    // }
    // &.choose {
    //   &::after {
    //     visibility: visible;
    //   }
    // }
    &.rotating {
      animation: rotateBox 1.2s linear infinite;
    }
  }
</style>
