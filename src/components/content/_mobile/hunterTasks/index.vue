<template>
  <div class="hounter-tasks-component">
    <transition name="ld-hide-fade" mode="out-in">
      <hunter-tasks-skeletion v-if="loading"/>
      <div v-else class="hunter-tasks-container">
        <div class="hunter-unfinished-tasks hunter-tasks-box">
          <h3>Tasks</h3>
          <ul class="hunter-tasks-ul">
            <li v-for="(task, index) of unfinishedTasks" :key="index" class="task-unfinished-item hunter-task-item">
              <hunter-task-card :info="task" @completed="completedTask"/>
            </li>
          </ul>
        </div>
        <div class="hunter-finished-tasks hunter-tasks-box" v-if="finishedTasks && finishedTasks.length">
          <h3>Completed tasks</h3>
          <ul class="hunter-tasks-ul">
            <li v-for="(task, index) of finishedTasks" :key="index" class="task-finished-item hunter-task-item">
              <hunter-task-card :info="task" finished/>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import HunterTasksSkeletion from '@/components/skeletion/_mobile/hunterTasks'
import HunterTaskCard from '@/components/reuse/_mobile/card/hunterTask/card'

import { getHunterTaskTypes, getHunterTasksByUser } from 'api'
import { initLoadingMixins } from '@/mixins'
export default {
  name: 'mobile-hounter-tasks-component',
  mixins: [ initLoadingMixins ],
  data: () => {
    return {
      rendered: false,
      hunterTasks: null,
      userHunterTasks: null,
      finishedTasks: [],
      unfinishedTasks: []
    }
  },
  computed: {},
  components: {
    HunterTasksSkeletion,
    HunterTaskCard
  },
  methods: {
    completedTask (info) {
      const type = info.type
      let _task = null
      this.unfinishedTasks = this.unfinishedTasks.filter(item => {
        if (item.type === type) _task = item
        return item.type !== type
      })
      _task && this.finishedTasks.unshift(_task)
    },

    departTasks (_userHunterTasks = this.userHunterTasks, _hunterTasks = this.hunterTasks) {
      if (!_userHunterTasks || !_hunterTasks) return []
      const userTasks = _userHunterTasks.map(item => {
        if (item.finished) return item.type
        return undefined
      })
      this.finishedTasks = _hunterTasks.filter(item => {
        return userTasks.includes(item.type)
      })
      this.unfinishedTasks = _hunterTasks.filter(item => {
        return !userTasks.includes(item.type)
      })
      console.log('----------- departTasks', userTasks, this.finishedTasks, this.unfinishedTasks)
    },

    async initHunterTasks () {
      this.loading = true
      await Promise.all([this.getAllHunterTasks(), this.getUserHunterTasks()])
      this.$nextTick(() => this.departTasks())
      this.loading = false
      this.rendered = true
    },

    async getAllHunterTasks () {
      if (this.hunterTasks && this.hunterTasks.length) return this.hunterTasks
      try {
        const res = await getHunterTaskTypes()
        if (res.code === 1000 && res.data) {
          this.hunterTasks = res.data || []
        } else if (res.errorMsg) {
          this.$notify.error({
            title: 'HunterTaskType Error!',
            message: res.errorMsg || 'Invalidate Error!',
            position: 'bottom-right',
            duration: 2500
          })
        }
      } catch (err) {
        this.$notify.error({
          title: 'HunterTaskType Error!',
          message: err.message || 'Invalidate Error!',
          position: 'bottom-right',
          duration: 2500
        })
      }
    },

    async getUserHunterTasks () {
      try {
        const res = await getHunterTasksByUser()
        if (res.code === 1000 && res.data) {
          this.userHunterTasks = res.data || []
        } else if (res.errorMsg) {
          this.$notify.error({
            title: 'HunterTask Error!',
            message: res.errorMsg || 'Invalidate Error!',
            position: 'bottom-right',
            duration: 2500
          })
        }
      } catch (err) {
        this.$notify.error({
          title: 'HunterTask Error!',
          message: err.message || 'Invalidate Error!',
          position: 'bottom-right',
          duration: 2500
        })
      }
    }
  },
  activated () {
    if (!this.rendered) {
      this.rendered = true
      return
    }
    this.initHunterTasks()
  },
  mounted () {
    this.$nextTick(() => this.initHunterTasks())
  }
}
</script>

<style lang="scss" scoped>
  .hounter-tasks-component {
    padding-top: 44px;
    padding-bottom: 50px;
  }
  .hunter-tasks-container {
    padding: 0 20px;
  }
  .hunter-unfinished-tasks {

  }
  .hunter-task-title {
    font-size: 18px;
    color: $--main-color;
  }

  .hunter-tasks-box {
    margin-top: 16px;
  }
  .hunter-tasks-ul {
    margin-top: 8px;
  }
  .hunter-task-item {
    &:not(:first-of-type) {
      margin-top: 16px;
    }
  }
</style>
