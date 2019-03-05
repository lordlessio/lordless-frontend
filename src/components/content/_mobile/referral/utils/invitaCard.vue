<template>
  <div class="relative full-width referral-invitation-card">
    <div class="d-flex f-auto-center referral-invitation-loading" :class="{ 'is-hide': !loading }">
      <p class="loading-icon"></p>
    </div>
    <div v-if="loading" id="invitation-card-container" class="invitation-card-container">
      <div class="invitation-card-top">
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
          <p class="ImpactFont text-nowrap invitation-impact-address">Invite you to join LORDLESS</p>
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
      default: '0x726b2d681be918a28bb852915fe83a11533a99b3'
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
          desc: 'Get a <span>BOOST of HELD</span> of LESS Term Deposit.'
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
        width: 340,
        height: 340,
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
    background-color: #ddd;
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
    background-color: #000;
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
      color: #fff;
    }
  }
  .invitation-impact-address {
    margin-top: 18px;
    font-size: 30px;
    color: #FFCC66;
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
    >h3 {
      padding-left: 12px;
      font-size: 20px;
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
    font-size: 16px;
    >span {
      font-family: $--font-TTNormsBold;
      color: $--main-yellow-color;
    }
  }
  .invitation-reward-tips {
    margin-top: 50px;
    >p {
      color: #fff;
      font-size: 12px;
      &:first-of-type {
        font-size: 14px;
      }
      &:not(:first-of-type) {
        margin-top: 8px;
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
    padding: 36px 30px;
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
    padding: 12px;
    width: 126px;
    height: 126px;
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
    overflow: hidden;
  }
  /**
   *  invitation-card-bottom -- end
   */

  .loading-icon {
    height: 30px;
    width: 100%;
    background-repeat: no-repeat;
    background-position: 50% 0;
    animation: #{$animation-name} #{$duration} infinite steps(1);
    // transform: scale(1.2);
    background-image : url(data:image/png;base64,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)
  }
</style>
