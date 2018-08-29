<template>
  <div>
    <dialog-slide
      :visible.sync="dialogModel"
      @opened="$emit('opened')"
      @open="openModel"
      @close="closeModel"
      @closed="$emit('closed')">
      <slot></slot>
    </dialog-slide>
    <dialog-mask :visible.sync="dialogModel"></dialog-mask>
  </div>
</template>

<script>
import DialogSlide from './tool/slide'
import DialogMask from './tool/mask'

import { addClass, removeClass } from 'utils/tool'

import { actionTypes } from '@/store/types'
import { mapActions } from 'vuex'
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
      console.log('----- slider visible', val)
      this.dialogModel = val
      removeClass('overflow-hidden', document.body)
    },
    dialogModel (val) {
      this.$emit('update:visible', val)
    }
  },
  components: {
    DialogSlide,
    DialogMask
  },
  methods: {
    ...mapActions('layout', [
      actionTypes.LAYOUT_SET_APP_OPTIONS
    ]),
    openModel () {
      this.$emit('open')
      this[actionTypes.LAYOUT_SET_APP_OPTIONS]({ transform: true })
      addClass('overflow-hidden', document.body)
    },
    closeModel () {
      this.$emit('close')
      this[actionTypes.LAYOUT_SET_APP_OPTIONS]({ transform: false })
      removeClass('overflow-hidden', document.body)
    }
  }
}
</script>

<style>

</style>
