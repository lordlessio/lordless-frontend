<template>
  <transition
    :name="popstateModel ? 'ld-hide-in-fade' : 'ld-hide-fade'"
    @after-leave="afterLeave">
    <div
      v-if="visible"
      class="alone-layer ld-dialog-mask"
      :class="{ 'is-fade': isFade, 'is-absolute': absolute }"
      @click="$emit('update:visible', false)"
      @touchmove.prevent>
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
    absolute: {
      type: Boolean,
      default: false
    },
    isFade: {
      type: Boolean,
      default: false
    },

    // popstate 改变状态
    popstateModel: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    visible (val) {
      if (val && this.appendToBody) {
        document.body.appendChild(this.$el)
      }
    }
  },
  methods: {
    afterLeave () {
      this.$emit('closed')
    },
    destroy () {
      if (this.$el && this.$el.parentNode && this.appendToBody) {
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
  .ld-dialog-mask {
    position: fixed;
    // position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 2000;
    &.is-fade {
      background-color: rgba(255, 255, 255, 0.5);
      z-index: 3000;
    }
    &.is-absolute {
      position: absolute;
    }
  }
</style>
