<template>
  <div class="referral-invitation-box">
    <transition name="ld-hide-fade" mode="out-in" @after-enter="afterEnter">
      <referral-invitation-skeletion v-if="loading"/>
      <div v-else class="relative referral-invitation-container">
        <div class="referral-invitation-header">
          <div class="d-flex f-align-center invitation-header-desc">
            <span class="inline-block line-height-0 invitation-desc-icon">
              <svg>
                <use xlink:href="#icon-referral-envelope"/>
              </svg>
            </span>
            <div class="invitation-desc-text">
              <p>Invite friends to get</p>
              <h3>Two-sided rewards</h3>
            </div>
          </div>
          <div class="invitation-address-box">
            <p class="TTFontBolder">Invitation address</p>
            <h2 class="d-flex f-align-center invitation-header-address">
              <span>{{ account | splitAddress({ before: 6, end: 4, symbol: '******' }) }}</span>
              <span
                id="copy-user-account"
                class="inline-block line-height-1 invitation-copy-icon invitation-copy-btn"
                :class="{ 'clipboard': accountClipBool }"
                :data-clipboard-text="account">
                <svg>
                  <use xlink:href="#icon-copy"/>
                </svg>
              </span>
            </h2>
          </div>
          <div class="d-flex f-align-center invitation-header-btns">
            <span
              id="copy-invitation-link"
              class="TTFontBolder v-flex text-center invitation-friends-btn invitation-copy-btn"
              :class="{ 'clipboard': linkClipBool }"
              :data-clipboard-text="invitationLink">
              Invite friends
            </span>
            <lordless-btn theme="blue" class="invitation-header-btn" @click="cardModel = true">Exclusive poster</lordless-btn>
          </div>
        </div>
        <div class="referral-invitation-content">
          <h3>Why become a REFERRER?</h3>
          <div class="invitation-content-item"
            v-for="(item, index) of invitations" :key="index">
            <p class="TTFontBolder d-flex f-align-center invitation-content-title">
              <span class="inline-block line-height-0 invitation-cnt-title-icon">
                <svg>
                  <use xlink:href="#icon-bounty-chest-checked"/>
                </svg>
              </span>
              <span>{{ item.title }}</span>
            </p>
            <div class="d-flex col-flex f-auto-center invitation-item-cnt">
              <span class="inline-block line-height-0 invitation-item-icon">
                <svg>
                  <use :xlink:href="item.cntIcon"/>
                </svg>
              </span>
              <p v-html="item.desc" class="invitation-item-desc"></p>
            </div>
          </div>
          <div class="text-center invitation-tg-group-box">
            <span class="inline-block line-height-0 tg-group-icon">
              <svg>
                <use xlink:href="#icon-referral-telegram"/>
              </svg>
            </span>
            <h3>
              <a href="https://t.me/lordless_global" target="_blank" class="text-underline">LORDLESS Global Group</a>
            </h3>
            <p>Reach more users? Ask our influencers!</p>
          </div>
        </div>
      </div>
    </transition>
    <lordless-popup-dialog :visible.sync="cardModel" @opened="popupOpened" @closed="popupClosed">
      <div class="invitation-poster-box">
        <div class="d-flex col-flex invitation-poster-container">
          <div class="v-flex invitation-poster-top">
            <div class="poster-card-box" :class="{ 'is-drawing': drawing }">
              <invitation-card
                class="invitation-card"
                ref="invitation-card"
                :address="account"
                @done="drawing = false"/>
            </div>
          </div>
          <div class="TTFontBolder relative text-center invitation-poster-middle">
            {{ drawing ? 'Drawing your poster' : 'Long press to save the image' }}
          </div>
          <div class="invitation-poster-bottom">
            <lordless-btn theme="blue-linear" class="invitation-poster-close" @click="cardModel = false">Close</lordless-btn>
          </div>
        </div>
      </div>
    </lordless-popup-dialog>
  </div>
</template>

<script>
import Clipboard from 'clipboard'

import ReferralInvitationSkeletion from '@/components/skeletion/_mobile/referral/invitation'

import InvitationCard from '@/components/content/_mobile/referral/utils/invitaCard'

import { publicMixins, initLoadingMixins } from '@/mixins'
export default {
  name: 'referral-invitation-component',
  mixins: [ publicMixins, initLoadingMixins ],
  data: () => {
    return {
      rendered: false,
      invitations: [
        {
          title: 'Material reward',
          cntIcon: '#icon-referral-handshake',
          desc: 'You and your referee will both get <span>10,000 LESS material</span> after the referee confirm to be your referee.'
        }, {
          title: 'HOPS deposit reward',
          cntIcon: '#icon-referral-reward',
          desc: 'After the referee’s confirmation, the referee would get <span>a HELD boost in LESS Term Deposit.</span> When the referee earned HOPS from LESS Term Deposit, the referrer can also acquire <span>a specific percentage of HOPS.</span>'
        }
      ],
      accountClipBool: false,
      linkClipBool: false,

      // invitation popup model
      cardModel: false,
      drawing: true
    }
  },
  computed: {
    invitationLink () {
      return `${location.origin}/owner/referee?r=${this.account}`
    }
  },
  watch: {
    accountClipBool (val) {
      if (val) {
        setTimeout(() => {
          this.accountClipBool = false
        }, 1500)
      }
    },
    linkClipBool (val) {
      if (val) {
        setTimeout(() => {
          this.linkClipBool = false
        }, 1500)
      }
    }
  },
  components: {
    ReferralInvitationSkeletion,

    InvitationCard
  },
  methods: {
    afterEnter () {
      this.initClipboard()
    },
    // initInvitation () {
    //   this.loading = false
    //   // this.initClipboard()
    // },
    initClipboard () {
      this.initAccountClipboard()
      this.initLinkClipboard()
    },
    // 初始化 黏贴板
    initAccountClipboard () {
      const clip = new Clipboard('#copy-user-account')
      clip.on('success', (e) => {
        this.accountClipBool = true
        e.clearSelection()
      })
    },
    initLinkClipboard () {
      const clip = new Clipboard('#copy-invitation-link')
      clip.on('success', (e) => {
        this.linkClipBool = true
        e.clearSelection()
      })
    },

    popupOpened () {
      this.$refs['invitation-card'].init()
    },
    popupClosed () {
      this.drawing = true
    }
  },
  activated () {
    if (!this.rendered) {
      this.rendered = true
      return
    }
    this.loading = false
    this.initClipboard()
  },
  mounted () {
    this.$nextTick(() => {
      this.loading = false
    })
  }
}
</script>

<style lang="scss" scoped>
  .referral-invitation-box {

  }
  .referral-invitation-container {
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: 0 100%;
    background-image: url('~static/svg/referral/bg-pricing-education.svg');
  }

  /**
   *  referral-invitation-header  -- begin
   */
  .referral-invitation-header {
    padding: 54px 20px 25px;
    color: #fff;
    background-color: #0079FF;
  }

  // invitation-header-desc
  .invitation-header-desc {

  }
  .invitation-desc-icon {
    width: 36px;
    height: 36px;
  }
  .invitation-desc-text {
    margin-left: 12px;
    font-size: 14px;
    >h3 {
      margin-top: 2px;
      font-size: 18px;
    }
  }

  //  invitation-address-box
  .invitation-address-box {
    margin-top: 24px;
    font-size: 14px;
  }
  .invitation-header-address {
    font-size: 24px;
  }
  .invitation-copy-icon {
    margin-left: 8px;
    width: 20px;
    height: 20px;
    fill: #fff;
  }
  .invitation-header-btns {
    margin-top: 24px;
  }
  .invitation-friends-btn {
    padding: 0 12px;
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    color: #555;
    background-color: $--main-yellow-color;
    border-radius: 5px;
  }
  .invitation-header-btn {
    margin-left: 12px;
    padding: 0 12px;
    height: 44px;
    // &:not(:first-of-type) {
    //   margin-left: 12px;
    // }
  }
  /**
   *  referral-invitation-header  -- end
   */

  /**
   *  referral-invitation-content  -- begin
   */
  .referral-invitation-content {
    padding: 32px 24px 24px;
    >h3 {
      margin-bottom: 32px;
      font-size: 20px;
      color: #0B2A48;
    }
  }
  .invitation-content-item {
    color: #fff;
    &:not(:first-of-type) {
      margin-top: 32px;
    }
  }
  .invitation-content-title {
    font-size: 18px;
    color: #555;
  }
  .invitation-cnt-title-icon {
    margin-right: 6px;
    width: 20px;
    height: 20px;
  }
  .invitation-item-cnt {
    margin-top: 18px;
    padding: 32px 20px;
    // background-image: linear-gradient(-45deg, #7D72F0 100%, #1613B0 100%);
    background-color: #7D72F0;
    border-radius: 5px;
    >p {
      margin-top: 16px;
    }
  }
  .invitation-item-icon {
    width: 100px;
    height: 100px;
  }
  .invitation-item-desc {
    color: #fff;
    /deep/ {
      >span {
        font-family: $--font-TTNormsBold;
        color: $--main-yellow-color;
      }
    }
  }
  /**
   *  referral-invitation-content  -- end
   */

  /**
   *  invitation-tg-group-box  -- begin
   */
  .invitation-tg-group-box {
    margin-top: 32px;
    padding: 32px 0 84px;
    >h3 {
      margin-top: 24px;
      font-size: 16px;
      color: #555;
    }
    >p {
      margin-top: 8px;
      font-size: 14px;
      color: #777;
    }
  }
  .tg-group-icon {
    width: 72px;
    height: 63px;
    fill: #555;
  }
  /**
   *  invitation-tg-group-box  -- end
   */


  /**
   *  invitation-poster-box  -- begin
   */

  .invitation-poster-box {

  }
  .invitation-poster-container {
    padding-top: 36px;
    background-color: #fff;
    @include viewport-unit(height, 80vh);
  }
  .invitation-poster-top {
    @include overflow;
  }
  .poster-card-box {
    margin: 0 auto;
    width: 200px;
    height: auto;
    border: 6px solid #0079FF;
    border-radius: 5px;
    // overflow: hidden;
    &.is-drawing {
      @include viewport-unit(height, 80vh, 150px);
      .invitation-card {
        height: 100%;
        overflow: hidden;
      }
    }
  }
  .invitation-poster-middle {
    padding-top: 44px;
    padding-bottom: 30px;
    font-size: 18px;
    color: #555;
    overflow: hidden;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      width: 65%;
      height: 0;
      box-shadow: 0 0 70px 10px rgba(0, 121, 255, .6);
      border-radius: 50%;
      transform: translateX(-50%);
      z-index: 3;
    }
  }
  .invitation-poster-bottom {

  }
  .invitation-poster-close {
    width: 100%;
    height: 50px;
    border-radius: 0;
  }

  /**
   *  invitation-poster-box  -- end
   */

  .invitation-copy-btn {
    position: relative;
    &::before {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      border-bottom: 5px solid rgba(0, 0, 0, .75);
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      transform: translateX(-50%);
      opacity: 0;
      visibility: hidden;
      transition: all .4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    &::after {
      content: 'Copied!';
      position: absolute;
      bottom: -40px;
      left: 50%;
      padding: 0 14px;
      height: 30px;
      line-height: 30px;
      background-color: rgba(0, 0, 0, .75);
      font-size: 14px;
      color: #fff;
      border-radius: 5px;
      white-space: nowrap;
      transform: translateX(-50%);
      opacity: 0;
      visibility: hidden;
      transition: all .4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    &.clipboard {
      &::before, &::after {
        opacity: 1;
        visibility: visible;
      }
    }
  }
</style>
