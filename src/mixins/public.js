import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('web3', [
      'web3Opt'
    ]),

    // 当前账户地址
    account () {
      return this.web3Opt.address || window.localStorage.getItem('currentAddress')
    },

    // 是否是移动端
    isMobile () {
      return this.$root.$children[0].isAppMobile
    },

    ETHERSCANURL () {
      return process.env.ETHERSCANURL
    }
  }
}
