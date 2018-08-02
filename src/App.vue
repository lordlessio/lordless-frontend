<template>
  <div id="lordless" :class="{ 'blur': blurs[0] }">
    <Header v-bind="headerOpt"/>
    <GradientSvg/>
    <div class="ld-main" :class="[{ 'no-header': !headerOpt.show || (headerOpt.show && headerOpt.scroll) }, { 'no-footer': !footerOpt.show }]">
      <div class="d-flex col-flex f-auto-center ld-error" v-if="web3Opt.error">
        <h1>出错啦！</h1>
        <p>{{ web3Opt.error }}</p>
      </div>
      <router-view/>
      <!-- <Relogin v-model="userExpired" :address="web3Opt.address"></Relogin> -->
    </div>
    <Footer v-bind="footerOpt"/>
  </div>
</template>

<script>
import GradientSvg from '@/components/reuse/gradientSvg'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import Relogin from '@/components/reuse/relogin'
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
      reloginDialog: false
    }
  },
  components: {
    Header,
    Footer,
    Relogin,
    GradientSvg
  },
  computed: {
    ...mapState('layout', {
      headerOpt: 'header',
      footerOpt: 'footer',
      blurs: 'blurs'
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
  methods: {
    ...mapActions('status', [
      actionTypes.STATUS_INIT_BROSWER
    ]),

    // 监听主网络环境
    listenNetWork () {
      web3js.version.getNetwork((err, netId) => {
        console.log('getNetwork err', err, netId)
        switch (netId) {
          case '1':
            console.log('1：This is mainnet')
            break
          case '2':
            console.log('2：This is the deprecated Morden test network.')
            break
          case '3':
            console.log('3：This is the ropsten test network.')
            break
          case '4':
            console.log('4：This is the Rinkeby test network.')
            break
          case '42':
            console.log('42：This is the Kovan test network.')
            break
          default:
            console.log('other：This is an unknown network.')
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => this[actionTypes.STATUS_INIT_BROSWER]())
  }
}
</script>
