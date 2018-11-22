<template>
  <section class="d-flex f-auto-center text-center mobile-wallets-box" :class="{ 'dialog': dialog }">
    <div class="v-flex mobile-wallets-container">
      <h2 class="mobile-wallets-title">No wallet available</h2>
      <p class="mobile-wallets-desc">We can’t connect the external wallet.<br>Please download the wallet beblow to play our game inside.</p>
      <div class="mobile-wallet-btns">
        <lordless-btn
          v-for="(item, index) of wallets"
          :key="index"
          class="full-width mobile-wallet-btn" :class="[item.type, item.theme]">
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
export default {
  name: 'mobile-wallets',
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      wallets: [
        {
          type: 'is-yellow',
          icon: '#icon-trustwallet',
          theme: 'dark',
          path: 'https://alphawallet.com/'
        },
        {
          type: 'is-blue',
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
      .mobile-wallets-title, .mobile-wallets-desc {
        color: #fff;
      }
      .mobile-wallet-btn {
        border: none;
        background-color: transparent;
      }
    }
  }
  .mobile-wallets-container {
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
  .mobile-wallet-btns {
    margin-top: 45px;
  }
  .mobile-wallet-btn {
    padding: 10px 0;
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
    }
    .arrow-icon {
      margin-left: 15px;
      width: 25px;
      height: 25px;
    }
    &.is-yellow {
      background-image: linear-gradient(to right, #F76B1C, #FAD961);
    }
    &.is-blue {
      background-image: linear-gradient(to right, #1613B0, #7D72F0);
    }
    &.is-green {
      background-image: linear-gradient(to right, #429321, #B4EC51);
    }
    &.is-red {
      background-image: linear-gradient(to right, #9F041B, #F5515F);
    }
  }
</style>
