<template>
  <transition name="ld-hide-in-fade">
    <div v-if="value" class="relative webchat-block-box">
      <div class="relative wechat-block-content">
        <span class="wechat-block-icon">
          <svg>
            <use xlink:href="#icon-linear-arrow-sharing"/>
          </svg>
        </span>
        <div class="wechat-block-container">
          <h2>Your operation is blocked</h2>
          <p class="wechat-block-desc">LORDLESS can not connect the ETH Wallet in Wechat.</p>
          <p class="wechat-block-learn-text">Click the <span class="wechat-block-symbol">&nbsp;...&nbsp;</span> on the upper-right corner and select <span>Open in Safari.</span></p>
        </div>
        <div class="webchat-block-img line-height-0">
          <img class="full-width" src="/static/img/utils/wechat-sharing.png"/>
        </div>
      </div>
      <div
        class="alone-layer wechat-block-mask"
        @click="closeModel"
        @touchmove.prevent>
      </div>
    </div>
  </transition>
</template>

<script>
import { layoutMixins } from '@/mixins'
export default {
  name: 'lordless-slider',
  mixins: [layoutMixins],
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data: (vm) => {
    return {
      dialogModel: vm.value
    }
  },
  computed: {
  },
  watch: {
    value (val) {
      // 需要根据 popstate 的值，改变 子组件的 transition name
      // 但是 popstate 的值和 value 是同步的，所以这里需要做下处理，让 dialogModel 迟于 popstate
      this.$nextTick(() => {
        this.dialogModel = val
        this.freeScroll()
      })
      if (val) this.openModel()
    },
    dialogModel (val) {
      this.$emit('input', val)
    }
  },
  methods: {

    openModel () {
      this.$el && document.body.appendChild(this.$el)
      this.$emit('open')
      this.prohibitScroll()
    },
    closeModel () {
      this.dialogModel = false
      this.$emit('close')
      this.destroy()
    },
    destroy () {
      this.$emit('input', false)
      this.freeScroll()
      if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el)
      }
    }
  },
  deactivated () {
    this.destroy()
  },
  destroyed () {
    this.destroy()
  }
}
</script>

<style lang="scss" scoped>
  .webchat-block-box {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3999;
  }
  .wechat-block-content {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100%;
    padding-top: 30px;
    background-color: #fff;
  }
  .wechat-block-icon {
    position: absolute;
    right: 12px;
    top: 6px;
    width: 24px;
    height: 24px;
  }
  .wechat-block-container {
    margin: 0 auto;
    max-width: 320px;
    >h2 {
      font-size: 24px;
      color: #555;
    }
  }
  .wechat-block-desc {
    margin-top: 24px;
    font-size: 16px;
    color: #777;
  }
  .wechat-block-learn-text {
    margin-top: 12px;
    font-size: 14px;
    color: #999;
    >span {
      font-size: 16px;
      color: #0079FF;
      @include TTFontBolder();
      &.wechat-block-symbol {
        font-size: 24px;
        line-height: 16px;
      }
    }
  }
  .webchat-block-img {
    margin-top: 12px;
  }

  .wechat-block-mask {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
  }
</style>
