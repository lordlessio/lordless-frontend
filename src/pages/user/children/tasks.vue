<template>
  <div class="d-flex user-tasks-box">
    <div class="d-flex v-flex col-flex user-candy-container">
      <h1 class="text-cap user-tasks-title">Tasks</h1>
      <div
        v-if="!tasks.length && !taskRewards.length && !loading"
        class="d-flex v-flex col-flex f-auto-center text-center no-asset-box">
        <svg>
          <use xlink:href="#icon-no-candy"/>
        </svg>
        <p>You have no tasks now.</p>
        <div class="d-flex f-auto-center TTFontBolder">
          <span>Try to buy a LDB in</span>
          <span class="inline-block">
            <ld-btn class="TTFontBolder no-asset-btn" theme="default" shadow>Marketplace</ld-btn>
          </span>
        </div>
      </div>
      <div
        v-if="tasks.length || taskRewards.length"
        class="v-flex user-tasks-tabs">
        <el-tabs
          v-model="taskTab"
          @tab-click="chooseTab">
          <el-tab-pane
            label="Tasks"
            name="tasks">
            <el-row :gutter="20" class="user-tasks-cnt">
              <el-col
                :xs="24"
                class="tasks-item"
                v-for="(task, index) of tasks"
                :key="index">
                <task-card
                  :info="task"
                  @play="playTask"
                  @choose="chooseTask">
                </task-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane
            label="Rewarded tasks"
            name="rewarded">
            <div
              v-if="!taskRewards.length && !loading"
              class="d-flex v-flex col-flex f-auto-center text-center no-asset-box user-no-sale-tasks">
              <svg>
                <use xlink:href="#icon-no-candy"/>
              </svg>
              <p>You have nothing on rewarded now.</p>
              <div class="d-flex f-auto-center TTFontBolder">
                <span>Make the first selling transaction for your</span>
              </div>
            </div>
            <el-row :gutter="20" class="user-tasks-cnt">
              <el-col
                :xs="24"
                class="tasks-item"
                v-for="(task, index) of taskRewards"
                :key="index">
                <task-card
                  :info="task"
                  reward
                  @choose="chooseTask">
                </task-card>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
        <Pagination
          v-if="showPagination"
          class="ld-tasks-pagination"
          :total="pageTotal"
          background
          @currentChange="pageChange">
        </Pagination>
      </div>
    </div>
    <task-dialog
      v-model="detailModel"
      :taskId="taskInfo._id"
      @close="dialogClose">
    </task-dialog>
  </div>
</template>

<script>
import TaskDialog from '@/components/reuse/dialog/task/detail'
import TaskCard from '@/components/reuse/card/task'
import Pagination from '@/components/stories/pagination'
import LdBtn from '@/components/stories/button'

import { historyState } from 'utils/tool'

import { getUserTasks } from 'api'
import { mapState } from 'vuex'
export default {
  data: () => {
    return {

      loading: false,

      // 当前 tab 区域
      taskTab: 'tasks',

      // 改变之前的 tab 区域
      currentTab: 'tasks',

      // task detail 弹窗
      detailModel: false,

      // 选中的建筑
      taskInfo: {},

      /**
       * all tasks options
       */

      // 用户全部的任务
      tasks: [],
      // 建筑总数
      tTotal: 0,

      /**
       * rewarded tasks options
       */

      // 任务奖励列表
      taskRewards: [],
      // sale 建筑总数
      tRTotal: 0
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ]),
    pageTotal () {
      if (this.taskTab === 'tasks') {
        return this.tTotal
      }
      return this.tRTotal
    },
    showPagination () {
      if (this.taskTab === 'tasks') {
        return this.tasks.length
      }
      return this.taskRewards.lnegth
    }
  },
  components: {
    TaskDialog,
    TaskCard,
    Pagination,
    LdBtn
  },
  methods: {
    chooseTab () {
      if (this.currentTab === this.taskTab) return
      this.currentTab = this.taskTab

      if (this.taskTab === 'tasks') this.getTasks()
      else this.getTaskRewards()
    },

    async getTasks ({ pn = 1, ps = 10 } = {}) {
      this.loading = true
      const params = {
        pn,
        ps
      }
      const res = await getUserTasks(params)
      if (res.code === 1000 && res.data) {
        const { list, total } = res.data
        this.tasks = list
        this.tTotal = total
      }
      this.loading = false
    },

    async getTaskRewards ({ pn = 1, ps = 10 } = {}) {
      this.loading = true
      const params = {
        pn,
        ps
      }
      const res = await getUserTasks(params)
      if (res.code === 1000) {
        const { list, total } = res.data
        this.taskRewards = list
        this.tRTotal = total
      }
      this.loading = false
    },

    pageChange (e) {
      if (this.taskTab === 'tasks') {
        this.getTasks({ pn: e })
      } else {
        this.getTaskRewards({ pn: e })
      }
    },

    chooseTask (item) {
      console.log('-----chooseTask', item)
      this.detailModel = true
      this.$nextTick(() => {
        this.taskInfo = item
        historyState(`/task/${item._id}`)
      })
    },

    playTask (item) {
      console.log('-----playTask', item)
    },

    /**
     * 对话框关闭触发函数
     */
    dialogClose () {
      historyState(this.$route.path)
    }
  },
  watch: {
    userInfo (val) {
      if (this.taskTab === 'tasks') {
        this.getTasks()
      } else {
        this.getTaskRewards()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getTasks()
    })
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  .user-tasks-box {
    font-size: 16px;
    @include padding(-1, 30px, 1);
    /deep/ .el-tabs__header {
      margin: 0;
    }
    /deep/ .el-tabs__content {
      position: static;
      overflow: initial;
    }
    /deep/ .el-tabs__item {
      font-size: 18px;
      color: #999;
      &.is-active {
        color: inherit;
      }
    }
  }

  .user-tasks-title {
    font-size: 36px;
    color: #999;
  }

  .ld-tasks-pagination {
    position: absolute;
    left: 0;
    bottom: -100px;
  }

   .user-tasks-tabs {
    position: relative;
    @include margin('top', 35px, 1);
    @include margin('bottom', 150px, 1);
  }
  .user-no-sale-tasks {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .tasks-item {
    @include margin('top', 30px, 1);
  }
</style>
