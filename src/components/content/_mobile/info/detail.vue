<template>
  <div class="relative mobile-user-box">
    <div class="relative mobile-user-container">
      <div class="info-detail-navbar">
        <span class="inline-block line-height-0 detail-back-icon" @click.stop="$router.push('/owner/info')">
          <svg>
            <use xlink:href="#icon-back"/>
          </svg>
        </span>
      </div>
      <div class="text-center mobile-user-card mobile-user-header">
        <div class="mobile-user-content">
          <div class="mobile-user-avatar">
            <lordless-blockies :seed="userInfo._id" :scale="12"/>
          </div>
          <div class="mobile-user-info">
            <p class="user-info-name">{{ userInfo.nickName }}</p>
            <p class="user-info-email">{{ userInfo.email }}</p>
            <p class="text-break user-info-address">{{ userInfo.address }}</p>
          </div>
          <div class="mobile-user-holdings">
            <h2>Total Earnings from LORDLESS</h2>
            <div class="d-flex f-align-center user-holdings-cnt">
              <div class="v-flex user-holdings-item">
                <p>In ETH</p>
                <p class="TTFontBolder d-flex row-flex f-auto-center holdings-value">
                  <svg>
                    <use xlink:href="#icon-eth-price"/>
                  </svg>
                  <span>{{ overviews.estimated / (candyPrice.eth ? candyPrice.eth.USD : 0) | formatDecimal }}</span>
                </p>
              </div>
              <div class="v-flex user-holdings-item right">
                <p>In USD</p>
                <p class="TTFontBolder holdings-value">
                  $ {{ overviews.estimated | formatDecimal }}
                </p>
              </div>
            </div>
          </div>
          <div class="user-progress-box user-level-box">
            <p class="d-flex user-progress-title">
              <span class="user-progress-name">Level {{ userInfo.level }}</span>
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
              <span class="user-progress-name">Action point</span>
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
      <div class="card-margin user-home-box">
        <h3 class="card-title">Home</h3>
        <div class="d-flex f-align-center mobile-user-card user-home-container">
          <div
            v-if="userHome && userHome._id"
            class="d-flex full-width user-has-home"
            @click.stop="$emit('home', userHome.ldb)">
            <div class="user-home-poster">
              <lordless-tavern-poster
                :src="userHome.ldb.ldbIcon.source.preview"
                :popularity="userHome.ldb.chain.popularity"
                shadow
                showPopularity
                isSmall/>
            </div>
            <div class="v-flex d-flex col-flex f-justify-between user-home-info">
              <p class="d-flex f-align-center user-home-title">
                <span class="inline-block user-home-mark">HOME</span>
                <span class="text-nowrap user-home-name">{{ userHome.ldb.name.zh }}</span>
              </p>
              <div>
                <p class="user-home-level">Level {{ userHome.ldb.chain.level }}</p>
                <p class="user-home-leftap">{{ userHome.ldb.apLeft }} AP remaining</p>
              </div>
            </div>
            <div class="d-flex f-auto-center user-home-jump">
              <svg>
                <use xlink:href="#icon-arrow-circle"/>
              </svg>
            </div>
          </div>
          <div v-else class="d-flex f-align-center user-none-home">
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserOverview } from 'api'
import { nextAC } from 'utils/tool'

import { actionTypes } from '@/store/types'
import { mapState, mapActions } from 'vuex'
import { publicMixins } from '@/mixins'
export default {
  name: 'mobile-user-info-detail',
  mixins: [publicMixins],
  data: () => {
    return {

      loading: true,
      overviews: {},

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
    ...mapState('user', [
      'userInfo',
      'userHome'
    ]),
    ...mapState('candy', [
      'candyPrice'
    ]),

    currentActiveness () {
      return this.userInfo.activeness - nextAC(this.userInfo.level - 1)
    },

    // 升至下个等级所需经验
    nextActiveness () {
      return nextAC(this.userInfo.level) - nextAC(this.userInfo.level - 1)
    },

    ethBalance () {
      return this.$root.$children[0].web3Opt.balance
    }
  },
  watch: {
    account (val) {
      console.log('---------- user account', val)
      if (val) this.initInfo()
    }
  },
  methods: {
    ...mapActions('user', [
      actionTypes.USER_SET_USER_HOME,
      actionTypes.USER_SET_USER_BY_TOKEN
    ]),

    countDownHandle () {
      this.initInfo()
      this[actionTypes.USER_SET_USER_BY_TOKEN]()
    },

    initInfo () {
      this.getUserMessage()
      this[actionTypes.USER_SET_USER_HOME]()
    },

    // 获取用户 overview 信息
    async getUserMessage () {
      this.loading = true
      try {
        const res = await getUserOverview({ single: true })
        if (res.code === 1000) {
          this.overviews = Object.assign({}, this.overviews, res.data)
        }
      } catch (err) {
        this.loading = false
      }
      this.loading = false
    }
  },
  activated () {
    this[actionTypes.USER_SET_USER_HOME]()
  },
  async mounted () {
    this.$nextTick(() => {
      // this.initClipboard()
      this.initInfo()
    })
  }
}
</script>

<style lang="scss" scoped>
  .mobile-user-box {
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      width: 120%;
      height: 238px;
      background-image: linear-gradient(-225deg, #124BDC 0%, #0079FF 100%);
      border-bottom-left-radius: 100%;
      border-bottom-right-radius: 100%;
      transform: translateX(-50%);
    }
  }
  .mobile-user-container {
    padding: 100px 20px 30px;
    z-index: 1;
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
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px 3px rgba(200, 200, 200, .5);
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

  /**
   *  mobile-user-header  -- begin
   */

  .mobile-user-header {
    padding-top: 0;
    padding-bottom: 0;
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
    border-bottom: 1px solid #ddd;
  }
  .user-info-name {
    color: #555;
  }
  .user-info-email {
    margin-top: 6px;
    color: #999;
  }
  .user-info-address {
    margin-top: 6px;
    font-size: 14px;
    color: #bbb;
  }

  .mobile-user-holdings {
    padding-top: 24px;
    >h2 {
      font-size: 18px;
      color: #555;
    }
  }
  .user-holdings-cnt {
    margin-top: 24px;
  }
  .user-holdings-item {
    font-size: 16px;
    color: #999;
  }
  .holdings-value {
    margin-top: 5px;
    font-size: 24px;
    fill: #4586FC;
    color: #4586FC;
    svg {
      margin-right: 6px;
      width: 12px;
      height: 15px;
    }
  }
  /**
   *  mobile-user-header  -- end
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
    color: #bbb;
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
   *  user-home-box  -- begin
   */

  .user-home-box {

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

  /**
   *  user-taverns-box  -- end
   */
  .user-taverns-box {

  }
  .owner-taverns-item {
    &:not(:first-of-type) {
      margin-top: 10px;
    }
  }
  /**
   *  user-taverns-box  -- end
   */
</style>
