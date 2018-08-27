<template>
  <div>
    <slide-dialog
      :visible.sync="detailModel"
      @open="dialogOpen"
      @close="dialogClose">
      <!-- <ldb-detail-skeletion :visible="loading" dialog></ldb-detail-skeletion> -->

      <ldb-detail
        v-show="!loading"
        :class="{ 'blur': blurs[1] }"
        ref="ldbDetail"
        dialog
        :theme="theme"
        @initInfo="initDetailInfo">
      </ldb-detail>
    </slide-dialog>
  </div>
</template>

<script>
import LdbDetailSkeletion from '@/components/skeletion/ldb/detail'
import LdbDetail from '@/components/ldb/detail'

import SlideDialog from '@/components/stories/dialog/slider'

import { mutationTypes } from '@/store/types'
import { mapMutations } from 'vuex'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    ldbId: [String, Number],
    theme: {
      type: String,
      default: 'light'
    },
    top: {
      type: String,
      default: '0px'
    }
  },
  data: () => {
    return {
      prevLdbId: null,
      detailModel: false,
      loading: true,
      tokenId: null
    }
  },
  computed: {
    blurs () {
      return this.$root.$children[0].blurs
    }
  },
  components: {
    LdbDetailSkeletion,

    SlideDialog,
    LdbDetail
  },
  methods: {
    ...mapMutations('layout', [
      mutationTypes.LAYOUT_SET_BLURS
    ]),

    /**
     * 对话框打开事件
     */

    dialogOpen () {
      setTimeout(() => {
        // if (this.prevLdbId && this.prevLdbId === this.ldbId) {
        //   this.loading = false
        //   this.initLoading()
        //   return
        // }
        this.loading = false
        this.$refs.ldbDetail.init(this.ldbId)
      }, 500)
    },

    /**
     * 对话框关闭事件
     */
    dialogClose () {
      this.$emit('input', false)
      const ldbDetail = this.$refs.ldbDetail
      console.log('-----close', ldbDetail, Boolean(ldbDetail))
      if (ldbDetail) ldbDetail.clearCInterval()
      this[mutationTypes.LAYOUT_SET_BLURS](0)
    },

    initDetailInfo ({ chain } = {}) {
      this.tokenId = chain.tokenId
      this.initLoading({ tokenId: chain.tokenId })
    },

    initLoading ({ tokenId = this.tokenId }) {
      this.loading = false
      // const ldbDetail = this.$refs.ldbDetail
      // if (ldbDetail) ldbDetail.checkOwner(tokenId)
    }
  },
  watch: {
    value (val) {
      console.log('--------- dialog value', val)
      this.loading = true
      if (!val) {
        this.$refs.ldbDetail.initStatus()
        this.$refs.ldbDetail.destory()
        this.$emit('close')
      }
      this.detailModel = val
    },
    detailModel (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="scss" scoped>
  .dialog-content {
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
</style>
