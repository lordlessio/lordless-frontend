<template>
  <div class="mobile-quests-box">
    <el-tabs
      v-model="taskTab"
      @tab-click="chooseTab">
      <el-tab-pane
        label="Bottoms up"
        name="candy">
        <transition name="ld-hide-fade" mode="out-in">
          <mobile-bottoms-up-skeletion v-if="loading"/>
          <div
            v-else-if="!loading && !infos.candy.total"
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
          <div v-else class="quest-item-content">
            <ul>
              <li
                class="quest-item"
                v-for="candy of infos.candy.list" :key="candy._id">
                <mobile-quest-bounty
                  bottoms
                  :info="candy"/>
              </li>
            </ul>
          </div>
        </transition>
      </el-tab-pane>
      <el-tab-pane
        class="relative"
        label="Bounty"
        name="tasks">
        <div class="d-flex tasks-sort-box">
          <span>Filter by</span>
          <mobile-sort-bar
            class="v-flex tasks-sort-bar"
            :sortItems="taskSortItems"
            static
            inheritHeight
            :showOrder="false"
            :showTotal="false"
            @sort="candySortChange"/>
        </div>
        <transition name="ld-hide-fade" mode="out-in">
          <mobile-bounty-skeletion v-if="loading"/>
          <div
            v-else-if="!loading && !infos.tasks.total"
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
          <div v-else class="quest-item-content quest-tasks-content">
            <ul>
              <li
                class="quest-item"
                v-for="task of infos.tasks.list" :key="task._id">
                <mobile-quest-bounty
                  :info="task"/>
              </li>
            </ul>
          </div>
        </transition>
      </el-tab-pane>
      <el-tab-pane
        label="Reward"
        name="lord">
        lord reward
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MobileQuestBounty from '@/components/reuse/_mobile/card/quests/bounty'
import MobileSortBar from '@/components/reuse/_mobile/sortBar'

import MobileBottomsUpSkeletion from '@/components/skeletion/_mobile/quests/bottomsUp'
import MobileBountySkeletion from '@/components/skeletion/_mobile/quests/bounty'

import { getUserTasks } from 'api'
import { historyState } from 'utils/tool'
export default {
  name: 'mobile-quest-content',
  props: {
    type: {
      type: String,
      default: 'candy'
    }
  },
  data: () => {
    return {
      // 当前 tab 区域
      taskTab: 'candy',

      // 改变之前的 tab 区域
      currentTab: 'candy',

      taskInfos: {
        pn: 1,
        ps: 10,
        list: [],
        total: 0
      },

      loading: true,

      infos: {
        candy: {
          pn: 1,
          ps: 10,
          list: [],
          total: 0
        },
        tasks: {
          pn: 1,
          ps: 10,
          list: [],
          total: 0
        },
        lord: {
          pn: 1,
          ps: 10,
          list: [],
          total: 0
        }
      },

      // sortBar options
      taskStatus: -2,
      taskSortItems: {
        '-2': 'All',
        0: 'Under way',
        1: 'Approved',
        '-1': 'Rejected'
      }
    }
  },
  components: {
    MobileQuestBounty,
    MobileSortBar,

    MobileBottomsUpSkeletion,
    MobileBountySkeletion
  },
  methods: {

    /**
     * candy sort 事件
     */
    async candySortChange (status) {
      this.taskStatus = status
      const data = await this.getTasks({ status })
      data && this.$set(this.infos, this.taskTab, data)
    },

    /**
     * 根据 type 初始化 quest
     */
    async initQuest (type = 'candy') {
      const data = await this.getTasks(Object.assign({}, this.infos[type], { type }))
      data && this.$set(this.infos, type, data)
    },

    /**
     * choose tab
     */
    chooseTab (type) {
      if (this.currentTab === this.taskTab) return

      historyState(`/owner/quest/${this.taskTab}`)
      this.currentTab = this.taskTab
      this.taskStatus = -2

      this.$nextTick(async () => {
        const data = await this.getTasks(this.infos[this.taskTab])
        data && this.$set(this.infos, this.taskTab, data)
      })
    },

    /**
     * 获取 task 基础事件
     */
    async getTasks ({ pn = 1, ps = 10, status = this.taskStatus, type = this.taskTab } = {}) {
      this.taskTab = type

      this.loading = true

      const params = { pn, ps, type, status }

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
    }
  },
  mounted () {
    this.$nextTick(() => {
      const type = this.$route.params.type
      this.initQuest(type)
    })
  }
}
</script>

<style lang="scss" scoped>

.quest-item-content {
  padding: 24px 20px;
  padding-top: 24px;
  padding-bottom: 24px;
  box-sizing: border-box;
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
  padding-top: 35px;
  box-sizing: border-box;
}

/deep/ {
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
  padding: 0 20px;
  position: absolute;
  top: 10px;
  left: 0;
  width: 100%;
  color: #999;
}
.tasks-sort-bar {
  margin-left: 12px;
}

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

</style>
