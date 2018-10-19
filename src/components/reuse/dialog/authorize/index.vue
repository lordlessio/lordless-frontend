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
    @close="$emit('close')">
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
        :openStatus="authorizeDialog"
        :avatar="avatar"
        :address="address"
        @pending="crowdsalePending"></Crowdsale>

      <Telegram
        ref="telegram"
        v-model="showTelegram"
        :openStatus="authorizeDialog"
        :avatar="avatar"
        :address="address"
        @close="authorizeDialog = false"
        @telegram="$emit('telegram', $event)"></Telegram>

      <Status
        v-if="showStatus && !hideStatus"
        :type="statusType">
      </Status>

      <Sign
        ref="signAuthorize"
        v-model="showSign"
        :openStatus="authorizeDialog"
        @success="checkoutAuthorize()">
      </Sign>
    </div>
  </el-dialog>
</template>

<script>
import Telegram from './telegram'
import Crowdsale from './crowdsale'
import Status from './status'
import Sign from './sign'

import { contractMixins } from '@/mixins'

import { actionTypes } from '@/store/types'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'authorize-dialog',
  mixins: [contractMixins],
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
    ...mapState('contract', [
      'isCrowdsaleApproved'
    ]),

    isMobile () {
      return this.$root.$children[0].isMobile
    },

    address () {
      return this.userInfo._id
    },

    unBrowser () {
      return !this.browser.Chrome && !this.browser.Firefox
    },

    unMetamask () {
      const web3Opt = this.$root.$children[0].web3Opt
      return !web3Opt.web3js || !web3Opt.networkId || !web3Opt.isConnected
    },

    lockedMetamask () {
      const web3Opt = this.$root.$children[0].web3Opt
      return !web3Opt.address
    },

    unallowMetamask () {
      const web3Opt = this.$root.$children[0].web3Opt
      return parseInt(web3Opt.networkId) !== parseInt(process.env.APPROVED_NETWORK_ID)
    },

    statusType () {
      if (this.unBrowser) return 'browser'
      else if (this.unMetamask) return 'missing'
      else if (this.lockedMetamask) return 'locked'
      else if (this.unallowMetamask) return 'network'
      else return null
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
      return this.$root.$children[0].web3Opt.error
    },

    // 合约内部状态初始化状态
    authorizeInit () {
      const browserInit = !this.browser.default

      const web3Opt = this.$root.$children[0].web3Opt
      const web3Init = !web3Opt.web3js.default
      // const userInit = !this.userInfo.default
      console.log('browserInit', browserInit, web3Init)
      // if (browserInit && web3Init) {
      //   this.isInit = true
      //   return true
      // }

      return browserInit && web3Init
    },

    account () {
      return this.$root.$children[0].web3Opt.address
    },

    metaOpen () {
      return this.$root.$children[0].metaOpen
    }
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

    closeDialog () {
      this.$emit('fClose')
      this.authorizeDialog = false
    },

    checkoutAuthorize ({ guide = false, crowdsale = false, telegram = false } = {}) {
      // 如果是移动端，直接弹出
      if (this.isMobile) {
        this.$root.$children[0].alertModel = true
        return
      }

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
        this.showTelegram = true
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

      console.log('---- status', this.statusType, !this.address)

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
      // if (!this.authorizeInit) return false

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
  },
  watch: {

    // 监听用户登陆信息地址
    address (val) {
      // 如果地址有效，并且不允许市场判断,关闭
      if (!this.crowdsale && val) this.authorizeDialog = false
    },
    authorizeDialog (val) {
      this.$emit('blurs', val)
    },

    // 如果切换了账号，关闭对话框
    account (val, oVal) {
      if (!this.autoClose) return
      this.authorizeDialog = false
    },

    authorizeInit (val) {
      if (val) this.$emit('init')
    }
  }
}
</script>
