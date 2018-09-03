<template>
  <el-dialog
    :visible.sync="authorizeDialog"
    :custom-class="`inline-block lordless-dialog message-dialog no-header no-header transparent center ${metaOpen ? 'blur' : ''}`"
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
        @telegram="$emit('telegram', $event)"></Telegram>

      <Status
        v-if="showStatus"
        :openStatus="authorizeDialog"
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

      isInit: false,

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

    address () {
      return this.userInfo.address
    },

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
      return this.statusType
    },

    authorizeBool () {
      return this.address && !this.statusType
    },

    signBool () {
      return !this.statusType && !this.address
    },

    closeTheme () {
      return this.authorizeBool ? 'dark' : 'light'
    },

    web3Error () {
      return this.$root.$children[0].web3Opt.error
    },

    // 合约内部状态初始化状态
    authorizeInit () {
      if (this.isInit) return true
      const browserInit = !this.browser.default

      const web3Opt = this.$root.$children[0].web3Opt
      const web3Init = !web3Opt.web3js.default
      // const userInit = !this.userInfo.default
      console.log('browserInit', browserInit, web3Init)
      if (browserInit && web3Init) {
        console.log('----------- authorize init')
        this.isInit = true
        return true
      }
      return false
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

    checkoutAuthorize ({ init = false, crowdsale = false, telegram = false } = {}) {
      if (this.web3Error) {
        this.$notify.error({
          title: 'Error!',
          message: 'please check your metamask!',
          position: 'bottom-right',
          duration: 3500
        })
        return
      }
      if (!this.isInit && !init) {
        this.$notify({
          type: 'warning',
          title: 'web3 init...',
          message: 'please check your metamask! ',
          position: 'bottom-right',
          duration: 3500
        })
      }
      if (!this.isInit) return false
      this.initModels()
      console.log('---- this.statusType', this.statusType)

      console.log('---- status', this.statusType, !this.address)

      this.showSign = this.signBool

      // 检查用户状态是否ok
      if (this.statusType || !this.address) {
        this.authorizeDialog = true
        return false
      }

      // if (this.statusType) {
      //   this.authorizeDialog = true
      //   return false
      // }

      // if (!this.authorizeBool) {
      //   this.authorizeDialog = false
      //   return true
      // }
      // if (!this.crowdsale || !crowdsale) {
      //   this.authorizeDialog = false
      //   return true
      // }
      if (crowdsale) {
        this.showCrowsale = true
        console.log('---- authorize crowdsale', this.$refs.crowdsale)
        // 检查市场合约权限
        this.authorizeDialog = !this.isCrowdsaleApproved
        // const crowdsaleBool = await this.checkCrowdsale()
        return this.isCrowdsaleApproved
      }

      // 如果验证 telegram 并且用户没有授权 telegram,则执行
      if (telegram && (!this.userInfo.telegram || !this.userInfo.telegram.id)) {
        console.log('----- telegram')
        this.authorizeDialog = true
        this.$nextTick(() => {
          this.showTelegram = true
        })
        return false
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
