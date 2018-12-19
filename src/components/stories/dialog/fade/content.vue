<template>
  <transition name="ld-dialog-fade"
    @after-leave="afterLeave"
    @after-enter="$emit('opened')">
    <div
      v-if="visible"
      ref="slide"
      class="alone-layer ld-fade-dialog-box"
      :class="{ 'is-center': center }"
      @click.stop>
      <div v-if="rendered" class="ld-slide-container">
        <slot></slot>
      </div>
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
    },
    center: {
      type: Boolean,
      default: true
    },

    // popstate 改变状态
    popstateModel: {
      type: Boolean,
      default: false
    }
    // isMobile: {
    //   type: Boolean,
    //   default: false
    // }
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
        this.$emit('open')
        this.$nextTick(() => {
          this.$refs.slide.scrollTop = 0
        })
        if (this.appendToBody) {
          document.body.appendChild(this.$el)
        }
      } else {
        this.$emit('close')
      }
      // this.load(val)
    }
  },
  methods: {
    afterLeave () {
      console.log(' -- slide after leave popstate', this.popstateModel)
      this.$emit('closed')
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

  .ld-fade-dialog-box {
    // position: fixed;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 3001;
    @include overflow();
    &.is-center {
      .ld-slide-container {
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  .ld-slide-container {
    position: relative;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    // @include viewport-unit('height', 100vh);
  }

  .ld-dialog-fade-enter-active, .ld-dialog-fade-leave-active {
    opacity: 1;
    transform: translateY(0);
    transition: all .4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .ld-dialog-fade-enter, .ld-dialog-fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
</style>
