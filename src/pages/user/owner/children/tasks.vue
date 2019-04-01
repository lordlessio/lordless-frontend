<template>
  <div class="d-flex user-tasks-box">
    <div class="d-flex v-flex col-flex user-candy-container">
      <h1 class="text-cap owner-children-title">Quests</h1>
      <div
        class="user-tabs-box">
        <el-tabs
          v-model="currentTab"
          @tab-click="chooseTab">
          <el-tab-pane
            label="Bottoms up"
            name="bottoms"/>
          <el-tab-pane
            label="Promotion"
            name="promotion"/>
          <el-tab-pane
            label="Bounty"
            name="bounty"/>
          <el-tab-pane
            label="Reward"
            name="reward"/>
        </el-tabs>
      </div>
      <div v-if="tasksCurrentInfo.select" class="owner-children-sort-box">
        <span>Filter by</span>
        <ld-select
          class="owner-children-select"
          v-model="tasksSort"
          :items="sortItems"
          @change="filterTasks"/>
      </div>
      <div class="v-flex d-flex">
        <transition name="ld-hide-fade" mode="out-in">
          <div v-if="loading" class="v-flex user-tasks-skeletion">
            <promotion-skeletion v-if="tasksCurrentInfo.skeletion"/>
            <div v-else>
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
          </div>
          <div
            v-else-if="!tasksCurrentInfo.total && !loading"
            class="v-flex d-flex col-flex f-auto-center text-center no-asset-box">
            <svg>
              <use :xlink:href="emptyInfo.icon"/>
            </svg>
            <p>{{ emptyInfo.desc }}</p>
            <div class="d-flex f-auto-center TTFontBolder">
              <span>{{ emptyInfo.text }}</span>
              <span class="inline-block">
                <lordless-btn class="TTFontBolder no-asset-btn" theme="default" shadow @click="emptyInfo.routePath ? $router.push(emptyInfo.routePath) : null">{{ emptyInfo.btnText }}</lordless-btn>
              </span>
            </div>
          </div>
          <div v-else>
            <el-row v-if="currentTab === 'bottoms'" :gutter="20" class="relative user-tasks-cnt">
              <el-col
                :xs="24"
                class="tasks-item"
                v-for="(task, index) of tasksCurrentInfo.list"
                :key="index">
                <task-card
                  :info="task"
                  @play="playTask"
                  @choose="chooseTask">
                </task-card>
              </el-col>
            </el-row>
            <el-row v-else-if="currentTab === 'promotion'" :gutter="20" class="relative user-tasks-cnt">
              <el-col
                :xs="24"
                class="tasks-item"
                v-for="(promotion, index) of tasksCurrentInfo.list"
                :key="index">
                <promotion-airdrop v-if="promotion.airdrop" :info="promotion" lg shadow/>
                <promotion-lucky v-else :info="promotion" lg shadow/>
              </el-col>
            </el-row>
            <el-row v-if="currentTab === 'reward'" :gutter="20" class="relative user-tasks-cnt">
              <el-col
                :xs="24"
                class="tasks-item"
                v-for="(task, index) of tasksCurrentInfo.list"
                :key="index">
                <task-card
                  :info="task"
                  reward
                  @choose="chooseTask">
                </task-card>
              </el-col>
            </el-row>
            <el-row v-else :gutter="20" class="relative user-tasks-cnt">
              <el-col
                :xs="24"
                class="tasks-item"
                v-for="(task, index) of tasksCurrentInfo.list"
                :key="index">
                <task-card
                  :info="task"
                  reward
                  @choose="chooseTask">
                </task-card>
              </el-col>
            </el-row>
          </div>
        </transition>
      </div>
      <div v-if="tasksCurrentInfo.total"
          class="owner-children-pagination">
        <lordless-pagination
          :scrollE="$el"
          :currentPage="tasksCurrentInfo.pn"
          :scrollPE="pageScrollPE"
          :total="tasksCurrentInfo.total"
          background
          @currentChange="pageChange"/>
      </div>
    </div>
    <task-dialog
      v-model="detailModel"
      :taskId="taskInfo._id"
      @close="dialogClose"/>
  </div>
</template>

<script>
import TaskDialog from '@/components/reuse/dialog/task/detail'
import TaskCard from '@/components/reuse/card/task'
import LdSelect from '@/components/stories/select'

import PromotionAirdrop from '@/components/reuse/_mobile/card/quests/promotion'
import PromotionLucky from '@/components/reuse/_mobile/card/quests/lucky'
import PromotionSkeletion from '@/components/skeletion/_mobile/quests/promotion'

import { historyState } from 'utils/tool'

import { getUserTasks, getAirdropUsers } from 'api'
import { publicMixins } from '@/mixins'
import { mapState } from 'vuex'
export default {
  mixins: [publicMixins],
  data: (vm) => {
    let type = vm.$route.query.type
    const types = [ 'bottoms', 'reward', 'promotion', 'bounty' ]
    type = types.includes(type) ? type : 'bottoms'
    return {

      loading: false,

      tabFilters: {
        bottoms: 'candy',
        reward: 'lord',
        promotion: 'promotion',
        bounty: 'tasks'
      },

      // 当前 tab 区域,默认为地址栏参数
      currentTab: type,

      // 上一个历史的 tab 区域
      prevTab: type,

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

    emptyInfo () {
      const _currentTab = this.currentTab
      const obj = {
        bottoms: {
          icon: '#icon-no-candy',
          desc: 'You have no Bootoms up now.',
          text: 'recive candy in Taverns',
          routePath: '/map',
          btnText: 'Map'
        },
        promotion: {
          icon: '#icon-no-candy',
          desc: 'You have nothing on Promotion now.',
          text: 'Try to Receive a promotion in',
          routePath: '/project/promotions',
          btnText: 'Promotions'
        },
        bounty: {
          icon: '#icon-no-candy',
          desc: 'You have nothing Bounty now.',
          text: 'recive Task in Taverns',
          routePath: '/map',
          btnText: 'Map'
        },
        reward: {
          icon: '#icon-no-candy',
          desc: 'You have nothing on LORD rewarded now.',
          text: 'recive Task in Taverns',
          routePath: '/map',
          btnText: 'Map'
        }
      }
      return obj[_currentTab]
    },

    tasksCurrentInfo () {
      const _currentTab = this.currentTab
      const obj = {
        bootoms: {},
        promotion: {
          skeletion: true
        },
        bounty: {
          select: true
        },
        reward: {}
      }
      return Object.assign({}, this.taskInfos[_currentTab], obj[_currentTab])
    },

    pageScrollPE () {
      return document.getElementById('user-main-content')
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

    PromotionAirdrop,
    PromotionLucky,
    PromotionSkeletion
  },
  methods: {
    // afterEnter () {
    //   this.scrollListenerFunc()
    // },
    // tasksMethod () {
    //   const _currentTab = this.currentTab
    //   const obj = {
    //     bootoms:
    //   }
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
    async getTasks ({ pn = this.tasksCurrentInfo.pn, ps = this.tasksCurrentInfo.ps, status = this.tasksSort, type = this.currentTab } = {}) {
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
    // padding: 30px 30px 100px;
    // padding-bottom: 100px;
    font-size: 16px;
    // @include padding(-1, 30px, 1);
  }

  // user-tasks-skeletion
  .user-tasks-skeletion {
    margin-top: 35px;
    // position: absolute;
    // left: 0;
    // top: 70px;
    // width: 100%;
    // &.has-filter {
    //   top: 130px;
    // }
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

  // .ld-tasks-pagination {
  //   // position: absolute;
  //   // left: 0;
  //   // bottom: -100px;
  //   margin-top: 50px;
  //   margin-bottom: 50px;
  // }

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
