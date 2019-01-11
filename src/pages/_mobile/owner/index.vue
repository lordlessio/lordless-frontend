<template>
  <div class="mobile-main-page">
    <mobile-nav-bar
      ref="mobile-nav-bar"
      v-show="(scrollOpt.show && (!connectModel || !web3Model)) || connectModel || web3Model"
      v-bind="scrollOpt"
      @history="$router.push('/owner/info')"/>

    <transition :name="popTransition">
      <keep-alive :max="20">
        <router-view v-if="$route.meta.keepAlive && pageShow" class="lordless-pop-page"/>
      </keep-alive>
    </transition>
    <router-view v-if="!$route.meta.keepAlive && pageShow"/>
    <div
      v-if="web3Model || connectModel || web3Loading"
      class="d-flex mobile-plugins-box">
      <div v-if="web3Loading" class="v-flex d-flex f-auto-center mobile-plugins-loading">
        <i class="el-icon-loading"></i>
      </div>
      <mobile-wallets
        class="v-flex mobile-owner-plugin"
        v-else-if="web3Model"/>
      <mobile-connect
        class="v-flex mobile-owner-plugin"
        v-else
        @connect="checkUser"/>
    </div>
    <lordless-authorize
      ref="mobileOwnerAuthorize"
      blurs
      :modelClose="false"
      :autoClose="false"/>
  </div>
</template>

<script>
import MobileConnect from '@/components/reuse/_mobile/connect'
import MobileWallets from '@/components/reuse/_mobile/wallets/trust'
// import Authorize from '@/components/reuse/dialog/authorize'

import { publicMixins } from '@/mixins'
import { mapState } from 'vuex'
export default {
  name: 'mobile-owner-index',
  mixins: [publicMixins],
  data: () => {
    return {
      scrollOpt: {
        show: false,
        history: false,
        text: 'Candies',
        scroll: false,
        withdraw: false,
        scrollMark: 0
      },
      navbarTexts: [
        {
          text: 'Candies',
          match: /\/owner\/candy/,
          show: false,
          withdraw: true
        },
        {
          text: 'Quests',
          match: /\/owner\/quest/,
          show: false
        },
        {
          text: 'Me',
          match: /\/owner\/info/,
          show: false
        },
        {
          text: 'Activities',
          match: /\/owner\/activities/,
          show: true,
          history: true
        },
        {
          text: 'Taverns',
          match: /\/owner\/taverns/,
          show: true,
          history: true
        },
        {
          text: 'Authorizations',
          match: /\/owner\/authorization/,
          show: true,
          history: true
        },
        {
          text: 'Bind Telegram',
          match: /\/owner\/bind\/telegram/,
          show: true,
          history: true
        }
      ]
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ]),
    ...mapState('layout', [
      'popTransition'
    ]),
    web3Loading () {
      return this.web3Opt.loading
    },
    web3Model () {
      const { loading, isConnected } = this.web3Opt
      return this.isMobile && !loading && !isConnected
      // return true
    },
    connectModel () {
      return !this.userInfo.default && !this.userInfo._id
      // return true
    },
    pageShow () {
      return !this.connectModel && !this.web3Model && !this.web3Loading
    }
  },
  watch: {
    '$route' (route) {
      this.checkRoute(route)
    },
    account (val, oVal) {
      this.$nextTick(() => this.checkUser())
    }
  },
  components: {
    // Authorize,
    MobileConnect,
    MobileWallets
  },
  methods: {

    checkRoute (route = this.$route, navbarTexts = this.navbarTexts) {
      const opt = {
        show: false,
        history: false,
        text: 'Candies',
        scroll: false,
        scrollMark: 0
      }

      for (const item of navbarTexts) {
        if (route.path.match(item.match)) {
          this.$set(this, 'scrollOpt', Object.assign({}, opt, item))
          // this.$nextTick(() => {
          //   console.log('check route', item, (this.scrollOpt.show && (!this.connectModel || !this.web3Model)) || this.connectModel || this.web3Model)
          // })
          break
        }
      }
    },

    async checkUser () {
      this.$refs.mobileOwnerAuthorize.checkoutAuthorize()
    }
  },
  activated () {
    console.log(' mobile owner activated ')
    this.checkRoute()
    this.$nextTick(() => this.$refs['mobile-nav-bar'].init())
  },
  mounted () {
    this.$nextTick(() => this.checkRoute())
  }
}
</script>

<style lang="scss">
  .mobile-main-page {
    margin: 0 auto;
    max-width: 768px;
    // background-color: #f8f8f8;
    // @include viewport-unit(min-height, 100vh, 112px);
  }
  .mobile-plugins-box {
    // padding-top: 44px;
    // padding-bottom: 50px;
    // margin-top: 40px;
    // padding-bottom: 40px;
    @include viewport-unit(min-height, 100vh, 50px);
  }
  .mobile-owner-plugin {
    padding-top: 44px;
    box-sizing: border-box;
  }
  .mobile-plugins-loading {
    font-size: 30px;
    color: #999;
  }
  .mobile-children-page {
    // padding: 0 20px;
    // @include viewport-unit(min-height, 100vh, 60px);
  }
  .children-none-data-box {
    margin: 0 auto;
    width: 80%;
    text-align: center;
  }
  .children-none-data-container {

  }
  .children-none-data-icon {
    margin: 0 auto;
    width: 120px;
    height: 120px;
    line-height: 0;
    fill: #999;
  }
  .children-none-data-desc {
    margin-bottom: 36px;
    font-size: 16px;
    color: #999;
  }
  .children-none-data-btn {
    width: 100%;
    padding: 12px 0;
    &:not(:first-of-type) {
      margin-top: 12px;
    }
  }
</style>
