<template>
  <div class="relative mobile-user-box">
    <mobile-nav-bar
      ref="mobile-nav-bar"
      v-bind="scrollOpt"
      @history="historyBack"/>
    <transition name="ld-hide-fade" mode="out-in">
      <user-detail-skeletion v-if="loading || boostsLoading"/>
      <div v-else class="relative mobile-user-container">
        <!-- <div class="info-detail-navbar">
          <span class="inline-block line-height-0 detail-back-icon" @click.stop="historyBack">
            <svg>
              <use xlink:href="#icon-back"/>
            </svg>
          </span>
        </div> -->
        <div class="text-center user-detail-card user-detail-header">
          <div class="mobile-user-content">
            <div class="mobile-user-avatar">
              <lordless-blockies :seed="userInfo._id" :scale="12"/>
            </div>
            <div class="mobile-user-info">
              <!-- <p class="user-info-name">{{ userInfo.nickName }}</p> -->
              <!-- <p class="user-info-email">{{ userInfo.email }}</p> -->
              <p class="text-break text-upper user-info-address">{{ userInfo.address }}</p>
            </div>
            <div class="d-flex f-align-center user-permission-container">
              <ul class="d-flex f-align-center user-boosts-box user-permission-ul">
                <li class="user-permission-item"
                  v-for="(boost, index) of userBoosts" :key="index">
                  <span class="inline-block line-height-0 user-permission-icon">
                    <svg>
                      <use :xlink:href="boost.number ? boost.icon : boost.grayIcon"/>
                    </svg>
                  </span>
                </li>
              </ul>
              <ul class="d-flex f-align-center user-commissions-box user-permission-ul">
                <li class="user-permission-item"
                  v-for="(commission, index) of userCommissions" :key="index">
                  <span class="inline-block line-height-0 user-permission-icon">
                    <svg>
                      <use :xlink:href="commission.open ? commission.icon : commission.grayIcon"/>
                    </svg>
                  </span>
                </li>
              </ul>
            </div>
            <div class="user-progress-box user-level-box">
              <p class="d-flex user-progress-title">
                <span class="user-progress-name">LEVEL {{ userInfo.level }}</span>
                <span class="v-flex text-right">{{ currentActiveness }}<span class="user-progress-next">/{{ nextActiveness }}</span></span>
              </p>
              <div class="user-progress-bar user-level-progress">
                <lordless-progress
                  shadow
                  :current="currentActiveness"
                  :max="nextActiveness"
                  :gradient="levelProgress.gradient"/>
              </div>
              <p class="text-left user-progress-desc">{{ nextActiveness - currentActiveness }} activeness to level up.</p>
            </div>
            <div class="user-progress-box user-ap-box">
              <p class="d-flex user-progress-title">
                <span class="text-upper user-progress-name">Action point</span>
                <span class="v-flex text-right">{{ userInfo.ap }}<span class="user-progress-next">/{{ userInfo.maxAp }}</span></span>
              </p>
              <div class="user-progress-bar user-ap-progress">
                <lordless-progress
                  shadow
                  :current="userInfo.ap"
                  :max="userInfo.maxAp"
                  :gradient="apProgress.gradient"/>
              </div>
              <p class="d-flex user-progress-desc recover-at" v-if="new Date(overviews.recoverAt) - new Date() + 5000 > 0">
                <countdown class="task-status-time" @countdownend="countDownHandle" :time="new Date(overviews.recoverAt) - new Date() + 5000" :interval="1000" tag="p">
                  <!-- <template slot-scope="props">{{ parseInt(props.days) || props.hours || props.minutes || props.seconds }}{{ parseInt(props.days) ? 'd' : (props.hours ? 'h' : (props.minutes ? 'm' : props.seconds ? 's' : '')) }}</template> -->
                  <template slot-scope="props">{{ props | formatDue(3) }}</template>
                </countdown>
                to refill.
              </p>
            </div>
          </div>
        </div>
        <div class="user-info-assets">
          <h3>Assets</h3>
          <ul class="d-flex f-wrap user-detail-card user-assets-ul">
            <li class="user-asset-item"
              v-for="(asset, index) of userAssets" :key="index"
              @click.stop="asset.path ? $router.push(asset.path) : null">
              <h3>{{ asset.text }}</h3>
              <p class="d-flex f-align-center asset-item-cnt">
                <span class="v-flex asset-cnt-value">{{ asset.value }}</span>
                <span v-if="asset.path" class="inline-block line-height-0 asset-arrow-icon">
                  <svg>
                    <use xlink:href="#icon-arrow-line-right"/>
                  </svg>
                </span>
              </p>
            </li>
          </ul>
        </div>
        <div v-if="userHome && userHome._id" class="card-margin user-home-box">
          <h3 class="card-title">Home</h3>
          <div class="d-flex f-align-center mobile-user-card user-detail-card user-home-container">
            <div
              class="d-flex full-width user-has-home"
              @click.stop="$emit('home', userHome.homeInfo.tavern)">
              <div class="user-home-poster">
                <lordless-tavern-poster
                  :src="userHome.homeInfo.tavern.ldbIcon.source.preview"
                  :popularity="userHome.homeInfo.tavern.chain.popularity"
                  shadow
                  showPopularity
                  isSmall/>
              </div>
              <div class="v-flex d-flex col-flex f-justify-between user-home-info">
                <p class="d-flex f-align-center user-home-title">
                  <span class="inline-block user-home-mark">HOME</span>
                  <span class="text-nowrap user-home-name">{{ userHome.homeInfo.tavern.name.zh }}</span>
                </p>
                <div>
                  <p class="user-home-level">Level {{ userHome.homeInfo.tavern.chain.level }}</p>
                  <p class="user-home-leftap">{{ userHome.homeInfo.tavern.apLeft }} AP remaining</p>
                </div>
              </div>
              <div class="d-flex f-auto-center user-home-jump">
                <svg>
                  <use xlink:href="#icon-arrow-circle"/>
                </svg>
              </div>
            </div>
            <!-- <div v-else class="d-flex f-align-center user-none-home">
              <div class="user-home-poster none">
                <svg>
                  <use xlink:href="#icon-help"/>
                </svg>
              </div>
              <div class="v-flex user-home-info">
                <p>You have no home now.</p>
                <lordless-btn
                  class="user-info-btn"
                  theme="blue"
                  inverse
                  shadow
                  @click="$router.push('/taverns')">
                  View Taverns now
                </lordless-btn>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import UserDetailSkeletion from '@/components/skeletion/_mobile/user/detail'

import { getPlanBoosts } from 'api'

import { nextAC, formatDecimal, splitAddress } from 'utils/tool'

import { publicMixins, planBoostsMixins, overviewPublicMixins } from '@/mixins'
export default {
  name: 'mobile-user-info-detail',
  mixins: [ publicMixins, planBoostsMixins, overviewPublicMixins ],
  props: {
    address: {
      type: String,
      default: null
    }
  },
  data: () => {
    return {
      boostsLoading: true,
      unOwnerPlanBoosts: null,

      levelProgress: {
        gradient: {
          direction: 'to right',
          start: '#FFAA00',
          end: '#FFE000'
        }
      },
      apProgress: {
        gradient: {
          direction: 'to right',
          start: '#00D5B8',
          end: '#00FF99'
        }
      }
    }
  },
  computed: {
    userAddress () {
      return this.$route.params.address
    },
    userInfo () {
      return this.overviews.userInfo || {}
    },

    userHome () {
      return this.overviews.userHome
    },

    currentActiveness () {
      return this.userInfo.activeness - nextAC(this.userInfo.level - 1)
    },

    // 升至下个等级所需经验
    nextActiveness () {
      return nextAC(this.userInfo.level) - nextAC(this.userInfo.level - 1)
    },

    ethBalance () {
      return this.$root.$children[0].web3Opt.balance
    },

    userAssets () {
      const overviews = this.overviews
      return [
        {
          text: 'Materials',
          value: `$ ${(formatDecimal(overviews.holdings.value) || '0').toLocaleString()}`
        },
        {
          text: 'Bounty Chests',
          value: overviews.bountyCount
        },
        {
          text: 'Deposited',
          value: `${(overviews.depositsCandies.lessCount || '0').toLocaleString()} LESS`
        },
        {
          text: 'Taverns',
          value: overviews.tavernCount,
          path: `/user/${this.userAddress}/taverns`
        }
      ]
    },
    scrollOpt () {
      return {
        history: true,
        text: `${splitAddress(this.userAddress, { before: 4, end: 2 })} Info`
      }
    }
  },
  components: {
    UserDetailSkeletion
  },
  methods: {
    historyBack (e, path = '/owner/info') {
      sessionStorage.setItem('lordless_direction', '_reverse')
      const refer = this.$route.query.refer
      return this.$router.push(refer || path)
    },
    async checkUserPlanBoosts (user = this.userAddress) {
      this.boostsLoading = true
      try {
        const res = await getPlanBoosts({ user })
        if (res.code === 1000) {
          this.unOwnerPlanBoosts = res.data
        }
      } catch (err) {
      }
      this.boostsLoading = false
    }
  },
  activated () {
    if (!this.rendered) return
    this.checkUserPlanBoosts()
  },
  async mounted () {
    this.$nextTick(() => {
      this.checkUserPlanBoosts()
    })
  }
}
</script>

<style lang="scss" scoped>
  .mobile-user-box {

  }
  .mobile-user-container {
    padding: 100px 20px 30px;
    z-index: 1;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      width: 120%;
      height: 238px;
      // background-image: linear-gradient(-225deg, #124BDC 0%, #0079FF 100%);
      background-color: $--main-blue-color;
      border-bottom-left-radius: 100%;
      border-bottom-right-radius: 100%;
      transform: translateX(-50%);
      z-index: -1;
    }
  }
  .info-detail-navbar {
    padding-top: 12px;
    padding-left: 20px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
  }
  .detail-back-icon {
    width: 20px;
    height: 20px;
    fill: #fff;
  }
  .mobile-user-card {
    padding: 16px;
    box-sizing: border-box;
  }
  .card-margin {
    margin-top: 16px;
  }
  .card-title {
    margin-bottom: 6px;
    font-size: 18px;
    color: #0B2A48;
  }
  .user-detail-card {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.12);
  }

  /**
   *  user-detail-header  -- begin
   */

  .user-detail-header {
    padding: 0 27px;
  }
  .mobile-user-content {
    transform: translateY(-36px);
  }
  .mobile-user-info {
    padding: 0 20px;
    padding-bottom: 24px;
    margin: 12px auto 0;
    width: 90%;
    font-size: 16px;
    // border-bottom: 1px solid #ddd;
  }
  // .user-info-name {
  //   color: #999;
  // }
  // .user-info-email {
  //   margin-top: 6px;
  //   color: #999;
  // }
  .user-info-address {
    margin-top: 6px;
    font-size: 14px;
    color: #555;
  }

  // user-commissions-box
  .user-commissions-box {
    position: relative;
    margin-left: 28px;
    padding-left: 28px;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 4px;
      width: 1px;
      height: 20px;
      background-color: #ddd;
    }
  }
  .user-permission-item {
    height: 28px;
    &:not(:first-of-type) {
      margin-left: 28px;
    }
  }
  .user-permission-icon {
    width: 28px;
    height: 28px;
  }
  /**
   *  user-detail-header  -- end
   */

  /**
   *  user-progress-box -- begion
   */
  .user-progress-box {
    margin-top: 24px;
  }
  .user-progress-title {
    font-size: 14px;
    color: #555;
  }
  .user-progress-name {
    font-size: 16px;
    color: #777;
  }
  .user-progress-next {
    color: #bbb;
  }
  .user-progress-bar {
    margin-top: 8px;
    height: 22px;
    border-radius: 5px;
    overflow: hidden;
  }
  .user-progress-desc {
    margin-top: 3px;
    font-size: 14px;
    color: #999;
    &.recover-at {
      margin-top: 8px;
    }
  }
  .task-status-time {
    width: 110px;
  }
  /**
   *  user-progress-box  -- end
   */


  /**
   *  user-info-assets  -- begin
   */
  .user-info-assets {
    margin-top: 24px;
    // background-color: #fff;
    >h3 {
      font-size: 18px;
      color: $--main-color;
    }
  }
  .user-assets-ul {
    margin-top: 6px;
  }
  .user-asset-item {
    padding: 18px 20px;
    width: 50%;
    font-size: 14px;
    color: #999;
    line-height: 1.2;
    border-top: 1px solid #f0f0f0;
    box-sizing: border-box;
    &:nth-of-type(2n + 1) {
      border-right: 1px solid #f0f0f0;
    }
    >h3 {
      margin-bottom: 3px;
      font-size: 14px;
      color: #555;
    }
  }
  .asset-arrow-icon {
    width: 12px;
    height: 12px;
    fill: #999;
  }
  /**
   *  user-info-assets  -- end
   */

  /**
   *  user-home-box  -- begin
   */

  .user-home-box {
    margin-top: 24px;
  }
  .user-home-poster {
    width: 72px;
    height: 72px;
    &.none {
      padding: 10px;
      fill: #BDB9FD;
      border-radius: 5px;
      box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, .25);
    }
  }
  .user-home-mark {
    margin-right: 5px;
    padding: 2px 6px;
    font-size: 12px;
    color: #fff;
    background-color: #4586FC;
    border-radius: 5px;
  }
  .user-home-name {
    max-width: 130px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .user-home-info {
    margin-left: 18px;
  }
  .user-info-btn {
    display: inline-block;
    padding: 8px 15px;
    font-size: 14px;
    @include margin('top', 15px, 1);
  }
  .user-home-title {
    font-size: 16px;
    color: #777;
  }
  .user-home-level {
    font-size: 14px;
    color: #777;
  }
  .user-home-leftap {
    font-size: 14px;
    color: #4586FC;
  }
  .user-home-jump {
    width: 24px;
    >svg {
      width: 24px;
      height: 24px;
      fill: #4586FC;
    }
  }

  /**
   *  user-home-box  -- end
   */

</style>
