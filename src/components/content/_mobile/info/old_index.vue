<template>
  <div class="mobile-user-info-box">
    <div class="user-info-container">
      <div class="user-info-header">
        <div class="d-flex f-align-center info-header-content" @click.stop="$router.push('/owner/detail')">
          <lordless-blockies
            :seed="account"
            :scale="7"
            theme="light"/>
          <div class="v-flex">
            <p class="text-break info-user-account">{{ account }}</p>
          </div>
          <span class="inline-block line-height-0 info-arrow-icon light">
            <svg>
              <use xlink:href="#icon-arrow-line-right"/>
            </svg>
          </span>
        </div>
      </div>
      <div class="user-info-content">
        <ul class="info-cnt-article deep-blue">
          <li class="d-flex f-align-center info-cnt-item">
            <span class="inline-block line-height-0 cnt-item-icon">
              <svg>
                <use xlink:href="#icon-tap"/>
              </svg>
            </span>
            <div class="v-flex d-flex f-align-center cnt-item-right">
              <p class="v-flex cnt-item-title">Action point</p>
              <span>{{ userInfo.ap }}</span>
            </div>
          </li>
          <li class="d-flex f-align-center info-cnt-item">
            <span class="inline-block line-height-0 cnt-item-icon">
              <svg>
                <use xlink:href="#icon-issue-price"/>
              </svg>
            </span>
            <div class="v-flex d-flex f-align-center cnt-item-right">
              <p class="v-flex cnt-item-title">Total earnings</p>
              <span>$ {{ overviews.totalEarnings.value | formatDecimal }}</span>
            </div>
          </li>
          <li class="d-flex f-align-center info-cnt-item">
            <span class="inline-block line-height-0 cnt-item-icon">
              <svg>
                <use xlink:href="#icon-circulating-supply"/>
              </svg>
            </span>
            <div class="v-flex d-flex f-align-center cnt-item-right">
              <p class="v-flex cnt-item-title">Holdings</p>
              <span>$ {{ overviews.holdings.value | formatDecimal }}</span>
            </div>
          </li>
          <li v-if="userHome" class="d-flex f-align-center info-cnt-item" @click.stop="$emit('home', userHome.ldb)">
            <span class="inline-block line-height-0 cnt-item-icon large">
              <svg>
                <use xlink:href="#icon-building_selected"/>
              </svg>
            </span>
            <div class="v-flex d-flex f-align-center cnt-item-right">
              <p class="v-flex cnt-item-title">Home Tavern</p>
              <span># {{ (userHome && userHome.ldb) ? userHome.ldb.id : '' }}</span>
              <span class="inline-block line-height-0 info-arrow-icon">
                <svg>
                  <use xlink:href="#icon-arrow-line-right"/>
                </svg>
              </span>
            </div>
          </li>
          <li class="d-flex f-align-center info-cnt-item" @click.stop="$router.push('/owner/taverns')">
            <span class="inline-block line-height-0 cnt-item-icon large">
              <svg>
                <use xlink:href="#icon-beer"/>
              </svg>
            </span>
            <div class="v-flex d-flex f-align-center cnt-item-right">
              <p class="v-flex cnt-item-title">My Taverns</p>
              <span class="inline-block line-height-0 info-arrow-icon">
                <svg>
                  <use xlink:href="#icon-arrow-line-right"/>
                </svg>
              </span>
            </div>
          </li>
        </ul>
        <ul class="info-cnt-article blue">
          <li
            class="d-flex f-align-center info-cnt-item"
            v-for="(item, index) of infoChildrens" :key="index"
            @click.stop="$router.push(item.path)">
            <span class="inline-block line-height-0 cnt-item-icon" :class="{ 'large': item.large }">
              <svg>
                <use :xlink:href="item.icon"/>
              </svg>
            </span>
            <div class="v-flex d-flex f-align-center cnt-item-right">
              <p class="v-flex cnt-item-title">{{ item.title }}</p>
              <p v-if="item.tips" class="bind-item-tips">{{ item.tips }}</p>
              <p v-if="item.isNew" class="bind-item-tips is-red">New!</p>
              <p v-if="item.holdings" class="bind-item-tips">$ {{ overviews.holdings.value | formatDecimal }}</p>
              <span v-if="item.redPoint" class="inline-block item-red-point"></span>
              <p v-if="item.isBindTelegram" class="d-flex f-align-center">
                <span v-if="userInfo.telegram && userInfo.telegram.id">{{ userInfo.telegram.username || userInfo.telegram.first_name }}</span>
                <span v-else class="inline-block item-red-point"></span>
              </p>
              <span class="inline-block line-height-0 info-arrow-icon">
                <svg>
                  <use xlink:href="#icon-arrow-line-right"/>
                </svg>
              </span>
            </div>
          </li>
        </ul>
        <ul class="info-cnt-article purple">
          <li
            class="d-flex f-align-center info-cnt-item"
            v-for="(item, index) of lordlessOuterInfos" :key="index">
            <span class="inline-block line-height-0 cnt-item-icon">
              <svg>
                <use :xlink:href="item.icon"/>
              </svg>
            </span>
            <div class="v-flex cnt-item-right">
              <a class="d-flex f-align-center" :href="item.link" target="_blank">
                <p class="v-flex cnt-item-title">{{ item.title }}</p>
                <span class="inline-block line-height-0 info-arrow-icon">
                  <svg>
                    <use xlink:href="#icon-arrow-line-right"/>
                  </svg>
                </span>
              </a>
            </div>
          </li>
        </ul>
        <ul class="info-cnt-article gray">
          <li class="d-flex f-align-center info-cnt-item" @click.stop="$emit('logout')">
            <span class="inline-block line-height-0 cnt-item-icon">
              <svg>
                <use xlink:href="#icon-mobile-logout"/>
              </svg>
            </span>
            <div class="v-flex d-flex f-align-center cnt-item-right">
              <p class="v-flex cnt-item-title">Logout</p>
              <span class="inline-block line-height-0 info-arrow-icon">
                <svg>
                  <use xlink:href="#icon-arrow-line-right"/>
                </svg>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <p class="text-center info-powered-text">Powered by LORDLESS</p>
  </div>
</template>

<script>
import { publicMixins } from '@/mixins'

import { getUserOverview } from 'api'

import { actionTypes } from '@/store/types'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'mobile-lordless-user-info',
  mixins: [ publicMixins ],
  data: () => {
    return {
      loading: true,
      overviews: {
        holdings: {},
        totalEarnings: {}
      },

      lordlessOuterInfos: [
        {
          icon: '#icon-telegram',
          title: '@lordless_global',
          link: 'https://t.me/lordless_global'
        },
        {
          icon: '#icon-twitter',
          title: '@LordLessIo',
          link: 'https://twitter.com/lordless_global'
        },
        {
          icon: '#icon-lordless',
          title: 'lordless.io',
          link: 'https://lordless.io'
        }
      ]
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

    infoChildrens () {
      return [].concat([
        {
          icon: '#icon-tab-diploma',
          title: 'Invitation program',
          path: '/owner/referral/invitation',
          isNew: true
        },
        {
          icon: '#icon-badge',
          title: 'Referee boost',
          path: '/owner/referee',
          redPoint: true
        },
        {
          icon: '#icon-link',
          title: 'Bind Telegram',
          path: '/owner/bind/telegram',
          isBindTelegram: true
        },
        {
          icon: '#coin-hops',
          title: 'HOPS',
          path: '/owner/hops',
          tips: 'Deposit LESS'
        },
        // {
        //   icon: '#icon-outcome',
        //   title: 'Make a chest',
        //   path: '/owner/bountyChest',
        //   holdings: true
        // },
        // {
        //   icon: '#icon-bounty-chests',
        //   title: 'Bounty Chests',
        //   path: '/owner/bounty/chests'
        // },
        {
          icon: '#icon-authorization_selected',
          title: 'Authorizations',
          path: '/owner/authorization',
          large: true
        }
      ])
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
  .mobile-user-info-box {

  }
  .user-info-container {

  }

  /**
   *  user-info-header  -- begin
   */

  .user-info-header {
    // padding-top: 44px;
    background-image: linear-gradient(-225deg, #124BDC 0%, #0079FF 100%);
  }
  .info-header-content {
    padding: 30px 20px;
  }
  .info-user-account {
    margin-left: 18px;
    width: 220px;
    font-size: 16px;
    color: #fff;
  }
  .info-arrow-icon {
    margin-left: 12px;
    width: 14px;
    height: 14px;
    fill: #bbb;
    &.light {
      fill: #fff;
    }
  }

  /**
   *  user-info-header  -- en
   */

  /**
   *  user-info-content  -- begin
   */

  .user-info-content {
    // margin-bottom: 30px;
  }
  .cnt-item-icon {
    width: 20px;
    height: 20px;
    &.large {
      margin-left: -4px;
      width: 24px;
      height: 24px;
    }
  }
  .item-red-point {
    width: 8px;
    height: 8px;
    background-color: #F5515F;
    border-radius: 100%;
  }
  .info-cnt-article {
    padding-left: 20px;
    background-color: #fff;
    &:not(:first-of-type) {
      margin-top: 16px;
    }
    &.deep-blue {
      fill: #0024FF;
    }
    &.blue {
      fill: #0079FF;
    }
    &.purple {
      fill: #7D72F0;
    }
    &.gray {
      fill: #555;
    }
  }
  .info-cnt-item {
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;
    >a {
      width: 100%;
      height: 100%;
    }
    &:not(:first-of-type) {
      .cnt-item-right {
        border-top: 1px solid #ddd;
      }
    }
  }
  .cnt-item-title {
    color: #555;
  }
  .bind-item-tips {
    color: #999;
    &.is-red {
      color: $--main-red-color;
    }
  }
  .cnt-item-right {
    margin-left: 12px;
    padding-right: 20px;
    color: #0B2A48;
  }

  /**
   *  user-info-content  -- end
   */
  .info-powered-text {
    margin-top: 48px;
    margin-bottom: 25px;
    font-size: 14px;
    color: #bbb;
  }
</style>
