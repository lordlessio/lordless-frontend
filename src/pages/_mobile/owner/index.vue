<template>
  <div class="mobile-main-page">
    <mobile-nav-bar v-if="showNavbar" text="Candies"/>
    <router-view v-if="pageShow" class="mobile-children-page"/>
    <mobile-wallets v-if="web3Model"/>
    <mobile-connect
      v-else-if="connectModel"
      @connect="checkUser"/>
    <Authorize
      ref="ownerAuthorize"
      :modelClose="false"
      :autoClose="false"
      @blurs="dialogSetBlurs"
      @fClose="$router.push('/market')">
    </Authorize>
  </div>
</template>

<script>
import MobileConnect from '@/components/reuse/_mobile/connect'
import MobileWallets from '@/components/reuse/_mobile/wallets'
import Authorize from '@/components/reuse/dialog/authorize'

import { userMixins, dialogMixins } from '@/mixins'
import { mapState } from 'vuex'
export default {
  name: 'mobile-owner-index',
  mixins: [userMixins, dialogMixins],
  data: () => {
    return {
      // web3Model: false
      // connectModel: false
      showNavbar: true
    }
  },
  computed: {
    ...mapState('web3', [
      'web3Opt'
    ]),
    isMobile () {
      return this.$root.$children[0].isMobile
    },
    web3Model () {
      const { loading, isConnected } = this.web3Opt
      return this.isMobile && !loading && !isConnected
    },
    connectModel () {
      return !this.userInfo.default && !this.userInfo._id
    },
    pageShow () {
      return !this.connectModel && !this.web3Model
    }
  },
  watch: {
    '$route' (route) {
      this.checkRoute(route)
    }
  },
  components: {
    Authorize,
    MobileConnect,
    MobileWallets
  },
  methods: {

    checkRoute (route = this.$route) {
      if (route.path.match(/\/owner\/quest/)) {
        this.showNavbar = false
      } else {
        this.showNavbar = true
      }
    },

    async checkUser () {
      this.$refs.ownerAuthorize.checkoutAuthorize()
    }
  },
  mounted () {
    this.checkRoute()
  }
}
</script>

<style lang="scss">
  .mobile-main-page {
    margin: 0 auto;
    max-width: 768px;
    background-color: #f8f8f8;
    @include viewport-unit(min-height, 100vh);
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
