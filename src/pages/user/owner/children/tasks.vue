<template>
  <div class="d-flex user-tasks-box">
    <div class="d-flex v-flex col-flex user-candy-container">
      <h1 class="text-cap user-tasks-title">Tasks</h1>
      <div
        class="v-flex user-tasks-tabs">
        <el-tabs
          v-model="taskTab"
          @tab-click="chooseTab">
          <el-tab-pane
            label="Tasks"
            name="tasks">
            <div class="tasks-sort">
              <span>Filter by</span>
              <ld-select
                class="tasks-sort-select"
                v-model="tasksSort"
                :items="sortItems"
                @change="filterTasks">
              </ld-select>
            </div>
            <div v-if="loading" class="user-tasks-skeletion">
              <div class="d-flex skeletion-breath">
                <div class="v-flex tasks-skeletion-left">
                  <p></p>
                  <p></p>
                  <p></p>
                </div>
                <div class="d-flex col-flex tasks-skeletion-right">
                  <p></p>
                  <p></p>
                </div>
              </div>
            </div>
            <transition name="ld-hide-in-fade">
              <div
                v-if="!taskInfos.total && !loading"
                class="d-flex v-flex col-flex f-auto-center text-center no-asset-box user-no-sale-tasks">
                <svg>
                  <use xlink:href="#icon-no-candy"/>
                </svg>
                <p>You have nothing tasks now.</p>
                <!-- <div class="d-flex f-auto-center TTFontBolder">
                  <span>Make the first selling transaction for your</span>
                </div> -->
                <div class="d-flex f-auto-center TTFontBolder">
                  <span>recive Task in Taverns</span>
                  <span class="inline-block">
                    <ld-btn class="TTFontBolder no-asset-btn" theme="default" shadow @click="$router.push('/map')">Map</ld-btn>
                  </span>
                </div>
              </div>
            </transition>
            <transition name="ld-hide-in-fade">
              <el-row v-if="taskInfos.total && !loading" :gutter="20" class="relative user-tasks-cnt">
                <el-col
                  :xs="24"
                  class="tasks-item"
                  v-for="(task, index) of taskInfos.list"
                  :key="index">
                  <task-card
                    :info="task"
                    @play="playTask"
                    @choose="chooseTask">
                  </task-card>
                </el-col>
              </el-row>
            </transition>
          </el-tab-pane>
          <el-tab-pane
            label="Candy"
            name="candy">
            <!-- <div class="tasks-sort">
              <span>Filter by</span>
              <ld-select
                class="tasks-sort-select"
                v-model="tasksSort"
                :items="sortItems"
                @change="filterTasks">
              </ld-select>
            </div> -->
            <div v-if="loading" class="user-tasks-skeletion">
              <div class="d-flex skeletion-breath">
                <div class="v-flex tasks-skeletion-left">
                  <p></p>
                  <p></p>
                  <p></p>
                </div>
                <div class="d-flex col-flex tasks-skeletion-right">
                  <p></p>
                  <p></p>
                </div>
              </div>
            </div>
            <transition name="ld-hide-in-fade">
              <div
                v-if="!taskInfos.total && !loading"
                class="d-flex v-flex col-flex f-auto-center text-center no-asset-box user-no-sale-tasks">
                <svg>
                  <use xlink:href="#icon-no-candy"/>
                </svg>
                <p>You have no Candy Tasks now.</p>
                <div class="d-flex f-auto-center TTFontBolder">
                  <span>recive candy in Tavern</span>
                  <span class="inline-block">
                    <ld-btn class="TTFontBolder no-asset-btn" theme="default" shadow @click="$router.push('/map')">Map</ld-btn>
                  </span>
                </div>
              </div>
            </transition>
            <transition name="ld-hide-in-fade">
              <el-row v-if="taskInfos.total && !loading" :gutter="20" class="relative user-tasks-cnt">
                <el-col
                  :xs="24"
                  class="tasks-item"
                  v-for="(task, index) of taskInfos.list"
                  :key="index">
                  <task-card
                    :info="task"
                    @play="playTask"
                    @choose="chooseTask">
                  </task-card>
                </el-col>
              </el-row>
            </transition>
          </el-tab-pane>
          <el-tab-pane
            label="LORD rewards"
            name="lord">
            <!-- <div class="tasks-sort">
              <span>Filter by</span>
              <ld-select
                class="tasks-sort-select"
                v-model="tasksSort"
                :items="sortItems"
                @change="filterTasks">
              </ld-select>
            </div> -->
            <div v-if="loading" class="user-tasks-skeletion">
              <div class="d-flex skeletion-breath">
                <div class="v-flex tasks-skeletion-left">
                  <p></p>
                  <p></p>
                  <p></p>
                </div>
                <div class="d-flex col-flex tasks-skeletion-right">
                  <p></p>
                  <p></p>
                </div>
              </div>
            </div>
            <transition name="ld-hide-in-fade">
              <div
                v-if="!taskInfos.total && !loading"
                class="d-flex v-flex col-flex f-auto-center text-center no-asset-box user-no-sale-tasks">
                <svg>
                  <use xlink:href="#icon-no-candy"/>
                </svg>
                <p>You have nothing on LORD rewarded now.</p>
                <div class="d-flex f-auto-center TTFontBolder">
                  <span>Try to buy a Tavern in</span>
                  <span class="inline-block">
                    <ld-btn class="TTFontBolder no-asset-btn" theme="default" shadow @click="$router.push('/market')">Marketplace</ld-btn>
                  </span>
                </div>
              </div>
            </transition>
            <transition name="ld-hide-in-fade">
              <el-row v-if="taskInfos.total && !loading" :gutter="20" class="relative user-tasks-cnt">
                <el-col
                  :xs="24"
                  class="tasks-item"
                  v-for="(task, index) of taskInfos.list"
                  :key="index">
                  <task-card
                    :info="task"
                    reward
                    @choose="chooseTask">
                  </task-card>
                </el-col>
              </el-row>
            </transition>
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
import LdSelect from '@/components/stories/select'
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

      taskInfos: {
        pn: 1,
        ps: 10,
        list: [],
        total: 0
      },
      /**
       * all tasks options
       */

      // 用户全部的任务
      tasks: [],
      // 建筑总数
      tTotal: 0,

      tasksSort: -2,

      sortItems: [{
        value: -2,
        label: 'All'
      }, {
        value: 0,
        label: 'Under way'
      }, {
        value: 1,
        label: 'Approved'
      }, {
        value: -1,
        label: 'Rejected'
      }],

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
    LdBtn,
    LdSelect
  },
  methods: {
    chooseTab () {
      if (this.currentTab === this.taskTab) return
      this.currentTab = this.taskTab
      this.tasksSort = -2
      this.$set(this.taskInfos, 'pn', 1)
      this.$set(this.taskInfos, 'ps', 10)

      this.getTasks()
      // if (this.taskTab === 'tasks') this.getTasks()
      // else this.getTaskRewards()
    },

    filterTasks (e) {
      this.getTasks({ status: e })
    },

    async getTasks ({ pn = this.taskInfos.pn, ps = this.taskInfos.ps, status = this.tasksSort, type = this.taskTab } = {}) {
      if (!this.userInfo.address) return
      this.loading = true
      const params = {
        pn,
        ps,
        type,
        status
      }
      const res = await getUserTasks(params)
      if (res.code === 1000 && res.data) {
        // const { list, total } = res.data
        // this.tasks = list
        // this.tTotal = total
        this.$set(this, 'taskInfos', res.data)
      }
      this.loading = false
    },

    // async getTaskRewards ({ pn = 1, ps = 10 } = {}) {
    //   this.loading = true
    //   const params = {
    //     pn,
    //     ps,
    //     type: 'lord'
    //   }
    //   const res = await getUserTasks(params)
    //   if (res.code === 1000) {
    //     const { list, total } = res.data
    //     this.taskRewards = list
    //     this.tRTotal = total
    //   }
    //   this.loading = false
    // },

    pageChange (pn) {
      this.getTasks({ pn })
    },

    chooseTask (item) {
      console.log('-----chooseTask', item)
      this.taskInfo = item
      this.$nextTick(() => {
        this.detailModel = true
        historyState(`/task/${item._id}`)
      })
    },

    playTask (item) {
      window.open(item.ldbTaskType.url)
    },

    /**
     * 对话框关闭触发函数
     */
    dialogClose () {
      historyState(this.$route.path)
    }
  },
  watch: {
    userInfo (val, oval) {
      this.getTasks()
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

  // user-tasks-skeletion
  .user-tasks-skeletion {
    position: absolute;
    left: 0;
    top: 70px;
    width: 100%;
    >div {
      padding: 30px 45px;
      background-color: $--skeletion-light;
      border-radius: 5px;
    }
  }
  .tasks-skeletion-left {
    >p {
      background-color: $--skeletion-dark;
      &:nth-of-type(1) {
        width: 280px;
        height: 30px;
      }
      &:nth-of-type(2) {
        margin-top: 15px;
        width: 200px;
        height: 20px;
      }
      &:nth-of-type(3) {
        margin-top: 25px;
        width: 280px;
        height: 25px;
      }
    }
  }
  .tasks-skeletion-right {
    >p {
      background-color: $--skeletion-dark;
      &:nth-of-type(1) {
        margin-left: 50px;
        width: 100px;
        height: 15px;
      }
      &:nth-of-type(2) {
        margin-top: 10px;
        width: 150px;
        height: 20px;
      }
    }
  }

  .tasks-sort {
    margin-top: 30px;
  }
  .tasks-sort-select {
    margin-left: 10px;
    /deep/ .el-input__inner {
      width: 140px !important;
      height: 34px;
      line-height: 34px;
      font-size: 16px;
      color: #fff;
      background-color: #4586FC;
      border-radius: 20px;
      border: none;
    }
    /deep/ .el-input {
      .el-select__caret {
        font-weight: bolder;
        color: #fff;
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
