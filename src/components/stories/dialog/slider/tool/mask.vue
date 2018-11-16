<template>
  <transition
    :name="popstateModel ? 'ld-hide-in-fade' : 'ld-hide-fade'"
    @after-leave="afterLeave">
    <div
      v-if="visible"
      class="alone-layer ld-ldb-dialog"
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

    // popstate 改变状态
    popstateModel: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    visible (val) {
      if (val) {
        document.body.appendChild(this.$el)
      }
    }
  },
  methods: {
    afterLeave () {
      console.log(' -- mask after leave popstate', this.popstateModel)
      this.$emit('closed')
    },
    destroy () {
      if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el)
      }
    }
  },
  destroyed () {
    this.destroy()
  }
}
</script>

<style lang="scss" scoped>
  .ld-ldb-dialog {
    position: fixed;
    // position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 2000;
  }
</style>
