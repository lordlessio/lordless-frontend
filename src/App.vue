<template>
  <div id="lordless" :class="{ 'blur': blurs[0], 'transform': appOpt.transform, 'no-transform': !appOpt.transform }">
    <lordless-svg/>

    <mobile-tab-bar v-if="isMobile"/>

    <Header v-if="!isMobile" ref="lordlessHeader" v-bind="headerOpt" :zIndex="isMobile ? 2299 : 99"/>
    <div class="ld-main" :class="[{ 'no-header': isMobile || !headerOpt.show || (headerOpt.show && headerOpt.fixed) }, { 'no-footer': !footerOpt.show }]">
      <router-view/>
    </div>
    <Footer v-if="!isMobile" v-bind="footerOpt"/>
    <!-- <msg-tip
      v-model="msgTip.show"
      :text="msgTip.text"
      :theme="msgTip.theme"
      fixed
      closeSync
      @close="closeTip">
    </msg-tip> -->
    <meta-tip v-model="metaOpen"/>
    <mobile-alert v-model="mobileAlertModel"/>
  </div>
</template>

<script>
import MobileTabBar from '@/components/reuse/_mobile/tabBar'

import LordlessSvg from '@/components/reuse/lordlessSvg'
import Header from '@/components/content/layout/header'
import Footer from '@/components/content/layout/footer'
// import MsgTip from '@/components/stories/message'
import MetaTip from '@/components/reuse/dialog/metaTip'
import MobileAlert from '@/components/reuse/dialog/mobileAlert'
import { mobileBool } from 'utils/tool'

import { initWeb3 } from '@/assets/utils/web3/initWeb3'

import { actionTypes } from '@/store/types'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'App',
  async created () {
    initWeb3().then(({ loading, isConnected }) => {
      console.log(' --- web3 init')
      // if (!loading && !isConnected) {
      //   this.$notify.error({
      //     title: 'Error!',
      //     message: 'Web3 init failed',
      //     position: 'bottom-right',
      //     duration: 2500
      //   })
      // } else if (isConnected) {
      //   this.$notify.success({
      //     title: 'Success!',
      //     message: 'Web3 is onReady!',
      //     position: 'bottom-right',
      //     duration: 2500
      //   })
      // }
    })
  },
  data: () => {
    return {
      mobileAlertModel: false,
      isMobile: false,
      reloginDialog: false
    }
  },
  computed: {
    ...mapState('layout', {
      headerOpt: 'header',
      footerOpt: 'footer',
      blurs: 'blurs',
      msgTip: 'messageTip',
      metaOpen: 'metaOpen',
      appOpt: 'app'
    }),
    ...mapState('web3', [
      'web3Opt'
    ]),
    ...mapState('contract', [
      'isCrowdsaleApproved'
    ])
  },
  watch: {
    headerOpt (val) {
      this.$nextTick(() => this.$refs.lordlessHeader && this.$refs.lordlessHeader.init())
    }
  },
  components: {
    Header,
    Footer,
    MobileTabBar,

    // MsgTip,
    MetaTip,
    MobileAlert,
    LordlessSvg
  },
  methods: {
    // ...mapActions('region', [
    //   actionTypes.REGION_SET_REGIONS
    // ]),
    ...mapActions('status', [
      actionTypes.STATUS_INIT_BROSWER
    ]),
    ...mapActions('user', [
      actionTypes.USER_SET_USER_BY_TOKEN,
      actionTypes.USER_SET_USER_HOME
    ]),
    ...mapActions('layout', [
      actionTypes.LAYOUT_SET_MESSAGE_TIP,
      actionTypes.LAYOUT_SET_META_OPEN
    ]),

    closeTip () {
      this[actionTypes.LAYOUT_SET_MESSAGE_TIP]({ show: false })
    }

    // 监听主网络环境
    // listenNetWork () {
    //   web3js.version.getNetwork((err, netId) => {
    //     console.log('getNetwork err', err, netId)
    //     switch (netId) {
    //       case '1':
    //         console.log('1：This is mainnet')
    //         break
    //       case '2':
    //         console.log('2：This is the deprecated Morden test network.')
    //         break
    //       case '3':
    //         console.log('3：This is the ropsten test network.')
    //         break
    //       case '4':
    //         console.log('4：This is the Rinkeby test network.')
    //         break
    //       case '42':
    //         console.log('42：This is the Kovan test network.')
    //         break
    //       default:
    //         console.log('other：This is an unknown network.')
    //     }
    //   })
    // }
  },
  beforeMount () {
    this.isMobile = mobileBool()
  },
  mounted () {
    // document.getElementById('outside-loading').style = 'display: none'
    this.$nextTick(() => {
      // this[actionTypes.REGION_SET_REGIONS]()
      this[actionTypes.STATUS_INIT_BROSWER]()
      this[actionTypes.USER_SET_USER_BY_TOKEN]()
      this[actionTypes.USER_SET_USER_HOME]()
    })
  }
}
</script>
