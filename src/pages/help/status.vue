<template>
  <div class="lordless-status-box">
    <div class="page-container md">
      <div class="lordless-status-header text-center">
        <h1 class="TTFontBolder">Getting started</h1>
        <p class="TTFontBold text-color-secondary">Unsure how to get going on EVERMORE? WE'll help you out.</p>
      </div>
      <div class="lordless-status-content">
        <ul>
          <li class="status-cnt-item">
            <div class="d-flex status-cnt-container">
              <div class="d-flex f-align-end status-cnt-symbol">
                <span :class="[`lordless-symbol-${unBrowser ? 'close' : 'check'}`, 'lg']">
                  <i :class="[`el-icon-${unBrowser ? 'close' : 'check'}`]"></i>
                </span>
                <span class="inline-block mar-l1 text-upper text-color-third">STEP1</span>
              </div>
              <div class="v-flex status-cnt-left">
                <h2>Use a supported browser</h2>
                <p class="text-color-secondary mar-t2">You'll need to use Chrome or Firefox as your internet browser because this will allow you to user Metamask(your digital wallet)</p>
                <p class="no-install-browser" v-if="unBrowser">Install <a target="_blank" href="https://www.google.com/chrome/">Google Chrome</a> or <a target="_blank" href="https://www.mozilla.org/en-US/firefox/new/">Mozilla Firefox</a></p>
              </div>
              <div class="sm-hidden text-center status-cnt-right">
                <svg>
                  <use xlink:href="#icon-borswer"/>
                </svg>
              </div>
            </div>
          </li>
          <li class="status-cnt-item">
            <div class="d-flex status-cnt-container">
              <div class="d-flex f-align-end status-cnt-symbol">
                <span :class="[`lordless-symbol-${(unMetamask || lockedMetamask) ? 'close' : 'check'}`, 'lg']">
                  <i :class="[`el-icon-${(unMetamask || lockedMetamask) ? 'close' : 'check'}`]"></i>
                </span>
                <span class="inline-block mar-l1 text-upper text-color-third">STEP2</span>
              </div>
              <div class="v-flex status-cnt-left">
                <h2>Install and unlock MetaMask</h2>
                <p class="text-color-secondary mar-t2">You'll need to use Chrome or Firefox as your internet browser because this will allow you to user Metamask(your digital wallet)</p>
                <p class="no-install-metamask" v-if="unBrowser && unMetamask">Install extension for <a target="_blank" href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn">Google Chrome</a> or <a target="_blank" href="https://addons.mozilla.org/zh-CN/firefox/addon/ether-metamask/">Mozilla Firefox</a></p>
                <p class="unlock-wallet" v-if="!unMetamask && lockedMetamask">Your wallet is locked. Please unlock it.</p>
              </div>
              <div class="sm-hidden text-center status-cnt-right">
                <svg>
                  <use xlink:href="/static/svg/color_icon.svg#color-icon-metamask"/>
                </svg>
              </div>
            </div>
          </li>
          <li class="status-cnt-item">
            <div class="d-flex status-cnt-container">
              <div class="d-flex f-align-end status-cnt-symbol">
                <span :class="[`lordless-symbol-${unOwnEthBalance ? 'close' : 'check'}`, 'lg']">
                  <i :class="[`el-icon-${unOwnEthBalance ? 'close' : 'check'}`]"></i>
                </span>
                <span class="inline-block mar-l1 text-upper text-color-third">STEP3</span>
              </div>
              <div class="v-flex status-cnt-left">
                <h2>Own some Ethereum</h2>
                <p class="text-color-secondary mar-t2">You'll need to use Chrome or Firefox as your internet browser because this will allow you to user Metamask(your digital wallet)</p>
              </div>
              <div class="sm-hidden text-center status-cnt-right">
                <svg>
                  <use xlink:href="/static/svg/color_icon.svg#color-icon-ethereum"/>
                </svg>
              </div>
            </div>
          </li>
        </ul>
        <div class="text-center status-start-box" v-if="finishStatus">
          <h2>It seems that you're fully prepared!</h2>
          <ld-button class="text-upper start-btn" @click="$router.push('market')">START</ld-button>
        </div>
      </div>
      <div class="text-center lordless-status-questions">
        <h2>Common questions</h2>
        <div class="status-questions-cnt">
          <ul class="text-left d-flex">
            <li class="v-flex questions-cnt-item">
              <div class="questions-cnt-header">
                Why do you need my mobile phone number?
              </div>
              <div class="v-flex text-color-secondary questions-cnt-body">
                We use your email to send you notifications around collectible activity such as ones you buy and sell.
                If you plan to access Fan Bits across multiple platforms with different Ethereum addresses,your email let's
                us streamline your experience and the collectibles you own.
              </div>
            </li>
            <li class="v-flex questions-cnt-item">
              <div class="questions-cnt-header">
                Why do you need my mobile phone number?
              </div>
              <div class="v-flex text-color-secondary questions-cnt-body">
                We use your email to send you notifications around collectible activity such as ones you buy and sell.
                If you plan to access Fan Bits across multiple platforms with different Ethereum addresses,your email let's
                us streamline your experience and the collectibles you own.
              </div>
            </li>
            <li class="v-flex questions-cnt-item">
              <div class="questions-cnt-header">
                Why do you need my mobile phone number?
              </div>
              <div class="v-flex text-color-secondary questions-cnt-body">
                We use your email to send you notifications around collectible activity such as ones you buy and sell.
                If you plan to access Fan Bits across multiple platforms with different Ethereum addresses.
              </div>
            </li>
          </ul>
          <p class="text-color-secondary">Learn more in <span>FAQs</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LdButton from '@/components/stories/button'
import { mapState } from 'vuex'
export default {
  data: () => {
    return {}
  },
  computed: {
    ...mapState('status', [
      'browser'
    ]),
    unBrowser () {
      return !this.browser.Chrome && !this.browser.Firefox
    },

    unMetamask () {
      const web3Opt = this.$root.$children[0].web3Opt
      return !web3Opt.web3js || !web3Opt.networkId || !web3Opt.isInjected
    },

    lockedMetamask () {
      const web3Opt = this.$root.$children[0].web3Opt
      return !web3Opt.address
    },

    unOwnEthBalance () {
      const web3Opt = this.$root.$children[0].web3Opt
      return !web3Opt.balance
    },

    finishStatus () {
      return !this.unBrowser && !this.unMetamask && !this.lockedMetamask && !this.unOwnEthBalance
    }
  },
  components: {
    LdButton
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  .no-install-browser, .no-install-metamask {
    @include margin('top', 20px, 1);
    >a {
      color: #4E47D3;
      text-decoration: none;
    }
  }
  .unlock-wallet {
    @include margin('top', 20px, 1);
  }
  .lordless-status-header {
    @include margin('top', 50px, 1);
    @include margin('bottom', 100px, 1);
    >h1 {
      @include fontSize(36px, 1);
    }
    >p {
      @include margin('top', 18px, 1);
      @include fontSize(20px, 1);
    }
  }
  .status-cnt-item {
    border-radius: 10px;
    // border: 1px solid #eee;
    box-shadow: 5px 5px 20px 0 rgba(0, 0, 0, .3);
    &:not(:first-of-type) {
      @include margin('top', 60px, 1.2);
    }
  }
  .status-cnt-container {
    position: relative;
    @include padding-around(60px, 0, 30px, 60px, 1);
  }
  .status-cnt-symbol {
    position: absolute;
    top: -20px;
    left: 31px;
    @include fontSize(14px, 1);
  }
  .status-cnt-left {
    >h2 {
      @include fontSize(22px, 1);
    }
    >p {
      @include fontSize(16px, 1);
    }
  }
  .status-cnt-right {
    width: 30%;
    max-width: 350px;
    box-sizing: border-box;
    @include height(120px, 1);
    @include padding('left', 30px, 1);
    @include padding('right', 30px, 1);
    svg {
      width: 100%;
    }
  }

  .status-start-box {
    position: relative;
    color: #fff;
    background-color: transparent;
    @include TTFontBolder();
    @include margin('top', 60px, 1);
    @include padding('top', 40px, 1);
    @include padding('bottom', 30px, 1);
    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      width: 100vw;
      height: 100%;
      background-color: #4E47D3;
      transform: translateX(-50%);
      z-index: -1;
    }
    >h2 {
      font-family: inherit;
      @include fontSize(26px, 1);
    }
  }
  .start-btn {
    color: #4E47D3;
    font-weight: bold;
    @include fontSize(24px, 1);
    @include margin('top', 30px, 1);
    @include padding-around(10px, 30px, 10px, 30px, 1);
  }

  .lordless-status-questions {
    @include TTFontBolder();
    @include margin('top', 40px, 1);
    @include padding('bottom', 80px, 1);
    >h2 {
      font-family: inherit;
      @include fontSize(28px, 1);
    }
  }
  .status-questions-cnt {
    @include margin('top', 50px, 1);
    >p {
      @include TTFontNormal();
      @include fontSize(20px, 1);
      @include margin('top', 50px, 1);
      >span {
        text-decoration: underline;
        cursor: pointer;
        @include TTFontBolder();
      }
    }
  }
  .questions-cnt-item {
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 5px 5px 20px 0 rgba(0, 0, 0, .15);
    &:not(:first-of-type) {
      @include margin('left', 40px, 1);
    }
  }
  .questions-cnt-header {
    color: #fff;
    background-color: #4E47D3;
    @include fontSize(18px, 1);
    @include padding-around(32px, 22px, 32px, 22px, 1);
  }
  .questions-cnt-body {
    @include TTFontNormal();
    @include fontSize(16px, 1);
    @include padding-around(24px, 22px, 24px, 22px, 1);
  }
</style>
