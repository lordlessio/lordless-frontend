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

import { actionTypes } from '@/store/types'
import { mapState, mapActions } from 'vuex'

import { layoutMixins } from '@/mixins'
export default {
  name: 'lordless-slider',
  mixins: [layoutMixins],
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
  computed: {
    ...mapState('layout', {
      appOpt: 'app'
    })
  },
  watch: {
    visible (val) {
      this.dialogModel = val
      this.freeScroll()
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
      this.appOpt.transform && this[actionTypes.LAYOUT_SET_APP_OPTIONS]({ transform: true })
      this.prohibitScroll()
    },
    closeModel () {
      this.$emit('close')
      this[actionTypes.LAYOUT_SET_APP_OPTIONS]({ transform: false })
      this.freeScroll()
    }
  },
  destroyed () {
    this[actionTypes.LAYOUT_SET_APP_OPTIONS]({ transform: false })
    this.freeScroll()
  }
}
</script>

<style>

</style>
