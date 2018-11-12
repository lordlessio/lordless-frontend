<template>
  <div id="lordless" :class="{ 'blur': blurs[0], 'transform': appOpt.transform, 'no-transform': !appOpt.transform }">
    <lordless-svg/>
    <Header ref="lordlessHeader" v-bind="headerOpt"/>
    <div class="ld-main" :class="[{ 'no-header': isMobile || !headerOpt.show || (headerOpt.show && headerOpt.fixed) }, { 'no-footer': !footerOpt.show }]">
      <!-- <div class="d-flex col-flex f-auto-center ld-error" v-if="web3Opt.error">
        <h1>出错啦！</h1>
        <p>{{ web3Opt.error }}</p>
      </div> -->
      <router-view/>
      <!-- <Relogin v-model="userExpired" :address="web3Opt.address"></Relogin> -->
    </div>
    <Footer v-bind="footerOpt"/>
    <!-- <msg-tip
      v-model="msgTip.show"
      :text="msgTip.text"
      :theme="msgTip.theme"
      fixed
      closeSync
      @close="closeTip">
    </msg-tip> -->
    <meta-tip v-model="metaOpen"/>
    <alert v-model="mobileAlertModel" desc="目前不支持移动端领取哦，请前往PC端注册使用吧。"/>
  </div>
</template>

<script>
import LordlessSvg from '@/components/lordlessSvg'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
// import MsgTip from '@/components/stories/message'
import MetaTip from '@/components/reuse/dialog/metaTip'
import Alert from '@/components/reuse/dialog/alert'
import { mobileBool } from 'utils/tool'

import { initWeb3 } from '@/assets/utils/web3/initWeb3'

import { actionTypes } from '@/store/types'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'App',
  async created () {
    if (this.web3Opt.web3js.default) initWeb3()
  },
  data: () => {
    return {
      mobileAlertModel: false,
      isMobile: false,
      reloginDialog: false
    }
  },
  components: {
    Header,
    Footer,
    // MsgTip,
    MetaTip,
    Alert,
    LordlessSvg
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
    ...mapState('user', [
      'userExpired'
    ]),
    ...mapState('contract', [
      'isCrowdsaleApproved'
    ]),

    // 是否登陆了 metamask
    web3Login () {
      return this.web3Opt.address
    },

    // web3 Network 环境是否正常
    web3IsNetwork () {
      return this.web3Opt.networkId === process.env.APPROVED_NETWORK_ID
    },

    // web3 整体状态是否正常
    web3IsValidate () {
      return this.web3Opt.networkId === process.env.APPROVED_NETWORK_ID && this.web3Opt.address
    }
  },
  watch: {
    headerOpt (val) {
      this.$nextTick(() => this.$refs.lordlessHeader.init())
    }
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
