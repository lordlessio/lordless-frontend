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
        v-if="showCrowsale"
        ref="crowdsale"
        v-model="authorizeDialog"
        :avatar="avatar"
        :address="address"
        @pending="crowdsalePending"></Crowdsale>

      <Status
        v-if="showStatus"
        :type="statusType">
      </Status>

      <Sign
        v-if="showSign"
        v-model="authorizeDialog"
        >
      </Sign>
    </div>
  </el-dialog>
</template>

<script>
import Crowdsale from './crowdsale'
import Status from './status'
import Sign from './sign'

import { mapState } from 'vuex'
export default {
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

    // 是否检测 crowdsale
    crowdsale: {
      type: Boolean,
      default: true
    },
    modelClose: {
      type: Boolean,
      default: true
    }
  },
  data: () => {
    return {
      authorizeDialog: false,

      isInit: false

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

    statusType () {
      if (this.unBrowser) return 'browser'
      else if (this.unMetamask) return 'missing'
      else if (this.lockedMetamask) return 'locked'
      else return null
    },

    showStatus () {
      return this.statusType
    },

    showCrowsale () {
      return this.address && !this.statusType
    },

    showSign () {
      return !this.lockedMetamask && !this.address
    },

    closeTheme () {
      return this.showCrowsale ? 'dark' : 'light'
    },

    // 合约内部状态初始化状态
    authorizeInit () {
      if (this.isInit) return true
      const browserInit = !this.browser.default
      const web3Init = !this.$root.$children[0].web3Opt.web3js.default
      const userInit = !this.userInfo.default
      console.log('browserInit', browserInit, web3Init, userInit)
      if (browserInit && web3Init && userInit) {
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
    Crowdsale,
    Status,
    Sign
  },
  methods: {
    closeDialog () {
      this.$emit('fClose')
      this.authorizeDialog = false
    },

    checkoutAuthorize ({ crowdsale = false } = {}) {
      if (!this.isInit) return false
      console.log('---- this.statusType', this.statusType)

      // 检查用户状态是否ok
      if (this.statusType || !this.address) {
        this.authorizeDialog = true
        return false
      }

      if (!this.crowdsale || !crowdsale) {
        this.authorizeDialog = false
        return true
      }

      console.log('---- authorize crowdsale', this.$refs.crowdsale)
      // 检查市场合约权限
      this.authorizeDialog = !this.isCrowdsaleApproved
      // const crowdsaleBool = await this.checkCrowdsale()
      return this.isCrowdsaleApproved
    },

    crowdsalePending (data) {
      this.$emit('pending', data)
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
      // this[mutationTypes.LAYOUT_SET_BLURS](val ? 2 : 1)
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
