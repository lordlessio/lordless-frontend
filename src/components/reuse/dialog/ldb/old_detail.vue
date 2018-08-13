
<template>
  <el-dialog
    :visible.sync="detailModel"
    :custom-class="`lordless-dialog dialog-ldb-detail ${theme} ${(blurs[1] && value) ? 'blur' : ''}`"
    lock-scroll
    append-to-body
    :top="top"
    :show-close="false"
    @open="dialogOpen"
    @close="dialogClose">
    <div>
      <span @click.stop="$emit('input', false)" class="inline-block dialog-ldb-close">
        <i class="el-icon-close"></i>
      </span>
      <ldb-detail
        ref="ldbDetail"
        dialog
        :theme="theme"
        :ldbId="ldbId"
        @initInfo="initDetailInfo"></ldb-detail>
    </div>
  </el-dialog>
</template>

<script>
import LdbDetail from '@/components/ldb/detail'

import { mutationTypes } from '@/store/types'
import { mapMutations } from 'vuex'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    ldbId: String,
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
      detailModel: false,
      tokenId: null
    }
  },
  computed: {
    blurs () {
      return this.$root.$children[0].blurs
    }
  },
  components: {
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
        this.$refs.ldbDetail.init(this.ldbId)
      }, 500)
      if (this.$refs.ldbDetail) this.$refs.ldbDetail.checkOwner(this.tokenId)
      this.$emit('open')
    },

    /**
     * 对话框关闭事件
     */
    dialogClose () {
      this.$emit('input', false)
      this.$emit('close')
      this.$refs.ldbDetail.clearCInterval()
    },

    initDetailInfo ({ chain } = {}) {
      this.tokenId = chain.tokenId
      const detail = this.$refs.ldbDetail
      if (detail) detail.checkOwner(chain.tokenId)
    }
  },
  watch: {
    value (val) {
      this.detailModel = val
      this[mutationTypes.LAYOUT_SET_BLURS](val ? 1 : 0)
    },
    detailModel (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style>

</style>
