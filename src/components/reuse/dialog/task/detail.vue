<template>
  <div>
    <slide-dialog
      :visible.sync="detailModel"
      @opened="dialogOpen"
      @close="dialogClose">
      <!-- <ldb-detail-skeletion :visible="loading" dialog></ldb-detail-skeletion> -->
      <task-detail
        v-show="!loading"
        ref="taskDetail"
        dialog
        :taskId="taskId">
      </task-detail>
    </slide-dialog>
  </div>
</template>

<script>
import TaskDetail from '@/components/content/task/detail'

import SlideDialog from '@/components/stories/dialog/slider/index.vue'

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
      loading: true,
      detailModel: false
    }
  },
  computed: {
    blurs () {
      return this.$root.$children[0].blurs
    }
  },
  components: {
    TaskDetail,
    SlideDialog
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
      this.loading = false
      this.$nextTick(() => this.$refs.taskDetail.init(this.taskId))
    },

    /**
     * 对话框关闭事件
     */
    dialogClose () {
      const taskDetail = this.$refs.taskDetail
      if (taskDetail) {
        taskDetail.destory()
      }
      this.$emit('input', false)
      this.$emit('close')
      this[mutationTypes.LAYOUT_SET_BLURS](0)
    }
  },
  watch: {
    value (val) {
      this.loading = true
      this.detailModel = val
    },
    detailModel (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style>

</style>
