<template>
  <el-dialog
    :visible.sync="detailModel"
    :custom-class="`lordless-dialog dialog-ldb-detail transparent ${(blurs[1] && value) ? 'blur' : ''}`"
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
      <task-detail
        ref="taskDetail"
        dialog
        :taskId="taskId">
      </task-detail>
    </div>
  </el-dialog>
</template>

<script>
import TaskDetail from '@/components/reuse/task/detail'

import { mutationTypes } from '@/store/types'
import { mapMutations } from 'vuex'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    taskId: String,
    top: {
      type: String,
      default: '0px'
    }
  },
  data: () => {
    return {
      detailModel: false
    }
  },
  computed: {
    blurs () {
      return this.$root.$children[0].blurs
    }
  },
  components: {
    TaskDetail
  },
  methods: {
    ...mapMutations('layout', [
      mutationTypes.LAYOUT_SET_BLURS
    ]),

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
      this.$emit('input', false)
      this.$emit('close')
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
