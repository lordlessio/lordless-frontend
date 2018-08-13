<template>
  <div>
    <dialog-slide
      :visible.sync="dialogModel"
      @open="$emit('open')"
      @close="$emit('close')">
      <slot></slot>
    </dialog-slide>
    <dialog-mask :visible.sync="dialogModel"></dialog-mask>
  </div>
</template>

<script>
import DialogSlide from './tool/slide'
import DialogMask from './tool/mask'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data: (vm) => {
    return {
      dialogModel: vm.visible
    }
  },
  watch: {
    visible (val) {
      this.dialogModel = val
    },
    dialogModel (val) {
      this.$emit('update:visible', val)
    }
  },
  components: {
    DialogSlide,
    DialogMask
  }
}
</script>

<style>

</style>
