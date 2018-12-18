<template>
  <div class="relative mobile-user-box">
    <div class="relative mobile-user-container">
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
              <span class="v-flex text-right">{{ userInfo.activeness }}<span class="user-progress-next">/{{ nextActiveness }}</span></span>
            </p>
            <div class="user-progress-bar user-level-progress">
              <lordless-progress
                shadow
                :current="userInfo.activeness"
                :max="nextActiveness"
                :gradient="levelProgress.gradient"/>
            </div>
            <p class="text-left user-progress-desc">You still need to earn {{ nextActiveness - userInfo.activeness }} to level up.</p>
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
      <div class="mobile-user-card user-home-box">
        <div class="d-flex f-align-center user-home-container">
          <div
            v-if="userHome && userHome._id"
            class="d-flex full-width user-has-home"
            @click.stop="$emit('home', userHome.ldb)">
            <div class="user-home-poster">
              <lordless-tavern-poster
                :src="userHome.ldb.ldbIcon.source.preview"
                :popularity="userHome.ldb.chain.popularity"
                shadow/>
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
      <!-- <div class="mobile-user-card user-childrens-box">
        <div class="user-childrens-container">
          <ul>
            <li
              v-for="(children, index) of pathChildrens" :key="index"
              class="d-flex f-align-center user-children-item"
              @click.stop="$router.push(children.route)">
              <div class="v-flex d-flex f-align-center user-children-cnt">
                <span class="inline-block user-children-icon">
                  <svg>
                    <use :xlink:href="children.icon"/>
                  </svg>
                </span>
                <span>{{ children.name }}</span>
              </div>
              <span class="inline-block user-children-jump-icon">
                <svg>
                  <use xlink:href="#icon-arrow-line-right"/>
                </svg>
              </span>
            </li>
          </ul>
        </div>
      </div> -->
      <div class="d-flex f-align-center mobile-user-card user-logout-box" @click.stop="$emit('logout')">
        <div class="v-flex d-flex f-align-center user-children-cnt">
          <span class="inline-block user-children-icon logout">
            <svg>
              <use xlink:href="#icon-mobile-logout"/>
            </svg>
          </span>
          <span>Logout</span>
        </div>
        <span class="inline-block user-children-jump-icon">
          <svg>
            <use xlink:href="#icon-arrow-line-right"/>
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserOverview } from 'api'
import { nextAC } from 'utils/tool'

import { actionTypes } from '@/store/types'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'mobile-user-content',
  data: () => {
    return {
      pathChildrens: [
        {
          name: 'Activities',
          route: '/owner/activities',
          icon: '#icon-activity_selected'
        },
        {
          name: 'Taverns',
          route: '/owner/taverns',
          icon: '#icon-beer'
        },
        {
          name: 'Authorization',
          route: '/owner/authorization',
          icon: '#icon-authorization_selected'
        }
        // {
        //   name: 'General',
        //   route: '/owner/general',
        //   icon: '#icon-authorization_selected'
        // }
      ],
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

    // 升至下个等级所需经验
    nextActiveness () {
      return nextAC(this.userInfo.level)
    },

    ethBalance () {
      return this.$root.$children[0].web3Opt.balance
    }
  },
  watch: {
    userInfo (val) {
      console.log('---------- user info account', val)
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
      const res = await getUserOverview({ single: true })
      if (res.code === 1000) {
        this.overviews = Object.assign({}, this.overviews, res.data)
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
      height: 200px;
      background-image: linear-gradient(-45deg, #7D72F0, #1613B0);
      border-bottom-left-radius: 100%;
      border-bottom-right-radius: 100%;
      transform: translateX(-50%);
    }
  }
  .mobile-user-container {
    padding: 100px 20px 30px;
    z-index: 1;
  }
  .mobile-user-card {
    padding: 16px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px 3px rgba(200, 200, 200, .5);
    &:not(:first-of-type) {
      margin-top: 16px;
    }
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
   *  user-childrens-box  -- begin
   */
  // .user-childrens-box {

  // }
  // .user-children-item {
  //   &:not(:first-of-type) {
  //     margin-top: 28px;
  //   }
  // }
  // .user-children-cnt {
  //   color: #777;
  // }
  .user-children-icon {
    margin-right: 12px;
    width: 22px;
    height: 22px;
    fill: #7D72F0;
    &.logout {
      fill: #F5515F;
    }
  }
  .user-children-jump-icon {
    width: 14px;
    height: 14px;
    fill: #bbb;
  }
  /**
   *  user-childrens-box  -- end
   */
</style>
