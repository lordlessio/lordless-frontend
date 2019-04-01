<template>
  <div class="d-flex f-auto-center mobile-clipboard-box mobile-trust-wallet-box" :class="{ 'is-dialog': dialog, 'clipboard': clipBool }">
    <div class="text-center trust-wallet-container">
      <p class="wallet-main-icon">
        <svg>
          <use :xlink:href="`#icon-trust-${dialog ? 'white' : 'original'}`"/>
        </svg>
      </p>
      <h2>No wallet available</h2>
      <p class="wallet-main-desc">Install or switch to Trust Wallet App. Use <span>Trust Wallet Browser</span> to visit:</p>
      <!-- <p class="trust-wallet-desc">Use <span>Trust Wallet Browser</span> to visit:<br>(Click to copy URL)</p> -->
      <p id="copy-link" class="inline-block trust-copy-link" :data-clipboard-text="copyLink">{{ copyLink }}</p>
      <div class="d-flex col-flex trust-wallet-btns">
        <lordless-btn :theme="dialog ? 'dialog': 'blue-linear'" class="full-width trust-open-btn" @click="jumpTrust('trust')">
          Open with Trust
        </lordless-btn>
        <p>OR</p>
        <lordless-btn :theme="dialog ? 'dialog': 'blue-linear'" class="d-flex f-auto-center full-width other-open-btn" @click="jumpTrust('lumi')">
          <svg>
            <use xlink:href="#icon-lumi"/>
          </svg>
        </lordless-btn>
        <lordless-btn :theme="dialog ? 'dialog': 'blue-linear'" class="d-flex f-auto-center full-width other-open-btn" @click="jumpTrust('infinito')">
          <svg>
            <use xlink:href="#icon-infinito"/>
          </svg>
        </lordless-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { isWechat } from 'utils/tool'
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
    jumpTrust (type = 'trust') {
      const links = {
        trust: `https://links.trustwalletapp.com/a/key_live_lfvIpVeI9TFWxPCqwU8rZnogFqhnzs4D?&event=openURL&url=${this.copyLink}`,
        lumi: 'https://lumiwallet.com/',
        infinito: 'https://www.infinitowallet.io/download/'
      }
      if (isWechat()) {
        this.$root.$children[0].wechatBlockModel = true
      } else {
        window.location.href = links[type]
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
      .wallet-main-desc, .trust-copy-link {
        color: #fff;
        >span {
          color: #7d72f0;
        }
      }
      // .trust-wallet-desc {
      //   >span {
      //     color: #BDB9FD;
      //   }
      // }
      .trust-copy-link {
        border-color: #fff;
        background-color: transparent;
      }
      .trust-wallet-btns {
        >p {
          color: #fff;
        }
      }
      .trust-open-btn {
        color: #7d72f0;
        background-color: #fff;
        background-image: none;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, .3);
      }
      .other-open-btn {
        fill: #7d72f0;
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
      font-size: 20px;
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
    color: #555;
    >span {
      color: $--main-blue-color;
    }
  }
  // .trust-wallet-desc {
  //   margin-top: 18px;
  //   font-size: 14px;
  //   line-height: 1.2;
  //   color: #999;
  //   >span {
  //     color: #0079FF;
  //   }
  // }
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
    >p {
      margin-top: 12px;
      font-size: 16px;
      color: #999;
    }
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
  .other-open-btn {
    margin-top: 12px;
    height: 42px;
    fill: #fff;
    >svg {
      height: 20px;
    }
    // &:not(:first-of-type) {
    //   margin-top: 12px;
    // }
  }
</style>
