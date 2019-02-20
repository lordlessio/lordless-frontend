<template>
  <transition name="ld-dialog-fade"
    @after-leave="afterLeave"
    @after-enter="afterEnter"
    @enter="popupEnter">
    <div
      v-if="visible"
      ref="popup"
      class="alone-layer ld-popup-dialog-box"
      @click.stop>
      <transition name="ld-popup-in">
        <div v-if="rendered && showCnt" class="ld-popup-container">
          <slot></slot>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
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
      rendered: false,
      showCnt: false
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (!this.rendered) this.rendered = true
        this.$emit('open')
        this.$nextTick(() => {
          this.$refs.popup.scrollTop = 0
        })
        if (this.appendToBody) {
          document.body.appendChild(this.$el)
        }
      } else {
        this.showCnt = false
        this.$emit('close')
      }
      // this.load(val)
    }
  },
  methods: {
    afterLeave () {
      this.$emit('closed')
    },
    popupEnter () {
      this.showCnt = true
    },
    afterEnter () {
      this.$emit('opened')
    },
    destroy () {
      // if appendToBody is true, remove DOM node after destroy
      if (this.appendToBody && this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el)
      }
    }

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
      // this.open()
      if (this.appendToBody) {
        document.body.appendChild(this.$el)
      }
    }
  },

  destroyed () {
    this.destroy()
    // this.$el.removeEventListener(transitionEvent(), () => {}, { once: true })
  }
}
</script>

<style lang="scss" scoped>

  .ld-popup-dialog-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 2001;
  }
  .ld-popup-container {
    // position: relative;
    overflow: hidden;
    // -webkit-overflow-scrolling: touch;
    // @include viewport-unit('height', 100vh);
  }

  .ld-dialog-fade-enter-active, .ld-dialog-fade-leave-active {
    opacity: 1;
    transition: all .4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .ld-dialog-fade-enter, .ld-dialog-fade-leave-to {
    opacity: 0;
  }
</style>
