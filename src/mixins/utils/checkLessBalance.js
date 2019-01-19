import { weiByDecimals } from 'utils/tool'
import { mapState } from 'vuex'
export default {
  data: () => {
    return {
      lessBalanceNumber: 0,
      lessBalance: 0
    }
  },
  computed: {
    ...mapState('contract', [
      'tokensContractInit',
      'tokensContract'
    ]),
    ...mapState('web3', [
      'web3Opt'
    ]),

    // 当前账户地址
    account () {
      return this.web3Opt.address || window.localStorage.getItem('currentAddress')
    }
  },
  watch: {
    account (val) {
      val && this.$nextTick(() => this.checkLessBalance())
    },
    lessAddress (val) {
      val && this.checkLessBalance(val)
    },
    tokensContractInit (val) {
      val && this.checkLessBalance()
    }
  },
  methods: {
    async checkLessBalance (lessAddress = this.lessAddress, account = this.account, tokensContract = this.tokensContract) {
      console.log('account', account, lessAddress)
      if (!lessAddress || !tokensContract[lessAddress]) return
      const lessBalance = (await tokensContract[lessAddress].methods('balanceOf', [ account ])).toNumber()
      this.lessBalance = lessBalance
      this.lessBalanceNumber = weiByDecimals(lessBalance)
      return lessBalance
    }
  }
}
