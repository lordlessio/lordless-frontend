<template>
  <div class="mobile-quests-box">
    <el-tabs
      v-model="taskTab"
      stretch
      @tab-click="chooseTab">
      <el-tab-pane
        label="Bottoms up"
        name="bottoms">
        <transition name="ld-hide-fade" mode="out-in">
          <mobile-bottoms-up-skeletion class="quest-cnt-box" v-if="loading"/>
          <div
            v-else-if="!loading && !infos.bottoms.total"
            class="d-flex f-auto-center mobile-quests-empty mobile-bounty-empty">
            <div class="quests-empty-container">
              <p class="quests-empty-icon">
                <svg>
                  <use xlink:href="#icon-no-candy"/>
                </svg>
              </p>
              <p class="quests-empty-desc">You have not claimed any candy.</p>
              <div class="quests-empty-btns">
                <lordless-btn class="quests-empty-btn" theme="blue" inverse shadow @click="$route.push('/market')">Bottoms up</lordless-btn>
              </div>
            </div>
          </div>
          <div v-else ref="bottomsQuestCnt" class="quest-cnt-box quest-item-content">
            <ul>
              <li
                class="quest-item"
                v-for="bottoms of infos.bottoms.list" :key="bottoms._id">
                <mobile-quest-bounty
                  bottoms
                  :info="bottoms"/>
              </li>
            </ul>
            <div class="quest-pagination-box">
              <lordless-pagination
                :scrollE="bottomsPageScrollE"
                :scrollOffset="150"
                class="quest-pagination-pages"
                :total="infos.bottoms.total"
                :currentPage="infos.bottoms.pn"
                :size="infos.bottoms.ps"
                theme="blue"
                background
                @currentChange="changePage($event, 'bottoms')"/>
            </div>
          </div>
        </transition>
      </el-tab-pane>
      <el-tab-pane
        class="relative"
        label="Bounty"
        name="bounty">
        <div class="d-flex tasks-sort-box">
          <mobile-sort-bar
            class="v-flex tasks-sort-bar"
            :sortItems="bountySortItems"
            static
            inheritHeight
            :showOrder="false"
            :showTotal="false"
            @sort="bountySortChange">
            <span class="tasks-sort-title">Filter by</span>
          </mobile-sort-bar>
        </div>
        <transition name="ld-hide-fade" mode="out-in">
          <mobile-bounty-skeletion class="quest-cnt-box" v-if="loading"/>
          <div
            v-else-if="!loading && !infos.bounty.total"
            class="d-flex f-auto-center mobile-quests-empty mobile-bounty-empty">
            <div class="quests-empty-container">
              <p class="quests-empty-icon">
                <svg>
                  <use xlink:href="#icon-no-candy"/>
                </svg>
              </p>
              <p class="quests-empty-desc">You have not apply any quests now.</p>
              <div class="quests-empty-btns">
                <lordless-btn class="quests-empty-btn" theme="blue" inverse shadow @click="$route.push('/market')">Apply a quest</lordless-btn>
              </div>
            </div>
          </div>
          <div v-else ref="bountyQuestCnt" class="quest-cnt-box quest-item-content quest-tasks-content">
            <ul>
              <li
                class="quest-item"
                v-for="bounty of infos.bounty.list" :key="bounty._id">
                <mobile-quest-bounty
                  :info="bounty"/>
              </li>
            </ul>
            <div class="quest-pagination-box">
              <lordless-pagination
                :scrollE="bountyPageScrollE"
                :scrollOffset="150"
                class="quest-pagination-pages"
                :total="infos.bounty.total"
                :currentPage="infos.bounty.pn"
                :size="infos.bounty.ps"
                theme="blue"
                background
                @currentChange="changePage($event, 'bounty')"/>
            </div>
          </div>
        </transition>
      </el-tab-pane>
      <el-tab-pane
        label="Reward"
        name="reward">
        <transition name="ld-hide-fade" mode="out-in">
          <mobile-reward-skeletion class="quest-cnt-box" v-if="loading"/>
          <div
            v-else-if="!loading && !infos.reward.total"
            class="d-flex f-auto-center mobile-quests-empty mobile-bounty-empty">
            <div class="quests-empty-container">
              <p class="quests-empty-icon">
                <svg>
                  <use xlink:href="#icon-no-candy"/>
                </svg>
              </p>
              <p class="quests-empty-desc">You have no taverns now.</p>
              <div class="quests-empty-btns">
                <lordless-btn class="quests-empty-btn" theme="blue" inverse shadow @click="$route.push('/market')">Buy a tavern</lordless-btn>
              </div>
            </div>
          </div>
          <div v-else ref="rewardQuestCnt" class="quest-cnt-box quest-item-content">
            <ul>
              <li
                class="quest-item"
                v-for="reward of infos.reward.list" :key="reward._id">
                <mobile-quest-reward
                  :info="reward"/>
              </li>
            </ul>
            <div class="quest-pagination-box">
              <lordless-pagination
                :scrollE="rewardPageScrollE"
                :scrollOffset="150"
                class="quest-pagination-pages"
                :total="infos.reward.total"
                :currentPage="infos.reward.pn"
                :size="infos.reward.ps"
                theme="blue"
                background
                @currentChange="changePage($event, 'reward')"/>
            </div>
          </div>
        </transition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MobileQuestBounty from '@/components/reuse/_mobile/card/quests/bounty'
import MobileQuestReward from '@/components/reuse/_mobile/card/quests/reward'

import MobileSortBar from '@/components/reuse/_mobile/sortBar'

import MobileBottomsUpSkeletion from '@/components/skeletion/_mobile/quests/bottomsUp'
import MobileBountySkeletion from '@/components/skeletion/_mobile/quests/bounty'
import MobileRewardSkeletion from '@/components/skeletion/_mobile/quests/reward'

import { getUserTasks } from 'api'
import { historyState } from 'utils/tool'
export default {
  name: 'mobile-quest-content',
  props: {
    type: {
      type: String,
      default: 'bottoms'
    }
  },
  data: () => {
    return {
      popstateModel: false,
      tabFilters: {
        bottoms: 'candy',
        bounty: 'tasks',
        reward: 'lord'
      },

      // 当前 tab 区域
      taskTab: 'bottoms',

      // 改变之前的 tab 区域
      currentTab: 'bottoms',

      loading: true,

      infos: {
        bottoms: {
          pn: 1,
          ps: 10,
          list: [],
          total: 0
        },
        bounty: {
          pn: 1,
          ps: 10,
          list: [],
          total: 0
        },
        reward: {
          pn: 1,
          ps: 10,
          list: [],
          total: 0
        }
      },

      // sortBar options
      bountyStatus: -2,
      bountyStatusFilters: {
        'all': -2,
        'under': 0,
        'approved': 1,
        'rejected': -1
      },
      bountySortItems: {
        'all': 'All',
        'under': 'Under way',
        'approved': 'Approved',
        'rejected': 'Rejected'
      }
    }
  },
  computed: {
    bottomsPageScrollE () {
      return this.$refs.bottomsQuestCnt
    },
    bountyPageScrollE () {
      return this.$refs.bountyQuestCnt
    },
    rewardPageScrollE () {
      return this.$refs.rewardQuestCnt
    }
  },
  watch: {
    popstateModel (val) {
      if (val) {
        this.taskTab = this.$route.query.type || 'bottoms'
        this.popstateModel = false
      }
    }
  },
  components: {
    MobileQuestReward,
    MobileQuestBounty,
    MobileSortBar,

    MobileBottomsUpSkeletion,
    MobileBountySkeletion,
    MobileRewardSkeletion
  },
  methods: {

    async changePage (page, type = 'bottoms') {
      if (page === this.infos[type].pn) return

      this.$set(this.infos[type], 'pn', page)
      this.$nextTick(async () => {
        const data = await this.getTasks(this.infos[type])
        data && this.$set(this.infos, type, data)
      })
      console.log('page', page, this.infos[type].pn)
    },

    /**
     * bounty sort 事件
     */
    async bountySortChange (status) {
      this.bountyStatus = status
      const data = await this.getTasks({ status })
      data && this.$set(this.infos, this.taskTab, data)
    },

    /**
     * 根据 type 初始化 quest
     */
    async initQuest (type = 'bottoms') {
      const data = await this.getTasks(Object.assign({}, this.infos[type], { type }))
      data && this.$set(this.infos, type, data)
    },

    /**
     * choose tab
     */
    chooseTab () {
      if (this.currentTab === this.taskTab) return

      historyState(`/owner/quest?type=${this.taskTab}`)
      this.currentTab = this.taskTab
      this.bountyStatus = -2

      if (this.infos[this.taskTab].total) return
      this.$nextTick(async () => {
        const data = await this.getTasks(this.infos[this.taskTab])
        data && this.$set(this.infos, this.taskTab, data)
      })
    },

    /**
     * 获取 task 基础事件
     */
    async getTasks ({ pn = 1, ps = 10, status = this.bountyStatus, type = this.taskTab } = {}) {
      const _type = this.tabFilters[type]
      const _status = this.bountyStatusFilters[status]

      this.taskTab = type

      this.loading = true

      const params = { pn, ps, type: _type, status: _status }

      let data = null
      try {
        const res = await getUserTasks(params)
        if (res.code === 1000 && res.data) {
          data = res.data
        }
        this.loading = false
      } catch (err) {
        this.loading = false
      }

      return data
    },

    /**
     * window popstate 监听事件
     */
    popstateListener () {
      if (this.popstateModel) return
      this.popstateModel = true
    }
  },
  beforeDestroy () {
    window.removeEventListener('popstate', this.popstateListener)
  },
  mounted () {
    // 监听 popstate 事件，主要用于 pushState 监听
    window.addEventListener('popstate', this.popstateListener)
    this.$nextTick(() => {
      const type = this.$route.query.type
      this.initQuest(type)
    })
  }
}
</script>

<style lang="scss" scoped>

.quest-cnt-box {
  padding: 24px 20px;
  box-sizing: border-box;
}
.quest-item-content {
  @include overflow();
  @include viewport-unit(height, 100vh, 112px);
}
.quest-item {
  box-shadow: 0 0 10px 3px rgba(200, 200, 200, .35);
  &:not(:first-of-type) {
    margin-top: 18px;
  }
}
.quest-tasks-content {
  padding-top: 59px;
  box-sizing: border-box;
}

/deep/ {
  // .el-tabs__nav {
  //   margin: 0 auto;
  // }
  .el-tabs__header {
    margin: 0;
    padding: 6.5px 20px;
    background-color: #4586FC;
    color: #fff;
  }
  .el-tabs__active-bar {
    bottom: 5px;
    background-color: #fff;
  }
  .el-tabs__nav-wrap::after {
    bottom: 5px;
    background-color: transparent;
  }
  .el-tabs__item {
    font-family: $--font-TTNormsBold;
    font-size: 16px;
    color: #fff;
    &.is-active {
      color: #fff;
    }
  }
  .el-tabs__content {
    // padding: 0 20px;
  }
}

.tasks-sort-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.tasks-sort-title {
  margin-right: 15px;
  font-size: 16px;
  color: #999;
}
// .tasks-sort-bar {
//   margin-left: 12px;
// }

/**
 *  mobile-quests-empty -- begin
 */

 // 此处style可以和其他组件复用，eg：connect
.mobile-quests-empty {
  @include viewport-unit(min-height, 100vh, 112px);
}
.quests-empty-container {
  margin: 0 auto;
  max-width: 300px;
  font-size: 16px;
}
.quests-empty-icon {
  margin: 0 auto;
  width: 120px;
  height: 120px;
  line-height: 0;
  fill: #999;
}
.quests-empty-desc {
  margin-top: 12px;
  color: #999;
}
.quests-empty-btns {
  margin-top: 36px;
}
.quests-empty-btn {
  padding: 12px 0;
  width: 100%;
  &:not(:first-of-type) {
    margin-top: 12px;
  }
}
/**
 *  mobile-quests-empty -- end
 */

.quest-pagination-box {
  margin-top: 35px;
}
</style>
