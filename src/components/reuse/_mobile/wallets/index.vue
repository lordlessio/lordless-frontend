<template>
  <section class="d-flex f-auto-center text-center mobile-clipboard-box mobile-wallets-box" :class="{ 'dialog': dialog, 'clipboard': clipBool }">
    <div class="v-flex mobile-wallets-container">
      <h2 class="mobile-wallets-title">No wallet available</h2>
      <p class="mobile-wallets-desc">We can’t connect the external wallet.<br>Please copy the website below and download the wallet to paste the address in the wallet.</p>
      <p
        id="copy-link"
        class="TTFontBolder inline-block line-height-1 wallets-copy-link"
        :data-clipboard-text="copyLink"
        @mouseleave="clipBool = false">
        {{ copyLink }}
      </p>
      <div class="mobile-wallet-btns">
        <lordless-btn
          v-for="(item, index) of wallets"
          :key="index"
          class="full-width mobile-wallet-btn" :class="[item.type, item.theme, { 'inverse': dialog }]">
          <a class="inline-block" :href="item.path" target="_blank">
            <span class="inline-block wallet-icon">
              <svg>
                <use :xlink:href="item.icon"/>
              </svg>
            </span>
            <span class="inline-block arrow-icon">
              <svg>
                <use xlink:href="#icon-arrow-circle"/>
              </svg>
            </span>
          </a>
        </lordless-btn>
      </div>
    </div>
  </section>
</template>

<script>
import { clipboardMixins } from '@/mixins'
export default {
  name: 'mobile-wallets',
  mixins: [clipboardMixins],
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      copyLink: 'https://game.lordless.io',
      wallets: [
        {
          type: 'is-blue',
          icon: '#icon-coinbase-wallet',
          theme: 'light',
          path: 'https://wallet.coinbase.com/'
        },
        {
          type: 'is-yellow',
          icon: '#icon-trustwallet',
          theme: 'dark',
          path: 'https://trustwallet.com/'
        },
        {
          type: 'is-popular',
          theme: 'light',
          icon: '#icon-alphawallet',
          path: 'https://alphawallet.com/'
        },
        {
          type: 'is-green',
          theme: 'light',
          icon: '#icon-buntoy',
          path: 'https://www.buntoy.com/'
        },
        {
          type: 'is-red',
          theme: 'light',
          icon: '#icon-cocowallet',
          path: 'http://cocowallet.com.cn/'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .mobile-wallets-box {
    position: relative;
    // height: 100%;
    background-color: transparent;
    // @include viewport-unit(min-height, 100vh, 60px);
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-image: url('~static/svg/single/graphic-curve-tr-blue.svg');
      background-size: 100% auto;
      background-repeat: no-repeat;
      background-position: 0 0;
      z-index: -1;
      transform: rotate(180deg);
    }
    &.dialog {
      padding-top: 0;
      margin: 0 auto;
      width: 85%;
      min-height: inherit;
      &::before {
        display: none;
      }
      .mobile-wallets-container {
        padding-top: 0;
        padding-bottom: 0;
      }
      .mobile-wallets-title, .mobile-wallets-desc {
        color: #fff;
      }
      .wallets-copy-link {
        color: #fff;
        border-color: #fff;
      }
      .mobile-wallet-btn {
        border: none;
        background-color: transparent;
      }
    }
  }
  .mobile-wallets-container {
    padding-top: 35px;
    padding-bottom: 35px;
    margin: 0 auto;
    max-width: 300px;
  }
  .mobile-wallets-title {
    font-size: 24px;
    color: #555;
  }
  .mobile-wallets-desc {
    margin-top: 18px;
    font-size: 16px;
    color: #999;
  }
  .wallets-copy-link {
    margin-top: 12px;
    padding: 10px 12px;
    line-height: 1;
    font-size: 16px;
    border: 2px dashed;
    color: #0079FF;
    border-color: #0079FF;
    border-radius: 5px;
    outline: none;
  }
  .mobile-wallet-btns {
    margin-top: 45px;
  }
  .mobile-wallet-btn {
    height: 50px;
    background-color: transparent !important;
    border: none;
    &.light {
      color: #fff;
      fill: #fff !important;
    }
    &.dark {
      color: #555;
      fill: #555 !important;
    }
    &:not(:first-of-type) {
      margin-top: 12px;
    }
    .wallet-icon {
      width: 120px;
      height: 22px;
      text-align: left;
    }
    .arrow-icon {
      margin-left: 15px;
      width: 25px;
      height: 25px;
    }
    &.is-blue {
      .wallet-icon {
        svg {
          width: 110px;
        }
      }
      background-image: linear-gradient(to right, #124BDC, #0079FF);
      &.inverse {
        fill: #0079FF !important;
        background-image: linear-gradient(#fff, #fff);
      }
    }
    &.is-yellow {
      .wallet-icon {
        svg {
          width: 90px;
        }
      }
      background-image: linear-gradient(to right, #F76B1C, #FAD961);
      &.inverse {
        fill: #F76B1C !important;
        stroke: #F76B1C;
        stroke-width: 0.35px;
        background-image: linear-gradient(#fff, #fff);
      }
    }
    &.is-popular {
      .wallet-icon {
        svg {
          width: 110px;
        }
      }
      background-image: linear-gradient(to right, #1613B0, #7D72F0);
      &.inverse {
        fill: #7D72F0 !important;
        background-image: linear-gradient(#fff, #fff);
      }
    }
    &.is-green {
      .wallet-icon {
        svg {
          width: 110px;
        }
      }
      background-image: linear-gradient(to right, #429321, #B4EC51);
      &.inverse {
        fill: #429321 !important;
        background-image: linear-gradient(#fff, #fff);
      }
    }
    &.is-red {
      .wallet-icon {
        svg {
          width: 90px;
        }
      }
      background-image: linear-gradient(to right, #9F041B, #F5515F);
      &.inverse {
        fill: #F5515F !important;
        background-image: linear-gradient(#fff, #fff);
      }
    }
  }
</style>
