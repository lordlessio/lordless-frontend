<template>
  <div class="mobile-user-info-box">
    <div class="user-info-container">
      <div class="user-info-header">
        <div class="d-flex f-align-start info-header-content" @click.stop="$router.push(`/user/${account}/info?refer=${$route.path}`)">
          <lordless-blockies
            :seed="account"
            :scale="6"
            theme="light"/>
          <div class="v-flex info-user-account-box">
            <div class="d-flex f-align-center text-break">
              <p class="v-flex">
                <span class="inline-block info-user-account">
                  {{ account }}
                </span>
              </p>
              <span class="inline-block line-height-0 info-arrow-icon light">
                <svg>
                  <use xlink:href="#icon-arrow-line-right"/>
                </svg>
              </span>
            </div>
            <p class="d-flex f-align-center info-user-ap-box">
              <span class="inline-block line-height-1 user-ap-icon">
                <svg>
                  <use xlink:href="#icon-color-star"/>
                </svg>
              </span>
              <span>AP</span>
              <span class="TTFontBolder user-ap-text">{{ userInfo.ap }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="d-flex f-align-center user-permission-box">
        <div class="d-flex f-align-center user-permission-container" @click.stop="$router.push('/owner/privileges')">
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
      </div>
      <div class="user-info-assets">
        <h3>Assets</h3>
        <ul class="d-flex f-wrap user-assets-ul">
          <li class="user-asset-item"
            v-for="(asset, index) of ownerAssets" :key="index"
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
      <div class="user-info-services">
        <h3>Services</h3>
        <ul class="d-flex f-wrap user-services-ul">
          <li class="relative user-service-item"
            v-for="(service, index) of ownerServices" :key="index"
            @click.stop="$router.push(service.path)">
            <div class="d-flex col-flex f-auto-center user-service-item-container">
              <span class="inline-block line-height-0 user-service-icon">
                <svg>
                  <use :xlink:href="service.icon"/>
                </svg>
              </span>
              <p>{{ service.text }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="user-info-content">
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
import { formatDecimal } from 'utils/tool'
import { mapState } from 'vuex'
import { checkTokensBalanceMixins, planBoostsMixins, publicMixins, overviewPublicMixins } from '@/mixins'
export default {
  name: 'mobile-lordless-user-info',
  mixins: [ checkTokensBalanceMixins, planBoostsMixins, publicMixins, overviewPublicMixins ],
  data: () => {
    return {

      lordlessOuterInfos: [
        {
          icon: '#icon-telegram',
          title: '@lordless_global',
          link: 'https://t.me/lordless_global'
        },
        {
          icon: '#icon-twitter',
          title: '@LordLessIo',
          link: 'https://twitter.com/LordLessIo'
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

    ownerAssets () {
      const overviews = this.overviews
      return [
        {
          text: 'LESS(Wallet)',
          value: (this.lessBalanceNumber || '0').toLocaleString()
        },
        {
          text: 'HOPS(Wallet)',
          value: (this.hopsBalanceNumber || '0').toLocaleString()
        },
        {
          text: 'Materials',
          value: `$ ${(formatDecimal(overviews.holdings.value) || '0').toLocaleString()}`,
          path: '/owner/bc?type=materials'
        },
        {
          text: 'Bounty Chests',
          value: overviews.bountyCount,
          path: '/owner/bc?type=chests'
        },
        {
          text: 'Deposited',
          value: `${(overviews.depositsCandies.lessCount || '0').toLocaleString()} LESS`,
          path: '/owner/hops'
        },
        {
          text: 'Taverns',
          value: overviews.tavernCount,
          path: `/user/${this.account}/taverns`
        }
      ]
    },

    ownerServices () {
      return [
        {
          icon: '#icon-blue-linear-diploma',
          text: 'Invitation',
          path: '/owner/referral/invitation'
        },
        {
          icon: '#icon-blue-linear-badge',
          text: 'Referee boost',
          path: '/owner/referee'
        },
        {
          icon: '#icon-blue-linear-marketplace',
          text: 'Home',
          path: this.userHome ? `/tavern/${this.userHome.homeInfo.tavern.id}` : '/taverns'
        },
        {
          icon: '#icon-blue-linear-link',
          text: 'Bind Telegram',
          path: '/owner/bind/telegram'
        },
        {
          icon: '#icon-blue-linear-hops',
          text: 'HOPS',
          path: '/owner/hops'
        },
        {
          icon: '#icon-blue-linear-authorization',
          text: 'Authorizations',
          path: '/owner/authorization'
        }
      ]
    }
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
    // background-image: linear-gradient(-225deg, #124BDC 0%, #0079FF 100%);
    background-color: $--main-blue-color;
  }
  .info-header-content {
    padding: 30px 20px 48px;
  }

  .info-user-account-box {
    margin-left: 18px;
    font-size: 14px;
    color: #fff;
  }
  .info-user-account {
    width: 220px;
  }

  .info-user-ap-box {
    margin-top: 12px;
  }
  .user-ap-icon {
    margin-right: 3px;
    width: 14px;
    height: 14px;
  }
  .user-ap-text {
    margin-left: 8px;
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
   *  user-info-header  -- end
   */

  /**
   *  user-permission-box  -- begin
   */
  .user-permission-box {
    padding: 0 27px;
    background-color: #fff;
  }
  .user-permission-container {
    padding: 12px 20px;
    border-radius: 5px;
    background-color: #fff;
    transform: translateY(-26px);
    box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.12);
  }
  .user-boosts-box {

  }
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
   *  user-permission-box  -- end
   */

  /**
   *  user-info-assets  -- begin
   */
  .user-info-assets {
    background-color: #fff;
    >h3 {
      padding-left: 20px;
      font-size: 16px;
      color: $--main-color;
    }
  }
  .user-assets-ul {
    margin-top: 12px;
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
   *  user-info-services  -- begin
   */
  .user-info-services {
    margin-top: 16px;
    line-height: 1.2;
    background-color: #fff;
    >h3 {
      padding: 12px 0 12px 20px;
      font-size: 16px;
      color: $--main-color;
    }
  }
  .user-service-item {
    padding-top: 33%;
    width: 33%;
    border-top: 1px solid #f0f0f0;
    box-sizing: border-box;
    &:nth-of-type(3n + 2) {
      width: 34%;
      border-left: 1px solid #f0f0f0;
      border-right: 1px solid #f0f0f0;
    }
  }
  .user-service-item-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 12px;
    color: #555;
    >p {
      margin-top: 12px;
    }
  }
  .user-service-icon {
    width: 28px;
    height: 28px;
  }
  /**
   *  user-info-services  -- end
   */

  /**
   *  user-info-content  -- begin
   */

  .user-info-content {
    margin-top: 16px;
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
