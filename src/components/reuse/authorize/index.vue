<template>
  <el-dialog
    :visible.sync="authorizeDialog"
    custom-class="inline-block lordless-dialog message-dialog no-header no-header transparent center"
    width="100%"
    append-to-body
    center
    top="0"
    :show-close="false"
    @open="$emit('open')"
    @close="$emit('close')">
    <div class="lordless-message-box">
      <span
        @click.stop="authorizeDialog = false"
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

// import { mutationTypes } from '@/store/types'
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
    address: {
      type: String,
      default: ''
    }
  },
  data: () => {
    return {
      authorizeDialog: false

      // crowdsale options
      // crowdsaleModel: false,
      // crowdsaleInterval: null,
      // crowdsaleTx: null
    }
  },
  computed: {
    ...mapState('status', [
      'browser'
    ]),
    ...mapState('contract', [
      'ldbNFTContract',
      'ldbNFTCrowdsaleContract'
    ]),

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

    account () {
      return this.$root.$children[0].web3Opt.address
    }
  },
  components: {
    Crowdsale,
    Status,
    Sign
  },
  methods: {
    // ...mapMutations('layout', [
    //   mutationTypes.LAYOUT_SET_BLURS
    // ]),
    async checkoutAuthorize () {
      console.log('---- this.statusType', this.statusType)

      // 检查用户状态是否ok
      if (this.statusType || !this.address) {
        this.authorizeDialog = true
        return false
      }

      console.log('---- authorize crowdsale', this.$refs.crowdsale)
      // 检查市场合约权限
      const crowdsaleBool = await this.checkCrowdsale()
      return crowdsaleBool
    },

    crowdsalePending (data) {
      this.$emit('pending', data)
    },

    /**
     * 检查是否授权了市场合约
     */
    async checkCrowdsale () {
      const ldbNFTContract = this.ldbNFTContract
      const ldbNFTCrowdsaleContract = this.ldbNFTCrowdsaleContract
      const crowdsaleModel = await ldbNFTContract.isApprovedForAll(this.address, ldbNFTCrowdsaleContract.address)

      if (!crowdsaleModel) this.authorizeDialog = true
      else this.authorizeDialog = false
      // this.crowdsaleModel = crowdsaleModel

      return crowdsaleModel
    }
  },
  watch: {
    authorizeDialog (val) {
      this.$emit('blurs', val)
      // this[mutationTypes.LAYOUT_SET_BLURS](val ? 2 : 1)
    },

    // 如果改变了地址，关闭对话框
    account (val) {
      this.authorizeDialog = false
    }
  }
}
</script>
