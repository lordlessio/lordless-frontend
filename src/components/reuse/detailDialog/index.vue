<template>
  <el-dialog
    :visible.sync="ldbDialog"
    :custom-class="`dialog-ldb-detail ${theme}`"
    lock-scroll
    append-to-body
    :top="top"
    :show-close="false"
    @open="dialogOpen"
    @close="dialogClose">
    <div>
      <span @click.stop="ldbDialog = false" class="inline-block dialog-ldb-close">
        <i class="el-icon-close"></i>
      </span>
      <ldb-detail dialog :theme="theme" :ldbId="ldbId"></ldb-detail>
    </div>
  </el-dialog>
</template>

<script>
import LdbDetail from '@/components/ldb/detail'
export default {
  props: {
    ldbId: String,
    theme: {
      type: String,
      default: 'default'
    },
    top: {
      type: String,
      default: '0px'
    }
  },
  data: () => {
    return {
      ldbDialog: false
    }
  },
  components: {
    LdbDetail
  },
  methods: {

    open () {
      this.ldbDialog = true
    },

    /**
     * 对话框打开事件
     */
    dialogOpen () {
      this.$emit('open')
    },

    /**
     * 对话框关闭事件
     */
    dialogClose () {
      this.$emit('close')
    }
  }
}
</script>

<style>

</style>
