<template>
  <transition :name="popstateModel ? 'ld-hide-in-fade' : 'ld-slide-fade'"
    @after-leave="afterLeave"
    @after-enter="$emit('opened')">
    <div
      v-if="visible"
      ref="slide"
      class="alone-layer ld-dialog-slide"
      @click.stop>
      <div v-if="rendered" class="ld-slide-container">
        <span @click.stop="$emit('update:visible', false)" class="lg-hidden inline-block dialog-ldb-close">
          <i class="el-icon-close"></i>
        </span>
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

  .ld-dialog-slide {
    position: fixed;
    // position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    transform: translateZ(0);
    z-index: 2001;
    will-change: transform;
    @include width(90%, -2);
    @include width(100%, 1, -2);
    // &.is-mobile {
    //   position: absolute;
    // }
  }
  .ld-slide-container {
    position: relative;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    @include viewport-unit('height', 100vh);
  }

  .dialog-ldb-close {
    // position: fixed;
    position: absolute;
    left: 30px;
    top: 15px;
    color: #555;
    line-height: 1;
    z-index: 2009;
    cursor: pointer;
    @include fontSize(30px, 0.85);
    @include grid('left', 15px, -1);
  }

  .ld-slide-fade-enter-active, .ld-slide-fade-leave-active {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .ld-slide-fade-enter, .ld-slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(100%) translateZ(0);
  }
</style>
