<template>
  <div>
    <popup-content
      :visible.sync="dialogModel"
      :absolute="absolute"
      :appendToBody="appendToBody"
      @opened="$emit('opened')"
      @open="openModel"
      @close="closeModel"
      @closed="contentClosed">
      <slot></slot>
    </popup-content>

    <dialog-mask
      :visible.sync="dialogModel"
      :absolute="absolute"
      :appendToBody="appendToBody"/>
  </div>
</template>

<script>
import PopupContent from './content'
import DialogMask from '../tool/mask'

import { addClass, removeClass, scrollTo } from 'utils/tool'

import { layoutMixins } from '@/mixins'
export default {
  name: 'lordless-popup-dialog',
  mixins: [layoutMixins],
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
    }
  },
  data: (vm) => {
    return {
      dialogModel: vm.visible
    }
  },
  computed: {
  },
  watch: {
    visible (val) {
      this.dialogModel = val
      this.freeScroll()
    },
    dialogModel (val) {
      this.$emit('update:visible', val)
    }

    // 监听  popstateModel 处理
    // popstateModel (val) {
    //   if (val) {
    //     if (this.popstatePath && location.pathname.includes(this.popstatePath)) {
    //       this.dialogModel = false
    //     }
    //   }
    // }
    // _popstate (val) {
    //   console.log(' ---- _popstate ', val)
    //   if (val) this.endPopState()
    // }
  },
  components: {
    PopupContent,
    DialogMask
  },
  methods: {

    openModel () {
      this.$emit('open')
      scrollTo(0)
      this.prohibitScroll()
      addClass('mobile-dialog-open', document.getElementById('lordless'))
    },
    closeModel () {
      this.dialogModel = false
      this.$emit('close')
      this.freeScroll()
      removeClass('mobile-dialog-open', document.getElementById('lordless'))
    },

    contentClosed () {
      this.$emit('closed')
    }
  },
  destroyed () {
    this.freeScroll()
    removeClass('mobile-dialog-open', document.getElementById('lordless'))
  },
  mounted () {
  }
}
</script>

<style>

</style>
