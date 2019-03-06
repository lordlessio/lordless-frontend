<template>
  <div class="relative full-width referral-invitation-card">
    <div class="d-flex f-auto-center referral-invitation-loading" :class="{ 'is-hide': !loading }">
      <span class="inline-block line-height-0 invitation-loading-icon">
        <svg>
          <use xlink:href="#icon-large-loading"/>
        </svg>
      </span>
    </div>
    <div v-if="loading" id="invitation-card-container" class="invitation-card-container">
      <div class="relative invitation-card-top">
        <img class="full-width card-img-bg" src="/static/svg/referral/bg-pricing-education.svg"/>
        <p class="d-flex f-align-center invitation-card-icon">
          <span class="inline-block line-height-0 icon-image">
            <!-- <svg>
              <use xlink:href="#icon-logo-image"/>
            </svg> -->
            <img class="full-width" src="/static/svg/single/icon-image.svg"/>
          </span>
          <span class="inline-block line-height-0 icon-text">
            <!-- <svg>
              <use xlink:href="#icon-logo-text"/>
            </svg> -->
            <img class="full-width" src="/static/svg/single/icon-text.svg"/>
          </span>
        </p>
        <div class="invitation-card-cnt">
          <div class="d-flex f-align-center invitation-address-box">
            <lordless-blockies :seed="address" :scale="4" theme="light"/>
            <p class="v-flex text-break">{{ address }}</p>
          </div>
          <p class="ImpactFont relative text-nowrap invitation-impact-address" style="text-shadow: 8px 6px 0px rgba(255, 204, 102, .15);">Invite you to join LORDLESS</p>
          <ul class="invitation-reward-box">
            <li class="d-flex f-align-center invitation-reward-item"
              v-for="(item, index) of rewards" :key="index">
              <span class="inline-block line-height-0">
                <img class="full-width" :src="`/static/svg/referral/${item.cntIcon}.svg`"/>
                <!-- <svg>
                  <use :xlink:href="item.cntIcon"/>
                </svg> -->
              </span>
              <div class="v-flex reward-item-info">
                <h3 class="relative">{{ item.title }}</h3>
                <p v-html="item.desc" class="reward-item-desc"></p>
              </div>
            </li>
          </ul>
          <div class="invitation-reward-tips">
            <p class="d-flex f-align-center">
              <span class="inline-block line-height-0 invitation-tips-icon">
                <!-- <svg>
                  <use xlink:href="#icon-tips"/>
                </svg> -->
                <img class="full-width" src="/static/svg/single/tips.svg"/>
              </span>
              <span>Tips</span>
            </p>
            <p>The materials can be made into Bounty Chest which can be sold or opened.</p>
            <p>HELD, HOPS earned on every LESS per deposit, describes the income of the deposit.</p>
          </div>
        </div>
      </div>
      <div class="invitation-card-bottom">
        <div class="d-flex f-align-center card-bottom-container">
          <div class="v-flex d-flex col-flex f-justify-between card-bottom-left">
            <p class="TTFontBolder">Scan the QR code to sign up and get the rewards.</p>
            <div class="invitation-lordless-copyright">
              <p>© 2018-2019 LORDLESS</p>
              <p>Powered by LORDLESS</p>
            </div>
          </div>
          <div class="invitation-scan-code">
            <div class="invitation-scan-container">
              <div id="invitation-qrcode" class="invitation-qrcode"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else id="invitation-download-img" class="full-width line-height-0 invitation-download-img"></div>
  </div>
</template>

<script>
import Html2Canvas from 'html2canvas'

import { appendScript } from 'utils/tool'
export default {
  name: 'referral-invitation-card-component',
  props: {
    address: {
      type: String,
      default: ''
    }
  },
  data: () => {
    return {
      loading: true,
      rewards: [
        {
          title: 'Material reward',
          cntIcon: 'handshake',
          desc: 'After the confirmation you will get <span>10,000 LESS material.</span>'
        }, {
          title: 'HOPS deposit reward',
          cntIcon: 'reward',
          desc: 'Get a <span>HELD boost</span> in LESS Term Deposit.'
        }
      ],
      qrcode: null
    }
  },
  methods: {
    async init () {
      await this.initQrcode()
      setTimeout(() => {
        this.drawImage()
      }, 300)
    },
    async initQrcode () {
      let QRCode = window.QRCode
      if (!QRCode) {
        await appendScript(['//lordless-sh.oss-cn-shanghai.aliyuncs.com/static/js/qrcode.js'])
        QRCode = window.QRCode
      }

      const qrcode = new QRCode(document.getElementById('invitation-qrcode'), {
        text: `${location.origin}/owner/referee?r=${this.address}`,
        width: 288,
        height: 288,
        colorDark: '#000',
        colorLight: '#fff',
        correctLevel: QRCode.CorrectLevel.H
      })
      console.log('0qrcode', qrcode, `${location.origin}/owner/referee?r=${this.address}`)
      this.qrcode = qrcode
    },
    async drawImage () {
      this.loading = true
      // if (!this.downloadLoaded) return
      Html2Canvas(document.getElementById('invitation-card-container'), {
        useCORS: true,
        scale: window.devicePixelRatio + 1
      }).then((canvas) => {
        const img = document.createElement('img')
        img.className = 'lens-download-img vertical-bottom full-width'
        img.src = canvas.toDataURL('image/png', 1)

        this.loading = false
        this.$nextTick(() => {
          const downloadBox = document.getElementById('invitation-download-img')
          if (downloadBox) {
            downloadBox.firstChild && downloadBox.removeChild(downloadBox.firstChild)
            downloadBox.appendChild(img)
          }
          console.log('-------- done')
          this.$emit('done')
        })
      })
    }
  },
  beforeDestroyed () {
    this.loading = true
    const downloadBox = document.getElementById('invitation-download-img')
    downloadBox && downloadBox.firstChild && downloadBox.removeChild(downloadBox.firstChild)
  }
}
</script>

<style lang="scss" scoped>
  .referral-invitation-card {

  }
  .invitation-card-container {
    width: 375px;
  }

  /**
   *  referral-invitation-loading -- begin
   */
  .referral-invitation-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    @include viewport-unit(height, 80vh, 150px);
    background-color: #fff;
    opacity: 1;
    visibility: visible;
    transition: all .3s, visibility 0s .3s, z-index 0s .3s;
    z-index: 1;
    &.is-hide {
      opacity: 0;
      visibility: hidden;
      z-index: -1;
    }
  }
  /**
   *  referral-invitation-loading -- end
   */

  /**
   *  invitation-card-top -- begin
   */
  .invitation-card-top {
    padding: 30px 30px 90px;
    background-color: #151518;
  }
  .card-img-bg {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    opacity: .15;
    z-index: 1;
  }
  .invitation-card-icon {
    // fill: #fff;
    >.icon-image {
      width: 22px;
      // height: 22px;
    }
    >.icon-text {
      margin-left: 8px;
      width: 87px;
      // height: 23px;
    }
  }
  .invitation-card-cnt {
    margin-top: 42px;
  }
  .invitation-address-box {
    >p {
      margin-left: 12px;
      max-width: 220px;
      font-size: 14px;
      line-height: 1.2;
      color: #fff;
    }
  }
  .invitation-impact-address {
    margin-top: 18px;
    font-size: 30px;
    color: $--main-yellow-color;
    // &::before {
    //   content: 'Invite you to join LORDLESS';
    //   position: absolute;
    //   bottom: -5px;
    //   right: -5px;
    //   font-size: 30px;
    //   color: $--main-yellow-color;
    //   opacity: .5;
    // }
  }
  .invitation-reward-box {
    margin-top: 48px;
  }
  .invitation-reward-item {
    >span {
      width: 64px;
      // height: 64px;
    }
    &:not(:first-of-type) {
      margin-top: 32px;
    }
  }
  .reward-item-info {
    margin-left: 16px;
    color: #fff;
    line-height: 1.2;
    >h3 {
      padding-left: 12px;
      font-size: 20px;
      text-shadow: 0px 0px 0px #000;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: 6px;
        height: 12px;
        background-color: $--main-yellow-color;
        transform: translateY(-50%);
      }
    }
  }
  .reward-item-desc {
    margin-top: 4px;
    font-size: 16px;
    /deep/ {
      >span {
        font-family: $--font-TTNormsBold;
        color: $--main-yellow-color;
      }
    }
  }
  .invitation-reward-tips {
    margin-top: 50px;
    >p {
      color: #fff;
      font-size: 12px;
      &:first-of-type {
        font-size: 14px;
        height: 18px;
      }
      &:not(:first-of-type) {
        margin-top: 8px;
        height: 30px;
      }
    }
  }
  .invitation-tips-icon {
    margin-right: 6px;
    width: 12px;
    // height: 12px;
    // fill: #fff;
  }
  /**
   *  invitation-card-top -- end
   */

  /**
   *  invitation-card-bottom -- end
   */
  .invitation-card-bottom {
    margin: 0 -30px;
    padding: 36px 60px;
    background-image: linear-gradient(-45deg, #FAD961 0%, #F76B1C 100%);
  }
  .card-bottom-left {
    height: 120px;
    >p {
      font-size: 16px;
      color: $--main-color;
    }
  }
  .invitation-lordless-copyright {
    font-size: 12px;
    color: #555;
  }

  .invitation-scan-code {
    margin-left: 28px;
    padding: 10px;
    width: 116px;
    height: 116px;
    border-radius: 5px;
    background-color: #fff;
    overflow: hidden;
  }
  .invitation-scan-container {
    width: 100%;
    height: 100%;
  }
  .invitation-qrcode {
    width: 100%;
    /deep/ {
      >img {
        width: 100%;
      }
    }
    // transform: scale(.3);
    // transform-origin: 0 0;
  }
  .invitation-download-img {
    // overflow: hidden;
  }
  /**
   *  invitation-card-bottom -- end
   */
  @keyframes pendingRotate {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .invitation-loading-icon {
    width: 56px;
    height: 56px;
    fill: #0079FF;
    animation: pendingRotate 1s linear infinite;
  }
</style>
