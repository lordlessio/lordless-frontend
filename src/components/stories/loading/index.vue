<template>
  <div ref="loading" class="ldb-detail-loading" :class="[{ 'show': loading }, position]" :style="`z-index: ${index};`">
    <slot></slot>
  </div>
</template>

<script>
// import { transitionEvent } from 'utils/tool'
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: 'fixed'
    },
    index: {
      type: Number,
      default: 5
    }
  },
  methods: {
    // transitionEvt () {
    //   const tEvt = transitionEvent()
    //   const dom = this.$refs.loading
    //   const func = () => {
    //     this.$refs.loading.style.display = 'none'
    //     dom.removeEventListener(tEvt, func, false)
    //   }
    //   tEvt && dom.addEventListener(tEvt, func)
    // }
  },
  watch: {
    loading (val) {
      // if (!val) this.transitionEvt()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/color_mixin.scss';
  .ldb-detail-loading {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    visibility: hidden;
    transition: opacity .3s ease, visibility 0s .3s;
    // el-popup-parent--hidden
    &.fixed {
      position: fixed;
    }
    &.absolute {
      position: absolute;
    }
    &.show {
      opacity: 1;
      visibility: visible;
      transition: opacity .3s ease, visibility 0s 0s;
    }
  }
</style>
