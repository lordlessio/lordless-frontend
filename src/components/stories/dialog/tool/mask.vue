<template>
  <transition name="ld-hide-fade">
    <div
      v-show="visible"
      class="ld-ldb-dialog"
      @click="$emit('update:visible', false)">
    </div>
  </transition>
</template>

<script>
import { addClass, removeClass } from 'utils/tool'
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
  watch: {
    visible (val) {
      if (val) {
        document.body.appendChild(this.$el)
        addClass('overflow-hidden', document.body)
      } else {
        removeClass('overflow-hidden', document.body)
      }
    }
  },
  destroyed () {
    removeClass('overflow-hidden', document.body)
    // if appendToBody is true, remove DOM node after destroy
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}
</script>

<style lang="scss" scoped>
  .ld-ldb-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 2000;
  }
</style>
