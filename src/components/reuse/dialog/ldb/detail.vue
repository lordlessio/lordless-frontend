<template>
  <div>
    <slide-dialog
      ref="tavernSlideDialog"
      :visible.sync="detailModel"
      :showClose="false"
      @opened="dialogOpen"
      @close="dialogClose">
      <!-- <ldb-detail-skeletion :visible="loading" dialog></ldb-detail-skeletion> -->
      <!-- <div class="text-nowrap ldb-detail-dialog-tip">
        <header-tip
          :market="false"
          :leftInfo="!isMobile"
          :scale="isMobile ? 6 : 8"
          :mobile="isMobile"
          :loginText="isMobile ? 'Started' : 'Get Started'"
          @click="$emit('tipClick')"/>
      </div> -->
      <ldb-detail
        v-if="!loading"
        :class="{ 'blur': blurs[1] }"
        ref="ldbDetail"
        dialog
        :detailInfo.sync="detailInfo"
        @tClose="tCloseHandle"
        @initInfo="initDetailInfo"
        @touchmove.prevent>
      </ldb-detail>
    </slide-dialog>
  </div>
</template>

<script>
import LdbDetailSkeletion from '@/components/skeletion/ldb/detail'
import LdbDetail from '@/components/content/ldb/detail'
import HeaderTip from '@/components/reuse/headerTip'

import SlideDialog from '@/components/stories/dialog/slider/index.vue'

import { mutationTypes } from '@/store/types'
import { mapMutations } from 'vuex'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    ldbId: [String, Number]
  },
  data: () => {
    return {
      detailInfo: null,
      detailModel: false,
      loading: true
    }
  },
  computed: {
    blurs () {
      return this.$root.$children[0].blurs
    },
    isMobile () {
      return this.$root.$children[0].isMobile
    }
  },
  watch: {
    value (val) {
      this.loading = true
      this.detailModel = val
      // if (val) {
      //   setTimeout(() => {
      //     this.$emit('input', false)
      //   }, 3000)
      // }
    },
    detailModel (val) {
      this.$emit('input', val)
    }
  },
  components: {
    LdbDetailSkeletion,

    SlideDialog,
    LdbDetail,
    HeaderTip
  },
  methods: {
    ...mapMutations('layout', [
      mutationTypes.LAYOUT_SET_BLURS
    ]),

    tCloseHandle () {
      this.$refs.tavernSlideDialog && this.$refs.tavernSlideDialog.closeModel()
    },

    /**
     * 对话框打开事件
     */

    dialogOpen () {
      this.$emit('open')
      this.loading = false
      this.$nextTick(() => this.$refs.ldbDetail.init(this.ldbId))
    },

    /**
     * 对话框关闭事件
     */
    dialogClose () {
      const ldbDetail = this.$refs.ldbDetail
      if (ldbDetail) {
        ldbDetail.destory()
      }
      this[mutationTypes.LAYOUT_SET_BLURS](0)
      // clearTimeout(timeout)
      // timeout = null
      this.$emit('input', false)
      this.$emit('close', this.detailInfo)
    },

    initDetailInfo () {
      // this.initLoading()
    }

    // initLoading () {
    // this.loading = false
    // const ldbDetail = this.$refs.ldbDetail
    // if (ldbDetail) ldbDetail.checkOwner(tokenId)
    // }
  }
}
</script>

<style lang="scss" scoped>
  .dialog-content {
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
  .ldb-detail-dialog-tip {
    position: absolute;
    // left: 0;
    top: 5px;
    // transform: translateX(50%);
    z-index: 9;
    @include grid('let', 0, 1);
    @include grid('right', 5px, -1);
  }
</style>
