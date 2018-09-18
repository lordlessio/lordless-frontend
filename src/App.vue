<template>
  <div id="lordless" :class="{ 'blur': blurs[0], 'transform': appOpt.transform, 'no-transform': !appOpt.transform }">
    <lordless-svg/>
    <Header ref="lordlessHeader" v-bind="headerOpt"/>
    <div class="ld-main" :class="[{ 'no-header': !headerOpt.show || (headerOpt.show && (!headerOpt.scroll || !headerOpt.fixed)) }, { 'no-footer': !footerOpt.show }]">
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
    <meta-tip v-model="metaOpen"></meta-tip>
  </div>
</template>

<script>
import LordlessSvg from '@/components/lordlessSvg'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
// import MsgTip from '@/components/stories/message'
import MetaTip from '@/components/reuse/dialog/metaTip'

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
      isMobile: false,
      reloginDialog: false
    }
  },
  components: {
    Header,
    Footer,
    // MsgTip,
    MetaTip,
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
    },

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
  beforeMount () {
    const bool = () => {
      let check = false;
      (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera)
      return check
    }
    this.isMobile = bool()
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
