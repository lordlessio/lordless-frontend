import { actionTypes } from '@/store/types'
import { mapState, mapActions } from 'vuex'
export default {
  data: () => {
    return {
      CTBRendered: false,
      lessBalance: 0,
      lessBalanceNumber: 0,
      hopsBalance: 0,
      hopsBalanceNumber: 0
    }
  },
  computed: {
    ...mapState('contract', [
      'tokensBalance',
      'tokensBalanceInit'
    ]),
    ...mapState('user', [
      'userInfo'
    ])
  },
  watch: {
    tokensBalanceInit (val) {
      val && this.initTokensBalance()
    },
    userInfo (val, oval) {
      val && oval && this.initTokensBalance()
    }
  },
  methods: {
    ...mapActions('contract', [
      actionTypes.CONTRACT_SET_TOKENS_BALANCE
    ]),

    async setTokensBalance () {
      const tokensBalance = await this[actionTypes.CONTRACT_SET_TOKENS_BALANCE]()
      this.initTokensBalance(tokensBalance)
      return tokensBalance
    },

    initTokensBalance (tokensBalance = this.tokensBalance) {
      const _lessBalances = tokensBalance.less || {}
      this.lessBalance = _lessBalances.balance
      this.lessBalanceNumber = _lessBalances.balanceNumber

      const _hopsBalances = tokensBalance.hops || {}
      this.hopsBalance = _hopsBalances.balance
      this.hopsBalanceNumber = _hopsBalances.balanceNumber
    }
  },
  activated () {
    if (!this.CTBRendered) {
      this.CTBRendered = true
      return
    }
    this.initTokensBalance()
  },
  mounted () {
    this.initTokensBalance()
    if (!this.CTBRendered) this.CTBRendered = true
  }
}
