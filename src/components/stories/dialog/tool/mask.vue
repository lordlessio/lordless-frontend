<template>
  <transition name="ld-mask-fade">
    <div
      v-dom-portal
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

  .ld-mask-fade-enter-active, .ld-mask-fade-leave-active {
    opacity: 1;
    transition: opacity .4s cubic-bezier(0.4, 0, 0.2, 1);;
  }
  .ld-mask-fade-enter, .ld-mask-fade-leave-to {
    opacity: 0;
  }
</style>
