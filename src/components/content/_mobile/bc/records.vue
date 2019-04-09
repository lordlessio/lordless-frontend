<template>
  <div ref="lordless-load-more-box" class="bc-records-cnt-box">
    <ul v-if="!loading && firstEnter" class="d-flex f-wrap f-align-center bc-record-tags">
      <li v-for="(tag, index) of recordTags" :key="index" class="bc-record-item" @click.stop="currentTag = tag.name">
        <span class="inline-block bc-record-tag" :class="{ 'is-active': currentTag === tag.name }">{{ tag.label }}</span>
      </li>
    </ul>
    <transition name="ld-hide-fade" mode="out-in" @enter="firstEnter = true" @after-enter="afterEnter">
      <b-c-records-skeletion v-if="loading || smallLoading"/>
      <div v-else-if="!loadDatas.total" class="d-flex col-flex f-auto-center bc-records-empty">
        <span class="inline-block line-height-0 records-empty-icon">
          <svg>
            <use xlink:href="#icon-chest-empty"/>
          </svg>
        </span>
        <h2>You have no records.</h2>
      </div>
      <div v-else class="bc-records-contaner">
        <ul class="bc-records-box">
          <li v-for="(record, index) of loadDatas.list" :key="index" class="d-flex f-align-start bc-record-card">
            <span class="inline-block line-height-0 bc-record-icon">
              <svg>
                <use :xlink:href="bcTypeDatas[record.type].icon"/>
              </svg>
            </span>
            <div class="v-flex bc-record-cnt">
              <p class="record-card-title">{{ record.type === 'hunterTasks' ? taskInfos[record.taskType].title : bcTypeDatas[record.type].title }}</p>
              <p class="d-flex f-align-center record-card-desc">
                <span>{{ record.candy.symbol }}</span>
                <span v-if="record.ldb" class="relative inline-block">#{{ record.ldb.info }}</span>
              </p>
              <p class="record-card-time">{{ record.date | dateFormat('HH:mm MMM DD YYYY') }}</p>
            </div>
            <h3 class="record-card-reward" :class="{ 'is-cost': record.cost }">{{ record.cost ? '-' : '+' }}{{ formatDecimal(record.count).toLocaleString() }}</h3>
          </li>
        </ul>
        <div class="text-center records-noMore-text">
          <p v-if="loadMoreLoading && !loadDatas.noMore">
            <i class="el-icon-loading"></i>
          </p>
          <p v-else-if="loadDatas.noMore">No more Records~</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import BCRecordsSkeletion from '@/components/skeletion/_mobile/bounty/records'
import { getUserBCRecords } from 'api'

import { formatDecimal } from 'utils/tool'
import { initLoadingMixins, loadMoreDataMixins } from '@/mixins'
export default {
  name: 'mobile-bc-records',
  mixins: [ initLoadingMixins, loadMoreDataMixins ],
  data: (vm) => {
    let type = vm.$route.query.type
    const types = [ 'all', 'bottoms', 'reward', 'referral', 'bc' ]
    type = types.includes(type) ? type : 'all'
    return {
      rendered: false,
      currentTag: type,
      smallLoading: true,

      taskInfos: {
        1: {
          icon: '#icon-hunter-task-like',
          title: 'Follow LORDLESS Telegram',
          desc: 'Follow the @lordless_global.',
          path: '/owner/bind/telegram'
        },
        2: {
          icon: '#icon-hunter-task-wallet',
          title: 'Hold LESS in the wallet',
          desc: 'You have to hold 1,000 LESS at least.',
          path: '/owner/info'
        },
        3: {
          icon: '#icon-hunter-task-badge',
          title: 'Referee program',
          desc: 'Become a referee.',
          path: '/owner/referee'
        },
        4: {
          icon: '#icon-hunter-task-email',
          title: 'Invitation program',
          desc: 'Invite one friend at least.',
          path: '/owner/referral/invitation'
        },
        5: {
          icon: '#icon-hunter-task-coin',
          title: 'LESS Term Deposit',
          desc: 'Make LESS Term Deposit once at least.',
          path: '/owner/hops'
        },
        6: {
          icon: '#icon-hunter-task-sword',
          title: 'Get recruited',
          desc: 'Become a Recruit.',
          path: '/taverns'
        },
        7: {
          icon: '#icon-hunter-task-box',
          title: 'Unlock a Bounty Chest',
          desc: 'Unlock the Bounty Chest once at least.',
          path: '/owner/bc?type=chests'
        },
        8: {
          icon: '#icon-hunter-task-viking-helmet',
          title: 'Become a Tavernkeep',
          desc: 'Hold one Tavern at least.',
          path: '/taverns'
        }
      },

      // 记录第一次 enter 状态
      firstEnter: false,
      recordTags: [
        {
          name: 'all',
          label: 'All'
        },
        {
          name: 'bottoms',
          label: 'Bottoms up'
        },
        {
          name: 'reward',
          label: 'Reward'
        },
        {
          name: 'referral',
          label: 'Referral'
        },
        {
          name: 'bc',
          label: 'Bounty Chest'
        },
        {
          name: 'hunterTasks',
          label: 'Bounty Hunter tasks'
        }
      ],
      bcTypeDatas: {
        bottoms: {
          title: 'Bottoms up',
          icon: '#icon-blue-linear-beer'
        },
        reward: {
          title: 'Tavern reward',
          icon: '#icon-blue-linear-ingots'
        },
        referee: {
          title: 'Referee program',
          icon: '#icon-blue-linear-diploma'
        },
        referral: {
          title: 'Invitation program',
          icon: '#icon-blue-linear-diploma'
        },
        bc: {
          title: 'Bounty Chest',
          icon: '#icon-blue-linear-paper-bag'
        },
        hunterTasks: {
          title: 'Bounty Hunter task',
          icon: '#icon-blue-linear-hunter-task'
        }
      },
      loadDatas: {
        pn: 1,
        ps: 10,
        list: [],
        total: 0,
        noMore: false
      }
    }
  },
  watch: {
    currentTag (type) {
      type && this.initBCRecords({ type })
    }
  },
  components: {
    BCRecordsSkeletion
  },
  methods: {
    formatDecimal () {
      return formatDecimal(...arguments)
    },
    afterEnter () {
      this.scrollListenerFunc()
    },

    async initBCRecords ({ type = this.currentTag, pn = 1 } = {}) {
      this.smallLoading = true
      this.loadMoreLoading = false
      const { list = [], ps = 10, total = 0 } = (await this.getDataMethod({ pn, type })) || {}
      this.loadDatas = {
        list,
        pn,
        ps,
        total,
        noMore: total <= ps
      }
      this.smallLoading = false
      this.rendered = true
    },

    async getDataMethod ({ pn, ps = this.loadDatas.ps, type = this.currentTag || 'all' }) {
      try {
        const res = await getUserBCRecords({ pn, ps, type })
        return res.data
      } catch (err) {
        return null
      }
    }
  },
  async activated () {
    if (!this.rendered) {
      this.rendered = true
      return
    }
    this.loading = true
    await this.initBCRecords()
    this.loading = false

    this.$nextTick(() => this.scrollListenerFunc())
  },
  mounted () {
    this.$nextTick(async () => {
      this.loading = true
      this.initBCRecords()
      this.loading = false
    })
  }
}
</script>

<style lang="scss" scoped>
  /**
   *  bc-records-empty  -- begin
   */
  .bc-records-empty {
    @include viewport-unit(min-height, 100vh, 94px);
    >h2 {
      margin-top: 32px;
      font-size: 20px;
      color: $--main-color;
    }
  }
  .records-empty-icon {
    width: 200px;
    height: 200px;
  }
  /**
   *  bc-records-empty  -- edn
   */
  .bc-records-cnt-box {
    padding: 20px;
  }
  .bc-records-contaner {

  }
  .bc-record-tags {
    margin-top: -6px;
  }
  .bc-record-item {
    margin-top: 6px;
    &:not(:last-of-type) {
      margin-right: 8px;
    }
  }
  .bc-record-tag {
    padding: 0 8px;
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    color: #999;
    border: 1px solid #999;
    border-radius: 5px;
    box-sizing: border-box;
    &.is-active {
      background-color: $--main-blue-color;
      border: none;
      color: #fff;
    }
  }

  // bc-records-box
  .bc-records-box {
    margin-top: 18px;
  }
  .bc-record-card {
    padding: 18px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, .1);
    &:not(:first-of-type) {
      margin-top: 15px;
    }
  }
  .bc-record-icon {
    width: 28px;
    height: 28px;
  }

  .bc-record-cnt {
    margin-left: 12px;
  }
  .record-card-title {
    font-size: 16px;
    color: $--main-color;
  }
  .record-card-desc {
    margin-top: 6px;
    font-size: 12px;
    color: #555;
    >span {
      &:nth-of-type(2) {
        margin-left: 13px;
        padding-left: 13px;
        &::before {
          content: '';
          position: absolute;
          top: 2px;
          left: 0;
          width: 1px;
          height: 10px;
          background-color: #ddd;
        }
      }
    }
  }
  .record-card-time {
    margin-top: 6px;
    font-size: 14px;
    color: #bbb;
  }

  .record-card-reward {
    font-size: 18px;
    color: $--main-blue-color;
    &.is-cost {
      color: $--main-color;
    }
  }

  .records-noMore-text {
    margin-top: 12px;
    padding-bottom: 16px;
    padding-top: 16px;
    font-size: 16px;
    color: #999;
    // background-color: #fff;
    box-shadow: border-box;
  }
</style>
