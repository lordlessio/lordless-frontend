<template>
  <div>
    <dialog-slide
      :visible.sync="dialogModel"
      :popstateModel="popstateModel"
      :showClose="showClose"
      @opened="$emit('opened')"
      @open="openModel"
      @close="closeModel"
      @closed="slideClosed">
      <slot></slot>
    </dialog-slide>

    <dialog-mask
      :visible.sync="dialogModel"
      :popstateModel="popstateModel"/>
  </div>
</template>

<script>
import DialogSlide from './tool/slide'
import DialogMask from './tool/mask'

import { mutationTypes, actionTypes } from '@/store/types'
import { mapState, mapMutations, mapActions } from 'vuex'

import { layoutMixins } from '@/mixins'
export default {
  name: 'lordless-slider',
  mixins: [layoutMixins],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: true
    }
  },
  data: (vm) => {
    return {
      dialogModel: vm.visible

      // popstate 改变状态
      // popstateModel: false
    }
  },
  computed: {
    ...mapState('layout', {
      appOpt: 'app'
    }),
    ...mapState('status', {
      popstateModel: 'popstate'
    })

    // _popstate () {
    //   return this.popstateMask && this.popstateSlide
    // }
  },
  watch: {
    visible (val) {
      // 需要根据 popstate 的值，改变 子组件的 transition name
      // 但是 popstate 的值和 visible 是同步的，所以这里需要做下处理，让 dialogModel 迟于 popstate
      this.$nextTick(() => {
        this.dialogModel = val
        this.freeScroll()
      })
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
    DialogSlide,
    DialogMask
  },
  methods: {
    ...mapMutations('status', [
      mutationTypes.STATUS_SET_POPSTATE
    ]),
    ...mapActions('layout', [
      actionTypes.LAYOUT_SET_APP_OPTIONS
    ]),

    openModel () {
      this.$emit('open')
      this.appOpt.transform && this[actionTypes.LAYOUT_SET_APP_OPTIONS]({ transform: true })
      this.prohibitScroll()
    },
    closeModel () {
      this.dialogModel = false
      this.$emit('close')
      this[actionTypes.LAYOUT_SET_APP_OPTIONS]({ transform: false })
      this.freeScroll()
    },

    slideClosed () {
      this.$emit('closed')
      this.$nextTick(() => {
        this[mutationTypes.STATUS_SET_POPSTATE](false)
      })
    },

    // popstate 监听函数
    popstateListener () {
      if (this.popstateModel) return
      this[mutationTypes.STATUS_SET_POPSTATE](true)
    }
  },
  destroyed () {
    this[actionTypes.LAYOUT_SET_APP_OPTIONS]({ transform: false })
    this.freeScroll()
    window.removeEventListener('popstate', this.popstateListener)
  },
  mounted () {
    // 监听 popstate 事件，主要用于 pushState 监听
    window.addEventListener('popstate', this.popstateListener)
  }
}
</script>

<style>

</style>
