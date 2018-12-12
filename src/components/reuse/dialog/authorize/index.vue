<template>
  <el-dialog
    :visible.sync="authorizeDialog"
    :custom-class="`inline-block lordless-dialog message-dialog no-header transparent center ${metaOpen ? 'blur' : ''}`"
    width="100%"
    append-to-body
    center
    top="0"
    :close-on-click-modal="modelClose"
    :close-on-press-escape="false"
    :show-close="false"
    @open="$emit('open')"
    @close="$emit('close')"
    @closed="authorizeClosed">
    <div class="lordless-message-box">
      <span
        @click.stop="closeDialog"
        class="inline-block line-height-1 lordless-message-close"
        :class="closeTheme">
        <i class="el-icon-close"></i>
      </span>
      <Crowdsale
        ref="crowdsale"
        v-model="showCrowsale"
        :avatar="avatar"
        :address="address"
        @pending="crowdsalePending"/>

      <Telegram
        ref="telegram"
        :visible.sync="showTelegram"
        :avatar="avatar"
        :address="address"
        @close="authorizeDialog = false"
        @telegram="$emit('telegram', $event)"/>

      <Status
        v-if="showStatus && !hideStatus"
        :type="statusType"/>

      <Sign
        ref="signAuthorize"
        v-model="authorizeDialog"
        :visible="showSign"
        :account="account"
        :web3Loading="web3Opt.loading"
        @success="signSuccess"/>
    </div>
  </el-dialog>
</template>

<script>
import Telegram from './telegram'
import Crowdsale from './crowdsale'
import Status from './status'
import Sign from './sign'

import { addClass, removeClass } from 'utils/tool'

import { contractMixins, publicMixins } from '@/mixins'

import { actionTypes } from '@/store/types'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'lordless-authorize',
  mixins: [contractMixins, publicMixins],
  props: {
    avatar: {
      type: Object,
      default: () => {
        return {
          scale: 18,
          radius: '20px'
        }
      }
    },

    // 是否自动关闭
    autoClose: {
      type: Boolean,
      default: true
    },

    modelClose: {
      type: Boolean,
      default: false
    },

    // 是否内部执行pending
    pending: {
      type: Boolean,
      default: true
    }
  },
  data: () => {
    return {
      // 在 authorizeInit 就绪之前，如果手动触发了 check，则标记 initBeforeCheck 为 true
      initBeforeCheck: false,

      // 在 authorizeInit 就绪之前，如果手动触发了 check，则标记 rendered 为 true
      rendered: false,

      authorizeDialog: false,

      // isInit: false,

      showSign: false,

      showCrowsale: false,

      showTelegram: false

      // crowdsale options
      // crowdsaleModel: false,
      // crowdsaleInterval: null,
      // crowdsaleTx: null
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ]),
    ...mapState('status', [
      'browser'
    ]),
    ...mapState('layout', [
      'metaOpen'
    ]),
    ...mapState('contract', [
      'isCrowdsaleApproved'
    ]),

    // 登陆之后的用户地址
    address () {
      return this.userInfo._id
    },

    // web3 连接状态
    statusType () {
      const web3Opt = this.web3Opt

      // const web3Loading = web3Opt.loading
      const authorizeInit = this.authorizeInit

      const unBrowser = !this.isMobile && !this.browser.Chrome && !this.browser.Firefox
      // const unBrowser = false

      const unMetamask = web3Opt.web3js.default || !web3Opt.networkId || !web3Opt.isConnected
      // const unMetamask = false

      const lockedMetamask = !web3Opt.address
      // const lockedMetamask = false

      const unallowMetamask = process.env.NODE_ENV !== 'development' && parseInt(web3Opt.networkId) !== parseInt(process.env.APPROVED_NETWORK_ID)
      // const unallowMetamask = false

      switch (true) {
        case authorizeInit && unBrowser: return 'browser'
        case authorizeInit && unMetamask: return 'missing'
        case authorizeInit && lockedMetamask: return 'locked'
        case authorizeInit && unallowMetamask: return 'network'
        default: return null
      }
    },

    showStatus () {
      return !!this.statusType
    },

    hideStatus () {
      return this.showTelegram
    },

    authorizeBool () {
      return !this.showStatus && this.address
    },

    signBool () {
      return !this.showStatus && !this.address
    },

    closeTheme () {
      // return this.authorizeBool ? 'dark' : 'light'
      return 'light'
    },

    web3Error () {
      return this.web3Opt.error
    },

    // web3初始化状态
    authorizeInit () {
      // 浏览器检测初始化状态
      const browserInit = !this.browser.default

      // web3 是否在加载
      const { loading } = this.web3Opt

      const _web3js = this.web3Opt.web3js

      // unlocked 表示当前环境没有 web3
      const unlockedWeb3 = _web3js.unlocked
      console.log('browserInit', browserInit, loading, unlockedWeb3)

      return unlockedWeb3 || (browserInit && !loading)
    }

    // metaOpen () {
    //   return this.$root.$children[0].metaOpen
    // }
  },
  watch: {

    showStatus (val) {
      if (val && this.authorizeInit) {
        this.initModels()
      } else if (this.rendered) {
        this.checkoutAuthorize()
      }
    },

    // 监听用户登陆信息地址
    address (val) {
      // 如果地址有效，并且不允许市场判断,关闭
      if (!this.crowdsale && val) this.authorizeDialog = false
    },
    authorizeDialog (val) {
      const lordless = document.getElementById('lordless')
      if (val) {
        this.$nextTick(() => addClass('mobile-dialog-open', lordless))
      } else {
        removeClass('mobile-dialog-open', lordless)
      }
      this.$emit('blurs', val)
    },

    // 如果切换了账号，recheck authorize
    account (val, oVal) {
      console.log('------- account watch', oVal, 'rendered', this.rendered)
      if (!this.autoClose || !this.rendered) return
      console.log('------------ account', val, oVal)
      this.checkoutAuthorize()
      // this.authorizeDialog = false
    },

    authorizeInit (val) {
      if (val) {
        const { loading, isConnected } = this.web3Opt
        this.$emit('init')

        if (this.isMobile && !loading && !isConnected) {
          this.authorizeDialog = false

          this.$nextTick(() => {
            if (this.initBeforeCheck) {
              this.$root.$children[0].mobileWalletModel = true
            }
          })
        }
      }
    }

    // metaOpen () {
    //   return this.$root.$children[0].metaOpen
    // }
  },
  components: {
    Telegram,
    Crowdsale,
    Status,
    Sign
  },
  methods: {
    ...mapActions('contract', [
      actionTypes.CONTRACT_CHECK_CROWDSALE
    ]),

    signSuccess () {
      this.$emit('sign')
      this.authorizeDialog = false
    },

    authorizeClosed () {
      // console.log('this.signAuthorize', this.$refs.signAuthorize)
      this.$refs.signAuthorize && this.$refs.signAuthorize.reset()
    },

    closeDialog () {
      this.$emit('fClose')
      this.authorizeDialog = false
    },

    isMobileRead () {
      const { loading, isConnected } = this.web3Opt

      switch (true) {
        // 如果是移动端，并且 !locked 返回 false
        case this.isMobile && !loading && !isConnected:
        // case this.isMobile:
          this.authorizeDialog = false
          this.$nextTick(() => {
            this.$root.$children[0].mobileWalletModel = true
          })
          return false

        // 如果不是移动端，或者移动端含有 web3，返回 true
        default: return true
      }
    },

    checkoutAuthorize ({ guide = false, crowdsale = false, telegram = false } = {}) {
      // 记录是否已经手动check过了， rendered
      if (!this.rendered) this.rendered = true
      // authorizeInit 就绪之前，触发 checkout， 改变 initBeforeCheck 状态为 true
      if (!this.authorizeInit) this.initBeforeCheck = true
      if (!this.isMobileRead()) return false

      // 如果是移动端，直接弹出
      // if (this.isMobile) {
      //   this.$root.$children[0].mobileWalletModel = true
      //   return
      // }

      // 如果用户不存在，打开对话框，执行下行阻断
      if (!this.address) {
        this.showSign = this.signBool
        this.authorizeDialog = true
        return false
      }

      // 检测之前初始化状态
      this.initModels()

      // 如果验证 telegram 并且用户没有授权 telegram,则执行并下行阻断
      if (telegram && (!this.userInfo.telegram || !this.userInfo.telegram.id)) {
        console.log('----- telegram')
        this.authorizeDialog = true
        this.$nextTick(() => {
          this.showTelegram = true
        })
        return false
      }

      /**
       * 手动检查 guide 配置是否ok
       *
       * 如果只需要检查 guide 配置，执行此判断
       */
      if (guide && this.showStatus) {
        this.authorizeDialog = true
        return false
      }

      if (!crowdsale) return true

      console.log('---- this.statusType', this.statusType)

      /**
       * crowdsale 前检查guide配置是否ok
       *
       * 如果用户之前登陆过，本地存有信息，下次登陆就不需要重新授权，所以可能会在 guide 配置不完善的时候登陆
       * 因为执行合约操作，必须需要 guide 配置完善，所以需要手动检查一下 guide
       */
      if (this.showStatus) {
        this.authorizeDialog = true
        return false
      }

      // 如果 web3 error
      if (this.web3Error) {
        this.$notify.error({
          title: 'Error!',
          message: 'please check your metamask!',
          position: 'bottom-right',
          duration: 3500
        })
        return false
      }

      if (!this.authorizeInit) {
        this.$notify({
          type: 'warning',
          title: 'web3 init...',
          message: 'please check your metamask! ',
          position: 'bottom-right',
          duration: 3500
        })
        return false
      }

      if (crowdsale) {
        this.showCrowsale = true
        console.log('---- authorize crowdsale', this.$refs.crowdsale)

        // 检查市场合约权限， 如果 isCrowdsaleApproved 为 true，代表市场已授权
        this.authorizeDialog = !this.isCrowdsaleApproved
        // const crowdsaleBool = await this.checkCrowdsale()
        return this.isCrowdsaleApproved
      }

      this.authorizeDialog = false
      return true
    },

    initModels () {
      this.showTelegram = false
      this.showCrowsale = false
      this.showSign = false
    },

    // 市场授权 pending 状态处理
    crowdsalePending ({ tx, pass = false }, address = this.address) {
      if (pass) {
        this[actionTypes.CONTRACT_CHECK_CROWDSALE](address)
        this.closeDialog()
        return
      }
      if (this.pending) {
        this.checkCrowdsaleEvent({ address }, () => {
          this[actionTypes.CONTRACT_CHECK_CROWDSALE](address)
          this.closeDialog()
        })
      }
      this.$emit('pending', { tx })
    }
  }
}
</script>
