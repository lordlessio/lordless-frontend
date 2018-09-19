<template>
  <div class="task-detail-box">
    <task-detail ref="taskDetail"/>
  </div>
</template>

<script>
import TaskDetail from '@/components/content/task/detail'
export default {
  components: {
    TaskDetail
  },
  mounted () {
    this.$nextTick(() => {
      const { taskId } = this.$route.params
      this.$refs.taskDetail.init(taskId)
    })
  }
}
</script>

<style lang="scss" scoped>
  .task-detail-box {
    @include margin('top', -90px, 1.5);
  }
</style>
