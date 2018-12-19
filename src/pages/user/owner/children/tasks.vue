<template>
  <div class="d-flex user-tasks-box">
    <div class="d-flex v-flex col-flex user-candy-container">
      <h1 class="text-cap owner-children-title">Quests</h1>
      <div
        class="v-flex relative onwer-children-cnt">
        <el-tabs
          v-model="currentTab"
          @tab-click="chooseTab">
          <el-tab-pane
            label="Bottoms up"
            name="bottoms">
            <!-- <div class="tasks-sort">
              <span>Filter by</span>
              <ld-select
                class="tasks-sort-select"
                v-model="tasksSort"
                :items="sortItems"
                @change="filterTasks">
              </ld-select>
            </div> -->
            <transition name="ld-hide-fade" mode="out-in">
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
              <div
                v-else-if="!taskInfos.bottoms.total && !loading"
                class="d-flex v-flex col-flex f-auto-center text-center no-asset-box absolute user-no-sale-tasks">
                <svg>
                  <use xlink:href="#icon-no-candy"/>
                </svg>
                <p>You have no Bootoms up now.</p>
                <div class="d-flex f-auto-center TTFontBolder">
                  <span>recive candy in Tavern</span>
                  <span class="inline-block">
                    <lordless-btn class="TTFontBolder no-asset-btn" theme="default" shadow @click="$router.push('/map')">Map</lordless-btn>
                  </span>
                </div>
              </div>
              <el-row v-else :gutter="20" class="relative user-tasks-cnt">
                <el-col
                  :xs="24"
                  class="tasks-item"
                  v-for="(task, index) of taskInfos.bottoms.list"
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
            label="Promotion"
            name="promotion">
            <transition name="ld-hide-fade" mode="out-in">
              <promotion-skeletion v-if="loading"/>
              <div
                v-else-if="!taskInfos.promotion.total && !loading"
                class="d-flex v-flex col-flex f-auto-center text-center no-asset-box absolute user-no-sale-tasks">
                <svg>
                  <use xlink:href="#icon-no-candy"/>
                </svg>
                <p>You have nothing on Promotion now.</p>
                <div class="d-flex f-auto-center TTFontBolder">
                  <span>Try to Receive a promotion in</span>
                  <span class="inline-block">
                    <lordless-btn class="TTFontBolder no-asset-btn" theme="default" shadow @click="$router.push('/project/promotions')">Promotions</lordless-btn>
                  </span>
                </div>
              </div>
              <el-row v-else :gutter="20" class="relative user-tasks-cnt">
                <el-col
                  :xs="24"
                  class="tasks-item"
                  v-for="(promotion, index) of taskInfos.promotion.list"
                  :key="index">
                  <promotion-card :info="promotion" lg shadow/>
                </el-col>
              </el-row>
            </transition>
          </el-tab-pane>
          <el-tab-pane
            label="Bounty"
            name="bounty">
            <div class="tasks-sort">
              <span>Filter by</span>
              <ld-select
                class="tasks-sort-select"
                v-model="tasksSort"
                :items="sortItems"
                @change="filterTasks">
              </ld-select>
            </div>
            <transition name="ld-hide-fade" mode="out-in">
              <div v-if="loading" class="user-tasks-skeletion has-filter">
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
              <div
                v-else-if="!taskInfos.bounty.total && !loading"
                class="d-flex v-flex col-flex f-auto-center text-center no-asset-box absolute user-no-sale-tasks">
                <svg>
                  <use xlink:href="#icon-no-candy"/>
                </svg>
                <p>You have nothing Bounty now.</p>
                <!-- <div class="d-flex f-auto-center TTFontBolder">
                  <span>Make the first selling transaction for your</span>
                </div> -->
                <div class="d-flex f-auto-center TTFontBolder">
                  <span>recive Task in Taverns</span>
                  <span class="inline-block">
                    <lordless-btn class="TTFontBolder no-asset-btn" theme="default" shadow @click="$router.push('/map')">Map</lordless-btn>
                  </span>
                </div>
              </div>
              <el-row v-else :gutter="20" class="relative user-tasks-cnt">
                <el-col
                  :xs="24"
                  class="tasks-item"
                  v-for="(task, index) of taskInfos.bounty.list"
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
            label="Reward"
            name="reward">
            <!-- <div class="tasks-sort">
              <span>Filter by</span>
              <ld-select
                class="tasks-sort-select"
                v-model="tasksSort"
                :items="sortItems"
                @change="filterTasks">
              </ld-select>
            </div> -->
            <transition name="ld-hide-fade" mode="out-in">
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
              <div
                v-else-if="!taskInfos.reward.total && !loading"
                class="d-flex v-flex col-flex f-auto-center text-center no-asset-box absolute user-no-sale-tasks">
                <svg>
                  <use xlink:href="#icon-no-candy"/>
                </svg>
                <p>You have nothing on LORD rewarded now.</p>
                <div class="d-flex f-auto-center TTFontBolder">
                  <span>Try to buy a Tavern in</span>
                  <span class="inline-block">
                    <lordless-btn class="TTFontBolder no-asset-btn" theme="default" shadow @click="$router.push('/market')">Marketplace</lordless-btn>
                  </span>
                </div>
              </div>
              <el-row v-else :gutter="20" class="relative user-tasks-cnt">
                <el-col
                  :xs="24"
                  class="tasks-item"
                  v-for="(task, index) of taskInfos.reward.list"
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
        <lordless-pagination
          v-if="showPagination"
          class="ld-tasks-pagination"
          :scrollE="$el"
          :currentPage="currentPage"
          :scrollPE="pageScrollPE"
          :total="pageTotal"
          background
          @currentChange="pageChange"/>
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
import LdSelect from '@/components/stories/select'

import PromotionCard from '@/components/reuse/_mobile/card/quests/promotion'
import PromotionSkeletion from '@/components/skeletion/_mobile/quests/promotion'

import { historyState } from 'utils/tool'

import { getUserTasks, getAirdropUsers } from 'api'
import { publicMixins } from '@/mixins'
import { mapState } from 'vuex'
export default {
  mixins: [publicMixins],
  data: (vm) => {
    return {

      loading: false,

      tabFilters: {
        bottoms: 'candy',
        reward: 'lord',
        promotion: 'promotion',
        bounty: 'tasks'
      },

      // 当前 tab 区域,默认为地址栏参数
      currentTab: vm.$route.query.type || 'bottoms',

      // 上一个历史的 tab 区域
      prevTab: vm.$route.query.type || 'bottoms',

      // task detail 弹窗
      detailModel: false,

      // 选中的建筑
      taskInfo: {},

      taskInfos: {
        bounty: {
          pn: 1,
          ps: 10,
          list: [],
          total: 0,
          more: true
        },
        bottoms: {
          pn: 1,
          ps: 10,
          list: [],
          total: 0,
          more: true
        },
        reward: {
          pn: 1,
          ps: 10,
          list: [],
          total: 0,
          more: true
        },
        promotion: {
          pn: 1,
          ps: 10,
          list: [],
          total: 0,
          more: true
        }
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
      tRTotal: 0,

      // scroll options
      scrollHandle: null
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ]),
    ...mapState('status', {
      popstateModel: 'popstate'
    }),
    pageScrollPE () {
      return document.getElementById('user-main-content')
    },
    currentPage () {
      return this.taskInfos[this.currentTab].pn
    },
    pageTotal () {
      // if (this.currentTab === 'tasks') {
      //   return this.tTotal
      // }
      return this.taskInfos[this.currentTab].total
    },
    showPagination () {
      const { total, pn, ps } = this.taskInfos[this.currentTab]
      return total > pn * ps
    //   if (this.currentTab === 'tasks') {
    //     return this.tasks.length
    //   }
    //   return this.taskRewards.lnegth
    }
  },
  watch: {
    // userInfo (val, oval) {
    //   this.getTasks()
    // },
    popstateModel (val) {
      console.log('popstate', val, location.pathname)
      if (val && location.pathname.includes('/owner/tasks')) {
        this.detailModel = false
      }
    },
    account () {
      this.initQuest()
    }
  },
  components: {
    TaskDialog,
    TaskCard,
    LdSelect,

    PromotionCard,
    PromotionSkeletion
  },
  methods: {
    // afterEnter () {
    //   this.scrollListenerFunc()
    // },

    /**
     * 根据 type 初始化 quest
     */
    async initQuest (type = this.currentTab) {
      if (!this.rendered) this.rendered = true
      const data = await this.getTasks(Object.assign({}, this.taskInfos[type], { type }))
      data && this.$set(this.taskInfos, type, data)
      this.currentTab = type
    },

    /**
     * choose tab
     */
    async chooseTab () {
      // const _currentTab = this.currentTab
      // if (this.prevTab === this.currentTab) return
      // this.prevTab = this.currentTab
      // this.tasksSort = -2
      // this.$set(this.taskInfos[this.currentTab], 'pn', 1)
      // this.$set(this.taskInfos[this.currentTab], 'ps', 10)

      // this.getTasks()

      // historyState(`/owner/quests?type=${_currentTab}`)

      const _currentTab = this.currentTab
      if (this.prevTab === _currentTab) return

      // 切换 tab 之后，在数据还未修改之前，将之前tab的 scrollTop 进行存储
      const _prevTab = this.prevTab
      const _scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
      console.log('chooseTab _scrollTop', _scrollTop)
      this.$set(this.taskInfos[_prevTab], 'scrollTop', _scrollTop)

      // 将 scrollTop 复位 为0
      // scrollTo(0)

      historyState(`/owner/quests?type=${_currentTab}`)
      this.prevTab = _currentTab
      // this.bountyStatus = -2

      // 切换tab之前，判断当前tab是否含有历史数据，如果有，就不请求
      if (!this.taskInfos[_currentTab].total) {
        const data = await this.getTasks(this.taskInfos[_currentTab])
        data && this.$set(this.taskInfos, _currentTab, data)
      }
    },

    filterTasks (e) {
      this.getTasks({ status: e })
    },

    /**
     * 获取 task 基础事件
     */
    async getTasks ({ pn = this.taskInfos[this.currentTab].pn, ps = this.taskInfos[this.currentTab].ps, status = this.tasksSort, type = this.currentTab } = {}) {
      // if (!this.userInfo.address) return

      // 根据选择器的key，过滤后端对应sort字符
      const _type = this.tabFilters[type]
      // const _status = this.bountyStatusFilters[status]

      this.currentTab = type

      this.loading = true

      // const params = { pn, ps, type: _type, status: _status }
      const params = { pn, ps, type: _type, status }

      let data = null
      try {
        let res
        if (_type === 'promotion') {
          res = await getAirdropUsers(params)
        } else {
          res = await getUserTasks(params)
        }
        if (res.code === 1000 && res.data) {
          data = res.data
        }
        this.loading = false
      } catch (err) {
        this.loading = false
      }

      return data
    },

    // 获取更多 tasks
    async loadMoreTasks (cb) {
      const currentTab = this.currentTab
      const info = this.taskInfos[currentTab]
      const pn = info.pn + 1
      const { list, ps, total } = await this.getTasks({ pn })

      this.$set(this.taskInfos, currentTab, Object.assign({}, info, {
        list: info.list.concat(list),
        pn,
        ps,
        total
      }))

      return cb && cb()
    },

    /**
     * scroll 监听事件
     */
    // scrollListenerFunc ({ bool = false, bottom = 80, pHeight = document.body.offsetHeight, chooseTab = false } = {}) {
    //   this.scrollHandle && document.removeEventListener('scroll', this.scrollHandle)
    //   this.scrollHandle = null

    //   console.log(' --- scroll')
    //   const box = document.getElementById('mobile-quests-content-box')
    //   let bHeight = box ? box.offsetHeight : 0
    //   // 如果 bHeight 不存在或者 bHeight - bottom 小于 pHeight, return
    //   if (!bHeight || bHeight - bottom < pHeight) return

    //   const _currentTab = this.currentTab

    //   // chooseTab 根据已有 scrollTop 值做变化
    //   if (chooseTab) {
    //     // 将 scrollTop 修改为当前 tab 的scrollTop值
    //     const _cScrollTop = this.taskInfos[_currentTab].scrollTop || 0
    //     console.log('_cScrollTop', _cScrollTop)
    //     scrollTo(_cScrollTop)
    //   }

    //   const handleFunc = () => {
    //     if (bool || this.taskInfos[_currentTab].noMore) return
    //     if (!bHeight) bHeight = box.offsetHeight
    //     const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop

    //     // 如果页面上滑到达指定条件位置
    //     // 读取更多数据
    //     if (scrollTop + pHeight + bottom > bHeight) {
    //       bool = true
    //       this.loadMoreTasks(() => {
    //         this.$nextTick(() => {
    //           bool = false
    //           bHeight = box.offsetHeight
    //         })
    //       })
    //     }
    //   }
    //   handleFunc()

    //   this.scrollHandle = handleFunc

    //   this.$nextTick(() => {
    //     document.addEventListener('scroll', this.scrollHandle)
    //   })
    // },

    // async getTasks ({ pn = this.taskInfos.pn, ps = this.taskInfos.ps, status = this.tasksSort, type = this.currentTab } = {}) {
    //   if (!this.userInfo.address) return
    //   this.loading = true
    //   const params = {
    //     pn,
    //     ps,
    //     type,
    //     status
    //   }
    //   const res = await getUserTasks(params)
    //   if (res.code === 1000 && res.data) {
    //     // const { list, total } = res.data
    //     // this.tasks = list
    //     // this.tTotal = total
    //     this.$set(this, 'taskInfos', res.data)
    //   }
    //   this.loading = false
    // },

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

    async pageChange (pn) {
      const currentTab = this.currentTab
      const info = this.taskInfos[currentTab]
      const { list, ps, total } = await this.getTasks({ pn })
      this.$set(this.taskInfos, currentTab, Object.assign({}, info, {
        list: info.list.concat(list),
        pn,
        ps,
        total
      }))
      // this.getTasks({ pn })
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
      if (!this.popstateModel) historyState(this.$route.path)
    }

    // destoryTasks () {
    //   this.scrollHandle && document.removeEventListener('scroll', this.scrollHandle)
    //   this.scrollHandle = null
    // }
  },
  // beforeDestroy () {
  //   this.destoryTasks()
  // },
  mounted () {
    this.$nextTick(() => {
      const type = this.$route.query.type
      this.initQuest(type)
      // this.getTasks()
    })
  }
}
</script>

<style lang="scss" scoped>

  .user-tasks-box {
    padding: 30px 30px 100px;
    font-size: 16px;
    // @include padding(-1, 30px, 1);
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
    &.has-filter {
      top: 130px;
    }
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

  .ld-tasks-pagination {
    position: absolute;
    left: 0;
    bottom: -100px;
  }

  .user-no-sale-tasks {
    // width: 100%;
    // @include margin('top', 50px, 1, -2);
    // @media screen and (min-width: 769px) {
    //   position: absolute;
    //   top: 50%;
    //   left: 50%;
    //   transform: translate(-50%, -50%);
    // }
  }
  .tasks-item {
    @include margin('top', 30px, 1);
  }
</style>
