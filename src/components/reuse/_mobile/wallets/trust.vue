<template>
  <div class="d-flex f-auto-center mobile-clipboard-box mobile-trust-wallet-box" :class="{ 'is-dialog': dialog, 'clipboard': clipBool }">
    <div class="text-center trust-wallet-container">
      <p class="wallet-main-icon">
        <svg>
          <use :xlink:href="`#icon-trust-${dialog ? 'white' : 'original'}`"/>
        </svg>
      </p>
      <h2>No wallet available</h2>
      <p class="wallet-main-desc">LORDLESS can not connect the external ETH wallet. Please install or switch to Trust Wallet App.</p>
      <p class="trust-wallet-desc">Use <span>Trust Wallet Browser</span> to visit:<br>(Click to copy URL)</p>
      <p id="copy-link" class="inline-block trust-copy-link" :data-clipboard-text="copyLink">{{ copyLink }}</p>
      <div class="trust-wallet-btns">
        <lordless-btn theme="blue-linear" class="full-width trust-open-btn" @click="jumpTrust">
          Open with Trust
        </lordless-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { clipboardMixins } from '@/mixins'
export default {
  name: 'mobile-wallet-trust',
  mixins: [clipboardMixins],
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      copyLink: window.location.href || 'https://game.lordless.io'
    }
  },
  watch: {
    '$route' () {
      this.copyLink = window.location.href
    }
  },
  methods: {
    jumpTrust () {
      const isWechat = typeof WeixinJSBridge !== 'undefined' && (navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1 || typeof window.navgator.wxuserAgent !== 'undefined')
      if (isWechat) {
        this.$root.$children[0].wechatBlockModel = true
      } else {
        window.location.href = `https://links.trustwalletapp.com/a/key_live_lfvIpVeI9TFWxPCqwU8rZnogFqhnzs4D?&event=openURL&url=${this.copyLink}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .mobile-trust-wallet-box {
    &.is-dialog {
      .trust-wallet-container {
        max-width: 270px;
        >h2 {
          color: #fff;
        }
      }
      .wallet-main-icon {
        fill: #fff;
      }
      .wallet-main-desc, .trust-wallet-desc, .trust-copy-link {
        color: #fff;
      }
      .trust-wallet-desc {
        >span {
          color: #BDB9FD;
        }
      }
      .trust-copy-link {
        border-color: #fff;
        background-color: transparent;
      }
      .trust-open-btn {
        color: #0079FF;
        background-color: #fff;
        background-image: none;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, .3);
      }
    }
  }
  .trust-wallet-container {
    max-width: 280px;
    >h2 {
      margin-top: 18px;
      font-size: 24px;
      color: #555;
    }
  }
  .wallet-main-icon {
    fill: #124BDC;
    svg {
      width: 90px;
      height: 90px;
    }
  }
  .wallet-main-desc {
    margin-top: 18px;
    font-size: 16px;
    color: #777;
  }
  .trust-wallet-desc {
    margin-top: 18px;
    font-size: 14px;
    line-height: 1.2;
    color: #999;
    >span {
      color: #0079FF;
    }
  }
  .trust-copy-link {
    max-width: 250px;
    margin-top: 12px;
    padding: 8px 12px;
    font-size: 16px;
    color: #777;
    border: 2px dashed #777;
    border-radius: 5px;
    background-color: #fff;
    @include overflow();
  }
  .trust-wallet-btns {
    margin-top: 36px;
  }
  .trust-open-btn {
    height: 42px;
    line-height: 40px;
    // a {
    //   display: inline-block;
    //   width: 100%;
    //   height: 100%;
    //   color: inherit;
    // }
    // font-size: 16px;
    // color: #fff;
    // background-image: linear-gradient(-225deg, #124BDC 0%, #0079FF 100%);
    // border-radius: 5px;
  }
</style>
