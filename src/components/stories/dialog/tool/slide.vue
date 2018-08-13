<template>
  <transition name="ld-slide-fade">
    <div
      v-show="visible"
      ref="slide"
      class="ld-dialog-slide"
      @click.stop>
      <slot></slot>
    </div>
  </transition>
</template>

<script>
// import { transitionEvent } from 'utils/tool'

import { actionTypes } from '@/store/types'
import { mapActions } from 'vuex'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: true
    }
  },
  data: () => {
    return {
      rendered: false
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (!this.rendered) this.rendered = true
        this[actionTypes.LAYOUT_SET_APP_OPTIONS]({ transform: true })
        this.$emit('open')
        this.$nextTick(() => {
          this.$refs.slide.scrollTop = 0
        })
        if (this.appendToBody) {
          document.body.appendChild(this.$el)
        }
      } else {
        this.$emit('close')
        this[actionTypes.LAYOUT_SET_APP_OPTIONS]({ transform: false })
      }
      // this.load(val)
    }
  },
  methods: {
    ...mapActions('layout', [
      actionTypes.LAYOUT_SET_APP_OPTIONS
    ])

    // load (status) {
    //   this.$el.addEventListener(transitionEvent(), () => {
    //     console.log('-------')
    //     // if (status) this.$emit('opened')
    //     // if (!status) this.$emit('closed')
    //   }, { once: true })
    // }
  },

  mounted () {
    if (this.visible) {
      this.rendered = true
      this.open()
      if (this.appendToBody) {
        document.body.appendChild(this.$el)
      }
    }
  },

  destroyed () {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
    // this.$el.removeEventListener(transitionEvent(), () => {}, { once: true })
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  .ld-dialog-slide {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    transform: translateZ(0);
    z-index: 2001;
    overflow: auto;
    will-change: transform;
    @include width(90%, -2);
    @include width(95%, 1, -2);
  }

  .ld-slide-fade-enter-active, .ld-slide-fade-leave-active {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .ld-slide-fade-enter, .ld-slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(100%) translateZ(0);
  }
</style>
