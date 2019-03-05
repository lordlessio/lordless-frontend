<template>
  <div id="mobile-referral-rewards" class="referral-rewards-box">
    <transition name="ld-hide-fade" mode="out-in">
      <referral-rewards-skeletion v-if="loading"/>
      <div v-else class="referral-reward-container">
        <lordless-tabs-navbar
          :originTab="originTab"
          :tabs="tabs"
          history
          @history="$router.push('/owner/info')"
          @changeTab="tabChange"/>
        <div v-if="loadDatas.total" class="referral-rewards-cnt referral-rewards-materials">
          <ul>
            <li v-for="(record, index) of loadDatas.list" :key="index" class="referral-records-item" :class="{ 'none-line': record.month }">
              <p v-if="record.month" class="referral-records-date">{{ record.month.timestamp | dateFormat('MMM YYYY') }}</p>
              <div class="d-flex f-align-start record-item-cnt">
                <span class="inline-block line-height-0 referral-record-icon">
                  <svg>
                    <use :xlink:href="`#coin-${record.candy ? record.candy.symbol.toLocaleLowerCase() : 'less'}`"/>
                  </svg>
                </span>
                <div class="v-flex referral-record-info">
                  <p class="d-flex f-align-center record-info-title">
                    <span class="v-flex">{{ record.taskType === 12 ? 'HOPS Reward' : 'Referral program reward' }}</span>
                    <span class="TTFontBolder record-info-reward">+ {{ record.rewardCount | weiByDecimals(record.candy ? record.candy.decimals : 18) | formatMoneyNumber }}</span>
                  </p>
                  <div class="d-flex f-align-center record-info-middle">
                    <span class="text-upper">{{ record.candy ? record.candy.symbol : 'Token' }}</span>
                    <div class="v-flex d-flex f-align-center record-info-address-box">
                      <lordless-blockies :scale="3" :seed="record.from"/>
                      <span>{{ record.from | splitAddress({ before: 8, end: 8, symbol: '***' }) }}</span>
                    </div>
                  </div>
                  <p class="record-info-date">{{ record.created_at | dateFormat('HH:mm MMM DD YYYY') }}</p>
                </div>
              </div>
            </li>
          </ul>
          <div class="text-center records-noMore-text">
            <p v-if="loadMoreLoading && !loadDatas.noMore">
              <i class="el-icon-loading"></i>
            </p>
            <p v-else-if="loadDatas.noMore">No more Referral rewards~</p>
          </div>
        </div>
        <div v-else class="text-center d-flex col-flex f-auto-center referral-rewards-empty">
          <span class="relative inline-block line-height-0 records-empty-icon">
            <svg>
              <use xlink:href="#icon-sitdown-human"/>
            </svg>
          </span>
          <h3>You have no referral rewards.</h3>
          <p>Invite your friends to get material rewards and deposit boost.</p>
          <lordless-btn theme="blue-linear" class="records-empty-btn">Invite friends</lordless-btn>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ReferralRewardsSkeletion from '@/components/skeletion/_mobile/referral/rewards'

import { getLastYearMonths } from 'utils/tool'
import { getActivityTasks } from 'api'

import { loadMoreDataMixins } from '@/mixins'
export default {
  name: 'referral-rewards-component',
  mixins: [ loadMoreDataMixins ],
  data: () => {
    return {
      originTab: 'materials',
      tabs: [
        {
          name: 'materials',
          label: 'Materials'
        },
        {
          name: 'hops',
          label: 'HOPS'
        }
      ],
      rendered: false,
      loading: true,
      loadDatas: {
        list: [],
        ps: 10,
        pn: 1,
        total: 0,
        noMore: false
      },
      changeLoading: false
      // loadMoreLoading: false
    }
  },
  watch: {
    originTab (val) {
      val && this.changeReferralRecords(val)
    },
    'loadDatas.list' (val) {
      this.rewriteRecords(val)
      console.log('------ watch materialsRewards.list', val)
    }
  },
  components: {
    ReferralRewardsSkeletion
  },
  methods: {
    tabChange (e) {
      this.originTab = e
      this.loadMoreLoading = false
      // this.initReferralRecords(e)
      console.log('------ e', e)
    },
    rewriteRecords (list = this.loadDatas.list) {
      if (!list.length) return
      const lastYearMonths = getLastYearMonths()
      for (let item of list) {
        if (item.month) item.month = null
        if (!lastYearMonths.length) continue
        for (let i = 0; i < lastYearMonths.length; i++) {
          if (new Date(item.created_at).getTime() < lastYearMonths[i].nextTimestamp) {
            item.month = lastYearMonths[i]
            lastYearMonths.splice(i, 1)
            break
          }
        }
      }
    },
    async changeReferralRecords (type = this.originTab) {
      this.loadMoreLoading = false
      this.changeLoading = true
      const { list = [], pn = 1, ps = 10, total = 0 } = (await this.getDataMethod({ pn: 1, type })) || {}
      this.loadDatas = {
        list,
        pn,
        ps,
        total,
        noMore: total <= ps
      }
      console.log('---- loadDatas', this.loadDatas)
      this.changeLoading = false
    },

    async initReferralRecords (type = this.originTab) {
      this.loadMoreLoading = false
      this.loading = true
      const { list = [], pn = 1, ps = 10, total = 0 } = (await this.getDataMethod({ pn: 1, type })) || {}
      this.loadDatas = {
        list,
        pn,
        ps,
        total,
        noMore: total <= ps
      }
      this.loading = false
    },

    async getDataMethod ({ pn, ps = this.loadDatas.ps, type = this.originTab }) {
      try {
        const res = await getActivityTasks({ pn, ps, type })
        return res.data
      } catch (err) {
        return null
      }
    }

    // 获取更多 records
    // async loadMoreRecords (cb) {
    //   this.loadMoreLoading = true
    //   const info = this.planRecords
    //   const pn = info.pn + 1
    //   const { list = [], ps = info.ps, total = 0 } = (await this.getUserPlanRecords({ pn })) || {}

    //   let noMore = false
    //   if (list.length < ps) {
    //     noMore = true
    //   }
    //   this.$set(this, 'planRecords', Object.assign({}, info, {
    //     list: info.list.concat(list),
    //     pn,
    //     ps,
    //     total,
    //     noMore
    //   }))
    //   this.loadMoreLoading = false
    //   return cb && cb()
    // },

    // /**
    //  * scroll 监听事件
    //  */
    // scrollListenerFunc ({ bool = false, bottom = 80, pHeight = document.body.offsetHeight } = {}) {
    //   this.scrollHandle && document.removeEventListener('scroll', this.scrollHandle)
    //   this.scrollHandle = null

    //   const box = document.getElementById('mobile-referral-rewards')
    //   let bHeight = box ? box.offsetHeight : 0
    //   console.log(' --- scroll', bHeight, bottom, pHeight)
    //   // 如果 bHeight 不存在或者 bHeight - bottom 小于 pHeight, return
    //   if (!bHeight || bHeight - bottom < pHeight) return

    //   const handleFunc = () => {
    //     if (bool || this.planRecords.noMore) return
    //     if (!bHeight) bHeight = box.offsetHeight
    //     const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop

    //     // 如果页面上滑到达指定条件位置
    //     // 读取更多数据
    //     if (scrollTop + pHeight + bottom > bHeight) {
    //       bool = true
    //       this.loadMoreRecords(() => {
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
    // }
  },
  async activated () {
    if (!this.rendered) {
      this.rendered = true
      return
    }
    await this.initReferralRecords()

    this.$nextTick(() => this.scrollListenerFunc())
  },
  mounted () {
    this.$nextTick(() => this.initReferralRecords())
  }
}
</script>

<style lang="scss" scoped>
  .referral-rewards-box {
    padding-top: 44px;
  }

  .referral-rewards-cnt {

  }
  .referral-records-item {
    &:not(:first-of-type) {
      &:not(.none-line) {
        .referral-record-info {
          border-top: 1px solid #ddd;
        }
      }
    }
  }
  .record-item-cnt {
    padding-left: 20px;
    background-color: #fff;
  }
  .referral-record-icon {
    padding: 8px;
    width: 32px;
    height: 32px;
    fill: #fff;
    background-image: linear-gradient(-225deg, #124BDC 0%, #0079FF 100%);
    border-radius: 100%;
    box-sizing: border-box;
    transform: translateY(20px);
  }
  .referral-record-info {
    margin-left: 12px;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-right: 18px;
  }
  .record-info-title {
    font-size: 16px;
    color: #555;
  }
  .record-info-reward {
    font-size: 16px;
    color: #0079FF;
  }
  .record-info-middle {
    margin-top: 6px;
    font-size: 14px;
    color: #777;
  }
  .record-info-address-box {
    margin-left: 12px;
    padding-left: 13px;
    border-left: 1px solid #ddd;
    box-sizing: border-box;
    >span {
      margin-left: 4px;
    }
  }
  .record-info-date {
    margin-top: 6px;
    font-size: 14px;
    color: #bbb;
  }


  .referral-records-date {
    padding-top: 12px;
    padding-bottom: 4px;
    padding-left: 24px;
    font-size: 16px;
  }
  .records-noMore-text {
    padding-bottom: 16px;
    padding-top: 16px;
    font-size: 16px;
    color: #999;
    background-color: #fff;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 20%;
      width: 60%;
      height: 1px;
      background-color: #eee;
    }
  }

  // referral-rewards-empty
  .referral-rewards-empty {
    padding: 30px;
    box-sizing: border-box;
    @include viewport-unit(min-height, 100vh, 94px);
    >h3 {
      margin-top: 32px;
      font-size: 20px;
      color: #0B2A48;
    }
    >p {
      margin-top: 12px;
      font-size: 16px;
      color: #555;
    }
  }
  .records-empty-icon {
    width: 298px;
    max-width: 100%;
    padding-top: 298px;
    >svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .records-empty-btn {
    margin-top: 32px;
    padding: 12px 20px;
  }
</style>
